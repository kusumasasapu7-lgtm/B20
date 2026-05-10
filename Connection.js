
window.onload = function () {

  const currentUser = JSON.parse(localStorage.getItem('mm_current_user') || 'null');
  if (!currentUser) {
    window.location.href = 'LoginPage.html';
    return;
  }

  const connections = JSON.parse(localStorage.getItem('mm_connections') || '[]');
  const container = document.getElementById('connectionsList');
  const emptyState = document.getElementById('noConnections');

  if (connections.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  const yearLabels = { '1': '1st Year', '2': '2nd Year', '3': '3rd Year', '4': '4th Year' };

  container.innerHTML = connections.map(function(conn) {
    const initial = conn.name.charAt(0).toUpperCase();
    return `
      <div class="conn-card">
        <div class="match-avatar">${initial}</div>
        <div class="conn-info">
          <div class="conn-name">${conn.name}</div>
          <div class="conn-meta">
            ${conn.department} · ${yearLabels[conn.year] || conn.year}
            ${conn.q3 ? ' · Goal: ' + capitalize(conn.q3) : ''}
          </div>
          <div class="conn-meta" style="margin-top:2px;">${conn.email}</div>
        </div>
        <div style="display:flex; gap:0.75rem; flex-shrink:0;">
          <button class="btn btn-outline" style="padding:0.4rem 1rem; font-size:0.85rem;"
            onclick="copyEmail('${conn.email}')">📧 Email</button>
          <button class="btn btn-danger" style="padding:0.4rem 0.75rem; font-size:0.85rem;"
            onclick="removeConnection('${conn.email}', this)">✕</button>
        </div>
      </div>
    `;
  }).join('');

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

function copyEmail(email) {
  navigator.clipboard.writeText(email).then(function() {
    alert('📋 Email copied: ' + email);
  }).catch(function() {
    alert('Email: ' + email);
  });
}

function removeConnection(email, btn) {
  if (!confirm('Remove this connection?')) return;

  let connections = JSON.parse(localStorage.getItem('mm_connections') || '[]');
  connections = connections.filter(c => c.email !== email);
  localStorage.setItem('mm_connections', JSON.stringify(connections));

  // Remove the card from DOM
  const card = btn.closest('.conn-card');
  card.style.opacity = '0';
  card.style.transition = 'opacity 0.3s';
  setTimeout(function() {
    card.remove();
    if (connections.length === 0) {
      document.getElementById('noConnections').style.display = 'block';
    }
  }, 300);
}