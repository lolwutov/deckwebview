package main

import (
	"log"
	"lolwutov/deckwebview/internal/controllers/deck"
)

func main() {
	deck, err := deck.New()
	if err != nil {
		log.Fatal(err)
	}
	deck.Open()
	deck.ReadRaw()

}
