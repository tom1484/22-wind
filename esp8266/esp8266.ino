#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>

extern "C" {
#include "user_interface.h"
#include "wpa2_enterprise.h"
}

const char* serverName = "http://140.112.174.222:1484/wind/update";
unsigned long lastTime = 0;
unsigned long timerDelay = 5000;
int id = 1;

// WiFi
static const char* ssid = "ntu_peap";
static const char* username = "b08901181";
static const char* password = "QWer1234";

void setupWiFi() {
  // WPA2 Connection starts here
  // Setting ESP into STATION mode only (no AP mode or dual mode)

    wifi_set_opmode(STATION_MODE);

    struct station_config wifi_config;
    memset(&wifi_config, 0, sizeof(wifi_config));
    strcpy((char*)wifi_config.ssid, ssid);
   
    wifi_station_set_config(&wifi_config);
   
    wifi_station_clear_cert_key();
    wifi_station_clear_enterprise_ca_cert();
    wifi_station_set_wpa2_enterprise_auth(1);
    wifi_station_set_enterprise_identity((uint8*)username, strlen(username));
    wifi_station_set_enterprise_username((uint8*)username, strlen(username));
    wifi_station_set_enterprise_password((uint8*)password, strlen(password));
    wifi_station_connect();
  // WPA2 Connection ends here
  delay(500);
  // Wait for connection AND IP address from DHCP
  Serial.println();
  Serial.println("Waiting for connection and IP Address from DHCP");
  while (WiFi.status() != WL_CONNECTED) {
    delay(2000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  setupWiFi();
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
      if (httpResponseCode < 0) {
        Serial.println("Error in response code");
        setupWiFi();
      }
    }
    else {
      Serial.println("WiFi Disconnected");
      setupWiFi();
    }
    lastTime = millis();
  }
}
