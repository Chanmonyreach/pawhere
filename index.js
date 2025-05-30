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
  "private_key_id": "f90fd16b369e4a64aac2365d771d4e0cfb4f3af9",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCkRyKlNdsH/Edw\nrFVQr/4u3EBXAN7FUConZy+VdWCG7Anj54a2F21egV3siZ1OA4/F1WjwN1jofWOB\nzIuIRcnG6sBjKXXJd7XWcaUadq8jvGNLIlRf5UMG1hcSj9BqaWW9xtQfmeEKf67b\n53Eb+qCNmmcgdAsXpMcfqLbwbADBj13fMB4BGxawrHhprHXIg9ss3Q3MsXyjxKL7\n5vgauyctcgAisA/onVc8uUzwA9WIjRR7146+CkVUAE5oGbCpbdSNPdwbl/jzadUt\nW+/DgjJt8juaqFfA/dI//gOaQfEnxz8eClxBz8e9KCXmziEh7CyUci9c+A7X1laH\npYYAdqXpAgMBAAECggEAGpkV5+/vVbyoCHsumRDVs9qfZDbU2tee66BOWQGXLmE7\nPLY43nSulZWWkny5hm8XMS3bfsFHWOUsXlCy6s553AYYPjXxRzxlqaHe3IkI1F1l\nKj4VsS0ajBnPxIaadRA5k9+EatVsVVnVAu/XJXOP2T19owiG3z4jq2GStRyXhr8g\nCAFugGakZZxLEdMARwpwbOnpM6QWWIWouVeMwj9qMjAmUTKexlizhArTpLt1BANw\nOO0vyjWJFKKmxxqmhzwjFoQyJEa2w/AEJndfNY0MlDM+HWyjtIiWG81BMKQ8ElDp\nqv3cj6L4FbfE/rkpcfo41fkysa7lAwpIYWqzbVpT8QKBgQDfu+/pmrEg4qsXrwIS\nHuHEv4TGtqnuEEB6Hl0uhhGtIWqv6rcwC21uPb7S4m232t0OeCSepYQpILgyVeoN\na4WvWaLUJrCaRhrfOeSzK2B9kDsr0NHsmK+WvTvVRSmK7HR9B9QPUSn94T/vpTtr\nhK0ANzp2caFoJ66U7q0ELR5b5QKBgQC7+CBrK362nOR7lBYoQ32rnPxCOTK37/2g\nrLNm9Xmf1nXxTIdpNq7KptzC4C3TYimcxLhyB0QYPVMTtIsJFH2fJGxtlnRP9/WS\nd+FZqve/mJlCMgsVEnDD6Mc5NzeZ3zwtO3Mh++CjaO0wVVpAMKoB36pmmsSTfEcJ\nkobzQ6gptQKBgQCEem4m7vgvNsiEb5ZUUIDy1UyztXmNg4YKSWx3nd9dmsnnfJ4Y\nDswvWNRjXrwE/82hQba9Udid2cf31jOO2roACJ2H7Zjo4NYMk+U9ylOKRhsjaLTE\n2ewu38JMGHXu0vBvEHGa2D57HCOVrUsv8RHXbNxrQgGHAOg5O9KrBGRTmQKBgQCs\n4UVPzC0634n1bvoCBjDrSfNpJRpUulHXGX/XTiaSr7jCOdTBHB4fHOEmCvGa3UnQ\nec36clxavuxNz1ug+kuftuxSznIjqrceA0wsIGbEvSEYFNbEhrVYOhwhr3tf9kVu\nhKMbuoGdSb/9GENtjlSObJxYyjfKPh9H2pBr5OohkQKBgAdIwYGGHCvqRDj/bOcW\noZSLAEHEi/VH4YIQzTRzz7vKUbmb9aYdZra62BDakAJT/53bl3n1oA+ILLwlu+cB\n48mNt5dsgVVvA55LjFODxFaU8UfG3QKbqU/EdpTFMtuxs0QFKzo/qUf4gbmchTgV\nGYPbfu5rdKLT/auzlqqzPFt/\n-----END PRIVATE KEY-----\n",
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
