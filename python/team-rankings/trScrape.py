import pandas as pd
import json
from pymongo import MongoClient

# TODO - add week dynamically for automation
week = '0'
season = '0'

# Give/Take Data
tablesGive = pd.read_html("http://www.espn.com/nfl/statistics/team/_/stat/givetake", header=1)
giveData = json.loads(tablesGive[0].to_json())

# OFF RZA Data
tablesOffRZA = pd.read_html("https://www.teamrankings.com/nfl/stat/red-zone-scoring-attempts-per-game", header=0)
offRZAData = json.loads(tablesOffRZA[0].to_json())

# DEF RZA Data
tablesDefRZA = pd.read_html("https://www.teamrankings.com/nfl/stat/opponent-red-zone-scoring-attempts-per-game", header=0)
defRZAData = json.loads(tablesDefRZA[0].to_json())

# Connect to DB

client = MongoClient('mongodb://nickconnor52:Cardinals77@ds137611.mlab.com:37611/systemdb')
db = client['systemdb']
stats_collection = db['stats']
weeks_collection = db['weeks']
teams_collection = db['teams']

# Cleaned Up JSON

defTeams = defRZAData['Team']
offTeams = offRZAData['Team']

finalJson = {}

# ADD Week Info
thisWeek = weeks_collection.find_one({'number': week, 'season': season})

# GIVE/TAKE
for num, team in offTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']] = {
            'offRZAGame': str(offRZAData['2017'][num])
        }
    elif(teams_collection.find_one({'location': team})):
        thisTeam = teams_collection.find_one({'location': team})
        finalJson[thisTeam['name']] = {
            'offRZAGame': str(offRZAData['2017'][num])
        }

# DEF Yds/Game
for num, team in defTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']]['defRZAGame'] = str(defRZAData['2017'][num])
        stats_collection.find_one_and_update({'team': thisTeam['_id']}, {'$set': finalJson[thisTeam['name']]})

    elif(teams_collection.find_one({'location': team})):
        thisTeam = teams_collection.find_one({'location': team})
        finalJson[thisTeam['name']]['defRZAGame'] = str(defRZAData['2017'][num])
        stats_collection.find_one_and_update({'team': thisTeam['_id']}, {'$set': finalJson[thisTeam['name']]})

# Close DB
client.close()
