package oauth

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type Credentials struct {
	Cid     string   `json:"client_id"`
	Csecret string   `json:"client_secret"`
	Redir   []string `json:"redirect_uris"`
}

func Cred() (Credentials, oauth2.Config, error) {
	var c Credentials
	var conf oauth2.Config
	f, e := ioutil.ReadFile("oauth/client_id.json")
	if e != nil {
		fmt.Println(e.Error())
		return c, conf, e
	}
	json.Unmarshal(f, &c)
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

func getLoginURL(state string) string {
	_, conf, _ := Cred()
	return conf.AuthCodeURL(state)
}

func randToken() string {
	b := make([]byte, 32)
	rand.Read(b)
	return base64.StdEncoding.EncodeToString(b)
}

func GoogleLogin(context *gin.Context) {
	state := randToken()
	context.JSON(200, getLoginURL(state))
}

func GoogleAuth(c *gin.Context) {
	_, conf, e := Cred()
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
