package main

import (
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/mirroraculous/mirroraculous/config"
	"github.com/mirroraculous/mirroraculous/handlers"
)

func main() {
	e := config.Connect()
	if e != nil {
		fmt.Println("DB unable to connect")
		return
	}

	if e != nil {
		fmt.Println("Unable to get credentials")
		return
	}

	server := gin.Default()
	server.Use(cors.New(cors.Config{
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Content-Length", "x-auth-token"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowAllOrigins:  false,
		AllowOriginFunc:  func(origin string) bool { return true },
	}))

	server.POST("/api/user", handlers.RegisterUser)
	server.DELETE("/api/user", handlers.DeleteUser)
	server.PUT("/api/user", handlers.UpdateUser)

	server.POST("/api/auth", handlers.LoginUser)
	server.GET("/api/auth", handlers.GetUser)

	server.GET("/api/calendar/:day", handlers.GetCalendar)
	server.POST("/api/calendar", handlers.AddEvent)
	server.PUT("/api/calendar/:id", handlers.UpdateEvent)
	server.DELETE("/api/calendar/:id", handlers.DeleteEvent)

	server.GET("/api/googlelogin", handlers.GoogleLogin)
	server.GET("/api/googleauth", handlers.GoogleAuth)
	server.GET("/api/googleevents", handlers.GoogleEvents)

	server.GET("/api/alarms", handlers.GetAlarms)
	server.POST("/api/alarms", handlers.AddAlarm)
	server.PUT("/api/alarms", handlers.UpdateAlarm)
	server.DELETE("/api/alarms", handlers.DeleteAlarm)

	err := server.Run(":3000")
	if err != nil {
		panic(err)
	}
}
