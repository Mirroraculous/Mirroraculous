package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mirroraculous/mirroraculous/datamock"
)

func RegisterUser(context *gin.Context) {
	fmt.Println("Hello from register")
	user, status, e := convertHTTPBodyToUser(context.Request.Body)
	if e != nil {
		context.JSON(status, e)
		return
	}
	context.JSON(http.StatusOK, datamock.AddUser(user.Name, user.Pwd))
}

// LoginUser logs in a user
// Needs to respond with the status and user token (if applicable)
func LoginUser(context *gin.Context) {
	fmt.Println("Hello from login")
	user, status, e := convertHTTPBodyToUser(context.Request.Body)
	if e != nil {
		context.JSON(status, e)
		return
	}
	token, e := datamock.LoginUser(user.Name, user.Pwd)
	if e != nil {
		context.JSON(400, e)
		return
	}
	context.JSON(http.StatusOK, token)
}

func GetUser(context *gin.Context) {
	fmt.Println("Hello from GetUser")
	token := context.Request.Header.Get("x-auth-token")
	user, e := datamock.GetUser(token)
	if e != nil {
		context.JSON(400, e)
	}
	context.JSON(http.StatusOK, user)
}

// GetCalendar gets the calendar events for a user
// Needs user token in header
// If timeframe is specified, will return that timeframe
// Default timeframe is x
func GetCalendar(context *gin.Context) {
	fmt.Println("Hello from GetCalendar")
	token := context.Request.Header.Get("x-auth-token")
	calendar, e := datamock.GetCalendar(token)
	if e != nil {
		fmt.Println(e)
		context.JSON(400, e)
	}
	context.JSON(http.StatusOK, calendar)
}

// AddEvent and UpdateEvent
func AddEvent(context *gin.Context) {
	fmt.Println("Hello from AddEvent")
}

func UpdateEvent(context *gin.Context) {
	fmt.Println("Hello from UpdateEvent")
}

func DeleteEvent(context *gin.Context) {
	fmt.Println("Hello from DeleteEvent")
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
