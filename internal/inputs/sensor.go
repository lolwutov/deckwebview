package inputs

import (
	"encoding/binary"
	"errors"
	"fmt"
)

var ErrInvalidOffset = errors.New("offset exceeds data length")

type Sensor interface {
	Update([]byte) error
}

type Button struct {
	Name    string
	Offset  uint
	Command byte
	Pressed bool
}

type Analog16 struct {
	Name   string
	Offset uint
	Value  int16
}

func (sensor *Analog16) Update(data []byte) (err error) {
	if len(data) < int(sensor.Offset+2) {
		sensor.Value = 0
		return fmt.Errorf("%w: %d > %d", ErrInvalidOffset, sensor.Offset+2, len(data))
	}

	slice := data[sensor.Offset : sensor.Offset+2]
	sensor.Value = int16(binary.LittleEndian.Uint16(slice))
	return nil
}

func (sensor *Button) Update(data []byte) error {
	if len(data) <= int(sensor.Offset) {
		return fmt.Errorf("%w: %d > %d", ErrInvalidOffset, sensor.Offset, len(data))
	}
	val := data[sensor.Offset]
	sensor.Pressed = val&sensor.Command > 0
	return nil
}
