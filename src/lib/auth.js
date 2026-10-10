// Browser-only accounts.
// Passwords are never stored: we keep a PBKDF2-SHA256 hash with a random salt (Web Crypto API).
// Accounts live in this browser's localStorage, so they are per-device. This is suitable for a
// demo / student project — a production app needs a server-side auth provider.

const USERS_KEY = 'cg:users';
const SESSION_KEY = 'cg:session';
const ITERATIONS = 150000;
const SESSION_DAYS = 30;

const enc = new TextEncoder();
const toB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

function readUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; } catch { return {}; }
}
function writeUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

function requireCrypto() {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure sign-in needs https:// or localhost. Open the app at http://localhost:5173 or on your GitHub Pages URL.');
  }
}

async function hashPassword(password, saltB64) {
  requireCrypto();
  const salt = saltB64 ? fromB64(saltB64) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS }, key, 256);
  return { salt: toB64(salt), hash: toB64(bits) };
}

// Constant-time-ish comparison to avoid early exit.
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const normEmail = (e) => e.trim().toLowerCase();
const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

export function publicUser(u) {
  if (!u) return null;
  const { hash, salt, ...rest } = u; // eslint-disable-line no-unused-vars
  return rest;
}

export function validatePassword(pw) {
  if (pw.length < 8) return 'Use at least 8 characters.';
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return 'Include at least one letter and one number.';
  return '';
}

export async function signUp({ name, email, password }) {
  const users = readUsers();
  const key = normEmail(email);
  if (!name.trim()) throw new Error('Enter your name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) throw new Error('Enter a valid email address.');
  const pwErr = validatePassword(password);
  if (pwErr) throw new Error(pwErr);
  if (users[key]) throw new Error('An account with this email already exists. Sign in instead.');
  const { salt, hash } = await hashPassword(password);
  const user = { id: newId(), name: name.trim(), email: key, salt, hash, createdAt: new Date().toISOString(), profile: { college: '', degree: '', gradYear: '', targetRole: '' } };
  users[key] = user;
  writeUsers(users);
  return publicUser(user);
}

export async function signIn({ email, password }) {
  const user = readUsers()[normEmail(email)];
  // Hash even when the user doesn't exist so timing doesn't reveal which emails are registered.
  const { hash } = await hashPassword(password, user?.salt || 'AAAAAAAAAAAAAAAAAAAAAA==');
  if (!user || !safeEqual(hash, user.hash)) throw new Error('Email or password is incorrect.');
  return publicUser(user);
}

export function startSession(userId, remember) {
  const session = JSON.stringify({ userId, exp: Date.now() + SESSION_DAYS * 864e5 });
  (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, session);
  (remember ? sessionStorage : localStorage).removeItem(SESSION_KEY);
}

export function currentUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const { userId, exp } = JSON.parse(raw);
    if (Date.now() > exp) { endSession(); return null; }
    const user = Object.values(readUsers()).find((u) => u.id === userId);
    return publicUser(user);
  } catch { return null; }
}

export function endSession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

export function updateUser(userId, patch) {
  const users = readUsers();
  const key = Object.keys(users).find((k) => users[k].id === userId);
  if (!key) throw new Error('Account not found.');
  const next = { ...users[key], ...patch, profile: { ...users[key].profile, ...(patch.profile || {}) } };
  if (patch.email && normEmail(patch.email) !== key) {
    const newKey = normEmail(patch.email);
    if (users[newKey]) throw new Error('Another account already uses that email.');
    next.email = newKey;
    delete users[key];
    users[newKey] = next;
  } else {
    users[key] = next;
  }
  writeUsers(users);
  return publicUser(next);
}

export async function changePassword(userId, current, nextPw) {
  const users = readUsers();
  const user = Object.values(users).find((u) => u.id === userId);
  if (!user) throw new Error('Account not found.');
  const { hash } = await hashPassword(current, user.salt);
  if (!safeEqual(hash, user.hash)) throw new Error('Current password is incorrect.');
  const err = validatePassword(nextPw);
  if (err) throw new Error(err);
  const fresh = await hashPassword(nextPw);
  users[user.email] = { ...user, ...fresh };
  writeUsers(users);
}

export function deleteUser(userId) {
  const users = readUsers();
  const key = Object.keys(users).find((k) => users[k].id === userId);
  if (key) delete users[key];
  writeUsers(users);
  localStorage.removeItem(`cg:data:${userId}`);
  endSession();
}

export function findUserByEmail(email) {
  return publicUser(readUsers()[normEmail(email)]);
}
