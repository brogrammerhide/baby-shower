import { connectToDatabase } from '../lib/db';
import { Account } from '../health/entities/Account';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-key-12345!';

export async function seedAdminAccount() {
  await connectToDatabase();
  const adminCount = await Account.countDocuments({ role: 'admin' });
  if (adminCount === 0) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);
    await Account.create({
      email: 'admin@babyshower.com',
      passwordHash,
      role: 'admin',
      firstName: 'Shower',
      lastName: 'Organizer',
    });
  }
}

export async function login(email: string, password: string) {
  await connectToDatabase();
  
  // Auto-seed default admin if none exists
  await seedAdminAccount();

  const account = await Account.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
  if (!account) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, account.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // Create JWT session token
  const token = jwt.sign(
    { userId: account._id, email: account.email, role: account.role },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  return {
    token,
    account: {
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
      role: account.role,
    },
  };
}

import { NextRequest } from 'next/server';

export async function verifyAdminToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
    if (decoded.role !== 'admin') {
      throw new Error('Unauthorized role access');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired authentication token');
  }
}

export async function checkAuth(req: NextRequest) {
  const cookieToken = req.cookies.get('token')?.value;
  if (cookieToken) {
    try {
      return await verifyAdminToken(cookieToken);
    } catch (e) {
      // Fall through to authorization header
    }
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const headerToken = authHeader.substring(7);
    try {
      return await verifyAdminToken(headerToken);
    } catch (e) {
      // Fall through
    }
  }

  return null;
}


