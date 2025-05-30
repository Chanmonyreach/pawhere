const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8081;

// Inline Firebase service account credentials
admin.initializeApp({
  credential: admin.credential.cert({
  "type": "service_account",
  "project_id": "pawhere-a797f",
  "private_key_id": "e3f44a8f07973d4bff5296a84402e8d8bf267edd",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCssBr2ndfVmjK6\nHZWDlalINWEM0XQL7QJh7l/4gElptERtU9ju5+KTknWqB6cleHrKtsxc1zZatowO\nP2gjINg5wdlzVJ9sREugo84yuOW84kSbXtvfxBdttmkpvJ49RYmCgoh1swV70uc6\n3uCfDcpJyexzV/oVvEy5y/9YnU4lWG7P5Q5VWVoAXz7ZRcXX7vPNPizG5ZOE6n23\nu6AwawQ/C4ntOhKIHIArwV8UwO40A71QIP0UMUF1gDt/G0S759hK1oZOBIF3mfhH\nePch85L0HN3Ea34JCrFgdznm+E5MmgRl70Qz6StjGJ1pJTmN2ER2NA2oBLI4gHnP\nRILkP05nAgMBAAECggEAMDyvA3V63UlJ4zAxXAS5uRhkCCMX0d7+G+Hsv+sB1ruK\no6lYvv9aDJPMN1cU6wQY9LgUJNje737vZ2lxyuI5VATgm3UnZSQ8pd4r0oJQdi8U\nL/xS2dIaI0ThYk20O/RJIYIZ4RrFLN3wRkMMppFBENSNLnkEO/8RxZKEvLmQIyD2\nloDLolCT7TwrDwD3MV16GXg+5xEY+elzuRPfwwvEFpfSGFIJse3l7SvRLzURITDr\nCHILy9dNd2F5vr9Ly9CR23+5gI0LIW/SlsTdlrJqQUeBRrupVSvSMfhQDWDWEebZ\n4YwfHZ7P/eYfr88jdl4c0EdYWtqVNL0cqrWXpxyWoQKBgQDxiy1x6hTmwII2bg8e\nditYKgI/fJDeLFlOvSBUAXZ7ROHUjEobWuYQzDgZB3LWSgarIdLocFjUZCrCsbsA\n1p7K+2gE0pFK+XxQ4hHL/bw8CGeA0bJDqhnjd8D28s9Tk0d6/tIJBG6ozn+ctQrb\nafMIxHDO+/vFWjNwYyQS3rLexwKBgQC3BfOCj5TFga9tNrzgpGVenJuYDYj1mlB7\n8nBFT7SiAPQXQF3U2Jm7L+HJvWyhRrk1w+1D6jR+OwrSrpUcTFCrwZb5zC/Haswl\nraN2hZvAyOCdeXYVGTwW8aXPFfYSLAOe14LqETmWWdzhYUxvHB6GBXu4o3o7CsB/\ndSu5hO7zYQKBgAhb5Kq4ixihOOBhVqybMkzOx10jFnBZ4I1VBjViB5Okgpw0bqwb\nrTKPnrFfDJ5V2X06om3g1XIkNUafl/UjeENWB/eCwfxyPdceu7bvhQAe2lYe66hj\nzpmMn2TsajheNG8ROnuNZ7b3znrB2SpWtE5tXeoL1l6yDG2rQKhWhKIpAoGAMJkZ\n8d8iR9eJt1xDhvrgF+FJx3RAm8af/GmBukXR1vqd1da3k574IyYxtBniUGixIT+n\nLtNvoN0YoJzO5za0bQb4idfYEAGht5eFwiD0HJq6WdY4rp2GwSjlODnCn0ykoXbk\nQjbUrcGqzwXA//fdewTVt09hU3AlcTKxq49Ky8ECgYAhJN0FXL7h/+boabmGQ+tM\nmJiu7yzaCKWCPQwwgdlbcNyAbRPeFqqJAGTmkyZSTt+szyBpCwfnL0CKjgeHjr5b\nU9LvQNwygBVJPb210LZE5NH2CaqKlX0B2vnHEwPqPq0AjDvW6iT7RLiO9EojuomW\ndDiOqbd7nYJnvmbEbC7DhA==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fm5fl@pawhere-a797f.iam.gserviceaccount.com",
  "client_id": "112905267967852424123",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fm5fl%40pawhere-a797f.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
)
});

const db = admin.firestore();
app.use(bodyParser.json());

app.post('/pawhere', async (req, res) => {
  const { latitude, longitude, deviceId } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).send({ success: false, message: 'Missing coordinates' });
  }

  const device = deviceId || 'unknown';
  const documentPath = `LocationTracker/${device}`;

  try {
    await db.doc(documentPath).set({ latitude, longitude });
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
