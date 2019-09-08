package main

import (
	"path"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/mirroraculous/mirroraculous/handlers"
)

func main() {
	server := gin.Default()
	server.NoRoute(func(context *gin.Context) {
		dir, file := path.Split(context.Request.RequestURI)
		ext := filepath.Ext(file)
		if file == "" || ext == "" {
			context.File("./index.html")
		} else {
			context.File("./" + path.Join(dir, file))
		}
	})

	server.POST("/api/user", handlers.RegisterUser)
	server.POST("/api/auth", handlers.LoginUser)
	server.GET("/api/auth", handlers.GetUser)
	server.GET("/api/calendar", handlers.GetCalendar)

	err := server.Run(":3000")
	if err != nil {
		panic(err)
	}
}
