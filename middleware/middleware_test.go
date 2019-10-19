package middleware

import "testing"

func TestMakeToken(t *testing.T) {
	if token, status := MakeToken(""); len(token) < 1 || status != 200 {
		t.Errorf("Test failed, expected status 200 and a token, got %d and %s", status, token)
	}
}

func TestVerifyToken(t *testing.T) {
	if id, status := VerifyToken(""); id != "Invalid Token" || status != 401 {
		t.Errorf("Test failed, expected status 401 and \"Invalid Token\", got %d and %s", status, id)
	}

	if id, status := VerifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkOTZkZDI3NjNmZjE1MGNlMDc5YThiYyIsImV4cCI6MTU3MDg3MzI3NH0.D23bbKce0hEk1zeXKbYimUII9HghGshtqlgqWf2rTZU"); id != "Invalid Token" || status != 401 {
		t.Errorf("Test failed, expected status 401 and \"Invalid Token\", got %d and %s", status, id)
	}

	if id, status := VerifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkOTZkZDI3NjNmZjE1MGNlMDc5YThiYyIsImV4cCI6MTU4MTY3MzM2MH0.6ecQAFQfvtjQWiV-hdJBA5pPtJFkMhrjWTQvyzkAlOY"); id != "5d96dd2763ff150ce079a8bc" || status != 200 {
		t.Errorf("Test failed, expected status 200 and \"5d96dd2763ff150ce079a8bc\", got %d and %s", status, id)
	}
}
