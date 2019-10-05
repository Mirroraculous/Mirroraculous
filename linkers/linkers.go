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
	if !validEmail(newUser.Email) || newUser.Name == "" || !validPassword(newUser.Pwd) {
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

	newUser.Pwd, err = salt(newUser.Pwd)
	if err != nil {
		return "Server error", 500
	}

	res, e := config.User.InsertOne(context.Background(), newUser)

	if e != nil {
		return e.Error(), 500
	}

	return fmt.Sprintf("%v", res.InsertedID), 200
}

func LoginUser(email string, pwd string) (string, int) {
	var u models.User
	err := config.User.FindOne(context.Background(), bson.D{{"email", email}}).Decode(&u)
	if err != nil {
		return "Email not found", 404
	}

	if !compHash(pwd, u.Pwd) {
		return "Invalid password", 401
	}

	return fmt.Sprintf("%q", u.ID.Hex()), 200

}
func GetUser(id string) (models.User, int) {
	var u models.User
	err := config.User.FindOne(context.Background(), bson.D{{"_id", id}}).Decode(&u)
	if err ! = nil {
		return "User not found", 404
	}
	
	return u, 200
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
