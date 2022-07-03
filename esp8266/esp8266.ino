#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>

extern "C" {
#include "user_interface.h"
#include "wpa2_enterprise.h"
}

const char* serverName = "http://140.112.174.222:9487/wind/update";
unsigned long lastTime = 0;
unsigned long timerDelay = 5000;
unsigned long lastReportTime = 0;
unsigned long reportAliveDelay = 5000;

int id = 1;
int machineID = 1;

// WiFi
static const char* ssid = "ntu_peap";
static const char* username = "";
static const char* password = "";

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

void reportAlive() {
  WiFiClient client;
  HTTPClient http;
  http.begin(client, serverName);
  DynamicJsonDocument json(1024);
  json["command"] = "alive";
  json["ID"] = id;
  json["machineID"] = machineID;
  String str;
  serializeJson(json, str);
  Serial.println(str);
  // Specify content-type header
  http.addHeader("Content-Type", "application/json");
  int httpResponseCode = http.POST(str);
  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);
    
  http.end();
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
  if (WiFi.status()== WL_CONNECTED) {
    if (millis() - lastReportTime >= reportAliveDelay) {
      reportAlive();
      lastReportTime = millis();
    }
    if (millis() - lastTime >= timerDelay) {
      WiFiClient client;
      HTTPClient http;
      http.begin(client, serverName);
      DynamicJsonDocument json(1024);
      json["command"] = "update";
      json["ID"] = id;
      json["machineID"] = machineID;
      //json["RFID"] = "23456789";
      json["RFID"] = "2349";
      String str;
      serializeJson(json, str);
      Serial.println(str);
      http.addHeader("Content-Type", "application/json");
      int httpResponseCode = http.POST(str);
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      http.end();
      if (httpResponseCode < 0) {
        Serial.println("Error in response code");
        setupWiFi();
      }
      lastTime = millis();
    }
  }
  else {
    Serial.println("WiFi Disconnected");
    setupWiFi();
  }
}
