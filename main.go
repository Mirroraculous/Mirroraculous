package main

import (
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/mirroraculous/mirroraculous/config"
	"github.com/mirroraculous/mirroraculous/handlers"
	"github.com/mirroraculous/mirroraculous/oauth"
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

	server.POST("/api/auth", handlers.LoginUser)
	server.GET("/api/auth", handlers.GetUser)

	server.GET("/api/calendar/:day", handlers.GetCalendar)
	server.POST("/api/calendar", handlers.AddEvent)
	server.PUT("/api/calendar/:id", handlers.UpdateEvent)
	server.DELETE("/api/calendar/:id", handlers.DeleteEvent)

	server.GET("/api/googlelogin", oauth.GoogleLogin)

	err := server.Run(":3000")
	if err != nil {
		panic(err)
	}
}
