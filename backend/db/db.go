package db

import (
	"context"
	"time"
  "go.mongodb.org/mongo-driver/mongo"
  "go.mongodb.org/mongo-driver/mongo/options"
	"log"
)

// GetDb is a representation of a db
func GetDb() (*mongo.Client, context.Context) {
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb+srv://Nivolves:Danya2000@hospital-crm.drhi5.mongodb.net/hospital-crm"))
  if err != nil {
    log.Fatal(err)
	}
	
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

  err = client.Connect(ctx)
  if err != nil {
    log.Fatal(err)
  }
	
	return client, ctx;
}