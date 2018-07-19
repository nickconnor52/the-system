import json
from pymongo import MongoClient

client = MongoClient('mongodb://nickconnor52:Cardinals77@ds137611.mlab.com:37611/systemdb')
db = client['systemdb']
collection_fo = db['football_outsiders']

with open('../storage/football-outsiders/week_0_DEF_pts_rz.json') as f:
    file_data = json.load(f)

collection_fo.insert(file_data)
client.close()