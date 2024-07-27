from pymongo import MongoClient, GEOSPHERE

# MongoDB connection

client = MongoClient("mongodb://localhost:27017")
db = client['geo_database']
collection = db['geo_collection']

# Ensure the collection has a 2dsphere index
collection.create_index([("geometry", GEOSPHERE)])
  

