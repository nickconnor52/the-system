# Install the Python Requests library:
# `pip install requests`

import os
import base64
import requests
import json
from pymongo import MongoClient
import sys

db_auth = os.environ['DB_AUTH']

client = MongoClient('mongodb://' + db_auth + '@ds137611.mlab.com:37611/systemdb')
db = client['systemdb']
schedule_collection = db['schedule']

def send_request():
    # Request
    try:
        response = requests.get(
            url="https://api.mysportsfeeds.com/v1.2/pull/nfl/2018-regular/full_game_schedule.json",
            headers={
                "Authorization": "Basic " + base64.b64encode('{}:{}'.format("37e80cba-499c-4b45-a869-94db0d","harvey6253").encode('utf-8')).decode('ascii')
            }
        )
        # print('Response HTTP Status Code: {status_code}'.format(
        #     status_code=response.status_code))
        # print('Response HTTP Response Body: {content}'.format(
        #     content=response.content))
        process_request(response.content)
    except requests.exceptions.RequestException:
        print('HTTP Request failed')

def process_request(content):
    content_json = json.loads(content)
    schedule = content_json['fullgameschedule']['gameentry']
    for matchup in schedule:
        matchup['season'] = '2018'
        schedule_collection.find_one_and_replace({'id': matchup['id']}, matchup, upsert=True)

send_request()