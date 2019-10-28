package middleware

import (
	"time"

	"github.com/dgrijalva/jwt-go"
)

var jwtSecret = []byte("supersecretdevkey")

type Claims struct {
	ID string `json:"id"`
	jwt.StandardClaims
}

func MakeToken(id string) (string, int) {
	claims := &Claims{
		ID: id,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 60).Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, e := token.SignedString(jwtSecret)
	if e != nil {
		return "Server Error", 500
	}
	return tokenString, 200
}

func VerifyToken(tokenString string) (string, int) {
	claims := &Claims{}
	token, e := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if e != nil {
		return "Invalid Token", 401
	}
	if !token.Valid {
		return "Invalid Token", 401
	}
	return claims.ID, 200

}
