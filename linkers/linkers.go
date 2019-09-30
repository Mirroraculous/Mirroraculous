package linkers

import (
	"context"
	"fmt"

	"github.com/mirroraculous/mirroraculous/config"
	"github.com/mirroraculous/mirroraculous/models"
	"go.mongodb.org/mongo-driver/bson"
)

// func AddUser(newUser models.User) (string, int) {
// 	return addUser(newUser, func(s string) interface{} {
// 		val, _ := config.User.Find({email: s})
// 		return val
// 	})
// }

// func addUser(newUser models.User, find func(email string) interface{}) (string, int) {
// 	found := find(newUser.Email)

// 	if found != nil {
// 		return "User already exists", 400
// 	}

// 	id, e := config.User.InsertOne(context.Background(), newUser)

// 	if e != nil {
// 		return e.Error(), 500
// 	}

// 	return fmt.Sprintf("%v", id.InsertedID), 200
// }

func AddUser(newUser models.User) (string, int) {
	var u models.User
	err := config.User.FindOne(context.Background(), bson.D{{"email", newUser.Email}}).Decode(&u)
	if u.Email == newUser.Email {
		return "Email already in use", 400
	}

	if err != nil {
		return "Server error", 500
	}

	id, e := config.User.InsertOne(context.Background(), newUser)

	if e != nil {
		return e.Error(), 500
	}

	return fmt.Sprintf("%v", id.InsertedID), 200
}
