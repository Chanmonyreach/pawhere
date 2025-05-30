const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const fs = require('fs'); // <-- You missed this
const app = express();
const PORT = 8081;

// Path to the secret file mounted by Render
const serviceAccountPath = '/run/secrets/serviceAccountKey.json';

// Read and parse the secret JSON file
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

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

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
