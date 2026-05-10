// register.js — Handle registration form

document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const department = document.getElementById('department').value;
  const year = document.getElementById('year').value;
  const errorMsg = document.getElementById('errorMsg');

  // Basic validation
  if (!name || !email || !password || !department || !year) {
    errorMsg.textContent = 'Please fill in all fields.';
    errorMsg.style.display = 'block';
    return;
  }

  if (password.length < 6) {
    errorMsg.textContent = 'Password must be at least 6 characters.';
    errorMsg.style.display = 'block';
    return;
  }

  // Check if email already exists
  const allUsers = JSON.parse(localStorage.getItem('mm_all_users') || '[]');
  const exists = allUsers.find(u => u.email === email);
  if (exists) {
    errorMsg.textContent = 'An account with this email already exists. Please login.';
    errorMsg.style.display = 'block';
    return;
  }

  // Save basic info temporarily (quiz will complete it)
  const basicInfo = { name, email, password, department, year };
  localStorage.setItem('mm_pending_register', JSON.stringify(basicInfo));

  // Redirect to quiz
  window.location.href = 'QuizPage.html';
});