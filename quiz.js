// quiz.js — Handle quiz form, save answers, create user

// Sample users pre-loaded so matching works from day one
const sampleUsers = [
  {
    email: "arjun@amrita.edu", name: "Arjun Menon", department: "CSE", year: "3", password: "sample",
    q1:"coding", q2:"ai ml", q3:"higher studies", q4:"research", q5:"night", q6:"alone",
    q7:"I watch lectures and solve problems on my own", q8:"4-5 hours",
    q9:"mentor", q10:"researcher", q11:"ai projects", q12:"discord",
    q13:"Someone who is passionate and self-driven", q14:"Deep Learning", q15:"I've read over 50 research papers"
  },
  {
    email: "priya@amrita.edu", name: "Priya Nair", department: "CSE", year: "2", password: "sample",
    q1:"design", q2:"web dev", q3:"placements", q4:"product company", q5:"afternoon", q6:"group",
    q7:"I prefer group study with discussions", q8:"3 hours",
    q9:"project partner", q10:"designer", q11:"web apps", q12:"whatsapp",
    q13:"Creative person who values aesthetics", q14:"Figma and UI/UX", q15:"I designed my school's entire yearbook"
  },
  {
    email: "rahul@amrita.edu", name: "Rahul Krishnan", department: "ECE", year: "4", password: "sample",
    q1:"coding", q2:"iot", q3:"startup", q4:"own business", q5:"early morning", q6:"one friend",
    q7:"I code projects and learn by building", q8:"3-4 hours",
    q9:"project partner", q10:"leader", q11:"hardware", q12:"in person",
    q13:"Someone with a can-do attitude and hustle mindset", q14:"Embedded Systems", q15:"I built a home automation system at age 17"
  },
  {
    email: "sneha@amrita.edu", name: "Sneha Pillai", department: "CSE", year: "1", password: "sample",
    q1:"reading", q2:"data science", q3:"higher studies", q4:"research", q5:"night", q6:"alone",
    q7:"I read textbooks and take detailed notes", q8:"2 hours",
    q9:"study buddy", q10:"researcher", q11:"research papers", q12:"email",
    q13:"Someone methodical who loves learning theory", q14:"Statistics and R", q15:"I've won 3 state-level quiz competitions"
  },
  {
    email: "kiran@amrita.edu", name: "Kiran Varma", department: "CSE", year: "3", password: "sample",
    q1:"coding", q2:"web dev", q3:"placements", q4:"product company", q5:"night", q6:"group",
    q7:"I work on real projects and practice DSA daily", q8:"4 hours",
    q9:"study buddy", q10:"developer", q11:"web apps", q12:"discord",
    q13:"Someone consistent with coding and loves problem solving", q14:"System Design", q15:"I can type 120 words per minute"
  },
  {
    email: "divya@amrita.edu", name: "Divya Suresh", department: "IT", year: "2", password: "sample",
    q1:"music", q2:"app dev", q3:"placements", q4:"product company", q5:"afternoon", q6:"one friend",
    q7:"I mix YouTube tutorials with hands-on practice", q8:"2-3 hours",
    q9:"friend", q10:"developer", q11:"mobile apps", q12:"whatsapp",
    q13:"Chill but dedicated person", q14:"Flutter", q15:"I play guitar in a college band"
  },
  {
    email: "arun@amrita.edu", name: "Arun Bose", department: "EEE", year: "4", password: "sample",
    q1:"sports", q2:"cybersecurity", q3:"government exams", q4:"civil services", q5:"early morning", q6:"alone",
    q7:"I make short notes and revise every day", q8:"5 hours",
    q9:"mentor", q10:"leader", q11:"research papers", q12:"in person",
    q13:"Disciplined and goal-oriented", q14:"Cybersecurity fundamentals", q15:"I wake up at 5am every single day"
  },
  {
    email: "meena@amrita.edu", name: "Meena Raj", department: "CSE", year: "1", password: "sample",
    q1:"photography", q2:"web dev", q3:"startup", q4:"own business", q5:"afternoon", q6:"group",
    q7:"I like project-based learning with teammates", q8:"2 hours",
    q9:"all", q10:"designer", q11:"web apps", q12:"whatsapp",
    q13:"Creative and fun to work with", q14:"React and Photography editing", q15:"My photos have been featured in 2 magazines"
  }
];

// Check if sample users are loaded
function loadSampleUsers() {
  const allUsers = JSON.parse(localStorage.getItem('mm_all_users') || '[]');
  if (allUsers.length === 0) {
    localStorage.setItem('mm_all_users', JSON.stringify(sampleUsers));
  }
}

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
document.getElementById('quizForm').addEventListener('submit', function(e) {
  e.preventDefault();

  loadSampleUsers();

  const errorMsg = document.getElementById('errorMsg');

  // Get pending registration info
  const basicInfo = JSON.parse(localStorage.getItem('mm_pending_register') || 'null');
  if (!basicInfo) {
    errorMsg.textContent = 'Session expired. Please register again.';
    errorMsg.style.display = 'block';
    setTimeout(() => { window.location.href = 'ResgisterPage.html'; }, 2000);
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

  // Add to all users list
  const allUsers = JSON.parse(localStorage.getItem('mm_all_users') || '[]');
  allUsers.push(newUser);
  localStorage.setItem('mm_all_users', JSON.stringify(allUsers));

  // Set as current logged-in user
  localStorage.setItem('mm_current_user', JSON.stringify(newUser));

  // Clean up pending registration
  localStorage.removeItem('mm_pending_register');

  // Redirect to dashboard
  window.location.href = 'Dashboard.html';
});

// Initial progress
updateProgress();