import pandas as pd

[tables] = pd.read_html("http://www.espn.com/nfl/statistics/team/_/stat/givetake", header=0)

print(tables.to_json())