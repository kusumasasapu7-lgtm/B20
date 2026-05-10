// dashboard.js — Load and display user data on dashboard

window.onload = function () {

  // Check login
  const user = JSON.parse(localStorage.getItem('mm_current_user') || 'null');
  if (!user) {
    window.location.href = 'LoginPage.html';
    return;
  }

  // Fill welcome banner
  document.getElementById('userName').textContent = user.name ? user.name.split(' ')[0] : 'there';

  // Fill stat cards
  const yearLabels = { '1': '1st Year', '2': '2nd Year', '3': '3rd Year', '4': '4th Year' };
  document.getElementById('statDept').textContent = user.department || '—';
  document.getElementById('statYear').textContent = yearLabels[user.year] || '—';
  document.getElementById('statGoal').textContent = capitalize(user.q3 || '—');
  document.getElementById('statLooking').textContent = capitalize(user.q9 || '—');

  // ── LIVE MATCH COUNT ──────────────────────────────────────────
  const allUsers = JSON.parse(localStorage.getItem('mm_all_users') || '[]');
  const otherUsers = allUsers.filter(u => u.email !== user.email);
  const matchCountEl = document.getElementById('statMatches');
  if (matchCountEl) {
    matchCountEl.textContent = otherUsers.length > 0 ? otherUsers.length + ' available' : 'None yet';
  }

  // ── CONNECTION COUNT ──────────────────────────────────────────
  const connections = JSON.parse(localStorage.getItem('mm_connections') || '[]');
  const connCountEl = document.getElementById('statConnections');
  if (connCountEl) {
    connCountEl.textContent = connections.length > 0 ? connections.length : '0';
  }

  // ── QUIZ SUMMARY ──────────────────────────────────────────────
  const hasQuizData = user.q1 || user.q2 || user.q3;

  if (!hasQuizData) {
    // Show a prompt to complete the quiz
    document.getElementById('quizSummary').innerHTML = `
      <div style="text-align:center; padding:1.5rem 0;">
        <p style="color:var(--text3); margin-bottom:1rem;">You haven't completed the quiz yet.</p>
        <a href="QuizPage.html" class="btn btn-primary" style="font-size:0.85rem; padding:0.6rem 1.25rem;">
          Take Quiz →
        </a>
      </div>
    `;
  } else {
    const summary = [
      user.q1 ? `🎯 Enjoys: <strong>${capitalize(user.q1)}</strong>` : '',
      user.q2 ? `💻 Tech: <strong>${capitalize(user.q2)}</strong>` : '',
      user.q5 ? `⏰ Studies: <strong>${capitalize(user.q5)}</strong>` : '',
      user.q6 ? `📖 How: <strong>${capitalize(user.q6)}</strong>` : '',
      user.q10 ? `👥 Role: <strong>${capitalize(user.q10)}</strong>` : '',
      user.q11 ? `🚀 Projects: <strong>${capitalize(user.q11)}</strong>` : '',
    ].filter(Boolean);

    document.getElementById('quizSummary').innerHTML = summary.length
      ? summary.map(s => `<p style="padding:0.35rem 0; border-bottom:1px solid var(--border);">${s}</p>`).join('')
      : '<p style="color:var(--text3)">No quiz data yet.</p>';
  }

  // ── FUN FACT & SKILL ──────────────────────────────────────────
  document.getElementById('funFact').textContent = user.q15 ? `"${user.q15}"` : '"Not filled yet"';
  document.getElementById('wantToLearn').textContent = user.q14 || '—';

  // ── RECENT CONNECTIONS PREVIEW ────────────────────────────────
  const recentEl = document.getElementById('recentConnections');
  if (recentEl) {
    if (connections.length === 0) {
      recentEl.innerHTML = `
        <p style="color:var(--text3); font-size:0.88rem; padding:0.5rem 0;">
          No connections yet. <a href="FindMatchesPage.html" style="color:var(--accent);">Find matches →</a>
        </p>
      `;
    } else {
      recentEl.innerHTML = connections.slice(0, 3).map(function(c) {
        const initial = c.name.charAt(0).toUpperCase();
        return `
          <div style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem 0; border-bottom:1px solid var(--border);">
            <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));
              display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;color:white;flex-shrink:0;">
              ${initial}
            </div>
            <div>
              <div style="font-size:0.9rem;font-weight:600;">${c.name}</div>
              <div style="font-size:0.78rem;color:var(--text2);">${c.department || ''}</div>
            </div>
          </div>
        `;
      }).join('') + (connections.length > 3
        ? `<a href="ViewConncetionsPage.html" style="font-size:0.8rem;color:var(--accent);display:block;margin-top:0.75rem;">
            View all ${connections.length} connections →
           </a>`
        : '');
    }
  }

  // ── LOGOUT ────────────────────────────────────────────────────
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