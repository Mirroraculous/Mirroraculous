package handlers

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

// RegisterUser registers a user
// Needs to check that user does not already exist
// Logs in user after successful registration
func RegisterUser(context *gin.Context) {
	fmt.Println("Hello from register")
	LoginUser(nil)
}

// LoginUser logs in a user
// Needs to respond with the status and user token (if applicable)
func LoginUser(context *gin.Context) {
	fmt.Println("Hello from login")
}

// GetUser gets the user's details
// Needs to have the user token in header
func GetUser(context *gin.Context) {
	fmt.Println("Hello from GetUser")
}

// GetCalendar gets the calendar events for a user
// Needs user token in header
// If timeframe is specified, will return that timeframe
// Default timeframe is x
func GetCalendar(context *gin.Context) {
	fmt.Println("Hello from GetCalendar")
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