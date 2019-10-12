package linkers

import (
	"errors"
	"testing"

	"github.com/mirroraculous/mirroraculous/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func TestAddUser(t *testing.T) {
	if id, status := AddUser(models.User{}, func(query bson.D) (*models.User, error) {
		var u *models.User
		return u, nil
	}, func(user *models.User) (string, error) {
		return "", nil
	}); id != "Incomplete Submission" || status != 400 {
		t.Errorf("Test failed, expected status 400 and \"Incomplete Submission\", got %d and %s", status, id)
	}

	if id, status := AddUser(models.User{
		Email: "tim@tim.tim",
		Name:  "Tim",
		Pwd:   "123456",
	}, func(query bson.D) (*models.User, error) {
		u := models.User{
			Email: "tim@tim.tim",
		}
		return &u, nil
	}, func(user *models.User) (string, error) {
		return "", nil
	}); id != "Server error" || status != 500 {
		t.Errorf("Test failed, expected status 500 and \"Server error\", got %d and %s", status, id)
	}

	if id, status := AddUser(models.User{
		Email: "tim@tim.tim",
		Name:  "Tim",
		Pwd:   "123456",
	}, func(query bson.D) (*models.User, error) {
		u := models.User{
			Email: "tim@tim.tim",
		}
		return &u, errors.New("mongo: no documents in result")
	}, func(user *models.User) (string, error) {
		return "", nil
	}); id != "Email already in use" || status != 400 {
		t.Errorf("Test failed, expected status 400 and \"Email already in use\", got %d and %s", status, id)
	}

	if id, status := AddUser(models.User{
		Email: "tim@tim.tim",
		Name:  "Tim",
		Pwd:   "123456",
	}, func(query bson.D) (*models.User, error) {
		var u models.User
		return &u, errors.New("mongo: no documents in result")
	}, func(user *models.User) (string, error) {
		return "12345", errors.New("some error")
	}); id != "some error" || status != 500 {
		t.Errorf("Test failed, expected status 500 and \"some error\", got %d and %s", status, id)
	}

	if id, status := AddUser(models.User{
		Email: "tim@tim.tim",
		Name:  "Tim",
		Pwd:   "123456",
	}, func(query bson.D) (*models.User, error) {
		var u models.User
		return &u, errors.New("mongo: no documents in result")
	}, func(user *models.User) (string, error) {
		return "abcde", nil
	}); id != "abcde" || status != 200 {
		t.Errorf("Test failed, expected status 200 and \"123456\", got %d and %s", status, id)
	}
}

func TestLoginUser(t *testing.T) {
	if id, status := LoginUser("tim@tim.tim", "123456", func(query bson.D) (*models.User, error) {
		var u models.User
		return &u, errors.New("")
	}); id != "Email not found" || status != 404 {
		t.Errorf("Test failed, expected status 404 and \"Email not found\", got %d and %s", status, id)
	}

	if id, status := LoginUser("tim@tim.tim", "123456", func(query bson.D) (*models.User, error) {
		u := models.User{
			Pwd: "123456",
		}
		return &u, nil
	}); id != "Invalid password" || status != 401 {
		t.Errorf("Test failed, expected status 401 and \"Invalid password\", got %d and %s", status, id)
	}
	if id, status := LoginUser("tim@tim.tim", "123456", func(query bson.D) (*models.User, error) {
		s, _ := salt("123456")
		i, _ := primitive.ObjectIDFromHex("0000")
		u := models.User{
			ID:  i,
			Pwd: s,
		}
		return &u, nil
	}); id != "000000000000000000000000" || status != 200 {
		t.Errorf("Test failed, expected status 200 and \"000000000000000000000000\", got %d and %s", status, id)
	}
}

func TestGetUser(t *testing.T) {
	if _, status := GetUser("000000000000000000000000", func(query bson.D) (*models.User, error) {
		var u models.User
		return &u, errors.New("bad")
	}); status != 404 {
		t.Errorf("Test failed, expected status 404, got %d", status)
	}

	if user, status := GetUser("000000000000000000000000", func(query bson.D) (*models.User, error) {
		i, _ := primitive.ObjectIDFromHex("0000")
		u := models.User{
			ID:    i,
			Email: "hello",
		}
		return &u, nil
	}); user.Email != "hello" || status != 200 {
		t.Errorf("Test failed, expected status 200 and user's email to be \"hello\", got %d and %s", status, user.Email)
	}
}
