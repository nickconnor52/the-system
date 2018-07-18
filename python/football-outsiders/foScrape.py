import pandas as pd

[tables] = pd.read_html("http://www.footballoutsiders.com/stats/drivestats", header=0)

print(tables.to_json())