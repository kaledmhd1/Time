const express = require('express');
const { readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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
  } catch (error) {
    return {};
  }
}

function saveUIDs(uids) {
  ensureStorageFile();
  writeFileSync(STORAGE_PATH, JSON.stringify(uids, null, 2));
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

function formatRemainingTime(expiration) {
  const now = new Date();
  const expirationDate = new Date(expiration);
  const diff = expirationDate.getTime() - now.getTime();

  if (diff <= 0) {
    return null; // Expired
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

// CORS Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.get(['/', '/api'], (req, res) => {
  res.json({
    message: 'Mossa Time API - UID Expiration Management',
    author: 'Mossa',
    version: '1.0.0',
    endpoints: {
      add_uid: '/api/add_uid?uid=USER_ID&time=VALUE&type=UNIT&permanent=false',
      get_time: '/api/get_time/USER_ID',
      remove_uid: '/api/remove_uid?uid=USER_ID',
      list_uids: '/api/list_uids'
    },
    time_units: ['seconds', 'minutes', 'hours', 'days', 'months', 'years']
  });
});

app.get('/api/add_uid', (req, res) => {
  const { uid, time, type, permanent } = req.query;

  if (!uid) return res.status(400).json({ error: 'Missing parameter: uid', author: 'Mossa' });

  let expirationTime;
  try {
    if (permanent === 'true') expirationTime = 'permanent';
    else expirationTime = calculateExpirationTime(parseInt(time), type);
  } catch {
    return res.status(400).json({
      error: 'Invalid time unit. Use: seconds, minutes, hours, days, months, years',
      author: 'Mossa'
    });
  }

  const uids = loadUIDs();
  uids[uid] = {
    expiration: expirationTime,
    added_by: 'Mossa',
    added_at: new Date().toISOString()
  };
  saveUIDs(uids);

  res.json({
    success: true,
    uid,
    expires_at: expirationTime === 'permanent' ? 'never' : expirationTime,
    added_by: 'Mossa',
    message: `UID ${uid} added successfully by Mossa`
  });
});

app.get('/api/get_time/:uid', (req, res) => {
  const uid = req.params.uid;
  const uids = loadUIDs();

  if (!uids[uid]) return res.status(404).json({ error: 'UID not found', uid, author: 'Mossa' });

  const uidData = uids[uid];

  if (uidData.expiration === 'permanent') {
    return res.json({
      uid,
      status: 'permanent',
      message: 'This UID will never expire',
      added_by: uidData.added_by || 'Mossa',
      author: 'Mossa'
    });
  }

  const remainingTime = formatRemainingTime(uidData.expiration);

  if (!remainingTime) {
    delete uids[uid];
    saveUIDs(uids);
    return res.status(410).json({ error: 'UID has expired and been removed', uid, author: 'Mossa' });
  }

  res.json({
    uid,
    remaining_time: remainingTime,
    expires_at: uidData.expiration,
    added_by: uidData.added_by || 'Mossa',
    author: 'Mossa'
  });
});

app.get('/api/remove_uid', (req, res) => {
  const uid = req.query.uid;
  if (!uid) return res.status(400).json({ error: 'Missing parameter: uid', author: 'Mossa' });

  const uids = loadUIDs();

  if (!uids[uid]) return res.status(404).json({ error: 'UID not found', uid, author: 'Mossa' });

  delete uids[uid];
  saveUIDs(uids);

  res.json({
    success: true,
    message: `UID ${uid} removed successfully by Mossa`,
    uid,
    author: 'Mossa'
  });
});

app.get('/api/list_uids', (req, res) => {
  const uids = loadUIDs();
  const validUIDs = {};
  let expiredCount = 0;

  Object.keys(uids).forEach(uid => {
    const uidData = uids[uid];
    if (uidData.expiration === 'permanent') {
      validUIDs[uid] = {
        status: 'permanent',
        added_by: uidData.added_by || 'Mossa',
        added_at: uidData.added_at
      };
    } else {
      const remainingTime = formatRemainingTime(uidData.expiration);
      if (remainingTime) {
        validUIDs[uid] = {
          remaining_time: remainingTime,
          expires_at: uidData.expiration,
          added_by: uidData.added_by || 'Mossa',
          added_at: uidData.added_at
        };
      } else {
        expiredCount++;
        delete uids[uid];
      }
    }
  });

  if (expiredCount > 0) {
    saveUIDs(uids);
  }

  res.json({
    total_uids: Object.keys(validUIDs).length,
    expired_removed: expiredCount,
    uids: validUIDs,
    managed_by: 'Mossa',
    author: 'Mossa'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
