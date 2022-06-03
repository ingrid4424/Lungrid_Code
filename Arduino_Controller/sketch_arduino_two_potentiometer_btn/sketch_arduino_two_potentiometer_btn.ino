// Arduino pin numbers
const int SW_pin = 4; // digital pin connected to switch output
const int X_pin = 0; // analog pin connected to X output
const int Y_pin = 1; // analog pin connected to Y output

const int LEDB_PIN_VIN =  5;
const int LEDR_PIN_VIN =  6;
const int LEDY_PIN_VIN =  9;

char turnOn;
const int buttonPass = 8;// the number of the pushbutton pin - left btn
const int buttonStart = 12; // derecha al borde - rigth btn

const byte DATA_MAX_SIZE = 32;
char data[DATA_MAX_SIZE];

void setup() {
  pinMode(SW_pin, INPUT);
  pinMode(buttonPass, INPUT_PULLUP);
  pinMode(buttonStart, INPUT_PULLUP);
  digitalWrite(SW_pin, HIGH);

  pinMode(LEDB_PIN_VIN, OUTPUT);
  pinMode(LEDR_PIN_VIN, OUTPUT);
  pinMode(LEDY_PIN_VIN, OUTPUT);


  Serial.begin(250000);
}

void loop() {
  int buttonState = digitalRead(buttonPass);
  int buttonStateStart = digitalRead(buttonStart);

  digitalWrite(LEDB_PIN_VIN , LOW);
  digitalWrite(LEDR_PIN_VIN , LOW);
  digitalWrite(LEDY_PIN_VIN , LOW);
  Serial.print(digitalRead(SW_pin) * 500); //switch output
  Serial.print(" ");
  Serial.print(analogRead(X_pin));
  Serial.print(" ");
  Serial.print(analogRead(Y_pin));
  Serial.print(" ");
  if (buttonState == HIGH) {
    // turn LED on:
    Serial.print(0);
  } else {
    // turn LED off:
    Serial.print(1);
  }
  Serial.print(" ");
  if (buttonStateStart == HIGH) {
    Serial.println(0);
  } else {
    Serial.println(1);
  }
  delay(200);
  
  if(turnOn == "1") {
      digitalWrite(LEDB_PIN_VIN , HIGH);
      digitalWrite(LEDR_PIN_VIN , HIGH);
      digitalWrite(LEDY_PIN_VIN , HIGH);
  }
  receiveData();
}


void receiveData() {
  static char endMarker = '\n'; // message separator
  char receivedChar;     // read char from serial port
  int ndx = 0;          // current index of data buffer
  // clean data buffer
  memset(data, 32, sizeof(data));
  // read while we have data available and we are
  // still receiving the same message.
  while (Serial.available() > 0) {
    receivedChar = Serial.read();
    if (receivedChar == endMarker) {
      
      data[ndx] = '\0'; // end current message
      return;
    }
    // looks like a valid message char, so append it and
    // increment our index
    data[ndx] = receivedChar;
    ndx++;
    // if the message is larger than our max size then
    // stop receiving and clear the data buffer. this will
    // most likely cause the next part of the message
    // to be truncated as well, but hopefully when you
    // parse the message, you'll be able to tell that it's
    // not a valid message.
    if (ndx >= DATA_MAX_SIZE) {
      break;
    }
    if(receivedChar == "1"){
      turnOn = receivedChar;
      Serial.print(turnOn);
    }
  }
  // no more available bytes to read from serial and we
  // did not receive the separato. it's an incomplete message!
  
  
  memset(data, 32, sizeof(data));
  
}