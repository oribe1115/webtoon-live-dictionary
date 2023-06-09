package main

import (
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.DefaultCORSConfig))
	e.Use(middleware.Logger())

	e.GET("/api/image", getImageHandler)

	e.Logger.Fatal(e.Start(":3000"))
}

func getImageHandler(c echo.Context) error {
	targetURL := c.QueryParam("src")

	contentType, blob, err := getImageBlob(targetURL)
	if err != nil {
		return err
	}

	if !strings.Contains(contentType, "image/") {
		return echo.NewHTTPError(http.StatusBadRequest, fmt.Errorf("content-type is %s", contentType))
	}

	return c.Blob(http.StatusOK, contentType, blob)
}

func getImageBlob(targetURL string) (contentType string, blob []byte, err error) {
	res, err := http.DefaultClient.Get(targetURL)
	if err != nil {
		return "", nil, err
	}

	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return "", nil, err
	}

	contentType = http.DetectContentType(body)

	return contentType, body, nil
}
