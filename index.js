const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const PORT = 8081;

// Load your Firebase service account key
const serviceAccount = JSON.parse(process.env.FIREBASE_SECRET_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(bodyParser.json());

// POST endpoint for GPS data
app.post('/pawhere', async (req, res) => {
  const { latitude, longitude, deviceId } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).send({ success: false, message: 'Missing coordinates' });
  }

  const device = deviceId || 'unknown';
  const documentPath = `LocationTracker/${device}`;

  try {
    await db.doc(documentPath).set({
      latitude,
      longitude
    });

    res.status(200).send({ success: true, message: 'GPS data stored successfully.' });
  } catch (error) {
    console.error('Error saving GPS data:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('📡 GPS Data Forwarding Server is Running!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
