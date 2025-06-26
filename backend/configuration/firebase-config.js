import { initializeApp, cert } from "firebase-admin/app";
import admin from "firebase-admin";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert `import.meta.url` to __dirname (needed for path resolution)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and parse the JSON file manually
const serviceAccountKey = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'serviceAccountKey.json'), 'utf-8')
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    databaseURL: "https://trial-95887-default-rtdb.firebaseio.com/",
  });
}

export default admin;