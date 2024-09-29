package main

import (
	"flag"
	"fmt"
	"log"
	"lolwutov/deckwebview/internal/controllers/deck"
	"lolwutov/deckwebview/internal/server"
)

var version string

func main() {
	fmt.Printf("deckwebview version %s\n", version)

	host := flag.String("h", "localhost:49753", "host listen address")
	dir := flag.String("d", "./static", "web app to serve")
	t := flag.Int("t", 8, "rate limiter in ms")
	v := flag.Bool("v", false, "version info")
	flag.Parse()

	if *t < 0 {
		log.Fatal("rate can't be negative")
	}

	if *v {
		return
	}

	deck, err := deck.New()
	if err != nil {
		log.Fatal(err)
	}
	server.Start(*host, *dir, *t, deck)
}
