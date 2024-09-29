package server

import (
	"lolwutov/deckwebview/internal/controllers"
	"sync"
)

type Broker struct {
	lock        *sync.Mutex
	notempty    *sync.Cond
	subscribers map[*Subscriber]struct{}
}

type Subscriber struct {
	messages chan []byte
	closed   chan struct{}
}

func (b *Broker) Publish(message []byte) {
	b.lock.Lock()
	defer b.lock.Unlock()
	for s := range b.subscribers {
		select {
		case s.messages <- message:
		case <-s.closed:
			close(s.messages)
			delete(b.subscribers, s)
		default:
		}
	}
}

func (b *Broker) Subscribe(subscriber *Subscriber) {
	b.lock.Lock()
	defer b.lock.Unlock()
	b.subscribers[subscriber] = struct{}{}
	b.notempty.Signal()
}

func (b *Broker) Wait(controller controllers.Controller) {
	b.lock.Lock()
	defer b.lock.Unlock()

	if len(b.subscribers) == 0 {
		controller.Close()
	}

	for len(b.subscribers) == 0 {
		b.notempty.Wait()
	}

	if controller.Closed() {
		controller.Open()
	}

}

func NewBroker() *Broker {
	mu := &sync.Mutex{}
	cv := sync.NewCond(mu)
	return &Broker{
		subscribers: make(map[*Subscriber]struct{}),
		lock:        mu,
		notempty:    cv,
	}
}
