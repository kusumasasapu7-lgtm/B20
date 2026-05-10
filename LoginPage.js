// login.js — Handle login authentication with Firebase

document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const errorMsg = document.getElementById('errorMsg');

  errorMsg.style.display = 'none';

  if (!email || !password) {
    errorMsg.textContent = 'Please enter both email and password.';
    errorMsg.style.display = 'block';
    return;
  }

  try {
    // Login using Firebase Authentication
    const result = await auth.signInWithEmailAndPassword(email, password);
    const uid = result.user.uid;

    // Get user details from Firestore
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      errorMsg.textContent = 'User data not found.';
      errorMsg.style.display = 'block';
      return;
    }

    const user = userDoc.data();

    // Store current session in browser
    localStorage.setItem('mm_current_user', JSON.stringify(user));

    // Redirect to dashboard
    window.location.href = 'Dashboard.html';

  } catch (error) {
    errorMsg.textContent = 'Invalid email or password.';
    errorMsg.style.display = 'block';
  }
});
