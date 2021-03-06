package datamock

import (
	"errors"
	"regexp"
	"sync"

	"github.com/rs/xid"
)

var (
	users    []Users
	events   []Events
	mtx      sync.RWMutex
	once     sync.Once
	calendar []Days
)

func init() {
	once.Do(initUsers)
}

func initUsers() {
	users = []Users{}
	calendar = []Days{}
}

type Users struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Pwd   string `json:"password"`
}

type Events struct {
	ID    string `json:"id"`
	Time  string `json:"time"`
	Event string `json:"event"`
}

type Days struct {
	UID   string `json:"uid"`
	Day   string `json:"day"`
	Date  string `json:"date"`
	Event []Events
}

func GetUser(id string) (Users, int) {
	var ret Users
	mtx.RLock()
	defer mtx.RUnlock()
	for _, n := range users {
		if n.ID == id {
			ret = n
			return ret, 200
		}
	}
	return ret, 400
}

func LoginUser(email string, pwd string) (string, int) {
	for _, n := range users {
		if n.Email == email {
			if n.Pwd == pwd {
				return n.ID, 200
			}
			return "Invalid Password", 401
		}
	}
	return "Username not found", 401
}

func AddUser(name string, email string, pwd string) (string, int) {
	tmp := Users{
		ID:    xid.New().String(),
		Name:  name,
		Email: email,
		Pwd:   pwd,
	}
	mtx.Lock()
	defer mtx.Unlock()
	for _, n := range users {
		if n.Email == email {
			return "User already exists", 400
		}
	}

	users = append(users, tmp)

	return tmp.ID, 200
}

func AddEvent(id string, date string, time string, event string) error {
	if !validTime(time) {
		return errors.New("Invalid time")
	}

	if !validDate(date) {
		return errors.New("Invalid date")
	}

	tmp := Events{
		ID:    xid.New().String(),
		Time:  time,
		Event: event,
	}

	mtx.RLock()
	defer mtx.RUnlock()

	found := false

	for i, n := range calendar {
		if n.Date == date && n.UID == id {
			for _, event := range n.Event {
				if event.Time == tmp.Time {
					return errors.New("Event exists for that time")
				}
			}
			calendar[i].Event = append(n.Event, tmp)
			found = true
		}
	}

	userExists := false
	for _, n := range users {
		if n.ID == id {
			userExists = true
		}
	}

	if !userExists {
		return errors.New("User doesn't exist")
	}

	if !found {
		newDay := Days{
			UID:   id,
			Day:   "random day",
			Date:  date,
			Event: []Events{},
		}

		newDay.Event = append(newDay.Event, tmp)

		calendar = append(calendar, newDay)
	}

	return nil
}

func GetCalendar(id string) ([]Days, int) {
	var ret []Days
	found := false
	mtx.RLock()
	defer mtx.RUnlock()
	for _, n := range calendar {
		if n.UID == id {
			found = true
			ret = append(ret, n)
		}
	}
	if !found {
		return ret, 400
	}
	return ret, 200
}

func UpdateEvent(uid string, eid string, time string, event string) int {
	found := false
	mtx.RLock()
	defer mtx.RUnlock()
	for i, day := range calendar {
		if day.UID == uid {
			var tmp []Events
			for _, events := range day.Event {
				if events.ID != eid {
					tmp = append(tmp, events)
				} else {
					tmpEvent := Events{
						ID:    events.ID,
						Time:  time,
						Event: event,
					}
					found = true
					tmp = append(tmp, tmpEvent)
				}
			}
			day.Event = tmp
			calendar[i] = day
		}
	}
	if found {
		return 200
	}
	return 404
}

func DeleteEvent(uid string, eid string) int {
	found := false
	mtx.RLock()
	defer mtx.RUnlock()
	for i, day := range calendar {
		if day.UID == uid {
			var tmp []Events
			for _, events := range day.Event {
				if events.ID != eid {
					tmp = append(tmp, events)
				} else {
					found = true
				}
			}
			day.Event = tmp
			calendar[i] = day
		}
	}
	if found {
		return 200
	}
	return 404
}

func validTime(time string) bool {
	matched, _ := regexp.MatchString(`\d?\d:\d\d[AP]M`, time)
	return matched
}

func validDate(date string) bool {
	matched, _ := regexp.MatchString(`\d?\d[/\-]\d?\d[/\-]\d\d\d\d`, date)
	return matched
}
