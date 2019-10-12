package linkers

import (
	"fmt"
	"regexp"

	"github.com/mirroraculous/mirroraculous/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
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
	e := insert(&event)
	if e != nil {
		return e, 500
	}
	return nil, 200
}

func GetCalendar(id string, num int64, find func(query bson.D, n int64) ([]models.Event, error)) ([]models.Event, int) {
	var ret []models.Event
	ret, e := find(bson.D{{"userid", id}}, num)

	if e != nil {
		return ret, 500
	}
	return ret, 200
}

func UpdateEvent(event models.Event, id string, replace func(query bson.D, e *models.Event) error) (error, int) {
	err := replace(bson.D{{"_id", event.ID}, {"userid", id}}, &event)
	if err != nil {
		return err, 500
	}
	return nil, 200
}

func DeleteEvent(eventID string, id string, delete func(query bson.D) error) (error, int) {
	primEID, _ := primitive.ObjectIDFromHex(eventID)
	err := delete(bson.D{{"_id", primEID}, {"userid", id}})
	if err != nil {
		return err, 500
	}
	return nil, 200
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

func compHash(password string, storedPW string) bool {
	if e := bcrypt.CompareHashAndPassword([]byte(storedPW), []byte(password)); e != nil {
		return false
	} else {
		return true
	}
}
