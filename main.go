package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	
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
	server.Use(cors.New(cors.Config{
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Content-Length", "x-auth-token"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowAllOrigins:  false,
		AllowOriginFunc:  func(origin string) bool { return true },
	}))

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
