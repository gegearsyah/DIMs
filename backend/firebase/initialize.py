import firebase_admin
from firebase_admin import credentials, messaging

# Path to your service account key
SERVICE_ACCOUNT_KEY_PATH = "./secret/dims-65008-firebase-adminsdk-fgau7-6e0d3872af.json"

# Initialize Firebase Admin SDK
cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_PATH)
firebase_admin.initialize_app(cred)
