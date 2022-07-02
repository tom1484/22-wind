import requests
import json
from datetime import datetime
from time import time

#BASE_URL = 'http://localhost:12345'
BASE_URL = 'http://140.112.174.222:' + str(input())
API_AUTH = '/wind/fetch'

session = requests.Session()

print(BASE_URL+API_AUTH)

req = session.post(
    BASE_URL + API_AUTH, json={},
    allow_redirects=True
)

print(req)

