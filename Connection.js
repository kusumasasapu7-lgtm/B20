window.onload = async function () {

  const currentUser = JSON.parse(localStorage.getItem('mm_current_user') || 'null');
  if (!currentUser) {
    window.location.href = 'LoginPage.html';
    return;
  }

  const container = document.getElementById('connectionsList');
  const emptyState = document.getElementById('noConnections');

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('mm_current_user');
    localStorage.removeItem('mm_connections');
    window.location.href = 'index.html';
  });

  try {
    const snapshot = await db
      .collection('connections')
      .where('fromUid', '==', currentUser.uid)
      .get();

    const connections = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (connections.length === 0) {
      emptyState.style.display = 'block';
      return;
    }

    const yearLabels = {
      '1': '1st Year',
      '2': '2nd Year',
      '3': '3rd Year',
      '4': '4th Year'
    };

    container.innerHTML = connections.map(function(conn) {
      const initial = conn.toName.charAt(0).toUpperCase();

      return `
        <div class="conn-card">
          <div class="match-avatar">${initial}</div>
          <div class="conn-info">
            <div class="conn-name">${conn.toName}</div>
            <div class="conn-meta">
              ${conn.department} · ${yearLabels[conn.year] || conn.year}
              ${conn.q3 ? ' · Goal: ' + capitalize(conn.q3) : ''}
            </div>
            <div class="conn-meta" style="margin-top:2px;">${conn.toEmail}</div>
          </div>
          <div style="display:flex; gap:0.75rem; flex-shrink:0;">
            <button class="btn btn-outline" style="padding:0.4rem 1rem; font-size:0.85rem;"
              onclick="copyEmail('${conn.toEmail}')">📧 Email</button>
            <button class="btn btn-danger" style="padding:0.4rem 0.75rem; font-size:0.85rem;"
              onclick="removeConnection('${conn.id}', this)">✕</button>
          </div>
        </div>
      `;
    }).join('');

  } catch (error) {
    emptyState.style.display = 'block';
    emptyState.innerHTML = `
      <h3>Error loading connections</h3>
      <p>${error.message}</p>
    `;
  }
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

async function removeConnection(connectionId, btn) {
  if (!confirm('Remove this connection?')) return;

  try {
    await db.collection('connections').doc(connectionId).delete();

    const card = btn.closest('.conn-card');
    card.style.opacity = '0';
    card.style.transition = 'opacity 0.3s';

    setTimeout(function() {
      card.remove();

      if (document.querySelectorAll('.conn-card').length === 0) {
        document.getElementById('noConnections').style.display = 'block';
      }
    }, 300);

  } catch (error) {
    alert('Error removing connection: ' + error.message);
  }
}
