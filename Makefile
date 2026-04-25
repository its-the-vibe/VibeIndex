.PHONY: build test test-go test-js lint lint-go lint-js docker clean

## build: Compile the Go server binary
build:
	go build -o server .

## test: Run all tests (Go and JavaScript)
test: test-go test-js

## test-go: Run Go unit tests
test-go:
	go test $$(go list ./... | grep -v /node_modules/)

## test-js: Run JavaScript unit tests with Jest
test-js:
	npm test

## lint: Run all linters (Go and JavaScript)
lint: lint-go lint-js

## lint-go: Run Go static analysis with go vet
lint-go:
	go vet $$(go list ./... | grep -v /node_modules/)

## lint-js: Lint JavaScript with ESLint
lint-js:
	npm run lint

## docker: Build the Docker image
docker:
	docker build -t vibeindex .

## clean: Remove build artefacts
clean:
	rm -f server
