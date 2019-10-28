package config

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/mirroraculous/mirroraculous/models"
	"go.mongodb.org/mongo-driver/bson"
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

func FindUser(query bson.D) (*models.User, error) {
	var u models.User
	err := User.FindOne(context.Background(), query).Decode(&u)
	return &u, err
}

func InsertUser(user *models.User) (string, error) {
	res, e := User.InsertOne(context.Background(), *user)
	if e != nil {
		return "", e
	}
	return fmt.Sprintf("%v", res.InsertedID), nil
}

func InsertEvent(event *models.Event) error {
	_, e := Calendar.InsertOne(context.Background(), *event)
	return e
}

func FindEvent(query bson.D, num int64) ([]models.Event, error) {
	var ret []models.Event
	findOptions := options.Find().SetLimit(num)
	res, e := Calendar.Find(context.Background(), query, findOptions)
	if e != nil {
		return ret, e
	}
	for res.Next(context.Background()) {
		var temp models.Event
		e = res.Decode(&temp)
		if e != nil {
			return ret, e
		}
		ret = append(ret, temp)
	}
	return ret, nil
}

func ReplaceEvent(query bson.D, event *models.Event) error {
	_, e := Calendar.ReplaceOne(context.Background(), query, *event)
	return e
}

func DeleteEvent(query bson.D) error {
	_, e := Calendar.DeleteOne(context.Background(), query)
	return e
}
