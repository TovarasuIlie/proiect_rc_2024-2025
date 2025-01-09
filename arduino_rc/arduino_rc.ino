#include <SimpleDHT.h>
#include <Arduino.h>
#include <Hash.h>
#include <WebSocketsClient.h>
#include "SoftwareSerial.h"
#include <ArduinoJson.h>
#include <ESP8266WebServer.h>
#include <Servo.h>

const char* wlan_ssid = "Imou-B5837B";
const char* wlan_password = "be3fJ336";
const char* ws_host = "192.168.10.2";
const int ws_port = 8080;

String roomName = "q";
String deviceId = "esp32";

String softwareSerialData = "";
char character;
bool connected = false;
bool windowOpen = false;
bool testingFan = false;
byte temperature = 0;
byte humidity = 0;
byte lower_limit = 0;
byte upper_limit = 0;
byte desire_temperature = 23;
byte threshold = 1;
Servo servo;
int angle = 0;

// base URL for SockJS (websocket) connection
// The complete URL will look something like this(cf. http://sockjs.github.io/sockjs-protocol/sockjs-protocol-0.3.3.html#section-36):
// ws://<ws_host>:<ws_port>/<ws_baseurl>/<3digits>/<randomstring>/websocket
// For the default config of Spring's SockJS/STOMP support, the default base URL is "/socketentry/".
const char* ws_baseurl = "/ws/";  // don't forget leading and trailing "/" !!!

SimpleDHT11 dht11;
const int dht_pin = D7;
const int fan_pin = D1;
const int connected_pin = D5;
const int servoPin = D0;
WebSocketsClient webSocket;
ESP8266WebServer server(80);
unsigned long startMillis;  //some global variables available anywhere in the program
unsigned long currentMillis;


void setup() {
  Serial.begin(115200);
  connectToWifi();
  connectToWebSocket();
  setupServer();
  pinMode(fan_pin, OUTPUT);
  pinMode(connected_pin, OUTPUT);
  servo.attach(servoPin);
  startMillis = millis();
}

void loop() {
  server.handleClient();
  webSocket.loop();
  if (connected) {
    serialGetData();
    digitalWrite(connected_pin, LOW);
  } else {
    digitalWrite(connected_pin, HIGH);
  }
}


void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {

  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("[WSc] Disconnected!\n");
      connected = false;
      break;
    case WStype_CONNECTED:
      {
        Serial.printf("[WSc] Connected to url: %s\n", payload);
      }
      break;
    case WStype_TEXT:
      {

        String text = (char*)payload;
        if (payload[0] == 'h') {

          Serial.println("Heartbeat!");

        } else if (payload[0] == 'o') {

          // on open connection
          char* msg = "[\"CONNECT\\naccept-version:1.1,1.0\\nheart-beat:10000,10000\\n\\n\\u0000\"]";
          webSocket.sendTXT(msg);
          delay(1000);


        } else if (text.startsWith("a[\"CONNECTED")) {

          // subscribe to some channels
          subscribeToChannel(roomName);
          delay(1000);
          connected = true;
          // sendMessage(roomName, deviceId, deviceId + " connected", "SYSTEM");
          // sendMessage(roomName, deviceId, "Hi there, this is esp32!", "USER");

        } else if (text.startsWith("a[\"MESSAGE")) {
          // processJsonData(text);
        }
        break;
      }
    case WStype_BIN:
      Serial.printf("[WSc] get binary length: %u\n", length);
      hexdump(payload, length);
      break;
  }
}

void setupServer() {
  digitalWrite(fan_pin, HIGH);
  lower_limit = desire_temperature - threshold;
  upper_limit = desire_temperature + threshold;
  server.on("/set-temperature", setTemperature);
  server.on("/testing-fan", testFan);
  //start the server
  server.begin();

  //print in serial manager that the HTTP server is started
  Serial.println("HTTP server started");
}

void setTemperature() {
  desire_temperature = server.arg("temperature").toInt();
  threshold = server.arg("threshold").toInt();
  lower_limit = desire_temperature - threshold;
  upper_limit = desire_temperature + threshold;
  server.send(200);
}

void testFan() {
  if (server.arg("fanStatus") == String("true")) {
    testingFan = true;
  } else {
    testingFan = false;
  }
  server.send(200);
}

String str;
void serialGetData() {
  currentMillis = millis(); 
  if (currentMillis - startMillis >= 200) {
    dht11.read(dht_pin, &temperature, &humidity, NULL);
    verifyStatusWindow();
    if (!testingFan) {
      if (windowOpen) {
        openWindow();
        fanControl();
      } else {
        closeWindow();
      }
    } else {
      digitalWrite(fan_pin, LOW);
    }
    String msg = "{\\\"temperature\\\":\\\"" + String(temperature) + "\\\",\\\"humidity\\\":\\\"" + String(humidity) + "\\\"}";
    sendMessage(roomName, deviceId, msg, "INPUT");
    startMillis = currentMillis;
  }
}

void fanControl() {
  if (temperature > upper_limit) {
    digitalWrite(fan_pin, LOW);
  }
  if (temperature < lower_limit) {
    digitalWrite(fan_pin, HIGH);
  }
}

void verifyStatusWindow() {
  if (temperature > desire_temperature) {
    windowOpen = true;
  }
  if (temperature < lower_limit) {
    windowOpen = false;
  }
}

void openWindow() {
  if (angle != 180) {
    for (angle = 0; angle < 180; angle+=2) {
      servo.write(angle);
      delay(15);
    }
  }
}

void closeWindow() {
  digitalWrite(fan_pin, HIGH);
  if (angle != 0) {
    for (angle = 180; angle > 0; angle-=2) {
      servo.write(angle);
      delay(15);
    }
  }
}

void testingFanSettings() {
  if (testingFan) {
    digitalWrite(fan_pin, LOW);
  } else {
    digitalWrite(fan_pin, HIGH);
  }
}

void subscribeToChannel(String _channelName) {
  String msg = "[\"SUBSCRIBE\\nid:sub-0\\ndestination:/topic/messages/" + _channelName + "\\n\\n\\u0000\"]";
  webSocket.sendTXT(msg);
}

void sendMessage(String _channelName, String _deviceId, String _messageText, String _messageType) {
  String messageData = "[\"SEND\\ndestination:/app/ws/" + _channelName + "\\n\\n{\\\"deviceId\\\":\\\"" + _deviceId + "\\\",\\\"message\\\":" + _messageText + ",\\\"messageType\\\":\\\"" + _messageType + "\\\"}\\u0000\"]";
  webSocket.sendTXT(messageData);
}

void processJsonData(String _received) {
  String json = extractString(_received);
  json.replace("\\", "");
  Serial.println(json);
  Serial.print("Payload");
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, json);
  JsonObject obj = doc.as<JsonObject>();
  String receivedMessage = obj["message"];
  String deviceId = obj["deviceId"];
  Serial.println(receivedMessage);
}

String extractString(String _received) {
  char startingChar = '{';
  char finishingChar = '}';

  String tmpData = "";
  bool _flag = false;
  for (int i = 0; i < _received.length(); i++) {
    char tmpChar = _received[i];
    if (tmpChar == startingChar) {
      tmpData += startingChar;
      _flag = true;
    } else if (tmpChar == finishingChar) {
      tmpData += finishingChar;
      break;
    } else if (_flag == true) {
      tmpData += tmpChar;
    }
  }

  return tmpData;
}

void connectToWifi() {
  delay(500);
  Serial.print("Logging into WLAN: ");
  Serial.print(wlan_ssid);
  Serial.print(" ...");
  WiFi.mode(WIFI_STA);
  WiFi.begin(wlan_ssid, wlan_password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" success.");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

void connectToWebSocket() {
  String socketUrl = ws_baseurl;
  socketUrl += random(0, 999);
  socketUrl += "/";
  socketUrl += random(0, 999999);  // should be a random string, but this works (see )
  socketUrl += "/websocket";
  Serial.println(ws_host + String(ws_port) + socketUrl);

  // connect to websocket
  webSocket.begin(ws_host, ws_port, socketUrl);
  webSocket.setExtraHeaders();
  //    webSocket.setExtraHeaders("foo: I am so funny\r\nbar: not"); // some headers, in case you feel funny
  webSocket.onEvent(webSocketEvent);
}