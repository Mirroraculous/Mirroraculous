package oauth

import (
	"testing"
)

func TestRandToken(t *testing.T) {
	if s, to, e := RandToken(); s != 200 || len(to) < 1 || e != nil {
		t.Errorf("RandToken failed.\nExpected status 200, got %d\nExpected token, token is %s\nExpected nil error, got %s\n", s, to, e)
	}
}
