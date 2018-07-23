#! /bin/bash

echo '--- Ingesting Football Outsiders Data ---'
python3 ./football-outsiders/foScrape.py
echo '--- DONE ---'

echo '--- Ingesting Team Rankings Data ---'
python3 ./team-rankings/trScrape.py
echo '--- DONE ---'

echo '--- Ingesting ESPN Data ---'
python3 ./espn/espnScrape.py

echo '--- Complete ---'