import requests
import json
from datetime import datetime
from time import time

BASE_URL = 'http://localhost:1484'
API_AUTH = '/wind/update'

session = requests.Session()

_data = {
    "ID": 7, 
    "RFID": "23456789"
}

req = session.post(
        BASE_URL + API_AUTH, json=_data,
        allow_redirects=True
)

print(req.json())

