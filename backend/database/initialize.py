from pymongo import MongoClient, GEOSPHERE

# MongoDB connection

client = MongoClient("mongodb://localhost:27017")
db = client['geo_database']

