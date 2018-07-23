import pandas as pd
import json
from pymongo import MongoClient


import pandas as pd

# TODO - add week dynamically for automation
week = '0'
season = '0'

# Give/Take Data
tablesGive = pd.read_html("http://www.espn.com/nfl/statistics/team/_/stat/givetake", header=1)
giveData = json.loads(tablesGive[0].to_json())

# OFF LOS Data
tablesOffLOS = pd.read_html("https://www.teamrankings.com/nfl/stat/red-zone-scoring-attempts-per-game", header=0)
offLOSData = json.loads(tablesOffLOS[0].to_json())

# DEF LOS Data
tablesDefLOS = pd.read_html("https://www.teamrankings.com/nfl/stat/opponent-red-zone-scoring-attempts-per-game", header=0)
defLOSData = json.loads(tablesDefLOS[0].to_json())

# Connect to DB

client = MongoClient('mongodb://nickconnor52:Cardinals77@ds137611.mlab.com:37611/systemdb')
db = client['systemdb']
stats_collection = db['stats']
weeks_collection = db['weeks']
teams_collection = db['teams']

# Cleaned Up JSON

defTeams = defLOSData['Team']
offTeams = offLOSData['Team']

finalJson = {}

# ADD Week Info
thisWeek = weeks_collection.find_one({'number': week, 'season': season})

# GIVE/TAKE
for num, team in offTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']] = {
            'off_RZA_game': str(giveData['DIFF'][num])
        }
    elif(teams_collection.find_one({'location': team})):
        thisTeam = teams_collection.find_one({'location': team})
        finalJson[thisTeam['name']] = {
            'def_RZA_game': str(giveData['DIFF'][num])
        }

# DEF Yds/Game
for num, team in defTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']]['def_yds_game'] = str(defYdsData['YDS/G'][num])
        stats_collection.find_one_and_update({'team': thisTeam['_id']}, {'$set': finalJson[thisTeam['name']]})

    elif(teams_collection.find_one({'location': team})):
        thisTeam = teams_collection.find_one({'location': team})
        finalJson[thisTeam['name']]['def_yds_game'] = str(defYdsData['YDS/G'][num])
        stats_collection.find_one_and_update({'team': thisTeam['_id']}, {'$set': finalJson[thisTeam['name']]})

# Close DB
client.close()
