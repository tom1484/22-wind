import requests
import json
from datetime import datetime
from time import time

BASE_URL = 'http://localhost:9487'
API_AUTH = '/wind/update'

session = requests.Session()

_data = {
    "ID": int(input("ID: ")), 
    "RFID": str(input("RFID: "))
}

req = session.post(
    BASE_URL + API_AUTH, json=_data,
    allow_redirects=True
)

print(req.json())

