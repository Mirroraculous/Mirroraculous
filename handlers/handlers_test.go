package handlers

import (
	"bytes"
	"errors"
	"io/ioutil"
	"net/http"
	"testing"
)

type r struct{}

func (r) Read(p []byte) (int, error) {
	return 0, errors.New("Broken")
}
func (r) Close() error {
	return errors.New("Broken")
}

func TestConvertHTTPBodyToUser(t *testing.T) {
	user, status, e := convertHTTPBodyToUser(r{})
	if status != http.StatusInternalServerError || e == nil {
		t.Errorf("Test failed, expected empty user, status 500, and an error, got %s, %d, and %s", user, status, e)
	}

	r := ioutil.NopCloser(bytes.NewReader([]byte("")))
	user, status, e = convertHTTPBodyToUser(r)
	if status != http.StatusBadRequest || e == nil {
		t.Errorf("Test failed, expected empty user, status 400, and an error, got %s, %d, and %s", user, status, e)
	}

	r = ioutil.NopCloser(bytes.NewReader([]byte("{\"name\": \"Test\", \"email\": \"abc@123.com\", \"password\": \"testpwd\"}")))
	user, status, e = convertHTTPBodyToUser(r)
	if status != http.StatusOK || e != nil {
		t.Errorf("Test failed, expected test user, status 200, and no error, got %s, %d, and %s", user, status, e)
	}
}

func TestConvertHTTPBodyToEvent(t *testing.T) {
	event, status, e := convertHTTPBodyToEvent(r{})
	if status != http.StatusInternalServerError || e == nil {
		t.Errorf("Test failed, expected empty event, status 500, and an error, got %v, %d, and %s", event, status, e)
	}

	r := ioutil.NopCloser(bytes.NewReader([]byte("")))
	event, status, e = convertHTTPBodyToEvent(r)
	if status != http.StatusBadRequest || e == nil {
		t.Errorf("Test failed, expected empty event, status 400, and an error, got %v, %d, and %s", event, status, e)
	}

	r = ioutil.NopCloser(bytes.NewReader([]byte("{\"status\": \"test\",\"summary\": \"test\",\"description\": \"test\",\"creator\": {\"email\": \"test@test.test\",\"displayName\": \"test\",\"self\": true},\"start\": {\"date\": \"2019-10-18T20:12:15-06:00\",\"dateTime\": \"2019-10-18T20:12:15-06:00\"},\"EndTimeUnspecified\": true}")))
	event, status, e = convertHTTPBodyToEvent(r)
	if status != http.StatusOK || e != nil {
		t.Errorf("Test failed, expected test event, status 200, and no error, got %v, %d, and %s", event, status, e)
	}
}
