
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const message = document.getElementById('contactMessage').value.trim();
  const successMsg = document.getElementById('successMsg');
  const errorMsg = document.getElementById('errorMsg');

  errorMsg.style.display = 'none';
  successMsg.style.display = 'none';

  if (!name || !email || !message) {
    errorMsg.textContent = 'Please fill in all fields.';
    errorMsg.style.display = 'block';
    return;
  }

  // Simulate sending (save to localStorage as messages log)
  const messages = JSON.parse(localStorage.getItem('mm_messages') || '[]');
  messages.push({
    name, email, message,
    subject: document.getElementById('contactSubject').value,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('mm_messages', JSON.stringify(messages));

  // Show success and reset form
  successMsg.style.display = 'block';
  document.getElementById('contactForm').reset();

  // Hide success after 4 seconds
  setTimeout(function() {
    successMsg.style.display = 'none';
  }, 4000);
});