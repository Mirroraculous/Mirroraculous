package oauth

import (
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
		t.Errorf("Expected 500 status, \"\" url, and error. Got %d, %s, %s", s, u, e.Error())
	}

	FILE = "oauth/dummy.json"
	if s, u, e := GetLoginURL("1vj2hK+3AuLnAEGxn90tPAu19BKk6IJRRiSg7zNkDms="); s != 200 || len(u) < 1 || e != nil {
		log.Println(os.)
		t.Errorf("Expected 200, some URL, and no error. Got %d, %s, %s", s, u, e.Error())
	}
}
