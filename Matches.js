
// ===================== MATCHING ALGORITHM =====================

// MCQ questions — these are compared directly (70% of score)
const MCQ_QUESTIONS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q9', 'q10', 'q11', 'q12'];

// Text questions — keyword comparison (30% of score)
const TEXT_QUESTIONS = ['q7', 'q8', 'q13', 'q14', 'q15'];

// Extract keywords from a text answer (remove short/common words)
function extractKeywords(text) {
  if (!text) return [];
  const stopWords = ['i', 'a', 'an', 'the', 'is', 'are', 'was', 'and', 'or', 'to', 'of',
    'in', 'on', 'at', 'for', 'with', 'my', 'me', 'do', 'can', 'it', 'be',
    'that', 'this', 'but', 'as', 'by', 'from', 'they', 'we', 'you', 'he', 'she'];

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
}

// Calculate similarity between two keyword arrays
function keywordSimilarity(text1, text2) {
  const words1 = extractKeywords(text1);
  const words2 = extractKeywords(text2);

  if (words1.length === 0 && words2.length === 0) return 0.5; // neutral if both empty
  if (words1.length === 0 || words2.length === 0) return 0;

  const common = words1.filter(w => words2.includes(w));
  const total = new Set([...words1, ...words2]).size;

  return common.length / total;
}

// Main function: calculate match % between two users
function calculateMatchScore(userA, userB) {

  // ---- MCQ SCORE (70% weight) ----
  let mcqMatches = 0;
  MCQ_QUESTIONS.forEach(function(q) {
    if (userA[q] && userB[q] && userA[q] === userB[q]) {
      mcqMatches++;
    }
  });
  const mcqScore = mcqMatches / MCQ_QUESTIONS.length; // 0 to 1

  // ---- TEXT SCORE (30% weight) ----
  let textScoreTotal = 0;
  TEXT_QUESTIONS.forEach(function(q) {
    textScoreTotal += keywordSimilarity(userA[q], userB[q]);
  });
  const textScore = textScoreTotal / TEXT_QUESTIONS.length; // 0 to 1

  // ---- FINAL SCORE ----
  const finalScore = (mcqScore * 0.70) + (textScore * 0.30);

  return Math.round(finalScore * 100); // Return as percentage
}

// Find common MCQ answers between two users (for tags display)
function getCommonAnswers(userA, userB) {
  const common = [];
  MCQ_QUESTIONS.forEach(function(q) {
    if (userA[q] && userB[q] && userA[q] === userB[q]) {
      common.push(userA[q]);
    }
  });
  return common.slice(0, 4); // Show max 4 tags
}

// ===================== DISPLAY =====================

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function yearLabel(y) {
  const labels = { '1': '1st Year', '2': '2nd Year', '3': '3rd Year', '4': '4th Year' };
  return labels[y] || `Year ${y}`;
}

function getScoreColor(score) {
  if (score >= 80) return 'var(--accent3)';
  if (score >= 60) return 'var(--accent)';
  if (score >= 40) return 'var(--accent2)';
  return 'var(--text3)';
}

function renderMatchCard(matchUser, score, commonAnswers, currentUser) {
  const initial = matchUser.name.charAt(0).toUpperCase();
  const scoreColor = getScoreColor(score);
  const isConnected = isAlreadyConnected(matchUser.email);

  const tagsHTML = commonAnswers.length > 0
    ? commonAnswers.map(t => `<span class="match-tag">${capitalize(t)}</span>`).join('')
    : '<span style="color:var(--text3); font-size:0.8rem;">No common answers</span>';

  return `
    <div class="match-card" id="card-${matchUser.email.replace(/[^a-z]/gi, '')}">
      <div class="match-card-header">
        <div class="match-avatar">${initial}</div>
        <div>
          <div class="match-name">${matchUser.name}</div>
          <div class="match-meta">${matchUser.department} · ${yearLabel(matchUser.year)}</div>
          <div class="match-meta" style="margin-top:2px;">Goal: ${capitalize(matchUser.q3) || '—'}</div>
        </div>
      </div>

      <div class="match-score-bar">
        <div class="score-label">
          <span>Compatibility</span>
          <span class="score-value" style="color:${scoreColor}">${score}%</span>
        </div>
        <div class="score-track">
          <div class="score-fill" style="width:${score}%; background: linear-gradient(90deg, var(--accent), ${scoreColor});"></div>
        </div>
      </div>

      <div class="match-tags">${tagsHTML}</div>

      <div class="match-actions">
        ${isConnected
          ? `<button class="btn btn-secondary" style="flex:1; justify-content:center;" disabled>✓ Connected</button>`
          : `<button class="btn btn-primary" style="flex:1; justify-content:center;" onclick="connectUser('${matchUser.email}', '${matchUser.name}')">Connect</button>`
        }
        <button class="btn btn-secondary" style="padding:0.6rem 1rem;" title="View details"
          onclick="viewDetails('${matchUser.email}')">👤</button>
      </div>
    </div>
  `;
}

// ===================== CONNECT LOGIC =====================

function isAlreadyConnected(email) {
  const connections = JSON.parse(localStorage.getItem('mm_connections') || '[]');
  return connections.some(c => c.email === email);
}

function connectUser(email, name) {
  const connections = JSON.parse(localStorage.getItem('mm_connections') || '[]');

  const allUsers = JSON.parse(localStorage.getItem('mm_all_users') || '[]');
  const targetUser = allUsers.find(u => u.email === email);

  if (targetUser && !isAlreadyConnected(email)) {
    connections.push({
      email: targetUser.email,
      name: targetUser.name,
      department: targetUser.department,
      year: targetUser.year,
      q3: targetUser.q3,
      q9: targetUser.q9
    });
    localStorage.setItem('mm_connections', JSON.stringify(connections));
  }

  // Update the button in UI
  const cardId = 'card-' + email.replace(/[^a-z]/gi, '');
  const card = document.getElementById(cardId);
  if (card) {
    const actionsDiv = card.querySelector('.match-actions');
    actionsDiv.innerHTML = `
      <button class="btn btn-secondary" style="flex:1; justify-content:center;" disabled>✓ Connected</button>
      <button class="btn btn-secondary" style="padding:0.6rem 1rem;" onclick="viewDetails('${email}')">👤</button>
    `;
  }
}

function viewDetails(email) {
  const allUsers = JSON.parse(localStorage.getItem('mm_all_users') || '[]');
  const u = allUsers.find(u => u.email === email);
  if (!u) return;
  alert(`📋 ${u.name}\n\nDept: ${u.department} | Year: ${u.year}\nGoal: ${capitalize(u.q3)}\nLooking for: ${capitalize(u.q9)}\nStudy time: ${capitalize(u.q5)}\nTech interest: ${capitalize(u.q2)}\nFun fact: ${u.q15 || 'Not shared'}`);
}

// ===================== FILTER & RENDER =====================

let allMatches = [];

function renderMatches(matches) {
  const container = document.getElementById('matchResults');
  const noMatches = document.getElementById('noMatches');
  const countEl = document.getElementById('matchCount');

  if (matches.length === 0) {
    container.innerHTML = '';
    noMatches.style.display = 'block';
    countEl.textContent = '0 matches found';
    return;
  }

  noMatches.style.display = 'none';
  countEl.textContent = `${matches.length} match${matches.length !== 1 ? 'es' : ''} found`;

  container.innerHTML = matches.map(function(m) {
    return renderMatchCard(m.user, m.score, m.common, null);
  }).join('');
}

function applyFilters() {
  const yearFilter = document.getElementById('filterYear').value;
  const goalFilter = document.getElementById('filterGoal').value;

  const currentUser = JSON.parse(localStorage.getItem('mm_current_user'));
  const currentYear = parseInt(currentUser.year);

  let filtered = allMatches.filter(function(m) {
    const matchYear = parseInt(m.user.year);

    if (yearFilter === 'junior' && matchYear >= currentYear) return false;
    if (yearFilter === 'senior' && matchYear <= currentYear) return false;
    if (yearFilter === 'same' && matchYear !== currentYear) return false;

    if (goalFilter !== 'all' && m.user.q3 !== goalFilter) return false;

    return true;
  });

  renderMatches(filtered);
}

// ===================== INIT =====================

window.onload = function () {

  const currentUser = JSON.parse(localStorage.getItem('mm_current_user') || 'null');
  if (!currentUser) {
    window.location.href = 'LoginPage.html';
    return;
  }

  const allUsers = JSON.parse(localStorage.getItem('mm_all_users') || '[]');

  // Calculate scores for all other users
  allMatches = allUsers
    .filter(u => u.email !== currentUser.email)
    .map(function(u) {
      const score = calculateMatchScore(currentUser, u);
      const common = getCommonAnswers(currentUser, u);
      return { user: u, score: score, common: common };
    })
    .sort((a, b) => b.score - a.score); // Sort highest first

  renderMatches(allMatches);

  // Filter button
  document.getElementById('filterBtn').addEventListener('click', applyFilters);

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('mm_current_user');
    window.location.href = 'index.html';
  });
};