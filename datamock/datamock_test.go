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

}

func TestGetCalendar(t *testing.T) {

}

func TestUpdateEvent(t *testing.T) {

}

func TestDeleteEvent(t *testing.T) {

}
