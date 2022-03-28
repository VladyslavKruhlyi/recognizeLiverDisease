package calculate

import (
	"github.com/labstack/echo"
	"net/http"
	"log"
	"os/exec"
	"os"
	"bufio"
	"fmt"
)

// AnalizeType is a representation of a calculate
type AnalizeType struct {
	Name 							string	`json:"name,omitempty"`
	Task 							string	`json:"task,omitempty"`
	Sensor 						string	`json:"sensor,omitempty"`
	SaveTransform 		string	`json:"saveTransform,omitempty"`
	SaveBinarization 	string	`json:"saveBinarization,omitempty"`
}

// Calculate is a representation of a calculate
func Calculate(c echo.Context) error {
	analizeType := &AnalizeType{}
	err := c.Bind(analizeType)
	if err != nil {
    log.Printf("Failed POST image request: %s\n", err)
    return echo.NewHTTPError(http.StatusInternalServerError)
	}

	mydir, err := os.Getwd() 
  if err != nil { 
    log.Printf("Failed POST patient request: %s\n", err)
    return echo.NewHTTPError(http.StatusInternalServerError)
	} 

	fmt.Print("python3", "SystemBack/pythonfile.py", mydir + "/assets/" + analizeType.Name, analizeType.Task, analizeType.Sensor, mydir + "/assets/" + analizeType.SaveTransform, mydir + "/assets/" + analizeType.SaveBinarization);

	cmd := exec.Command("python3", "SystemBack/pythonfile.py", mydir + "/assets/" + analizeType.Name, analizeType.Task, analizeType.Sensor, mydir + "/assets/" + analizeType.SaveTransform, mydir + "/assets/" + analizeType.SaveBinarization)

  stdout, err := cmd.StdoutPipe()
  if err != nil {
    panic(err)
	}
	
  err = cmd.Start()
  if err != nil {
    panic(err)
	}
	
	scanner := bufio.NewScanner(stdout)
	var text string;
	for scanner.Scan() {
		fmt.Print(scanner.Text())
		text = scanner.Text()
	}

	cmd.Wait()

	return c.JSON(http.StatusOK, text)
}
