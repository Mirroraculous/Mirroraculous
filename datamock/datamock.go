package datamock

import (
	"errors"
	"sync"

	"github.com/rs/xid"
)

var (
	users  []Users
	events []Events
	mtx    sync.RWMutex
	once   sync.Once
)

func init() {
	once.Do(initUsers)
}

func initUsers() {
	users = []Users{}
}

type Users struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Pwd      string `json:"pwd"`
	Calendar []Days
}

type Events struct {
	ID    string `json:"id"`
	Time  string `json:"time"`
	Event string `json:"event"`
}

type Days struct {
	ID    string `json:"id"`
	Day   string `json:"day"`
	Date  string `json:"date"`
	Event []Events
}

func GetUser(id string) (Users, error) {
	var ret Users
	mtx.RLock()
	defer mtx.RUnlock()
	for _, n := range users {
		if n.ID == id {
			ret = n
			return ret, nil
		}
	}
	return ret, errors.New("User ID doesn't exist")
}

func LoginUser(name string, pwd string) (string, error) {
	for _, n := range users {
		if n.Name == name {
			if n.Pwd == pwd {
				return n.ID, nil
			}
			return "", errors.New("Invalid password")
		}
	}
	return "", errors.New("Username not found")
}

func AddUser(name string, pwd string) string {
	tmp := Users{
		ID:       xid.New().String(),
		Name:     name,
		Pwd:      pwd,
		Calendar: []Days{},
	}
	mtx.Lock()
	users = append(users, tmp)
	mtx.Unlock()
	return tmp.ID
}

func AddEvent(id string, date string, time string, event string) error {
	calendar, e := GetCalendar(id)
	if e != nil {
		return e
	}

	tmp := Events{
		ID:    xid.New().String(),
		Time:  time,
		Event: event,
	}

	mtx.RLock()
	defer mtx.RUnlock()

	found := false

	for _, n := range calendar {
		if n.Date == date {
			n.Event = append(n.Event, tmp)
			found = true
		}
	}

	if !found {
		newDay := Days{
			ID:    xid.New().String(),
			Day:   "random day",
			Date:  date,
			Event: []Events{},
		}

		newDay.Event = append(newDay.Event, tmp)

		calendar = append(calendar, newDay)
	}

	return nil
}

func GetCalendar(id string) ([]Days, error) {
	var ret []Days
	mtx.RLock()
	defer mtx.RUnlock()
	for _, n := range users {
		if n.ID == id {
			ret = n.Calendar
			return ret, nil
		}
	}
	return ret, errors.New("User ID doesn't exist")
}
