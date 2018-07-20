import pandas as pd

week = '0'

# Give/Take Data
tables = pd.read_html("http://www.espn.com/nfl/statistics/team/_/stat/givetake", header=1)
tables[0].to_json('../storage/espn/week-' + week + '/give_take.json')

# OFF 3rd Down % Data
tables = pd.read_html("http://www.espn.com/nfl/statistics/team/_/stat/downs", header=1)
tables[0].to_json('../storage/espn/week-' + week + '/OFF_3rd_pct.json')

# DEF 3rd Down % Data
tables = pd.read_html("http://www.espn.com/nfl/statistics/team/_/stat/downs/position/defense", header=1)
tables[0].to_json('../storage/espn/week-' + week + '/DEF_3rd_pct.json')

# OFF Yds/game
tables = pd.read_html("http://www.espn.com/nfl/statistics/team/_/stat/total", header=0)
tables[0].to_json('../storage/espn/week-' + week + '/OFF_yds_gm.json')

# DEF Yds/game
tables = pd.read_html("http://www.espn.com/nfl/statistics/team/_/stat/total/position/defense", header=0)
tables[0].to_json('../storage/espn/week-' + week + '/DEF_yds_gm.json')

import pandas as pd
import json
from pymongo import MongoClient

# TODO - add week dynamically for automation
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
            'off_los_drive': driveJson['OFF.LOS/Dr'][num].split(' ')[0],
            'def_los_drive': driveJson['DEF.LOS/Dr'][num].split(' ')[0],
        }

# OFF pts/rz
for num, team in offTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']]['off_pts_rz'] = offJson['Pts/RZ'][num].split(' ')[0]

# DEF pts/rz
for num, team in defTeams.items():
    if(teams_collection.find_one({'nickname': team})):
        thisTeam = teams_collection.find_one({'nickname': team})
        finalJson[thisTeam['name']]['def_pts_rz'] = defJson['Pts/RZ'][num].split(' ')[0]
        stats_collection.insert(finalJson[thisTeam['name']])

# Close DB
client.close()
