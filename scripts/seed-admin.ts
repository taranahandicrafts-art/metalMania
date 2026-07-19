import fs from 'node:fs';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User';
import { getPermissionsForRole } from '../lib/permissions';

for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue;
  const idx = line.indexOf('=');
  if (idx > -1) {
    process.env[line.slice(0, idx)] = line.slice(idx + 1);
  }
}

const email = 'admin@furniture.local';
const password = 'Admin@12345';

await mongoose.connect(process.env.MONGODB_URI!, {
  serverSelectionTimeoutMS: 8000,
  socketTimeoutMS: 15000,
});

const hashed = await bcrypt.hash(password, 10);
const user = await User.findOneAndUpdate(
  { email },
  {
    name: 'Admin User',
    email,
    password: hashed,
    role: 'superadmin',
    permissions: getPermissionsForRole('superadmin'),
    is_active: true,
    email_verified: new Date(),
  },
  {
    upsert: true,
    new: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  },
);

console.log(JSON.stringify({
  message: 'Admin seed user created/updated successfully',
  email: user.email,
  role: user.role,
  password,
}, null, 2));

await mongoose.connection.close();
