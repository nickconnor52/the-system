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

# GIVE/TAKE
for num, team in giveTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        print(team)
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']] = {
            'team': thisTeam['_id'],
            'week': thisWeek['_id'],
            'give_take_diff': giveData['DIFF'][num]
        }
    elif(teams_collection.find_one({'location': team})):
        print(team)
        thisTeam = teams_collection.find_one({'location': team})
        finalJson[thisTeam['name']] = {
            'team': thisTeam['_id'],
            'week': thisWeek['_id'],
            'give_take_diff': giveData['DIFF'][num]
        }

print()

# # OFF pts/rz
# for num, team in offTeams.items():
#     if(teams_collection.find_one({'nickname': team})):
#         thisTeam = teams_collection.find_one({'nickname': team})
#         finalJson[thisTeam['name']]['off_pts_rz'] = offJson['Pts/RZ'][num].split(' ')[0]

# # DEF pts/rz
# for num, team in defTeams.items():
#     if(teams_collection.find_one({'nickname': team})):
#         thisTeam = teams_collection.find_one({'nickname': team})
#         finalJson[thisTeam['name']]['def_pts_rz'] = defJson['Pts/RZ'][num].split(' ')[0]
#         stats_collection.insert(finalJson[thisTeam['name']])

# Close DB
client.close()
