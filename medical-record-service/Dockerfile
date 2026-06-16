FROM golang:1.23-alpine AS builder

WORKDIR /app

COPY go.mod .
COPY . .

ENV GONOSUMCHECK=*
ENV GOFLAGS=-mod=mod
RUN go get github.com/gin-gonic/gin@v1.10.0
RUN go get github.com/lib/pq@v1.10.9
RUN go mod tidy
RUN go build -o main .

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .

EXPOSE 3004

CMD ["./main"]