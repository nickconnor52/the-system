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

# Give/Take Data
tablesGive = pd.read_html("http://www.espn.com/nfl/statistics/team/_/stat/givetake", header=1)
giveData = json.loads(tablesGive[0].to_json())

# OFF 3rd Down % Data
tablesOff3 = pd.read_html("http://www.espn.com/nfl/statistics/team/_/stat/downs", header=1)
off3Data = json.loads(tablesOff3[0].to_json())

# DEF 3rd Down % Data
tablesDef3 = pd.read_html("http://www.espn.com/nfl/statistics/team/_/stat/downs/position/defense", header=1)
def3Data = json.loads(tablesDef3[0].to_json())

# OFF Yds/game
tablesOffYds = pd.read_html("http://www.espn.com/nfl/statistics/team/_/stat/total", header=0)
offYdsData = json.loads(tablesOffYds[0].to_json())

# DEF Yds/game
tablesDefYds = pd.read_html("http://www.espn.com/nfl/statistics/team/_/stat/total/position/defense", header=0)
defYdsData = json.loads(tablesDefYds[0].to_json())

# Connect to DB

client = MongoClient('mongodb://' + db_auth + '@ds137611.mlab.com:37611/systemdb')
db = client['systemdb']
stats_collection = db['stats']
teams_collection = db['teams']

# Cleaned Up JSON

def3Teams = def3Data['TEAM']
off3Teams = off3Data['TEAM']
giveTeams = giveData['TEAM']
offYdsTeams = offYdsData['TEAM']
defYdsTeams = defYdsData['TEAM']

finalJson = {}

# GIVE/TAKE
for num, team in giveTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']] = {
            'giveTakeDiff': str(giveData['DIFF'][num])
        }
    elif(teams_collection.find_one({'location': team})):
        thisTeam = teams_collection.find_one({'location': team})
        finalJson[thisTeam['name']] = {
            'giveTakeDiff': str(giveData['DIFF'][num])
        }

# OFF 3rd Down PCT
for num, team in off3Teams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']]['off3rdPct'] = str(off3Data['PCT'][num])

    elif(teams_collection.find_one({'location': team})):
        thisTeam = teams_collection.find_one({'location': team})
        finalJson[thisTeam['name']]['off3rdPct'] = str(off3Data['PCT'][num])

# DEF 3rd Down PCT
for num, team in def3Teams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']]['def3rdPct'] = str(def3Data['PCT'][num])

    elif(teams_collection.find_one({'location': team})):
        thisTeam = teams_collection.find_one({'location': team})
        finalJson[thisTeam['name']]['def3rdPct'] = str(def3Data['PCT'][num])

# OFF Pass Yds/Game
for num, team in offYdsTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']]['offPassYdsGame'] = str(offYdsData['P YDS/G'][num])

    elif(teams_collection.find_one({'location': team})):
        thisTeam = teams_collection.find_one({'location': team})
        finalJson[thisTeam['name']]['offPassYdsGame'] = str(offYdsData['P YDS/G'][num])

# OFF Rushing Yds/Game
for num, team in offYdsTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']]['offRushYdsGame'] = str(offYdsData['R YDS/G'][num])

    elif(teams_collection.find_one({'location': team})):
        thisTeam = teams_collection.find_one({'location': team})
        finalJson[thisTeam['name']]['offRushYdsGame'] = str(offYdsData['R YDS/G'][num])

# OFF Pts/Game
for num, team in offYdsTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']]['offPtsGame'] = str(offYdsData['PTS/G'][num])

    elif(teams_collection.find_one({'location': team})):
        thisTeam = teams_collection.find_one({'location': team})
        finalJson[thisTeam['name']]['offPtsGame'] = str(offYdsData['PTS/G'][num])

# DEF Pts/Game
for num, team in defYdsTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']]['defPtsGame'] = str(defYdsData['PTS/G'][num])

    elif(teams_collection.find_one({'location': team})):
        thisTeam = teams_collection.find_one({'location': team})
        finalJson[thisTeam['name']]['defPtsGame'] = str(defYdsData['PTS/G'][num])

# DEF Passing Yds/Game
for num, team in defYdsTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']]['defPassYdsGame'] = str(defYdsData['P YDS/G'][num])

    elif(teams_collection.find_one({'location': team})):
        thisTeam = teams_collection.find_one({'location': team})
        finalJson[thisTeam['name']]['defPassYdsGame'] = str(defYdsData['P YDS/G'][num])

# DEF Rushing Yds/Game
for num, team in defYdsTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']]['defRushYdsGame'] = str(defYdsData['R YDS/G'][num])
        stats_collection.find_one_and_update({'team': thisTeam['_id'], 'week': week}, {'$set': finalJson[thisTeam['name']]})
        
    elif(teams_collection.find_one({'location': team})):
        thisTeam = teams_collection.find_one({'location': team})
        finalJson[thisTeam['name']]['defRushYdsGame'] = str(defYdsData['R YDS/G'][num])
        stats_collection.find_one_and_update({'team': thisTeam['_id'], 'week': week}, {'$set': finalJson[thisTeam['name']]})

# Close DB
client.close()
