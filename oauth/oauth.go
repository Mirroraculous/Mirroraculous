package oauth

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
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
func GoogleAuth(c *gin.Context) {
	_, conf, e := cred()
	if e != nil {
		c.JSON(500, "Server credentials failed")
		return
	}
	token, e := conf.Exchange(oauth2.NoContext, c.Query("code"))
	if e != nil {
		c.JSON(401, "Unauthorized")
		return
	}

	client := conf.Client(oauth2.NoContext, token)
	email, e := client.Get("https://www.googleapis.com/oauth2/v3/userinfo")
	if e != nil {
		c.JSON(401, "Email unverified")
		return
	}

	defer email.Body.Close()
	data, _ := ioutil.ReadAll(email.Body)
	fmt.Printf("Email: %s\n", string(data))
	c.Status(200)
}
