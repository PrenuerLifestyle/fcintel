import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDLavOembi_2egjQcshysiWqKZOwMka9aI",
  authDomain: "fcintel-1fa8c.firebaseapp.com",
  projectId: "fcintel-1fa8c",
  storageBucket: "fcintel-1fa8c.firebasestorage.app",
  messagingSenderId: "715533638753",
  appId: "1:715533638753:web:491d17796c411ecab9de20"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function showMsg(type, message) {
  if (typeof iziToast !== 'undefined') {
    iziToast[type]({ message, position: 'topRight' });
  } else { alert(message); }
}

function setLoading(btn, loading) {
  if (loading) { btn.disabled = true; btn.dataset.original = btn.innerHTML; btn.innerHTML = 'Please wait...'; }
  else { btn.disabled = false; btn.innerHTML = btn.dataset.original; }
}

const loginForm = document.querySelector('form.verify-gcaptcha');
if (loginForm && !document.getElementById('fullname')) {
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault(); e.stopPropagation();
    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const btn = loginForm.querySelector('[type=submit]');
    if (!email || !password) { showMsg('error', 'Please enter your email and password.'); return; }
    setLoading(btn, true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const token = await credential.user.getIdToken();
      localStorage.setItem('fcintel_uid', credential.user.uid);
      localStorage.setItem('fcintel_email', credential.user.email);
      localStorage.setItem('fcintel_token', token);
      showMsg('success', 'Login successful! Redirecting...');
      setTimeout(() => { window.location.href = '../index.html'; }, 1200);
    } catch (err) {
      setLoading(btn, false);
      const msgs = { 'auth/user-not-found': 'No account found.', 'auth/wrong-password': 'Incorrect password.', 'auth/invalid-email': 'Invalid email.', 'auth/too-many-requests': 'Too many attempts.' };
      showMsg('error', msgs[err.code] || 'Login failed: ' + err.message);
    }
  });
}

const registerForm = document.querySelector('form.verify-gcaptcha');
if (registerForm && document.getElementById('fullname')) {
  registerForm.addEventListener('submit', async function(e) {
    e.preventDefault(); e.stopPropagation();
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    const btn = registerForm.querySelector('[type=submit]');
    if (!fullname || !email || !password) { showMsg('error', 'Fill in all fields.'); return; }
    if (password !== confirm) { showMsg('error', 'Passwords do not match.'); return; }
    if (password.length < 6) { showMsg('error', 'Password must be 6+ characters.'); return; }
    setLoading(btn, true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: fullname });
      localStorage.setItem('fcintel_uid', credential.user.uid);
      localStorage.setItem('fcintel_email', credential.user.email);
      showMsg('success', 'Account created! Redirecting...');
      setTimeout(() => { window.location.href = '../index.html'; }, 1200);
    } catch (err) {
      setLoading(btn, false);
      const msgs = { 'auth/email-already-in-use': 'Email already registered.', 'auth/weak-password': 'Password too weak.' };
      showMsg('error', msgs[err.code] || 'Registration failed: ' + err.message);
    }
  });
}

const resetForm = document.getElementById('resetForm');
if (resetForm) {
  resetForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const btn = resetForm.querySelector('[type=submit]');
    setLoading(btn, true);
    try {
      await sendPasswordResetEmail(auth, email);
      showMsg('success', 'Reset email sent. Check your inbox.');
    } catch (err) { showMsg('error', 'Could not send: ' + err.message); }
    setLoading(btn, false);
  });
}

window.logout = function() {
  auth.signOut().then(() => { localStorage.clear(); window.location.href = '/user/login.html'; });
};
