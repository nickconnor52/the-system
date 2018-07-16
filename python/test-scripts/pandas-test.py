import pandas as pd

tables = pd.read_html("https://www.footballoutsiders.com/index.php?q=stats/drivestats")

print(tables)