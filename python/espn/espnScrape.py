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