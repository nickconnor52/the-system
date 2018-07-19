import pandas as pd
import json
from pymongo import MongoClient

# TODO - add week dynamically for automation
week = '0'

# LOS Data
tablesDrive = pd.read_html("http://www.footballoutsiders.com/stats/drivestats", header=0)
driveJson = tablesDrive[1].to_json()


# OFF pts/RZ
tablesOff = pd.read_html("http://www.footballoutsiders.com/stats/drivestatsoff", header=0)
offJson = tablesOff[1].to_json()

# DEF pts/RZ
tablesDef = pd.read_html("http://www.footballoutsiders.com/stats/drivestatsdef2017", header=0)
defJson = tablesDef[1].to_json()

# Cleaned Up JSON

finalJson = {}

# Ingest into DB

client = MongoClient('mongodb://nickconnor52:Cardinals77@ds137611.mlab.com:37611/systemdb')
db = client['systemdb']
collection_fo = db['football_outsiders']

collection_fo.insert(file_data)
client.close()



