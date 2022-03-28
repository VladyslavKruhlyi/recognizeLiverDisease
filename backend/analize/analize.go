package analize

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/bson"
	"hospital-backend/db"
	"time"
	"github.com/labstack/echo"
	"log"
	"net/http"
	"context"
)

// Analize is a representation of a analize
type Analize struct {
	AnalizeID primitive.ObjectID	`bson:"_id" json:"analizeId,omitempty"`
	PatientID primitive.ObjectID 	`json:"patientId,omitempty"`
	Name			string 	`json:"name,omitempty"`
	Value     string	`json:"value,omitempty"`
	Date     	time.Time	`json:"date,omitempty"`
}

// AddAnalize is a representation of a analize
func AddAnalize(c echo.Context) error {
	client, ctx := db.GetDb()
	analize := Analize{}

	err := c.Bind(&analize)
  if err != nil {
    log.Printf("Failed POST analize request: %s\n", err)
    return echo.NewHTTPError(http.StatusInternalServerError)
	}

	analize.Date = time.Now()

	collection := client.Database("hospital-crm").Collection("analizes")

	insertResult, err := collection.InsertOne(context.Background(), map[string]interface{}{
		"patientId": analize.PatientID,
		"name": analize.Name,
		"value": analize.Value,
		"date": analize.Date,
	})
	if err != nil {
    log.Printf("Failed POST analize request: %s\n", err)
    return echo.NewHTTPError(http.StatusInternalServerError)
	}

	analize.AnalizeID = insertResult.InsertedID.(primitive.ObjectID);

	defer client.Disconnect(ctx)

	return c.JSON(http.StatusOK, analize)
}

// GetAnalizes is a representation of a analize
func GetAnalizes(c echo.Context) error {
	client, ctx := db.GetDb()
	collection := client.Database("hospital-crm").Collection("analizes")
	patientID := c.Request().Header.Get("patientId")

	oid, err := primitive.ObjectIDFromHex(patientID)
	if err != nil {
		log.Printf("Failed GET analizes request: %s\n", err)
    return echo.NewHTTPError(http.StatusInternalServerError)
	}

	cur, err := collection.Find(context.Background(), bson.D{primitive.E{Key: "patientId", Value: oid}})
	if err != nil {
    log.Printf("Failed GET analizes request: %s\n", err)
    return echo.NewHTTPError(http.StatusInternalServerError)
	}
	var analizes []*Analize

	defer cur.Close(context.Background())

	for cur.Next(context.Background()) {
    var analize Analize
    err := cur.Decode(&analize)
    if err != nil {
			log.Printf("Failed GET analizes request: %s\n", err)
			return echo.NewHTTPError(http.StatusInternalServerError)
    }

    analizes = append(analizes, &analize)
	}

	if err := cur.Err(); err != nil {
		log.Printf("Failed GET analizes request: %s\n", err)
		return echo.NewHTTPError(http.StatusInternalServerError)
	}
	cur.Close(context.Background())

	defer client.Disconnect(ctx)

	return c.JSON(http.StatusOK, analizes)
}
