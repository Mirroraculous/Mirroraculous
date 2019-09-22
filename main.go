package main

import (
	"fmt"

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
	server := gin.Default()

	server.POST("/api/user", handlers.RegisterUser)

	server.POST("/api/auth", handlers.LoginUser)
	server.GET("/api/auth", handlers.GetUser)

	server.GET("/api/calendar", handlers.GetCalendar)
	server.POST("/api/calendar", handlers.AddEvent)
	server.PUT("/api/calendar/:id", handlers.UpdateEvent)
	server.DELETE("/api/calendar/:id", handlers.DeleteEvent)

	err := server.Run(":3000")
	if err != nil {
		panic(err)
	}
}
