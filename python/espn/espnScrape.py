import pandas as pd
import json
from pymongo import MongoClient

# TODO - add week dynamically for automation
week = '0'
season = '0'

# LOS Data ---- FO
tablesDrive = pd.read_html("http://www.footballoutsiders.com/stats/drivestats", header=0)
driveJson = json.loads(tablesDrive[1].to_json())

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

client = MongoClient('mongodb://nickconnor52:Cardinals77@ds137611.mlab.com:37611/systemdb')
db = client['systemdb']
stats_collection = db['stats']
weeks_collection = db['weeks']
teams_collection = db['teams']

# Cleaned Up JSON

def3Teams = def3Data['TEAM']
off3Teams = off3Data['TEAM']
giveTeams = giveData['TEAM']
offYdsTeams = offYdsData['TEAM']
defYdsTeams = defYdsData['TEAM']

finalJson = {}

# ADD Week Info
thisWeek = weeks_collection.find_one({'number': week, 'season': season})
check = 0
# GIVE/TAKE
for num, team in giveTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']] = {
            'team': thisTeam['_id'],
            'week': thisWeek['_id'],
            'give_take_diff': giveData['DIFF'][num]
        }
    elif(teams_collection.find_one({'location': team})):
        thisTeam = teams_collection.find_one({'location': team})
        finalJson[thisTeam['name']] = {
            'team': thisTeam['_id'],
            'week': thisWeek['_id'],
            'give_take_diff': giveData['DIFF'][num]
        }

# OFF 3rd Down PCT
for num, team in off3Teams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']]['off_3rd_pct'] = off3Data['PCT'][num]

    elif(teams_collection.find_one({'location': team})):
        thisTeam = teams_collection.find_one({'location': team})
        finalJson[thisTeam['name']]['off_3rd_pct'] = off3Data['PCT'][num]

# DEF 3rd Down PCT
for num, team in def3Teams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']]['def_3rd_pct'] = def3Data['PCT'][num]

    elif(teams_collection.find_one({'location': team})):
        thisTeam = teams_collection.find_one({'location': team})
        finalJson[thisTeam['name']]['def_3rd_pct'] = def3Data['PCT'][num]

# OFF Yds/Game
for num, team in offYdsTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']]['off_yds_game'] = offYdsData['YDS/G'][num]

    elif(teams_collection.find_one({'location': team})):
        thisTeam = teams_collection.find_one({'location': team})
        finalJson[thisTeam['name']]['off_yds_game/G'] = offYdsData['YDS/G'][num]

# DEF Yds/Game
for num, team in defYdsTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']]['def_yds_game/G'] = defYdsData['YDS/G'][num]
        stats_collection.insert(finalJson[thisTeam['name']])

    elif(teams_collection.find_one({'location': team})):
        thisTeam = teams_collection.find_one({'location': team})
        finalJson[thisTeam['name']]['def_yds_game/G'] = defYdsData['YDS/G'][num]
        stats_collection.insert(finalJson[thisTeam['name']])

# Close DB
client.close()
