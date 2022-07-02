#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>

const char* ssid = "MakerSpace_2.4G";
const char* password = "ntueesaad";

//Your Domain name with URL path or IP address with path
const char* serverName = "http://140.112.174.222:1484/wind/update";

unsigned long lastTime = 0;
unsigned long timerDelay = 5000;
int id = 1;

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
 
  Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");
}

void loop() {
  if (Serial.available()) {
    id = Serial.parseInt();
    if (id > 8)
      id = 8;
    if (id < 1)
      id = 1;
  }
  //Send an HTTP POST request every 10 minutes
  if ((millis() - lastTime) > timerDelay) {
    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
      WiFiClient client;
      HTTPClient http;
      
      // Your Domain name with URL path or IP address with path
      http.begin(client, serverName);
    
      //StaticJsonDocument<200> json;
      DynamicJsonDocument json(1024);
      //DynamicJsonDocument json(1024);
      json["ID"] = id;
      json["RFID"] = "23456789";
      String str;
      serializeJson(json, str);
      Serial.println(str);
      // Specify content-type header
      http.addHeader("Content-Type", "application/json");
      int httpResponseCode = http.POST(str);
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
        
      // Free resources
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}
