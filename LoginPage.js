// login.js — Handle login authentication

document.getElementById('loginForm').addEventListener('submit', function(e) {
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

  // Get all users from localStorage
  const allUsers = JSON.parse(localStorage.getItem('mm_all_users') || '[]');

  // Find matching user
  const user = allUsers.find(u => u.email === email && u.password === password);

  if (!user) {
    errorMsg.textContent = 'Invalid email or password. Please try again.';
    errorMsg.style.display = 'block';
    return;
  }

  // Set current user session
  localStorage.setItem('mm_current_user', JSON.stringify(user));

  // Redirect to dashboard
  window.location.href = 'Dashboard.html';
});