package inputs

import "encoding/json"

type Input struct {
	Name    string
	Sensors []Sensor
}

func (input Input) Update(data []byte) error {
	for _, sensor := range input.Sensors {
		err := sensor.Update(data)
		if err != nil {
			return err
		}
	}
	return nil
}

func (input Input) MarshalJSON() ([]byte, error) {
	imap := make(map[string]interface{})
	imap["id"] = input.Name
	for _, sensor := range input.Sensors {
		switch s := sensor.(type) {
		case *Analog16:
			imap[s.Name] = s.Value
		case *Button:
			imap[s.Name] = s.Pressed
		}
	}

	return json.Marshal(imap)
}
