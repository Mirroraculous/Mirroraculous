package linkers

import (
	"context"
	"fmt"

	"github.com/mirroraculous/mirroraculous/config"
	"github.com/mirroraculous/mirroraculous/models"
)

func AddUser(newUser models.User) (string, int) {
	found, _ := config.User.Find(context.Background(), newUser.Email)

	if found != nil {
		return "User already exists", 400
	}

	id, e := config.User.InsertOne(context.Background(), newUser)

	if e != nil {
		return e.Error(), 500
	}

	return fmt.Sprintf("%v", id.InsertedID), 200
}
