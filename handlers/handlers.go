package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mirroraculous/mirroraculous/datamock"
	"github.com/mirroraculous/mirroraculous/middleware"
)

// RegisterUser adds a new user, responds with user token
// POST name, email, password to :3000/api/user
func RegisterUser(context *gin.Context) {
	fmt.Println("Hello from register")
	user, status, e := convertHTTPBodyToUser(context.Request.Body)
	if e != nil {
		context.JSON(status, e.Error())
		return
	}
	id, status := datamock.AddUser(user.Name, user.Email, user.Pwd)
	if status != 200 {
		context.JSON(status, id)
		return
	}
	token, status := middleware.MakeToken(id)
	context.JSON(status, token)
}

// LoginUser logs in a user, responds with the user token
// POST email and password to :3000/api/auth
func LoginUser(context *gin.Context) {
	fmt.Println("Hello from login")
	user, status, e := convertHTTPBodyToUser(context.Request.Body)
	if e != nil {
		context.JSON(status, e.Error())
		return
	}
	id, status := datamock.LoginUser(user.Email, user.Pwd)
	if status != 200 {
		context.JSON(status, id)
		return
	}
	token, status := middleware.MakeToken(id)
	context.JSON(status, token)
}

// GetUser responds with the user account information
// GET to :3000/api/auth
func GetUser(context *gin.Context) {
	fmt.Println("Hello from GetUser")
	token := context.Request.Header.Get("x-auth-token")
	id, status := middleware.VerifyToken(token)
	if status != 200 {
		context.JSON(status, id)
		return
	}
	user, status := datamock.GetUser(id)
	if status != 200 {
		context.JSON(status, "No user found")
		return
	}
	context.JSON(http.StatusOK, user)
}

// GetCalendar gets the calendar events for a user
// GET to :3000/api/calendar
func GetCalendar(context *gin.Context) {
	fmt.Println("Hello from GetCalendar")
	token := context.Request.Header.Get("x-auth-token")
	id, status := middleware.VerifyToken(token)
	if status != 200 {
		context.JSON(status, id)
		return
	}
	calendar, status := datamock.GetCalendar(id)
	if status != 200 {
		context.JSON(status, "No calendar found for user")
		return
	}
	context.JSON(status, calendar)
}

// AddEvent adds an event on a day for the user; responds status
// POST date, time, event to :3000/api/calendar
func AddEvent(context *gin.Context) {
	fmt.Println("Hello from AddEvent")
	token := context.Request.Header.Get("x-auth-token")
	id, status := middleware.VerifyToken(token)
	if status != 200 {
		context.JSON(status, id)
		return
	}
	event, status, e := convertHTTPBodyToEvent(context.Request.Body)
	if e != nil {
		context.JSON(status, e.Error())
		return
	}
	context.JSON(http.StatusOK, datamock.AddEvent(id, event.Date, event.Time, event.Event).Error())
}

// UpdateEvent updates a specific event; responds status
// PUT time, event to :3000/api/calendar/:id
func UpdateEvent(context *gin.Context) {
	fmt.Println("Hello from UpdateEvent")
	token := context.Request.Header.Get("x-auth-token")
	id, status := middleware.VerifyToken(token)
	if status != 200 {
		context.JSON(status, id)
		return
	}
	event, status, e := convertHTTPBodyToEvent(context.Request.Body)
	if e != nil {
		context.JSON(status, e.Error())
		return
	}
	eventID := context.Params.ByName("id")
	status = datamock.UpdateEvent(id, eventID, event.Time, event.Event)
	context.JSON(status, "")
}

// DeleteEvent deletes a specific event; responds status
// DELETE to :3000/api/calendar/:id
func DeleteEvent(context *gin.Context) {
	fmt.Println("Hello from DeleteEvent")
	token := context.Request.Header.Get("x-auth-token")
	id, status := middleware.VerifyToken(token)
	if status != 200 {
		context.JSON(status, id)
		return
	}
	eventID := context.Params.ByName("id")
	status = datamock.DeleteEvent(id, eventID)
	context.JSON(status, "")
}

func convertHTTPBodyToUser(httpBody io.ReadCloser) (datamock.Users, int, error) {
	body, e := ioutil.ReadAll(httpBody)
	if e != nil {
		return datamock.Users{}, http.StatusInternalServerError, e
	}

	var tmp datamock.Users

	e = json.Unmarshal(body, &tmp)
	if e != nil {
		return datamock.Users{}, http.StatusBadRequest, e
	}

	return tmp, http.StatusOK, nil
}

func convertHTTPBodyToEvent(httpBody io.ReadCloser) (eventBody, int, error) {
	body, e := ioutil.ReadAll(httpBody)
	if e != nil {
		return eventBody{}, http.StatusInternalServerError, e
	}

	var tmp eventBody

	e = json.Unmarshal(body, &tmp)
	if e != nil {
		return eventBody{}, http.StatusBadRequest, e
	}

	return tmp, http.StatusOK, nil
}

type eventBody struct {
	Date  string `json:"date"`
	Time  string `json:"time"`
	Event string `json:"event"`
}
