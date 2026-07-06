/**
 * Server-side Firebase Admin SDK initialization.
 * This module is ONLY imported by Next.js API routes (server-side code).
 * Never import this from client components.
 *
 * In production, set the following environment variables:
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY  (with escaped newlines, e.g., "-----BEGIN...\\n...-----END...\n")
 *
 * If none of the above vars are set, the Admin SDK will use Application Default
 * Credentials (ADC), which works automatically on Vercel when integrated with
 * Firebase via the official Vercel Firebase extension.
 */

import admin from "firebase-admin";

function getAdminApp(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    return admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    });
  }

  // Fallback: Application Default Credentials (works on Cloud Run / Vercel with ADC)
  return admin.initializeApp();
}

const adminApp = getAdminApp();

/** Firestore Admin instance — bypasses security rules (server-side writes). */
export const adminDb = admin.firestore(adminApp);

/** Firebase Auth Admin instance — used for cryptographic JWT verification. */
export const adminAuth = admin.auth(adminApp);
