package server

import (
	"math/rand"
	"testing"
)

func TestSimulate(t *testing.T) {
	tests := 100
	b := NewBroker()
	report := make(chan struct{})
	completed := 0

	for i := 0; i < tests; i++ {
		go sub(b, report)
	}

	for completed < tests {
		b.Publish([]byte{byte(rand.Intn(255)), byte(rand.Intn(255))})
		select {
		case <-report:
			completed++
		default:
		}
	}

	if len(b.subscribers) != 0 {
		t.Fatalf("%d subscribers remained", len(b.subscribers))
	}
}

func sub(b *Broker, report chan struct{}) {
	data := make(chan []byte)
	closed := make(chan struct{})
	s := &Subscriber{data, closed}
	b.Subscribe(s)

	defer func() {
		report <- struct{}{}
	}()

	j := 0
	for range data {
		if j > rand.Intn(50)+1 {
			closed <- struct{}{}
		}
		j++
	}
}
