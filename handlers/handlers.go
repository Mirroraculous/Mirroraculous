package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mirroraculous/mirroraculous/config"
	"github.com/mirroraculous/mirroraculous/linkers"
	"github.com/mirroraculous/mirroraculous/middleware"
	"github.com/mirroraculous/mirroraculous/models"
	"github.com/mirroraculous/mirroraculous/oauth"
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
	// id, status := datamock.AddUser(user.Name, user.Email, user.Pwd)
	id, status := linkers.AddUser(user, config.FindUser, config.InsertUser)
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
	id, status := linkers.LoginUser(user.Email, user.Pwd, config.FindUser)
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
	user, status := linkers.GetUser(id, config.FindUser)
	if status != 200 {
		context.JSON(status, "No user found")
		return
	}
	context.JSON(http.StatusOK, user)
}

func UpdateUser(context *gin.Context) {
	fmt.Println("Hello from UpdateUser")
	token := context.Request.Header.Get("x-auth-token")
	id, status := middleware.VerifyToken(token)
	if status != 200 {
		context.JSON(status, id)
		return
	}

	user, status, e := convertHTTPBodyToUser(context.Request.Body)
	if e != nil {
		context.JSON(status, e.Error())
		return
	}

	e, status = linkers.UpdateUser(id, config.UpdateUser, user)
	if status != 200 {
		context.JSON(status, e.Error())
		return
	}
	context.JSON(status, "User updated!")
}

func DeleteUser(context *gin.Context) {
	fmt.Println("Hello from DeleteUser")
	token := context.Request.Header.Get("x-auth-token")
	id, status := middleware.VerifyToken(token)
	if status != 200 {
		context.JSON(status, id)
		return
	}

	e, status := linkers.DeleteUser(id, config.DeleteUser)
	if status != 200 {
		context.JSON(status, e.Error())
		return
	}
	context.JSON(status, "User deleted!")
}

// GetCalendar gets the calendar events for a user
// GET to :3000/api/calendar/:day
func GetCalendar(context *gin.Context) {
	fmt.Println("Hello from GetCalendar")
	token := context.Request.Header.Get("x-auth-token")
	id, status := middleware.VerifyToken(token)
	if status != 200 {
		context.JSON(status, id)
		return
	}
	startDay := context.Params.ByName("day")

	calendar, status := linkers.GetCalendar(id, startDay[:len(startDay)-3], config.FindEvent)
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
	e, status = linkers.AddEvent(id, event, config.InsertEvent)
	if e != nil {
		context.JSON(status, "Event not added")
		return
	}
	context.JSON(status, "Event added!")
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
	e, status = linkers.UpdateEvent(event, id, config.ReplaceEvent)
	if e != nil {
		context.JSON(status, e.Error())
		return
	}
	context.JSON(status, "Event updated!")
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
	e, status := linkers.DeleteEvent(eventID, id, config.DeleteEvent)
	if e != nil {
		context.JSON(status, e.Error())
		return
	}
	context.JSON(status, "Event deleted!")
}

// GoogleLogin sends the Google login URL for oauth2
// GET to :3000/api/googlelogin
func GoogleLogin(context *gin.Context) {
	token := context.Request.Header.Get("x-auth-token")
	id, status := middleware.VerifyToken(token)
	if status != 200 {
		context.JSON(status, id)
		return
	}
	status, state, e := oauth.RandToken()
	if e != nil {
		context.JSON(status, e.Error())
		return
	}
	status, lurl, e := oauth.GetLoginURL(state)
	if e != nil {
		context.JSON(status, e.Error())
		return
	}

	context.JSON(status, lurl)
}

func GoogleAuth(context *gin.Context) {
	token := context.Request.Header.Get("x-auth-token")
	id, status := middleware.VerifyToken(token)
	if status != 200 {
		context.JSON(status, id)
		return
	}
	status, t, e := oauth.GoogleToken(context.Query("code"))
	if e != nil {
		context.JSON(status, e.Error())
		return
	}
	status, e = linkers.AddGoogleToken(id, t, config.UpdateUser)
	if e != nil {
		context.JSON(status, e.Error())
		return
	}
	context.Status(status)
}

func GoogleEvents(context *gin.Context) {
	token := context.Request.Header.Get("x-auth-token")
	id, status := middleware.VerifyToken(token)
	if status != 200 {
		context.JSON(status, id)
		return
	}
	user, status := linkers.GetUser(id, config.FindUser)
	if status != 200 {
		context.JSON(status, "Could not get user")
		return
	}
	events, status, e := linkers.SyncGoogleCalendar(user, oauth.GetService, oauth.GetEvents)
	if e != nil {
		context.JSON(status, e.Error())
		return
	}
	e = linkers.AddListOfEvents(events, id, config.InsertEvent)
	if e != nil {
		context.JSON(500, e.Error())
		return
	}
	context.Status(200)
}

func GetAlarms(context *gin.Context) {
	token := context.Request.Header.Get("x-auth-token")
	id, status := middleware.VerifyToken(token)
	if status != 200 {
		context.JSON(status, id)
		return
	}
	alarms, status, e := linkers.GetAlarms(id, config.GetAlarms)
	if e != nil {
		context.JSON(status, e.Error())
		return
	}
	context.JSON(200, alarms)
}

func AddAlarm(context *gin.Context) {
	token := context.Request.Header.Get("x-auth-token")
	id, status := middleware.VerifyToken(token)
	if status != 200 {
		context.JSON(status, id)
		return
	}
	time, status, e := convertHTTPBodyToString(context.Request.Body)
	if e != nil {
		context.JSON(status, e.Error())
		return
	}
	status, e = linkers.AddAlarm(id, time, config.AddAlarm)
	if e != nil {
		context.JSON(status, e.Error())
		return
	}
	context.Status(status)
}

func UpdateAlarm(context *gin.Context) {
	token := context.Request.Header.Get("x-auth-token")
	id, status := middleware.VerifyToken(token)
	if status != 200 {
		context.JSON(status, id)
		return
	}
	time, status, e := convertHTTPBodyToString(context.Request.Body)
	if e != nil {
		context.JSON(status, e.Error())
		return
	}
	status, e = linkers.ToggleAlarm(id, time, config.GetOneAlarm, config.UpdateAlarm)
	if e != nil {
		context.JSON(status, e.Error())
		return
	}
	context.Status(status)
}

func convertHTTPBodyToString(httpBody io.ReadCloser) (string, int, error) {
	body, e := ioutil.ReadAll(httpBody)
	if e != nil {
		return "", 500, e
	}
	var res string
	e = json.Unmarshal(body, &res)
	if e != nil {
		return "", 500, e
	}
	return res, 200, nil
}

func convertHTTPBodyToUser(httpBody io.ReadCloser) (models.User, int, error) {
	body, e := ioutil.ReadAll(httpBody)
	if e != nil {
		return models.User{}, http.StatusInternalServerError, e
	}

	var tmp models.User

	e = json.Unmarshal(body, &tmp)
	if e != nil {
		return models.User{}, http.StatusBadRequest, e
	}

	return tmp, http.StatusOK, nil
}

func convertHTTPBodyToEvent(httpBody io.ReadCloser) (models.Event, int, error) {
	body, e := ioutil.ReadAll(httpBody)
	if e != nil {
		return models.Event{}, http.StatusInternalServerError, e
	}

	var tmp models.Event

	e = json.Unmarshal(body, &tmp)
	if e != nil {
		return models.Event{}, http.StatusBadRequest, e
	}

	return tmp, http.StatusOK, nil
}
