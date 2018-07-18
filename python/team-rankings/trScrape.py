import pandas as pd

week = '0'

# LOS Data
tables = pd.read_html("https://www.teamrankings.com/nfl/stat/red-zone-scoring-attempts-per-game", header=0)
tables[0].to_json('../storage/team-rankings/week-' + week + '/RZ_atmpts_game.json')