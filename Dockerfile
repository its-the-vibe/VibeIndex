# Build stage
FROM golang:1.25.7-alpine AS builder

WORKDIR /build

# Copy go mod files
COPY go.mod ./

# Download dependencies (if any)
RUN go mod download

# Copy source code
COPY main.go ./
COPY static ./static

# Create config.json from example if it doesn't exist
RUN if [ ! -f static/config.json ]; then cp static/config.json.example static/config.json; fi

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o server .

# Runtime stage
FROM scratch

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /build/server /app/server

# Expose port
EXPOSE 8080

# Run the server
CMD ["/app/server"]
