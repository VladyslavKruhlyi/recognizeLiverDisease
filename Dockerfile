FROM golang:alpine
WORKDIR /app/

COPY ./backend/go.mod .
COPY ./backend/go.mod .
RUN go mod download

COPY ./build .
COPY ./backend/ .

ENV NODE_ENV=production

RUN go build -o main .

EXPOSE 1323

CMD ["./main"]