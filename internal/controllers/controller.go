package controllers

type Controller interface {
	Open()
	Close()
	Read() ([]byte, error)
	Closed() bool
}
