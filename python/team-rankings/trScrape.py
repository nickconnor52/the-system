import os
import pandas as pd
import json
from pymongo import MongoClient
import sys

# TODO - add week dynamically for automation -- Pass in as parameter populated by the shell script
week = sys.argv[1]

if not week:
    sys.exit()

season = '2018'

db_auth = os.environ['DB_AUTH']

# OFF RZA Data
tablesOffRZA = pd.read_html("https://www.teamrankings.com/nfl/stat/red-zone-scoring-attempts-per-game", header=0)
offRZAData = json.loads(tablesOffRZA[0].to_json())

# DEF RZA Data
tablesDefRZA = pd.read_html("https://www.teamrankings.com/nfl/stat/opponent-red-zone-scoring-attempts-per-game", header=0)
defRZAData = json.loads(tablesDefRZA[0].to_json())

# Connect to DB

client = MongoClient('mongodb://' + db_auth + '@ds137611.mlab.com:37611/systemdb')
db = client['systemdb']
stats_collection = db['stats']
weeks_collection = db['weeks']
teams_collection = db['teams']

# Cleaned Up JSON

defTeams = defRZAData['Team']
offTeams = offRZAData['Team']

finalJson = {}

# GIVE/TAKE
for num, team in offTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']] = {
            'offRZAGame': str(offRZAData['2018'][num])
        }
    elif(teams_collection.find_one({'location': team})):
        thisTeam = teams_collection.find_one({'location': team})
        finalJson[thisTeam['name']] = {
            'offRZAGame': str(offRZAData['2018'][num])
        }

# DEF Yds/Game
for num, team in defTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']]['defRZAGame'] = str(defRZAData['2018'][num])
        stats_collection.find_one_and_update({'team': thisTeam['_id'], 'week': week}, {'$set': finalJson[thisTeam['name']]})

    elif(teams_collection.find_one({'location': team})):
        thisTeam = teams_collection.find_one({'location': team})
        finalJson[thisTeam['name']]['defRZAGame'] = str(defRZAData['2018'][num])
        stats_collection.find_one_and_update({'team': thisTeam['_id'], 'week': week}, {'$set': finalJson[thisTeam['name']]})

# Close DB
client.close()
