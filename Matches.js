// ===================== MATCHING ALGORITHM =====================

const MCQ_QUESTIONS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q9', 'q10', 'q11', 'q12'];
const TEXT_QUESTIONS = ['q7', 'q8', 'q13', 'q14', 'q15'];

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

function keywordSimilarity(text1, text2) {
  const words1 = extractKeywords(text1);
  const words2 = extractKeywords(text2);

  if (words1.length === 0 && words2.length === 0) return 0.5;
  if (words1.length === 0 || words2.length === 0) return 0;

  const common = words1.filter(w => words2.includes(w));
  const total = new Set([...words1, ...words2]).size;

  return common.length / total;
}

function calculateMatchScore(userA, userB) {
  let mcqMatches = 0;

  MCQ_QUESTIONS.forEach(function(q) {
    if (userA[q] && userB[q] && userA[q] === userB[q]) {
      mcqMatches++;
    }
  });

  const mcqScore = mcqMatches / MCQ_QUESTIONS.length;

  let textScoreTotal = 0;

  TEXT_QUESTIONS.forEach(function(q) {
    textScoreTotal += keywordSimilarity(userA[q], userB[q]);
  });

  const textScore = textScoreTotal / TEXT_QUESTIONS.length;
  const finalScore = (mcqScore * 0.70) + (textScore * 0.30);

  return Math.round(finalScore * 100);
}

function getCommonAnswers(userA, userB) {
  const common = [];

  MCQ_QUESTIONS.forEach(function(q) {
    if (userA[q] && userB[q] && userA[q] === userB[q]) {
      common.push(userA[q]);
    }
  });

  return common.slice(0, 4);
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

function renderMatchCard(matchUser, score, commonAnswers) {
  const initial = matchUser.name.charAt(0).toUpperCase();
  const scoreColor = getScoreColor(score);
  const isConnected = isAlreadyConnected(matchUser.uid);

  const tagsHTML = commonAnswers.length > 0
    ? commonAnswers.map(t => `<span class="match-tag">${capitalize(t)}</span>`).join('')
    : '<span style="color:var(--text3); font-size:0.8rem;">No common answers</span>';

  return `
    <div class="match-card" id="card-${matchUser.uid}">
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
          : `<button class="btn btn-primary" style="flex:1; justify-content:center;" onclick="connectUser('${matchUser.uid}')">Connect</button>`
        }
        <button class="btn btn-secondary" style="padding:0.6rem 1rem;" title="View details"
          onclick="viewDetails('${matchUser.uid}')">👤</button>
      </div>
    </div>
  `;
}

// ===================== CONNECT LOGIC =====================

function isAlreadyConnected(uid) {
  const connections = JSON.parse(localStorage.getItem('mm_connections') || '[]');
  return connections.some(c => c.uid === uid);
}

async function connectUser(uid) {
  const currentUser = JSON.parse(localStorage.getItem('mm_current_user') || 'null');

  if (!currentUser) {
    window.location.href = 'LoginPage.html';
    return;
  }

  const targetUser = allUsers.find(u => u.uid === uid);

  if (!targetUser || isAlreadyConnected(uid)) return;

  const connectionData = {
    fromUid: currentUser.uid,
    fromEmail: currentUser.email,
    fromName: currentUser.name,
    toUid: targetUser.uid,
    toEmail: targetUser.email,
    toName: targetUser.name,
    department: targetUser.department,
    year: targetUser.year,
    q3: targetUser.q3 || '',
    q9: targetUser.q9 || '',
    createdAt: new Date().toISOString()
  };

  try {
    await db.collection('connections').add(connectionData);

    const connections = JSON.parse(localStorage.getItem('mm_connections') || '[]');
    connections.push({
      uid: targetUser.uid,
      email: targetUser.email,
      name: targetUser.name,
      department: targetUser.department,
      year: targetUser.year,
      q3: targetUser.q3,
      q9: targetUser.q9
    });

    localStorage.setItem('mm_connections', JSON.stringify(connections));

    const card = document.getElementById('card-' + uid);

    if (card) {
      const actionsDiv = card.querySelector('.match-actions');
      actionsDiv.innerHTML = `
        <button class="btn btn-secondary" style="flex:1; justify-content:center;" disabled>✓ Connected</button>
        <button class="btn btn-secondary" style="padding:0.6rem 1rem;" onclick="viewDetails('${uid}')">👤</button>
      `;
    }

  } catch (error) {
    alert('Error connecting user: ' + error.message);
  }
}

function viewDetails(uid) {
  const u = allUsers.find(user => user.uid === uid);

  if (!u) return;

  alert(`📋 ${u.name}\n\nDept: ${u.department} | Year: ${u.year}\nGoal: ${capitalize(u.q3)}\nLooking for: ${capitalize(u.q9)}\nStudy time: ${capitalize(u.q5)}\nTech interest: ${capitalize(u.q2)}\nFun fact: ${u.q15 || 'Not shared'}`);
}

// ===================== FILTER & RENDER =====================

let allMatches = [];
let allUsers = [];

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
    return renderMatchCard(m.user, m.score, m.common);
  }).join('');
}

function applyFilters() {
  const yearFilter = document.getElementById('filterYear').value;
  const goalFilter = document.getElementById('filterGoal').value;

  const currentUser = JSON.parse(localStorage.getItem('mm_current_user'));
  const currentYear = parseInt(currentUser.year);

  const filtered = allMatches.filter(function(m) {
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

window.onload = async function () {
  const currentUser = JSON.parse(localStorage.getItem('mm_current_user') || 'null');

  if (!currentUser) {
    window.location.href = 'LoginPage.html';
    return;
  }

  try {
    const usersSnapshot = await db.collection('users').get();
    allUsers = usersSnapshot.docs.map(doc => doc.data());

    const connectionsSnapshot = await db
      .collection('connections')
      .where('fromUid', '==', currentUser.uid)
      .get();

    const myConnections = connectionsSnapshot.docs.map(doc => {
      const c = doc.data();
      return {
        uid: c.toUid,
        email: c.toEmail,
        name: c.toName,
        department: c.department,
        year: c.year,
        q3: c.q3,
        q9: c.q9
      };
    });

    localStorage.setItem('mm_connections', JSON.stringify(myConnections));

    allMatches = allUsers
      .filter(u => u.uid !== currentUser.uid)
      .map(function(u) {
        const score = calculateMatchScore(currentUser, u);
        const common = getCommonAnswers(currentUser, u);
        return { user: u, score: score, common: common };
      })
      .sort((a, b) => b.score - a.score);

    renderMatches(allMatches);

  } catch (error) {
    alert('Error loading matches: ' + error.message);
  }

  document.getElementById('filterBtn').addEventListener('click', applyFilters);

  document.getElementById('logoutBtn').addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('mm_current_user');
    localStorage.removeItem('mm_connections');
    window.location.href = 'index.html';
  });
};
