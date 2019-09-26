package datamock_test

import (
	"testing"

	"github.com/mirroraculous/mirroraculous/datamock"
)

func TestAddUser(t *testing.T) {
	id, status := datamock.AddUser("Tim", "tim@tim.tim", "123")
	if status != 200 {
		t.Errorf("Test failed, expected status '%d', got: '%d'", 200, status)
	} else if len(id) < 1 {
		t.Errorf("Test failed, id not properly created")
	}

	_, status = datamock.AddUser("Tim", "tim@tim.tim", "123")
	if status != 400 {
		t.Errorf("Test failed, duplicate registration expected status '%d', got: '%d'", 400, status)
	}
}

func TestLoginUser(t *testing.T) {
	id, status := datamock.LoginUser("tim@tim.tim", "123")
	if status != 200 {
		t.Errorf("Test failed, return error: '%s'", id)
	}

	id, status = datamock.LoginUser("tim@tim.ti", "123")
	if id != "Username not found" {
		t.Errorf("Test failed, expected Username not found, got '%s'", id)
	} else if status != 401 {
		t.Errorf("Test failed, expected status 401, got '%d'", status)
	}

	id, status = datamock.LoginUser("tim@tim.tim", "13")
	if id != "Invalid Password" {
		t.Errorf("Test failed, expected Username not found, got '%s'", id)
	} else if status != 401 {
		t.Errorf("Test failed, expected status 401, got '%d'", status)
	}
}

func TestGetUser(t *testing.T) {
	user, status := datamock.GetUser("")
	if status == 200 {
		t.Errorf("Test failed, expected status 400, got status '%d'", status)
	}
	id, _ := datamock.LoginUser("tim@tim.tim", "123")
	user, status = datamock.GetUser(id)
	if status != 200 {
		t.Errorf("Test failed, expected no error, got status '%d'", status)
	} else if user == (datamock.Users{}) {
		t.Errorf("Test failed, user object is empty")
	}
}

func TestAddEvent(t *testing.T) {
	id, _ := datamock.LoginUser("tim@tim.tim", "123")
	e := datamock.AddEvent(id, "12/01/2000", "nine:00AM", "do things")
	if e.Error() != "Invalid time" {
		t.Errorf("Test failed, expected Invalid time, got '%s'", e.Error())
	}
	e = datamock.AddEvent(id, "12/01/22", "9:00AM", "do things")
	if e.Error() != "Invalid date" {
		t.Errorf("Test failed, expected Invalid date, got '%s'", e.Error())
	}
	e = datamock.AddEvent(id, "12/01/2000", "9:00PM", "do things")
	if e != nil {
		t.Errorf("Test failed, expected no error, got '%s'", e.Error())
	}
	e = datamock.AddEvent(id, "12/01/2000", "9:00PM", "abcd")
	if e.Error() != "Event exists for that time" {
		t.Errorf("Test failed, expected Event exists for that time, got %s", e.Error())
	}
	e = datamock.AddEvent(id, "12/01/2000", "9:00AM", "abcd")
	if e != nil {
		t.Errorf("Test failed, expected no error, got %s", e.Error())
	}
	e = datamock.AddEvent(id, "12/01/2000", "9:00PM", "abcd")
	if e.Error() != "Event exists for that time" {
		t.Errorf("Test failed, expected Event exists for that time, got %s", e.Error())
	}
	e = datamock.AddEvent("", "12/01/2000", "9:00PM", "abcd")
	if e.Error() != "User doesn't exist" {
		t.Errorf("Test failed, expected User doesn't exist, got %s", e.Error())
	}
}

func TestGetCalendar(t *testing.T) {
	id, _ := datamock.LoginUser("tim@tim.tim", "123")
	calendar, status := datamock.GetCalendar(id)
	if status != 200 {
		t.Errorf("Expected status code 200, got '%d'", status)
	} else if calendar == nil {
		t.Errorf("Calendar object empty when should be populated")
	}
	calendar, status = datamock.GetCalendar("")
	if status != 400 {
		t.Errorf("Expected status 400, got '%d'", status)
	} else if calendar != nil {
		t.Errorf("Calendar object should be empty, got '%v'", calendar[0])
	}
}

func TestUpdateEvent(t *testing.T) {
	id, _ := datamock.LoginUser("tim@tim.tim", "123")
	calendar, _ := datamock.GetCalendar(id)
	status := datamock.UpdateEvent(id, calendar[0].Event[0].ID, "8:00PM", "eat")
	if status != 200 {
		t.Errorf("Expected 200, got '%d'", status)
	}
	calendar, _ = datamock.GetCalendar(id)
	if calendar[0].Event[0].Time != "8:00PM" {
		t.Errorf("Expected time 8:00PM, got '%s'", calendar[0].Event[0].Time)
	} else if calendar[0].Event[0].Event != "eat" {
		t.Errorf("Expected event eat, got '%s'", calendar[0].Event[0].Event)
	}
	status = datamock.UpdateEvent("", calendar[0].Event[0].ID, "8:00PM", "eat")
	if status != 404 {
		t.Errorf("Expected 404, got '%d'", status)
	}
	status = datamock.UpdateEvent(id, "", "8:00PM", "eat")
	if status != 404 {
		t.Errorf("Expected 404, got '%d'", status)
	}
}

func TestDeleteEvent(t *testing.T) {
	id, _ := datamock.LoginUser("tim@tim.tim", "123")
	calendar, _ := datamock.GetCalendar(id)
	status := datamock.DeleteEvent(id, calendar[0].Event[0].ID)
	if status != 200 {
		t.Errorf("Expected 200, got '%d'", status)
	}
	status = datamock.DeleteEvent(id, "")
	if status != 404 {
		t.Errorf("Expected 404, got '%d'", status)
	}
	status = datamock.DeleteEvent("", calendar[0].Event[0].ID)
	if status != 404 {
		t.Errorf("Expected 404, got '%d'", status)
	}
	_ = datamock.DeleteEvent(id, calendar[0].Event[1].ID)
	calendar, _ = datamock.GetCalendar(id)
	if calendar[0].Event != nil {
		t.Errorf("Expected empty day, got `%v`", calendar[0].Event[0])
	}
}