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
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://hospital:inmdr1@localhost:27017/hospital-crm"))
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