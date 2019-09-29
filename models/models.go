package models

import (
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

type AllowedConferenceSolutionTypes struct {
	Types string
}

type Calendar struct {
	Kind                 string `json:"kind"`
	Etag                 string `json:"etag"`
	ID                   string `json:"id"`
	Summary              string `json:"summary"`
	Description          string `json:"description"`
	Location             string `json:"Location"`
	TimeZone             string `json:"timeZone"`
	SummaryOverride      string `json:"summaryOverride"`
	ColorID              string `json:"colorID"`
	BackgroundColor      string `json:"backgroundColor"`
	ForegroundColor      string `json:"foregroundColor"`
	Hidden               bool   `json:"hidden"`
	Selected             bool   `json:"selected"`
	AccessRole           string `json:"accessRole"`
	DefaultReminders     []Reminders
	NotificationSettings []Notifications
	Primary              bool `json:"primary"`
	Deleted              bool `json:"deleted"`
	ConferenceProperties []AllowedConferenceSolutionTypes
}
