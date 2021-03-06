package config

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"

	"github.com/mirroraculous/mirroraculous/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var User, Calendar, Alarms *mongo.Collection

type config struct {
	MongoURI string `json:"mongoURI"`
	DBname   string `json:"dbname"`
	UserCol  string `json:"usercollection"`
	CalCol   string `json:"calendarcollection"`
	AlarmCol string `json:"alarmcollection"`
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

	if e := client.Ping(context.TODO(), nil); e != nil {
		fmt.Println(e.Error())
		return e
	}

	User = client.Database(conf.DBname).Collection(conf.UserCol)
	Calendar = client.Database(conf.DBname).Collection(conf.CalCol)
	Alarms = client.Database(conf.DBname).Collection(conf.AlarmCol)

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

func UpdateUser(filter, update bson.M) error {
	_, e := User.UpdateOne(context.Background(), filter, update)
	return e
}

func UpdateAlarm(filter, update bson.M) error {
	_, e := Alarms.UpdateOne(context.Background(), filter, update)
	return e
}

func AddAlarm(alarm *models.Alarm, query bson.D) error {
	alarms, e := GetAlarms(query)
	if e != nil {
		return e
	}
	for _, a := range alarms {
		if a.Time[0:4] == alarm.Time[0:4] && a.Time[len(a.Time)-2:len(a.Time)] == alarm.Time[len(alarm.Time)-2:len(alarm.Time)] {
			return errors.New("Alarm for that time already exists")
		}
	}
	_, e = Alarms.InsertOne(context.Background(), *alarm)
	return e
}

func GetOneAlarm(query bson.M) (models.Alarm, error) {
	var tmp models.Alarm
	e := Alarms.FindOne(context.Background(), query).Decode(&tmp)
	return tmp, e
}

func DeleteAlarm(query bson.M) error {
	_, e := Alarms.DeleteOne(context.Background(), query)
	return e
}

func GetAlarms(query bson.D) ([]models.Alarm, error) {
	var ret []models.Alarm
	res, e := Alarms.Find(context.Background(), query)
	if e != nil {
		return ret, e
	}
	for res.Next(context.Background()) {
		var tmp models.Alarm
		e = res.Decode(&tmp)
		if e != nil {
			return ret, e
		}
		ret = append(ret, tmp)
	}
	return ret, nil
}
