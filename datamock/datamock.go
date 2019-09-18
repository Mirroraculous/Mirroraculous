package datamock

import (
	"errors"
	"fmt"
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
	ID   string `json:"id"`
	Name string `json:"name"`
	Pwd  string `json:"pwd"`
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
		ID:   xid.New().String(),
		Name: name,
		Pwd:  pwd,
	}
	mtx.Lock()
	users = append(users, tmp)
	mtx.Unlock()
	return tmp.ID
}

func AddEvent(id string, date string, time string, event string) error {
	tmp := Events{
		ID:    xid.New().String(),
		Time:  time,
		Event: event,
	}

	mtx.RLock()
	defer mtx.RUnlock()

	found := false

	for _, n := range calendar {
		if n.Date == date && n.UID == id {
			n.Event = append(n.Event, tmp)
			found = true
		}
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
	fmt.Println(tmp)
	fmt.Println(calendar)
	return nil
}

func GetCalendar(id string) ([]Days, error) {
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
		return ret, errors.New("User ID doesn't exist")
	}
	return ret, nil
}
