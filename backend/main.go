package main

import (
	"hospital-backend/calculate"
	"hospital-backend/analize"
	"hospital-backend/doctor"
	"hospital-backend/patient"
	"hospital-backend/image"
	"github.com/labstack/echo"
	"os"
)

func main() {
	var build string 

	if os.Getenv("NODE_ENV") == "production" {
		build = "build"
	} else {
		build = "../build"
	}

	e := echo.New()

	e.POST("/analize", analize.AddAnalize)
	e.GET("/analizes", analize.GetAnalizes)
	e.POST("/calculate", calculate.Calculate)
	e.POST("/doctor", doctor.AddDoctor)
	e.GET("/doctor/:id", doctor.GetDoctor)
	e.POST("/image", image.AddImage)
	e.DELETE("/image/:id", image.DeleteImage)
	e.GET("/images", image.GetImages)
	e.GET("/all/images", image.GetAllImages)
	e.POST("/patient", patient.AddPatient)
	e.DELETE("/patient/:id", patient.DeletePatient)
	e.GET("/patients", patient.GetPatients)

	e.Static("/", build)
	e.Static("/assets", "assets")
	e.Logger.Fatal(e.Start(":1323"))
}
