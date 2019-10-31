package oauth

import (
	"log"
	"os"
	"path"
	"testing"
)

func TestRandToken(t *testing.T) {
	if s, to, e := RandToken(); s != 200 || len(to) < 1 || e != nil {
		t.Errorf("RandToken failed.\nExpected status 200, got %d\nExpected token, token is %s\nExpected nil error, got %s\n", s, to, e)
	}
}

func TestGetLoginURL(t *testing.T) {
	FILE = ""
	if s, u, e := GetLoginURL(""); s != 500 || u != "" || e == nil {
		t.Errorf("Expected 500 status, \"\" url, and error. Got %d, %s, %s", s, u, e)
	}

	dir, _ := os.Getwd()
	FILE = path.Join(dir, "dummy.json")
	if s, u, e := GetLoginURL("1vj2hK+3AuLnAEGxn90tPAu19BKk6IJRRiSg7zNkDms="); s != 200 || len(u) < 1 || e != nil {
		log.Println(e.Error())
		t.Errorf("Expected 200, some URL, and no error. Got %d, %s, %s", s, u, e.Error())
	}
}

func TestGoogleAuth(t *testing.T) {
	FILE = ""
	if s, e := GoogleAuth(""); s != 500 || e == nil {
		t.Errorf("Expected 500 status and \"Server credentials failed\", go %d and %s", s, e)
	}

	dir, _ := os.Getwd()
	FILE = path.Join(dir, "dummy.json")
	if s, e := GoogleAuth(""); s != 401 || e == nil {
		t.Errorf("Expected 401 status and \"Unauthorized\", go %d and %s", s, e)
	}
}
