const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Usa el archivo JSON que descargaste de Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;