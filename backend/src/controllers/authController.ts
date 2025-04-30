import { Request, Response } from 'express';
import { auth } from '../config/firebase.js';
import axios from 'axios';

// Firebase API key - typically this would be in an environment variable
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || '';

// Firebase Auth response interfaces
interface FirebaseAuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Create user with Firebase Admin SDK
    const userRecord = await auth.createUser({
      email,
      password,
      emailVerified: false
    });

    // Authenticate the user using Firebase Auth REST API
    const authResponse = await axios.post<FirebaseAuthResponse>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true
      }
    );

    const { idToken, refreshToken } = authResponse.data;

    res.status(201).json({
      message: 'User created successfully',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        token: idToken,
        refreshToken
      }
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(400).json({
      error: error.message || 'Error creating user'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!FIREBASE_API_KEY) {
      return res.status(500).json({ error: 'Firebase API key is missing' });
    }

    // Use Firebase Auth REST API to sign in with email/password
    const authResponse = await axios.post<FirebaseAuthResponse>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true
      }
    );

    const { localId, idToken, refreshToken } = authResponse.data;

    res.json({
      message: 'Login successful',
      user: {
        uid: localId,
        email: email,
        token: idToken,
        refreshToken
      }
    });
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    res.status(401).json({
      error: 'Invalid credentials'
    });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    // Verify the token with Firebase
    const decodedToken = await auth.verifyIdToken(token);
    const user = await auth.getUser(decodedToken.uid);

    res.json({
      user: {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified
      }
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(401).json({
      error: error.message || 'Invalid token'
    });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const decodedToken = await auth.verifyIdToken(token);
    const userRecord = await auth.getUser(decodedToken.uid);

    res.json({
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified
      }
    });
  } catch (error: any) {
    console.error('Token verification error:', error);
    res.status(401).json({
      error: 'Invalid token'
    });
  }
}; 