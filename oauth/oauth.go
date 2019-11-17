package oauth

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"log"
	"os"
	"time"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/calendar/v3"
	"google.golang.org/api/option"
)

type credentials struct {
	Cid     string   `json:"client_id"`
	Csecret string   `json:"client_secret"`
	Redir   []string `json:"redirect_uris"`
}

// FILE to get credentials from
var FILE string

func init() {
	FILE = "oauth/client_id.json"
}

func cred() (credentials, oauth2.Config, error) {
	var c credentials
	var conf oauth2.Config
	f, e := os.Open(FILE)
	if e != nil {
		log.Println(e.Error())
		return c, conf, e
	}
	decoder := json.NewDecoder(f)
	e = decoder.Decode(&c)
	if e != nil {
		log.Println(e.Error())
		return c, conf, e
	}

	conf = oauth2.Config{
		ClientID:     c.Cid,
		ClientSecret: c.Csecret,
		RedirectURL:  c.Redir[1],
		Scopes: []string{
			"https://www.googleapis.com/auth/calendar.events.readonly",
		},
		Endpoint: google.Endpoint,
	}
	return c, conf, e
}

// GetLoginURL returns the Google login URL for oauth2
func GetLoginURL(state string) (int, string, error) {
	_, conf, e := cred()
	if e != nil {
		return 500, "", e
	}
	return 200, conf.AuthCodeURL(state), nil
}

// RandToken generates a random 32 byte token (state for the google login
func RandToken() (int, string, error) {
	b := make([]byte, 32)
	_, e := rand.Read(b)
	if e != nil {
		return 500, "", errors.New("Error in generating random token")
	}
	return 200, base64.StdEncoding.EncodeToString(b), nil
}

// GoogleAuth does stuff
func GoogleToken(code string) (int, *oauth2.Token, error) {
	_, conf, e := cred()
	if e != nil {
		return 500, nil, errors.New("Server credentials failed")
	}
	token, e := conf.Exchange(context.Background(), code)
	if e != nil {
		log.Println(e.Error())
		return 401, nil, errors.New("Unauthorized")
	}

	return 200, token, nil
}

func GetService(userToken *oauth2.Token) (*calendar.Service, error) {
	client := oauth2.NewClient(context.Background(), oauth2.StaticTokenSource(userToken))
	service, e := calendar.NewService(context.Background(), option.WithHTTPClient(client))

	if e != nil {
		log.Println(e.Error())
		return nil, e
	}
	return service, nil
}

func GetEvents(service *calendar.Service) (*calendar.Events, error) {
	events, e := service.Events.List("primary").TimeMin(time.Now().Format(time.RFC3339)).Do()
	return events, e
}
