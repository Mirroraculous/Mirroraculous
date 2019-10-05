package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID    primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Name  string             `json:"name"`
	Email string             `json:"email"`
	Pwd   string             `json:"password"`
}

type Reminders struct {
	Method  string `json:"method"`
	Minutes int    `jsong:"minutes"`
}

type Notifications struct {
	Type   string `json:"type"`
	Method string `json:"method"`
}

type Event struct {
	UserID      primitive.ObjectID `json:"userid" bson:"userid"`
	ID          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Status      string             `json:"status"`
	Link        string             `json:"htmlLink"`
	Created     time.Time          `json:"created"`
	Updated     time.Time          `json:"updated"`
	Summary     string             `json:"summary"`
	Description string             `json:"description"`
	Location    string             `json:"location"`
	ColorId     string             `json:"colorId"`
	Creator     struct {
		Email       string `json:"email"`
		DisplayName string `json:"displayName"`
		Self        bool   `json:"self"`
	} `json:"creator"`
	Start struct {
		Date     time.Time `json:"date"`
		DateTime time.Time `json:"dateTime"`
		TimeZone string    `json:"timeZone"`
	} `json:"start"`
	End struct {
		Date     time.Time `json:"date"`
		DateTime time.Time `json:"dateTime"`
		TimeZone string    `json:"timeZone"`
	} `json:"end"`
	EndTimeUnspecified bool `json:"endTimeUnspecified"`
}
