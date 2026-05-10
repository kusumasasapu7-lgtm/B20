// quiz.js — Handle quiz form, save answers, create user

// Progress bar tracking
function updateProgress() {
  const mcqNames = ['q1','q2','q3','q4','q5','q6','q9','q10','q11','q12'];
  const textIds = ['q7','q8','q13','q14','q15'];

  let answered = 0;
  const total = 15;

  mcqNames.forEach(name => {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    if (selected) answered++;
  });

  textIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.value.trim().length > 0) answered++;
  });

  const pct = Math.round((answered / total) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressText').textContent = `${answered} of ${total} answered`;
  document.getElementById('progressPct').textContent = pct + '%';
}

// Listen to all inputs for progress
document.querySelectorAll('input[type="radio"]').forEach(el => {
  el.addEventListener('change', updateProgress);
});

document.querySelectorAll('input[type="text"]').forEach(el => {
  el.addEventListener('input', updateProgress);
});

// Submit quiz
document.getElementById('quizForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const errorMsg = document.getElementById('errorMsg');
  errorMsg.style.display = 'none';

  // Get pending registration info
  const basicInfo = JSON.parse(localStorage.getItem('mm_pending_register') || 'null');

  if (!basicInfo) {
    errorMsg.textContent = 'Session expired. Please register again.';
    errorMsg.style.display = 'block';

    setTimeout(() => {
      window.location.href = 'ResgisterPage.html';
    }, 2000);

    return;
  }

  // Collect MCQ answers
  const mcqNames = ['q1','q2','q3','q4','q5','q6','q9','q10','q11','q12'];
  const answers = {};

  for (let name of mcqNames) {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    answers[name] = selected ? selected.value : '';
  }

  // Collect text answers
  const textIds = ['q7','q8','q13','q14','q15'];

  for (let id of textIds) {
    const el = document.getElementById(id);
    answers[id] = el ? el.value.trim() : '';
  }

  // Build complete user object
  const newUser = {
    ...basicInfo,
    ...answers
  };

  // Save user data to Firebase Firestore
  try {
    await db.collection('users').doc(newUser.uid).set(newUser);

    // Set as current logged-in user in this browser
    localStorage.setItem('mm_current_user', JSON.stringify(newUser));

    // Clean up pending registration
    localStorage.removeItem('mm_pending_register');

    // Redirect to dashboard
    window.location.href = 'Dashboard.html';

  } catch (error) {
    errorMsg.textContent = 'Error saving user data: ' + error.message;
    errorMsg.style.display = 'block';
  }
});

// Initial progress
updateProgress();
