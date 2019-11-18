package linkers

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/mirroraculous/mirroraculous/config"
	"github.com/mirroraculous/mirroraculous/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/oauth2"
	"google.golang.org/api/calendar/v3"
)

func AddUser(newUser models.User, find func(query bson.D) (*models.User, error), insert func(user *models.User) (string, error)) (string, int) {
	if !validEmail(newUser.Email) || newUser.Name == "" || !validPassword(newUser.Pwd) {
		return "Incomplete Submission", 400
	}
	var u *models.User
	u, err := find(bson.D{{"email", newUser.Email}})

	if err == nil || err.Error() != "mongo: no documents in result" {
		return "Server error", 500
	}

	if u.Email == newUser.Email {
		return "Email already in use", 400
	}

	newUser.Pwd, err = salt(newUser.Pwd)
	if err != nil {
		return "Server error", 500
	}

	id, e := insert(&newUser)

	if e != nil {
		return e.Error(), 500
	}

	return id, 200
}

func LoginUser(email string, pwd string, find func(query bson.D) (*models.User, error)) (string, int) {
	var u *models.User
	u, err := find(bson.D{{"email", email}})
	if err != nil {
		return "Email not found", 404
	}

	if !compHash(pwd, u.Pwd) {
		return "Invalid password", 401
	}

	return fmt.Sprintf("%v", u.ID.Hex()), 200
}

func GetUser(id string, find func(query bson.D) (*models.User, error)) (models.User, int) {
	var u *models.User
	primId, _ := primitive.ObjectIDFromHex(id)
	u, err := find(bson.D{{"_id", primId}})
	if err != nil {
		return *u, 404
	}
	return *u, 200
}

func AddEvent(id string, event models.Event, insert func(event *models.Event) error) (error, int) {
	event.UserID = id
	event.Created = time.Now()
	e := insert(&event)
	if e != nil {
		return e, 500
	}
	return nil, 200
}

func GetCalendar(id string, start string, find func(query bson.D, n int64) ([]models.Event, error)) ([]models.Event, int) {
	var res, ret []models.Event
	res, e := find(bson.D{{"userid", id}}, 500)
	sint, er := strconv.ParseInt(start, 10, 0)
	if e != nil || er != nil {
		return ret, 500
	}
	for _, event := range res {
		if time.Time.Unix(event.Start.Date) >= sint && time.Time.Unix(event.Start.Date) <= sint+86400*35 {
			ret = append(ret, event)
		}
	}
	return ret, 200
}

func UpdateEvent(event models.Event, id string, replace func(query bson.D, e *models.Event) error) (error, int) {
	event.Updated = time.Now()
	err := replace(bson.D{{"_id", event.ID}, {"userid", id}}, &event)
	if err != nil {
		return err, 500
	}
	return nil, 200
}

func DeleteEvent(eventID string, id string, delete func(query bson.D) error) (error, int) {
	primEID, e := primitive.ObjectIDFromHex(eventID)
	if e != nil {
		return e, 500
	}
	err := delete(bson.D{{"_id", primEID}, {"userid", id}})
	if err != nil {
		return err, 500
	}
	return nil, 200
}

func AddGoogleToken(usertoken string, token *oauth2.Token, update func(filter, up bson.M) error) (int, error) {
	primID, e := primitive.ObjectIDFromHex(usertoken)
	if e != nil {
		log.Println(e.Error())
		log.Println("Broken primative")
		return 500, e
	}
	e = update(bson.M{"_id": bson.M{"$eq": primID}}, bson.M{"$set": bson.M{"googletoken": *token}})
	if e != nil {
		log.Println("Broken database")
		log.Println(e.Error())
		return 500, e
	}
	return 200, nil
}

func SyncGoogleCalendar(user models.User, getService func(userToken *oauth2.Token) (*calendar.Service, error), getEvents func(service *calendar.Service) (*calendar.Events, error)) ([]*calendar.Event, int, error) {
	if valid := (&user.GoogleToken).Valid(); !valid {
		return nil, 400, errors.New("Invalid token")
	}
	service, e := getService(&user.GoogleToken)
	if e != nil {
		return nil, 400, e
	}
	events, e := getEvents(service)
	if e != nil {
		return nil, 400, e
	}
	return events.Items, 200, nil
}

func convGoogleToMirror(id string, gevent *calendar.Event, mevent *models.Event) error {
	tmpID := gevent.Id
	gevent.Id = ""

	g, e := json.Marshal(gevent)
	if e != nil {
		return e
	}
	e = json.Unmarshal(g, mevent)
	if e != nil {
		return e
	}
	mevent.GoogleID = tmpID
	mevent.UserID = id
	return nil
}

func AddListOfEvents(events []*calendar.Event, UserID string) error {
	if len(events) > 0 {
		for _, item := range events {
			foundEvent, e := config.FindEvent(bson.D{{"googleid", item.Id}}, 1)
			if e != nil && e.Error() != "mongo: no documents in result" {
				return e
			} else if len(foundEvent) == 0 {
				mevent := &models.Event{}
				e = convGoogleToMirror(UserID, item, mevent)
				if e == nil {
					config.InsertEvent(mevent)
				}
			}
		}
	}
	return nil
}

func GetAlarms(uid string, get func(filter bson.D) ([]models.Alarm, error)) ([]models.Alarm, int, error) {
	alarms, e := get(bson.D{{"userid", uid}})
	if e != nil {
		return alarms, 500, e
	}
	return alarms, 200, nil
}

func ToggleAlarm(uid string, time string, getOne func(filter bson.M) (models.Alarm, error), update func(filter, up bson.M) error) (int, error) {
	if valid := validTime(time); !valid {
		return 400, errors.New("Invalid time")
	}
	alarm, e := getOne(bson.M{"userid": bson.M{"$eq": uid}})
	if e != nil {
		return 500, e
	}
	e = update(bson.M{"userid": bson.M{"$eq": uid}, "time": bson.M{"$eq": time}}, bson.M{"$set": bson.M{"isActive": !alarm.IsActive}})
	return 200, nil
}

func AddAlarm(uid string, time string, add func(alarm *models.Alarm) error) (int, error) {
	if valid := validTime(time); !valid {
		return 400, errors.New("Invalid time")
	}
	tmp := &models.Alarm{
		UserID:   uid,
		Time:     time,
		IsActive: true,
	}
	e := add(tmp)
	if e != nil {
		return 500, e
	}
	return 200, nil
}

func salt(password string) (string, error) {
	if hash, e := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost); e != nil {
		return "", e
	} else {
		return string(hash), nil
	}
}

func validEmail(email string) bool {
	matched, _ := regexp.MatchString(`[A-Za-z0-9._%+-{|}]+@[A-Za-z0-9._]+.[A-Za-z][A-Za-z][A-Za-z]`, email)
	return matched
}

func validPassword(email string) bool {
	return len(email) > 5
}

func validTime(time string) bool {
	time = strings.Replace(time, " ", "", -1)
	matched, _ := regexp.MatchString(`\d?\d:\d\d[AP]M`, time)
	return matched
}

func compHash(password string, storedPW string) bool {
	if e := bcrypt.CompareHashAndPassword([]byte(storedPW), []byte(password)); e != nil {
		return false
	} else {
		return true
	}
}
