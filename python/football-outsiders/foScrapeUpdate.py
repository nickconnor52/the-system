import os
import pandas as pd
import json
from pymongo import MongoClient
from bson.objectid import ObjectId
import sys

# TODO - add week dynamically for automation -- Pass in as parameter populated by the shell script
week = sys.argv[1]
if not week:
    sys.exit()

season = '2018'

db_auth = os.environ['DB_AUTH']

# LOS Data
tablesDrive = pd.read_html("https://www.footballoutsiders.com/stats/drivestats2018", header=0)
driveJson = json.loads(tablesDrive[1].to_json())

# OFF pts/RZ
tablesOff = pd.read_html("https://www.footballoutsiders.com/stats/drivestatsoff2018", header=0)
offJson = json.loads(tablesOff[1].to_json())

# DEF pts/RZ
tablesDef = pd.read_html("https://www.footballoutsiders.com/stats/drivestatsdef2018", header=0)
defJson = json.loads(tablesDef[1].to_json())

# Connect to DB

client = MongoClient('mongodb://' + db_auth + '@ds137611.mlab.com:37611/systemdb')
db = client['systemdb']
stats_collection = db['stats']
teams_collection = db['teams']

# Cleaned Up JSON

defTeams = defJson['Team']
driveTeams = driveJson['Team']
offTeams = offJson['Team']

finalJson = {}

# ADD Week Info --- Keeping if we switch week back to a model system
# thisWeek = weeks_collection.find_one({'number': week, 'season': season})

# DRIVE pts/rz
for num, team in driveTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']] = {
            'team': thisTeam['_id'],
            'week': week,
            'season': season,
            'offLOSDrive': driveJson['OFF.LOS/Dr'][num].split(' ')[0],
            'defLOSDrive': driveJson['DEF.LOS/Dr'][num].split(' ')[0],
        }

# OFF pts/rz
for num, team in offTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']]['offPtsRz'] = offJson['Pts/RZ'][num].split(' ')[0]

# DEF pts/rz
for num, team in defTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']]['defPtsRz'] = defJson['Pts/RZ'][num].split(' ')[0]
        teamId = ObjectId((finalJson[thisTeam['name']]['team']))
        stats_collection.find_one_and_replace({'team': teamId, 'week': week}, finalJson[thisTeam['name']], upsert=True)

# Close DB
client.close()



