package main

import (
	"log"
	"net/http"
	"os"
)

// getPort returns the TCP port the server should listen on.
// It reads the PORT environment variable and falls back to "8080".
func getPort() string {
	if port := os.Getenv("PORT"); port != "" {
		return port
	}
	return "8080"
}

// newHandler creates the HTTP handler that serves static files from staticDir.
func newHandler(staticDir string) http.Handler {
	return http.FileServer(http.Dir(staticDir))
}

func main() {
	port := getPort()
	http.Handle("/", newHandler("static"))

	log.Printf("Starting server on port %s...", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}
