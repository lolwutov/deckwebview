package server

import (
	"log"
	"lolwutov/deckwebview/internal/controllers"
	"net/http"
	"time"

	"golang.org/x/time/rate"
	"nhooyr.io/websocket"
)

type Server struct {
	broker *Broker
}

func (server *Server) wsHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	subscriber := &Subscriber{make(chan []byte), make(chan struct{})}

	c, err := websocket.Accept(w, r, nil)
	if err != nil {
		return
	}

	defer c.CloseNow()
	c.CloseRead(r.Context())

	server.broker.Subscribe(subscriber)

	for message := range subscriber.messages {
		err := c.Write(ctx, websocket.MessageText, message)
		if err != nil {
			subscriber.closed <- struct{}{}
		}
	}
}

func (server *Server) readDevice(controller controllers.Controller, t int) {
	controller.Open()
	defer controller.Close()

	limiter := rate.Sometimes{Interval: time.Duration(t) * time.Millisecond}

	for {
		server.broker.Wait(controller)
		message, err := controller.Read()
		if err != nil {
			log.Fatal(err)
		}
		if t != 0 {
			limiter.Do(func() {
				server.broker.Publish(message)
			})
		} else {
			server.broker.Publish(message)
		}
	}
}

func Start(host string, dir string, t int, controller controllers.Controller) {
	server := Server{broker: NewBroker()}
	go server.readDevice(controller, t)
	http.Handle("/", http.FileServer(http.Dir(dir)))
	http.HandleFunc("/ws", server.wsHandler)
	log.Fatal(http.ListenAndServe(host, nil))
}
