package config

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var User, Calendar *mongo.Collection

type config struct {
	MongoURI string `json:"mongoURI"`
	DBname   string `json:"dbname"`
	UserCol  string `json:"usercollection"`
	CalCol   string `json:"calendarcollection"`
}

func Connect() error {
	var conf config
	file, e := os.Open("config/default.json")
	if e != nil {
		fmt.Println(e)
		return e
	}
	decoder := json.NewDecoder(file)
	e = decoder.Decode(&conf)
	if e != nil {
		fmt.Println(e)
		return e
	}

	clientOptions := options.Client().ApplyURI(conf.MongoURI)

	client, e := mongo.Connect(context.TODO(), clientOptions)

	if e != nil {
		fmt.Println(e.Error())
		return e
	}

	if client.Ping(context.TODO(), nil) != nil {
		fmt.Println(e.Error())
		return e
	}

	User = client.Database(conf.DBname).Collection(conf.UserCol)
	Calendar = client.Database(conf.DBname).Collection(conf.CalCol)

	fmt.Println("connected!")
	return nil
}
