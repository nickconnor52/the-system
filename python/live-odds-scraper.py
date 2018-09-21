import os
import pandas as pd
import json
from pymongo import MongoClient
from bson.objectid import ObjectId
import sys

# LOS Data
oddsTable = pd.read_html("http://www.espn.com/nfl/lines", header=0)
print(oddsTable)
oddsJson = json.loads(oddsTable[0].to_json())
print(oddsJson)