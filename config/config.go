package config

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Config struct {
	MongoURI string `json:"mongoURI"`
}

func Connect() error {
	var conf Config
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

	client, e := mongo.NewClient(options.Client().ApplyURI(conf.MongoURI))

	if e != nil {
		fmt.Println(e)
		return e
	}

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	e = client.Connect(ctx)
	if e != nil {
		fmt.Println(e)
		return e
	}
	fmt.Println("connected!")
	return nil
}
