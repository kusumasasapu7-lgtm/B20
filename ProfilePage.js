
window.onload = function () {

  const user = JSON.parse(localStorage.getItem('mm_current_user') || 'null');
  if (!user) {
    window.location.href = 'LoginPage.html';
    return;
  }

  const yearLabels = { '1': '1st Year', '2': '2nd Year', '3': '3rd Year', '4': '4th Year' };

  // Header
  document.getElementById('avatarInitial').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileEmailDisplay').textContent = user.email;
  document.getElementById('profileYearBadge').textContent = yearLabels[user.year] || user.year;
  document.getElementById('profileDeptBadge').textContent = user.department;

  // Basic info
  document.getElementById('pDept').textContent = user.department || '—';
  document.getElementById('pYear').textContent = yearLabels[user.year] || '—';
  document.getElementById('pGoal').textContent = capitalize(user.q3) || '—';

  // Quiz MCQ answers
  document.getElementById('pQ1').textContent = capitalize(user.q1) || '—';
  document.getElementById('pQ2').textContent = capitalize(user.q2) || '—';
  document.getElementById('pQ4').textContent = capitalize(user.q4) || '—';
  document.getElementById('pQ5').textContent = capitalize(user.q5) || '—';
  document.getElementById('pQ6').textContent = capitalize(user.q6) || '—';
  document.getElementById('pQ9').textContent = capitalize(user.q9) || '—';
  document.getElementById('pQ10').textContent = capitalize(user.q10) || '—';
  document.getElementById('pQ11').textContent = capitalize(user.q11) || '—';
  document.getElementById('pQ12').textContent = capitalize(user.q12) || '—';

  // Text answers
  document.getElementById('pQ7').textContent = user.q7 || '—';
  document.getElementById('pQ13').textContent = user.q13 || '—';
  document.getElementById('pQ14').textContent = user.q14 || '—';
  document.getElementById('pQ15').textContent = user.q15 || '—';

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('mm_current_user');
    window.location.href = 'index.html';
  });
};

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}