const { readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');

const STORAGE_PATH = join(__dirname, 'uid_storage.json');

function ensureStorageFile() {
  if (!existsSync(STORAGE_PATH)) {
    writeFileSync(STORAGE_PATH, JSON.stringify({}));
  }
}

function loadUIDs() {
  ensureStorageFile();
  try {
    const data = readFileSync(STORAGE_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function saveUIDs(uids) {
  ensureStorageFile();
  try {
    writeFileSync(STORAGE_PATH, JSON.stringify(uids, null, 2));
  } catch {}
}

function calculateExpirationTime(timeValue, timeUnit) {
  const currentTime = new Date();
  let expiration;

  switch (timeUnit) {
    case 'seconds':
      expiration = new Date(currentTime.getTime() + timeValue * 1000);
      break;
    case 'minutes':
      expiration = new Date(currentTime.getTime() + timeValue * 60 * 1000);
      break;
    case 'hours':
      expiration = new Date(currentTime.getTime() + timeValue * 60 * 60 * 1000);
      break;
    case 'days':
      expiration = new Date(currentTime.getTime() + timeValue * 24 * 60 * 60 * 1000);
      break;
    case 'months':
      expiration = new Date(currentTime.getTime() + timeValue * 30 * 24 * 60 * 60 * 1000);
      break;
    case 'years':
      expiration = new Date(currentTime.getTime() + timeValue * 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      throw new Error('Invalid time unit');
  }

  return expiration.toISOString();
}

export default function handler(req, res) {
  // تهيئة الرؤوس للسماح بالوصول من أي مكان
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { uid, time, type, permanent } = req.query;

  if (!uid) {
    return res.status(400).json({ error: 'Missing parameter: uid' });
  }

  let expirationTime;

  try {
    if (permanent === 'true') {
      expirationTime = 'permanent';
    } else {
      if (!time || !type) {
        return res.status(400).json({ error: 'Missing time or type parameters' });
      }
      expirationTime = calculateExpirationTime(parseInt(time), type);
    }
  } catch (error) {
    return res.status(400).json({ error: 'Invalid time unit' });
  }

  const uids = loadUIDs();
  uids[uid] = {
    expiration: expirationTime,
    added_by: 'Mossa',
    added_at: new Date().toISOString(),
  };
  saveUIDs(uids);

  return res.status(200).json({
    success: true,
    uid,
    expires_at: expirationTime === 'permanent' ? 'never' : expirationTime,
    message: `UID ${uid} added successfully`,
  });
}
