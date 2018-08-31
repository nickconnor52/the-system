#! /bin/bash

# Will Check for the existance of stats for a team for a week and update them if they exist
# Otherwise will create them

week=$1

echo '--- Ingesting Football Outsiders Data ---'
python3 ./football-outsiders/foScrapeUpdate.py "$week"
echo '--- DONE ---'

echo '--- Ingesting Team Rankings Data ---'
python3 ./team-rankings/trScrape.py "$week"
echo '--- DONE ---'

echo '--- Ingesting ESPN Data ---'
python3 ./espn/espnScrape.py "$week"

echo '--- Complete ---'