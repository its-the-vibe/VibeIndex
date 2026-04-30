package main

import (
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
)

func TestGetPort_Default(t *testing.T) {
	os.Unsetenv("PORT")
	if got := getPort(); got != "8080" {
		t.Errorf("getPort() = %q, want %q", got, "8080")
	}
}

func TestGetPort_Custom(t *testing.T) {
	os.Setenv("PORT", "9090")
	defer os.Unsetenv("PORT")
	if got := getPort(); got != "9090" {
		t.Errorf("getPort() = %q, want %q", got, "9090")
	}
}

func TestNewHandler_NotNil(t *testing.T) {
	if h := newHandler("static"); h == nil {
		t.Fatal("newHandler() returned nil")
	}
}

func TestNewHandler_ServesFile(t *testing.T) {
	dir := t.TempDir()
	content := []byte("hello vibeindex")
	if err := os.WriteFile(filepath.Join(dir, "app.js"), content, 0644); err != nil {
		t.Fatal(err)
	}

	handler := newHandler(dir)
	req := httptest.NewRequest(http.MethodGet, "/app.js", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", rec.Code)
	}
	if got := rec.Body.String(); got != string(content) {
		t.Errorf("expected body %q, got %q", content, got)
	}
}

func TestNewHandler_Returns404ForMissingFile(t *testing.T) {
	dir := t.TempDir()

	handler := newHandler(dir)
	req := httptest.NewRequest(http.MethodGet, "/missing.html", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusNotFound {
		t.Errorf("expected status 404, got %d", rec.Code)
	}
}
