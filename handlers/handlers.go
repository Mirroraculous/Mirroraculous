package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mirroraculous/mirroraculous/linkers"
	"github.com/mirroraculous/mirroraculous/middleware"
	"github.com/mirroraculous/mirroraculous/models"
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
	id, status := linkers.AddUser(user)
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
	id, status := linkers.LoginUser(user.Email, user.Pwd)
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
	user, status := linkers.GetUser(id)
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
	calendar, status := linkers.GetCalendar(id)
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
	e, status = linkers.AddEvent(id, event)
	if e != nil {
		context.JSON(status, "Event not added")
	}
	context.JSON(status, "Event added")
}

UpdateEvent updates a specific event; responds status
PUT time, event to :3000/api/calendar/:id
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
	status = linkers.UpdateEvent(event)
	context.JSON(status, "")
}

// // DeleteEvent deletes a specific event; responds status
// // DELETE to :3000/api/calendar/:id
// func DeleteEvent(context *gin.Context) {
// 	fmt.Println("Hello from DeleteEvent")
// 	token := context.Request.Header.Get("x-auth-token")
// 	id, status := middleware.VerifyToken(token)
// 	if status != 200 {
// 		context.JSON(status, id)
// 		return
// 	}
// 	eventID := context.Params.ByName("id")
// 	status = datamock.DeleteEvent(id, eventID)
// 	context.JSON(status, "")
// }

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
