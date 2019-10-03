package linkers

import (
	"context"
	"fmt"
	"regexp"

	"github.com/mirroraculous/mirroraculous/config"
	"github.com/mirroraculous/mirroraculous/models"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

func AddUser(newUser models.User) (string, int) {
	if !validEmail(newUser.Email) || newUser.Name == "" || !validPassword(newUser.Password) {
		return "Incomplete Submission", 400
	}
	var u models.User
	err := config.User.FindOne(context.Background(), bson.D{{"email", newUser.Email}}).Decode(&u)
	if u.Email == newUser.Email {
		return "Email already in use", 400
	}

	if err.Error() != "mongo: no documents in result" {
		return "Server error", 500
	}

	newUser.Password, err = salt(newUser.Password)
	if err != nil {
		return "Server error", 500
	}

	res, e := config.User.InsertOne(context.Background(), newUser)

	if e != nil {
		return e.Error(), 500
	}

	return fmt.Sprintf("%v", res.InsertedID), 200
}

func salt(password string) (string, error) {
	if hash, e := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost); e != nil {
		return "", e
	} else {
		return string(hash), nil
	}

}

func validEmail(email string) bool {
	matched, _ := regexp.MatchString(`[A-Za-z0-9._%+-{|}]+@[A-Za-z0-9._]+.[A-Za-z][A-Za-z][A-Za-z]`, email)
	return matched
}

func validPassword(email string) bool {
	return len(email) > 5
}

func compHash(password string, storedPW string) bool {
	if e := bcrypt.CompareHashAndPassword([]byte(storedPW), []byte(password)); e != nil {
		return false
	} else {
		return true
	}
}
