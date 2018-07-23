import pandas as pd
import json
from pymongo import MongoClient

# TODO - add week dynamically for automation -- Pass in as parameter populated by the shell script
week = '0'
season = '0'

# LOS Data
tablesDrive = pd.read_html("http://www.footballoutsiders.com/stats/drivestats", header=0)
driveJson = json.loads(tablesDrive[1].to_json())

# OFF pts/RZ
tablesOff = pd.read_html("http://www.footballoutsiders.com/stats/drivestatsoff", header=0)
offJson = json.loads(tablesOff[1].to_json())

# DEF pts/RZ
tablesDef = pd.read_html("http://www.footballoutsiders.com/stats/drivestatsdef2017", header=0)
defJson = json.loads(tablesDef[1].to_json())

# Connect to DB

client = MongoClient('mongodb://nickconnor52:Cardinals77@ds137611.mlab.com:37611/systemdb')
db = client['systemdb']
stats_collection = db['stats']
weeks_collection = db['weeks']
teams_collection = db['teams']

# Cleaned Up JSON

defTeams = defJson['Team']
driveTeams = driveJson['Team']
offTeams = offJson['Team']

finalJson = {}

# ADD Week Info
thisWeek = weeks_collection.find_one({'number': week, 'season': season})

# DRIVE pts/rz
for num, team in driveTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']] = {
            'team': thisTeam['_id'],
            'week': thisWeek['_id'],
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
        stats_collection.insert(finalJson[thisTeam['name']])

# Close DB
client.close()



