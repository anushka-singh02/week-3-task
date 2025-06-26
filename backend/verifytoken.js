import admin from "./configuration/firebase-config.js";

export async function VerifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No or invalid Authorization header");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Token verified for UID:", decodedToken.uid);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(403).json({ message: "Invalid token", error: err.message });
    throw err;
  }
}
