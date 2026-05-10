document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const department = document.getElementById('department').value;
  const year = document.getElementById('year').value;
  const errorMsg = document.getElementById('errorMsg');

  errorMsg.style.display = 'none';

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

  try {
    const result = await auth.createUserWithEmailAndPassword(email, password);
    const uid = result.user.uid;

    const basicInfo = {
      uid,
      name,
      email,
      department,
      year
    };

    localStorage.setItem('mm_pending_register', JSON.stringify(basicInfo));
    window.location.href = 'QuizPage.html';

  } catch (error) {
    errorMsg.textContent = error.message;
    errorMsg.style.display = 'block';
  }
});
