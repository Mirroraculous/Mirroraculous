package linkers

import (
	"errors"
	"testing"
	"time"

	"github.com/mirroraculous/mirroraculous/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/oauth2"
	"google.golang.org/api/calendar/v3"
)

func TestAddUser(t *testing.T) {
	if id, status := AddUser(models.User{}, func(query bson.D) (*models.User, error) {
		var u *models.User
		return u, nil
	}, func(user *models.User) (string, error) {
		return "", nil
	}); id != "Incomplete Submission" || status != 400 {
		t.Errorf("Test failed, expected status 400 and \"Incomplete Submission\", got %d and %s", status, id)
	}

	if id, status := AddUser(models.User{
		Email: "tim@tim.tim",
		Name:  "Tim",
		Pwd:   "123456",
	}, func(query bson.D) (*models.User, error) {
		u := models.User{
			Email: "tim@tim.tim",
		}
		return &u, nil
	}, func(user *models.User) (string, error) {
		return "", nil
	}); id != "Server error" || status != 500 {
		t.Errorf("Test failed, expected status 500 and \"Server error\", got %d and %s", status, id)
	}

	if id, status := AddUser(models.User{
		Email: "tim@tim.tim",
		Name:  "Tim",
		Pwd:   "123456",
	}, func(query bson.D) (*models.User, error) {
		u := models.User{
			Email: "tim@tim.tim",
		}
		return &u, errors.New("mongo: no documents in result")
	}, func(user *models.User) (string, error) {
		return "", nil
	}); id != "Email already in use" || status != 400 {
		t.Errorf("Test failed, expected status 400 and \"Email already in use\", got %d and %s", status, id)
	}

	if id, status := AddUser(models.User{
		Email: "tim@tim.tim",
		Name:  "Tim",
		Pwd:   "123456",
	}, func(query bson.D) (*models.User, error) {
		var u models.User
		return &u, errors.New("mongo: no documents in result")
	}, func(user *models.User) (string, error) {
		return "12345", errors.New("some error")
	}); id != "some error" || status != 500 {
		t.Errorf("Test failed, expected status 500 and \"some error\", got %d and %s", status, id)
	}

	if id, status := AddUser(models.User{
		Email: "tim@tim.tim",
		Name:  "Tim",
		Pwd:   "123456",
	}, func(query bson.D) (*models.User, error) {
		var u models.User
		return &u, errors.New("mongo: no documents in result")
	}, func(user *models.User) (string, error) {
		return "abcde", nil
	}); id != "abcde" || status != 200 {
		t.Errorf("Test failed, expected status 200 and \"123456\", got %d and %s", status, id)
	}
}

func TestLoginUser(t *testing.T) {
	if id, status := LoginUser("tim@tim.tim", "123456", func(query bson.D) (*models.User, error) {
		var u models.User
		return &u, errors.New("")
	}); id != "Email not found" || status != 404 {
		t.Errorf("Test failed, expected status 404 and \"Email not found\", got %d and %s", status, id)
	}

	if id, status := LoginUser("tim@tim.tim", "123456", func(query bson.D) (*models.User, error) {
		u := models.User{
			Pwd: "123456",
		}
		return &u, nil
	}); id != "Invalid password" || status != 401 {
		t.Errorf("Test failed, expected status 401 and \"Invalid password\", got %d and %s", status, id)
	}
	if id, status := LoginUser("tim@tim.tim", "123456", func(query bson.D) (*models.User, error) {
		s, _ := salt("123456")
		i, _ := primitive.ObjectIDFromHex("0000")
		u := models.User{
			ID:  i,
			Pwd: s,
		}
		return &u, nil
	}); id != "000000000000000000000000" || status != 200 {
		t.Errorf("Test failed, expected status 200 and \"000000000000000000000000\", got %d and %s", status, id)
	}
}

func TestGetUser(t *testing.T) {
	if _, status := GetUser("000000000000000000000000", func(query bson.D) (*models.User, error) {
		var u models.User
		return &u, errors.New("bad")
	}); status != 404 {
		t.Errorf("Test failed, expected status 404, got %d", status)
	}

	if user, status := GetUser("000000000000000000000000", func(query bson.D) (*models.User, error) {
		i, _ := primitive.ObjectIDFromHex("0000")
		u := models.User{
			ID:    i,
			Email: "hello",
		}
		return &u, nil
	}); user.Email != "hello" || status != 200 {
		t.Errorf("Test failed, expected status 200 and user's email to be \"hello\", got %d and %s", status, user.Email)
	}
}

func TestAddEvent(t *testing.T) {
	testEvent := models.Event{}
	if e, status := AddEvent("000", testEvent, func(event *models.Event) error {
		return errors.New("bad")
	}); e.Error() != "bad" || status != 500 {
		t.Errorf("Test failed, expected status 500 and \"bad\", got %d and %s", status, e.Error())
	}

	if e, status := AddEvent("000", testEvent, func(event *models.Event) error {
		return nil
	}); e != nil || status != 200 {
		t.Errorf("Test failed, expected status 200, got %d", status)
	}
}

func TestGetCalendar(t *testing.T) {
	if _, status := GetCalendar("000", "0", func(query bson.D, n int64) ([]models.Event, error) {
		var ev []models.Event
		return ev, errors.New("bad")
	}); status != 500 {
		t.Errorf("Test failed, expected status 500, got %d", status)
	}

	if event, status := GetCalendar("000", "0", func(query bson.D, n int64) ([]models.Event, error) {
		var ev []models.Event
		var i int64
		for i = 0; i < 5; i++ {
			ev = append(ev, models.Event{
				UserID: "123",
				Start: struct {
					Date     time.Time `json:"date"`
					DateTime time.Time `json:"dateTime"`
					TimeZone string    `json:"timeZone"`
				}{
					Date:     time.Unix(0, 0),
					DateTime: time.Unix(0, 0),
				},
			})
		}
		return ev, nil
	}); len(event) != 5 || status != 200 {
		t.Errorf("Test failed, expected status 500, got %d and a length of %d", status, len(event))
	}
}

func TestUpdateEvent(t *testing.T) {
	testEvent := models.Event{}
	if e, status := UpdateEvent(testEvent, "abc", func(query bson.D, e *models.Event) error {
		return errors.New("test error")
	}); e == nil || status != 500 {
		t.Errorf("Test failed, expected status 500 and an error, got %d and %s", status, e.Error())
	}

	if e, status := UpdateEvent(testEvent, "abc", func(query bson.D, e *models.Event) error {
		return nil
	}); e != nil || status != 200 {
		t.Errorf("Test failed, expected status 200 and nil error, got %d and %s", status, e.Error())
	}
}

func TestDeleteEvent(t *testing.T) {
	if e, status := DeleteEvent("5d9dc973681c8a28abe999c1", "abc", func(query bson.D) error {
		return errors.New("test error")
	}); e.Error() != "test error" || status != 500 {
		t.Errorf("Test failed, expected status 500 and \"test error\", got %d and %s", status, e.Error())
	}

	if e, status := DeleteEvent("5d9dc973681c8a28abe999c1", "abc", func(query bson.D) error {
		return nil
	}); e != nil || status != 200 {
		t.Errorf("Test failed, expected status 200 and nil error, got %d and %s", status, e.Error())
	}
}

func TestAddGoogleToken(t *testing.T) {
	var blankToken oauth2.Token

	if status, e := AddGoogleToken("Brokenprimative", &blankToken, func(query, update bson.M) error { return nil }); status != 500 || e == nil {
		t.Errorf("Test failed, expected status 500 and non-nil error, got %d and %s", status, e)
	}

	if status, e := AddGoogleToken("000000000000000000000000", &blankToken, func(query, update bson.M) error {
		return errors.New("Broken database")
	}); status != 500 || e.Error() != "Broken database" {
		t.Errorf("Test failed, expected status 500 and \"Broken database\", got %d and %s", status, e)
	}

	if status, e := AddGoogleToken("000000000000000000000000", &blankToken, func(query, update bson.M) error { return nil }); status != 200 || e != nil {
		t.Errorf("Test failed, expected status 200 and no error, got %d and %s", status, e.Error())
	}
}

func TestSyncGoogleCalendar(t *testing.T) {
	invalidToken := oauth2.Token{}
	validToken := oauth2.Token{
		Expiry:      time.Unix(time.Now().Unix()+500000, 0),
		AccessToken: "FakeNews",
	}

	if events, status, e := SyncGoogleCalendar(models.User{GoogleToken: invalidToken}, func(t *oauth2.Token) (*calendar.Service, error) {
		return nil, nil
	}, func(service *calendar.Service) (*calendar.Events, error) {
		return nil, nil
	}); events != nil || status != 400 || e.Error() != "Invalid token" {
		t.Errorf("Test failed, expected status code 400, nil events, and an \"Invalid token\" error. Instead got: %d %s", status, e)
	}

	if events, status, e := SyncGoogleCalendar(models.User{GoogleToken: validToken}, func(t *oauth2.Token) (*calendar.Service, error) {
		return nil, errors.New("An error")
	}, func(service *calendar.Service) (*calendar.Events, error) {
		return nil, nil
	}); events != nil || status != 400 || e.Error() != "An error" {
		t.Errorf("Test failed, expected status code 400, nil events, and an error. Instead got: %d %s", status, e)
	}

	if events, status, e := SyncGoogleCalendar(models.User{GoogleToken: validToken}, func(t *oauth2.Token) (*calendar.Service, error) {
		return nil, nil
	}, func(service *calendar.Service) (*calendar.Events, error) {
		var tmp calendar.Events
		return &tmp, nil
	}); events != nil || status != 200 || e != nil {
		t.Errorf("Test failed, expected status code 200, and no error. Instead got: %d %s", status, e.Error())
	}
}

func TestAddListOfEvents(t *testing.T) {
	var dummyEvents []*calendar.Event

	if e := AddListOfEvents(dummyEvents, "Fake ID", func(event *models.Event) error {
		return nil
	}); e != nil {
		t.Errorf("Expected nil error, got %s", e.Error())
	}

	// if e := AddListOfEvents()
}
