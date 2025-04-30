import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
dotenv.config();

// Log environment variable status (without showing actual values)
console.log('Firebase environment variables status:');
console.log('- FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? 'Found' : 'Missing');
console.log('- FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'Found' : 'Missing');
console.log('- FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'Found' : 'Missing');

// Interface for our auth service
interface Auth {
  createUser: Function;
  getUserByEmail: Function;
  getUser: Function;
  createCustomToken: Function;
  verifyIdToken: Function;
}

// Variable to hold our auth implementation
let auth: Auth;

// First try to use environment variables
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  try {
    // Initialize Firebase with environment variables
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The private key comes as a string with "\n" characters
        // We need to replace them with actual newlines
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    
    console.log('Firebase Admin SDK initialized successfully with environment variables');
    
    // Set auth to use Firebase Admin SDK
    auth = admin.auth();
  } catch (error) {
    console.error('Firebase initialization error with env variables:', error);
    console.warn('Trying to find service account file...');
    tryServiceAccountFile();
  }
} else {
  console.warn('No Firebase environment variables found. Trying to find service account file...');
  tryServiceAccountFile();
}

// Helper function to try loading from service account file
function tryServiceAccountFile() {
  // Try to find service account file
  let serviceAccount = null;
  try {
    // Look for service account in common locations
    const possiblePaths = [
      join(process.cwd(), 'firebase-service-account.json'),
      join(process.cwd(), 'service-account.json'),
      join(process.cwd(), 'firebase-credentials.json')
    ];
    
    for (const path of possiblePaths) {
      try {
        serviceAccount = JSON.parse(readFileSync(path, 'utf8'));
        console.log(`Firebase service account found at: ${path}`);
        break;
      } catch (err) {
        // Continue checking other paths
      }
    }
  } catch (err) {
    console.log('No service account file found');
  }

  // Check if we have Firebase credentials
  if (serviceAccount) {
    try {
      // Initialize Firebase with service account file
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      
      console.log('Firebase Admin SDK initialized successfully with service account file');
      
      // Set auth to use Firebase Admin SDK
      auth = admin.auth();
    } catch (error) {
      console.error('Firebase initialization error with service account file:', error);
      console.warn('Falling back to mock authentication');
      setupMockAuth();
    }
  } else {
    console.warn('No Firebase credentials found. Using mock authentication.');
    setupMockAuth();
  }
}

// Helper function to set up mock auth
function setupMockAuth() {
  console.log('Setting up mock authentication system');
  
  // Mock implementation for development
  interface MockUser {
    uid: string;
    email: string;
    emailVerified: boolean;
    password: string;
  }
  
  const mockUsers = new Map<string, MockUser>();
  
  auth = {
    createUser: async ({ email, password, emailVerified }: { 
      email: string; 
      password: string; 
      emailVerified: boolean 
    }) => {
      console.log('Creating mock user:', email);
      const uid = `user_${Date.now()}`;
      const user = { uid, email, emailVerified, password };
      mockUsers.set(email, user);
      return user;
    },
    
    getUserByEmail: async (email: string) => {
      const user = mockUsers.get(email);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    },
    
    getUser: async (uid: string) => {
      for (const user of mockUsers.values()) {
        if (user.uid === uid) {
          return user;
        }
      }
      throw new Error('User not found');
    },
    
    createCustomToken: async (uid: string) => {
      return `mock_token_${uid}_${Date.now()}`;
    },
    
    verifyIdToken: async (token: string) => {
      // This is a simplified mock implementation
      const uidMatch = token.match(/mock_token_(.+?)_\d+/);
      if (uidMatch) {
        const uid = uidMatch[1];
        return { uid };
      }
      throw new Error('Invalid token');
    }
  };
}

// Export the auth service
export { auth }; 