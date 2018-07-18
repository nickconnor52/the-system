import pandas as pd

# TODO - add week dynamically for automation
week = '0'

# LOS Data
tables = pd.read_html("http://www.footballoutsiders.com/stats/drivestats", header=0)
tables[1].to_json('../storage/football-outsiders/week-' + week + '/LOS.json')

# OFF pts/RZ
tables = pd.read_html("http://www.footballoutsiders.com/stats/drivestatsoff", header=0)
tables[1].to_json('../storage/football-outsiders/week-' + week + '/OFF_pts_rz.json')

# DEF pts/RZ
tables = pd.read_html("http://www.footballoutsiders.com/stats/drivestatsdef2017", header=0)
tables[1].to_json('../storage/football-outsiders/week-' + week + '/DEF_pts_rz.json')