import dbSimulator from './database.js';

// Application State
let currentUser = null;
let currentView = 'dashboard';
let hoursChart = null;

// DOM Elements - Auth
const authOverlay = document.getElementById('authOverlay');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const loginView = document.getElementById('loginView');
const registerView = document.getElementById('registerView');

// Navigation Shell
const navItems = document.querySelectorAll('.nav-item');
const viewPanels = document.querySelectorAll('.view-panel');
const logoutBtn = document.getElementById('logoutBtn');
const welcomeTitle = document.getElementById('welcomeTitle');

// Dashboard Elements
const statLearningHours = document.getElementById('statLearningHours');
const statTeachingHours = document.getElementById('statTeachingHours');
const statAvgRating = document.getElementById('statAvgRating');
const dashActiveExchanges = document.getElementById('dashActiveExchanges');
const dashExchangeRequests = document.getElementById('dashExchangeRequests');
const dashUpcomingSessions = document.getElementById('dashUpcomingSessions');
const dashRecommendedPeers = document.getElementById('dashRecommendedPeers');
const goalDisplay = document.getElementById('goalDisplay');
const goalForm = document.getElementById('goalForm');
const newGoalInput = document.getElementById('newGoalInput');
const dashRequestBtn = document.getElementById('dashRequestBtn');
const dashBookBtn = document.getElementById('dashBookBtn');

// Skill Exchange Elements
const exchangeRequestsList = document.getElementById('exchangeRequestsList');
const exchangePeersList = document.getElementById('exchangePeersList');
const openExchangeModalBtn = document.getElementById('openExchangeModalBtn');
const exchangeModal = document.getElementById('exchangeModal');
const closeExchangeModal = document.getElementById('closeExchangeModal');
const cancelExchangeBtn = document.getElementById('cancelExchangeBtn');
const exchangeForm = document.getElementById('exchangeForm');
const exchangeProvider = document.getElementById('exchangeProvider');
const exchangeRequestedSkill = document.getElementById('exchangeRequestedSkill');
const exchangeOfferedSkill = document.getElementById('exchangeOfferedSkill');

// Progress Elements
const progressSkillList = document.getElementById('progressSkillList');

// Sessions Elements
const scheduleSessionList = document.getElementById('scheduleSessionList');
const scheduleBookBtn = document.getElementById('scheduleBookBtn');

// Booking Modal
const bookModal = document.getElementById('bookModal');
const closeBookModal = document.getElementById('closeBookModal');
const cancelBookBtn = document.getElementById('cancelBookBtn');
const bookForm = document.getElementById('bookForm');
const bookPeer = document.getElementById('bookPeer');
const bookSkill = document.getElementById('bookSkill');
const bookDate = document.getElementById('bookDate');

// Feedback Modal
const feedbackModal = document.getElementById('feedbackModal');
const closeFeedbackModal = document.getElementById('closeFeedbackModal');
const cancelFeedbackBtn = document.getElementById('cancelFeedbackBtn');
const feedbackForm = document.getElementById('feedbackForm');
const feedbackSessionId = document.getElementById('feedbackSessionId');
const feedbackRating = document.getElementById('feedbackRating');
const feedbackComments = document.getElementById('feedbackComments');

// Settings Elements
const settingsProfileForm = document.getElementById('settingsProfileForm');
const settingsName = document.getElementById('settingsName');
const settingsEmail = document.getElementById('settingsEmail');
const settingsRole = document.getElementById('settingsRole');
const settingsSkillList = document.getElementById('settingsSkillList');
const addSkillBtn = document.getElementById('addSkillBtn');
const skillModal = document.getElementById('skillModal');
const closeSkillModal = document.getElementById('closeSkillModal');
const cancelSkillBtn = document.getElementById('cancelSkillBtn');
const skillForm = document.getElementById('skillForm');

// Database Visualizer Elements
const sqlLogFeed = document.getElementById('sqlLogFeed');
const clearLogsBtn = document.getElementById('clearLogsBtn');
const resetDbBtn = document.getElementById('resetDbBtn');
const dbUsersTable = document.getElementById('dbUsersTable').querySelector('tbody');
const dbSkillsTable = document.getElementById('dbSkillsTable').querySelector('tbody');
const dbExchangesTable = document.getElementById('dbExchangesTable').querySelector('tbody');
const dbSessionsTable = document.getElementById('dbSessionsTable').querySelector('tbody');
const dbProgressTable = document.getElementById('dbProgressTable').querySelector('tbody');
const dbFeedbackTable = document.getElementById('dbFeedbackTable').querySelector('tbody');


// --- AUTHENTICATION FLOW ---

function checkAuth() {
  const cachedUser = localStorage.getItem('skillbridge_active_user');
  if (cachedUser) {
    currentUser = JSON.parse(cachedUser);
    authOverlay.classList.add('hidden');
    initApp();
  } else {
    authOverlay.classList.remove('hidden');
  }
}

tabLogin.addEventListener('click', () => {
  tabLogin.classList.add('active');
  tabRegister.classList.remove('active');
  loginView.classList.add('active');
  registerView.classList.remove('active');
});

tabRegister.addEventListener('click', () => {
  tabRegister.classList.add('active');
  tabLogin.classList.remove('active');
  registerView.classList.add('active');
  loginView.classList.remove('active');
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;

  try {
    const user = dbSimulator.loginUser(email, pass);
    if (user) {
      currentUser = user;
      localStorage.setItem('skillbridge_active_user', JSON.stringify(currentUser));
      authOverlay.classList.add('hidden');
      initApp();
      loginForm.reset();
    } else {
      alert("Invalid credentials. Try kani@gmail.com or sharmila@gmail.com (pass: password123)");
    }
  } catch (err) {
    alert(err.message);
  }
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const role = document.getElementById('regRole').value;
  const pass = document.getElementById('regPassword').value;
  const teachSkills = document.getElementById('regTeach').value.split(',').map(s => s.trim());
  const learnSkills = document.getElementById('regLearn').value.split(',').map(s => s.trim());

  try {
    const newUser = dbSimulator.registerUser(name, email, pass, teachSkills, learnSkills);
    newUser.Role = role;
    dbSimulator.updateUserProfile(newUser.User_ID, name, email, role);
    currentUser = newUser;
    localStorage.setItem('skillbridge_active_user', JSON.stringify(currentUser));
    authOverlay.classList.add('hidden');
    initApp();
    registerForm.reset();
  } catch (err) {
    alert(err.message);
  }
});

logoutBtn.addEventListener('click', () => {
  dbSimulator.logSQL('/* User Logged Out */');
  localStorage.removeItem('skillbridge_active_user');
  currentUser = null;
  authOverlay.classList.remove('hidden');
});


// --- ROUTING / VIEW NAVIGATION ---

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const targetView = item.getAttribute('data-view');
    switchView(targetView);
  });
});

function switchView(viewName) {
  currentView = viewName;
  
  navItems.forEach(item => {
    if (item.getAttribute('data-view') === viewName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  viewPanels.forEach(panel => {
    if (panel.id === `view-${viewName}`) {
      panel.classList.remove('hidden');
    } else {
      panel.classList.add('hidden');
    }
  });

  populateViewData(viewName);
}


// --- CORE APPLICATION INITIALIZATION ---

function initApp() {
  // Sync profile details from database
  const freshUser = dbSimulator.getTableData('users').find(u => u.User_ID === currentUser.User_ID);
  if (freshUser) currentUser = freshUser;

  document.getElementById('navAvatar').innerText = currentUser.Name.charAt(0);
  document.getElementById('navName').innerText = currentUser.Name;
  document.getElementById('navRole').innerText = currentUser.Role || 'Student';
  welcomeTitle.innerText = `Welcome, ${currentUser.Name} (${currentUser.Role})`;
  
  const today = new Date().toISOString().split('T')[0];
  bookDate.min = today;
  bookDate.value = today;

  switchView('dashboard');
  updateSqlLogs();
  updateVisualizerTables();
}

function populateViewData(viewName) {
  updateSqlLogs();
  updateVisualizerTables();

  const stats = dbSimulator.getUserStats(currentUser.User_ID);
  const allExchanges = dbSimulator.getTableData('exchanges');
  const userExchanges = allExchanges.filter(e => e.Requester_ID === currentUser.User_ID || e.Provider_ID === currentUser.User_ID);

  // 1. DASHBOARD VIEW
  if (viewName === 'dashboard') {
    dashActiveExchanges.innerText = userExchanges.length;
    statLearningHours.innerText = `${stats.learningHours.toFixed(1)}h`;
    statTeachingHours.innerText = `${stats.teachingHours.toFixed(1)}h`;
    statAvgRating.innerText = stats.avgRating;
    goalDisplay.innerText = stats.goal;

    // Recent Exchange Requests
    dashExchangeRequests.innerHTML = '';
    if (userExchanges.length === 0) {
      dashExchangeRequests.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">No active exchange requests.</p>';
    } else {
      userExchanges.slice(0, 3).forEach(ex => {
        const otherId = ex.Requester_ID === currentUser.User_ID ? ex.Provider_ID : ex.Requester_ID;
        const partner = dbSimulator.getTableData('users').find(u => u.User_ID === otherId);
        const direction = ex.Requester_ID === currentUser.User_ID ? `Requested ${ex.Requested_Skill} from ${partner ? partner.Name : 'Mentor'}` : `${partner ? partner.Name : 'Student'} requested ${ex.Requested_Skill}`;
        
        const card = document.createElement('div');
        card.className = 'session-item';
        card.innerHTML = `
          <div class="session-info">
            <h4 style="font-size: 0.95rem;">Skill: ${ex.Requested_Skill} <span style="font-size:0.75rem; color: var(--text-muted);">(Offer: ${ex.Offered_Skill})</span></h4>
            <p style="font-size: 0.8rem;">${direction} | ${ex.Date}</p>
          </div>
          <span class="session-status ${ex.Status === 'Accepted' ? 'status-completed' : 'status-scheduled'}">${ex.Status}</span>
        `;
        dashExchangeRequests.appendChild(card);
      });
    }

    // Upcoming Sessions
    const allSessions = dbSimulator.getTableData('sessions');
    const upcoming = allSessions.filter(s => 
      (s.User_ID === currentUser.User_ID || s.Partner_ID === currentUser.User_ID) && 
      s.Status === 'scheduled'
    );
    
    dashUpcomingSessions.innerHTML = '';
    if (upcoming.length === 0) {
      dashUpcomingSessions.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">No upcoming sessions scheduled.</p>';
    } else {
      upcoming.slice(0, 3).forEach(s => {
        const partnerId = s.User_ID === currentUser.User_ID ? s.Partner_ID : s.User_ID;
        const partner = dbSimulator.getTableData('users').find(u => u.User_ID === partnerId);
        const roleStr = s.User_ID === currentUser.User_ID ? 'Learning from' : 'Teaching';
        
        const card = document.createElement('div');
        card.className = 'session-item';
        card.innerHTML = `
          <div class="session-info">
            <h4 style="font-size: 0.95rem;">${s.Skill_Name}</h4>
            <p style="font-size: 0.8rem;">${roleStr} ${partner ? partner.Name : 'Peer'} | <i class="lucide-calendar"></i> ${s.Date}</p>
          </div>
          <span class="session-status status-scheduled">${s.Duration} hrs</span>
        `;
        dashUpcomingSessions.appendChild(card);
      });
    }

    // Recommended Peers
    const matches = dbSimulator.getMatches(currentUser.User_ID);
    dashRecommendedPeers.innerHTML = '';
    if (matches.length === 0) {
      dashRecommendedPeers.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">No peer matches found. Add skills in settings to find peers!</p>';
    } else {
      matches.slice(0, 3).forEach(m => {
        const div = document.createElement('div');
        div.className = 'match-item';
        div.innerHTML = `
          <div class="match-avatar-info">
            <div class="profile-avatar" style="width: 36px; height: 36px; font-size: 0.85rem;">${m.user.Name.charAt(0)}</div>
            <div>
              <h4 style="font-size: 0.9rem; font-weight:600;">${m.user.Name} <span class="tag tag-teach" style="font-size: 0.65rem;">${m.user.Role}</span></h4>
              <p style="font-size: 0.75rem; color: var(--text-secondary);">${m.matchType}</p>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary quick-exchange-btn" data-peer-id="${m.user.User_ID}" style="padding: 0.35rem 0.6rem; font-size: 0.75rem;">
              Request Exchange
            </button>
          </div>
        `;
        dashRecommendedPeers.appendChild(div);
      });

      document.querySelectorAll('.quick-exchange-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const peerId = parseInt(btn.getAttribute('data-peer-id'));
          openExchangeModalWithPeer(peerId);
        });
      });
    }

  // 2. SKILL EXCHANGE VIEW
  } else if (viewName === 'exchange') {
    exchangeRequestsList.innerHTML = '';
    if (userExchanges.length === 0) {
      exchangeRequestsList.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 1.5rem;">No exchange requests found. Click "New Exchange Request" to begin!</p>';
    } else {
      userExchanges.forEach(ex => {
        const isRequester = ex.Requester_ID === currentUser.User_ID;
        const otherId = isRequester ? ex.Provider_ID : ex.Requester_ID;
        const partner = dbSimulator.getTableData('users').find(u => u.User_ID === otherId);

        const card = document.createElement('div');
        card.className = 'match-item';
        
        let actionBtnHtml = '';
        if (!isRequester && ex.Status === 'Pending') {
          actionBtnHtml = `
            <div style="display:flex; gap: 0.5rem;">
              <button class="btn btn-primary accept-ex-btn" data-ex-id="${ex.Exchange_ID}" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">Accept</button>
              <button class="btn btn-secondary reject-ex-btn" data-ex-id="${ex.Exchange_ID}" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; color: var(--danger);">Reject</button>
            </div>`;
        } else {
          actionBtnHtml = `<span class="session-status ${ex.Status === 'Accepted' ? 'status-completed' : 'status-scheduled'}">${ex.Status}</span>`;
        }

        card.innerHTML = `
          <div class="match-avatar-info">
            <div class="profile-avatar">${partner ? partner.Name.charAt(0) : 'P'}</div>
            <div>
              <h4 style="font-weight: 700;">${partner ? partner.Name : 'Partner'} <span class="tag tag-teach">${partner ? partner.Role : 'Peer'}</span></h4>
              <p style="font-size: 0.85rem; color: var(--text-primary); margin-top: 0.25rem;">
                <strong>Requested Skill:</strong> ${ex.Requested_Skill} | <strong>Offered Skill:</strong> ${ex.Offered_Skill}
              </p>
              <p style="font-size: 0.75rem; color: var(--text-secondary);">${isRequester ? 'Sent by you' : 'Sent to you'} on ${ex.Date}</p>
            </div>
          </div>
          <div>
            ${actionBtnHtml}
          </div>
        `;
        exchangeRequestsList.appendChild(card);
      });

      document.querySelectorAll('.accept-ex-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const exId = parseInt(btn.getAttribute('data-ex-id'));
          dbSimulator.updateExchangeStatus(exId, 'Accepted');
          populateViewData('exchange');
        });
      });

      document.querySelectorAll('.reject-ex-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const exId = parseInt(btn.getAttribute('data-ex-id'));
          dbSimulator.updateExchangeStatus(exId, 'Rejected');
          populateViewData('exchange');
        });
      });
    }

    // Render Campus Peers List
    const matches = dbSimulator.getMatches(currentUser.User_ID);
    exchangePeersList.innerHTML = '';

    if (matches.length === 0) {
      exchangePeersList.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
          <i class="lucide-users" style="font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.5;"></i>
          <p>No compatible peer profiles found matching your current skill interests.</p>
        </div>`;
    } else {
      matches.forEach(m => {
        const item = document.createElement('div');
        item.className = 'match-item';
        item.innerHTML = `
          <div class="match-avatar-info">
            <div class="profile-avatar">${m.user.Name.charAt(0)}</div>
            <div>
              <h4 style="font-weight: 700;">${m.user.Name} <span class="tag tag-teach">${m.user.Role}</span></h4>
              <p style="font-size: 0.8rem; color: var(--primary); font-weight:600;">${m.matchType}</p>
              <div class="match-skills-tag">
                <span style="font-size: 0.75rem; color: var(--text-muted); align-self: center;">Teaches:</span>
                ${m.teaches.map(s => `<span class="tag tag-teach">${s}</span>`).join('')}
              </div>
              <div class="match-skills-tag">
                <span style="font-size: 0.75rem; color: var(--text-muted); align-self: center;">Learns:</span>
                ${m.learns.map(s => `<span class="tag tag-learn">${s}</span>`).join('')}
              </div>
            </div>
          </div>
          <button class="btn btn-primary request-exchange-peer-btn" data-peer-id="${m.user.User_ID}">
            <i class="lucide-arrow-left-right"></i> Request Exchange
          </button>
        `;
        exchangePeersList.appendChild(item);
      });

      document.querySelectorAll('.request-exchange-peer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const peerId = parseInt(btn.getAttribute('data-peer-id'));
          openExchangeModalWithPeer(peerId);
        });
      });
    }

  // 3. PROGRESS VIEW
  } else if (viewName === 'progress') {
    const allProgress = dbSimulator.getTableData('progress');
    const userProgress = allProgress.filter(p => p.User_ID === currentUser.User_ID);
    const userSkills = dbSimulator.getTableData('skills').filter(s => s.User_ID === currentUser.User_ID);

    progressSkillList.innerHTML = '';
    
    // Default list of skills to track
    const trackingSkills = [
      { name: 'Java', level: 'Intermediate', category: 'Programming', hrs: 8.0, target: 12.0 },
      { name: 'Python', level: 'Beginner', category: 'Programming', hrs: 4.5, target: 10.0 },
      { name: 'Web Development', level: 'Intermediate', category: 'Development', hrs: 6.0, target: 15.0 },
      { name: 'Data Structures', level: 'Advanced', category: 'Computer Science', hrs: 10.0, target: 15.0 }
    ];

    trackingSkills.forEach(sk => {
      const pRecord = userProgress.find(p => p.Skill_Name === sk.name);
      const hrsDone = pRecord ? pRecord.Hours_Completed : sk.hrs;
      const targetHrs = pRecord ? (pRecord.Target_Hours || sk.target) : sk.target;
      const pct = Math.min(100, Math.round((hrsDone / targetHrs) * 100));

      const card = document.createElement('div');
      card.className = 'match-item';
      card.style.flexDirection = 'column';
      card.style.alignItems = 'stretch';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
          <div>
            <h4 style="font-size: 1.1rem; font-weight:700;">${sk.name}</h4>
            <span class="tag tag-teach" style="font-size: 0.75rem;">${sk.level}</span>
            <span class="tag tag-learn" style="font-size: 0.75rem;">${sk.category}</span>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 1rem; font-weight:700; color: var(--primary);">${pct}% Mastery</span>
            <p style="font-size: 0.8rem; color: var(--text-secondary);">${hrsDone} / ${targetHrs} Hours Completed</p>
          </div>
        </div>
        <div style="width: 100%; height: 10px; background: rgba(255,255,255,0.08); border-radius: 5px; overflow: hidden; margin-top: 0.25rem;">
          <div style="width: ${pct}%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); border-radius: 5px; transition: width 0.5s ease;"></div>
        </div>
      `;
      progressSkillList.appendChild(card);
    });

  // 4. SESSIONS VIEW
  } else if (viewName === 'sessions') {
    const allSessions = dbSimulator.getTableData('sessions');
    const userSessions = allSessions.filter(s => s.User_ID === currentUser.User_ID || s.Partner_ID === currentUser.User_ID);
    
    scheduleSessionList.innerHTML = '';
    if (userSessions.length === 0) {
      scheduleSessionList.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
          <i class="lucide-calendar-x" style="font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.5;"></i>
          <p>No booked sessions yet. Use the Skill Exchange page to schedule meetings.</p>
        </div>`;
    } else {
      userSessions.slice().reverse().forEach(s => {
        const partnerId = s.User_ID === currentUser.User_ID ? s.Partner_ID : s.User_ID;
        const partner = dbSimulator.getTableData('users').find(u => u.User_ID === partnerId);
        const isLearner = s.User_ID === currentUser.User_ID;

        const sessionCard = document.createElement('div');
        sessionCard.className = 'session-item';
        
        let actionButtonHtml = '';
        if (s.Status === 'scheduled') {
          if (isLearner) {
            actionButtonHtml = `
              <button class="btn btn-primary complete-session-btn" data-session-id="${s.Session_ID}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">
                <i class="lucide-check-circle"></i> Complete & Rate
              </button>`;
          } else {
            actionButtonHtml = `<span style="font-size:0.8rem; color: var(--accent);"><i class="lucide-clock"></i> Upcoming (Tutor Mode)</span>`;
          }
        } else {
          actionButtonHtml = `<span class="session-status status-completed"><i class="lucide-check"></i> Finished</span>`;
        }

        sessionCard.innerHTML = `
          <div class="session-info">
            <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">${s.Skill_Name}</h4>
            <p style="margin-top: 0.25rem;">
              <strong>${isLearner ? 'Tutor/Mentor' : 'Learner'}:</strong> ${partner ? partner.Name : 'Peer'} | 
              <strong>Duration:</strong> ${s.Duration} hrs | 
              <strong>Date:</strong> ${s.Date}
            </p>
          </div>
          <div>
            ${actionButtonHtml}
          </div>
        `;
        scheduleSessionList.appendChild(sessionCard);
      });

      document.querySelectorAll('.complete-session-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const sId = parseInt(btn.getAttribute('data-session-id'));
          openFeedbackModal(sId);
        });
      });
    }

  // 5. REPORTS VIEW
  } else if (viewName === 'reports') {
    const allFeedback = dbSimulator.getTableData('feedback');
    const userSessions = dbSimulator.getTableData('sessions').filter(s => s.Partner_ID === currentUser.User_ID).map(s => s.Session_ID);
    const feedbackReceived = allFeedback.filter(f => userSessions.includes(f.Session_ID));

    const feedbackList = document.getElementById('feedbackList');
    feedbackList.innerHTML = '';
    if (feedbackReceived.length === 0) {
      feedbackList.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 2rem;">No feedback reviews received yet.</p>';
    } else {
      feedbackReceived.slice().reverse().forEach(f => {
        const student = dbSimulator.getTableData('users').find(u => u.User_ID === f.User_ID);
        const stars = '⭐'.repeat(Math.round(f.Rating));
        const item = document.createElement('div');
        item.className = 'match-item';
        item.style.flexDirection = 'column';
        item.style.alignItems = 'flex-start';
        item.innerHTML = `
          <div style="display:flex; justify-content:space-between; width:100%; margin-bottom: 0.5rem;">
            <strong style="font-size: 0.9rem;">${student ? student.Name : 'Peer student'}</strong>
            <span style="font-size: 0.8rem;">${stars} (${f.Rating})</span>
          </div>
          <p style="font-style: italic; font-size: 0.85rem; color: var(--text-secondary);">"${f.Comments}"</p>
        `;
        feedbackList.appendChild(item);
      });
    }

    setTimeout(() => {
      renderHoursChart(stats.learningHours, stats.teachingHours);
    }, 100);

  // 6. SETTINGS VIEW
  } else if (viewName === 'settings') {
    settingsName.value = currentUser.Name;
    settingsEmail.value = currentUser.Email;
    settingsRole.value = currentUser.Role || 'Student';

    const userSkills = dbSimulator.getTableData('skills').filter(s => s.User_ID === currentUser.User_ID);
    settingsSkillList.innerHTML = '';

    if (userSkills.length === 0) {
      settingsSkillList.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem;">No skills added yet.</p>';
    } else {
      userSkills.forEach(s => {
        const card = document.createElement('div');
        card.className = 'session-item';
        card.innerHTML = `
          <div class="session-info">
            <h4 style="font-size: 0.95rem;">${s.Skill_Name}</h4>
            <p style="font-size: 0.8rem; color: var(--text-secondary);">Level: ${s.Level || 'Intermediate'} | Category: ${s.Category || 'Programming'}</p>
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <span class="tag ${s.Skill_Type === 'teach' ? 'tag-teach' : 'tag-learn'}">${s.Skill_Type === 'teach' ? 'Taught' : 'Learning'}</span>
            <button class="btn btn-secondary delete-skill-btn" data-skill-id="${s.Skill_ID}" style="padding:0.25rem 0.5rem; font-size:0.75rem; color: var(--danger);">&times;</button>
          </div>
        `;
        settingsSkillList.appendChild(card);
      });

      document.querySelectorAll('.delete-skill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const sId = parseInt(btn.getAttribute('data-skill-id'));
          dbSimulator.deleteSkill(sId);
          populateViewData('settings');
        });
      });
    }
  }
}

// Goal submission
goalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const goalText = newGoalInput.value.trim();
  if (goalText) {
    dbSimulator.updateGoal(currentUser.User_ID, goalText);
    goalDisplay.innerText = goalText;
    newGoalInput.value = '';
    populateViewData('dashboard');
  }
});

// Settings Profile submission
settingsProfileForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = settingsName.value.trim();
  const email = settingsEmail.value.trim();
  const role = settingsRole.value;

  const updated = dbSimulator.updateUserProfile(currentUser.User_ID, name, email, role);
  currentUser = updated;
  localStorage.setItem('skillbridge_active_user', JSON.stringify(currentUser));
  alert("Profile updated successfully!");
  initApp();
});


// --- CHART.JS VISUAL ENGINE ---

function renderHoursChart(learnHrs, teachHrs) {
  const chartEl = document.getElementById('hoursChart');
  if (!chartEl) return;
  const ctx = chartEl.getContext('2d');
  
  if (hoursChart) {
    hoursChart.destroy();
  }

  hoursChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Learning Hours', 'Teaching / Mentoring Hours'],
      datasets: [{
        label: 'Hours Completed',
        data: [learnHrs, teachHrs],
        backgroundColor: [
          'rgba(6, 182, 212, 0.45)', // Cyan
          'rgba(16, 185, 129, 0.45)'  // Green
        ],
        borderColor: [
          '#06b6d4',
          '#10b981'
        ],
        borderWidth: 2,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#9ca3af' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#9ca3af' }
        }
      }
    }
  });
}


// --- MODAL ENGINE (SKILL EXCHANGE) ---

dashRequestBtn.addEventListener('click', () => openExchangeModalWithPeer());
openExchangeModalBtn.addEventListener('click', () => openExchangeModalWithPeer());

function openExchangeModalWithPeer(preselectedPeerId = null) {
  exchangeProvider.innerHTML = '';
  const matches = dbSimulator.getMatches(currentUser.User_ID);

  if (matches.length === 0) {
    alert("No matching peers found. Add skills in Settings to match with campus peers.");
    return;
  }

  matches.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.user.User_ID;
    opt.innerText = `${m.user.Name} (${m.user.Role}) - ${m.matchType}`;
    if (preselectedPeerId && m.user.User_ID === preselectedPeerId) {
      opt.selected = true;
    }
    exchangeProvider.appendChild(opt);
  });

  updateExchangeSkillOptions();
  exchangeModal.style.display = 'flex';
}

function updateExchangeSkillOptions() {
  exchangeRequestedSkill.innerHTML = '';
  exchangeOfferedSkill.innerHTML = '';

  const selectedPeerId = parseInt(exchangeProvider.value);
  const peerSkills = dbSimulator.getTableData('skills').filter(s => s.User_ID === selectedPeerId && s.Skill_Type === 'teach');
  const userSkills = dbSimulator.getTableData('skills').filter(s => s.User_ID === currentUser.User_ID && s.Skill_Type === 'teach');

  if (peerSkills.length > 0) {
    peerSkills.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.Skill_Name;
      opt.innerText = s.Skill_Name;
      exchangeRequestedSkill.appendChild(opt);
    });
  } else {
    const opt = document.createElement('option');
    opt.value = 'Python';
    opt.innerText = 'Python';
    exchangeRequestedSkill.appendChild(opt);
  }

  if (userSkills.length > 0) {
    userSkills.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.Skill_Name;
      opt.innerText = s.Skill_Name;
      exchangeOfferedSkill.appendChild(opt);
    });
  } else {
    const opt = document.createElement('option');
    opt.value = 'Java';
    opt.innerText = 'Java';
    exchangeOfferedSkill.appendChild(opt);
  }
}

exchangeProvider.addEventListener('change', updateExchangeSkillOptions);

function closeExchange() {
  exchangeModal.style.display = 'none';
  exchangeForm.reset();
}
closeExchangeModal.addEventListener('click', closeExchange);
cancelExchangeBtn.addEventListener('click', closeExchange);

exchangeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const providerId = parseInt(exchangeProvider.value);
  const reqSkill = exchangeRequestedSkill.value;
  const offSkill = exchangeOfferedSkill.value;

  dbSimulator.createExchangeRequest(currentUser.User_ID, providerId, reqSkill, offSkill);
  closeExchange();
  switchView('exchange');
});


// --- MODAL ENGINE (BOOKINGS) ---

dashBookBtn.addEventListener('click', () => openBookModalWithPeer());
scheduleBookBtn.addEventListener('click', () => openBookModalWithPeer());

function openBookModalWithPeer(preselectedPeerId = null) {
  bookPeer.innerHTML = '';
  const matches = dbSimulator.getMatches(currentUser.User_ID);

  if (matches.length === 0) {
    alert("You don't have matching peer profiles yet.");
    return;
  }

  matches.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.user.User_ID;
    opt.innerText = `${m.user.Name} (${m.user.Role})`;
    if (preselectedPeerId && m.user.User_ID === preselectedPeerId) {
      opt.selected = true;
    }
    bookPeer.appendChild(opt);
  });

  updateBookSkillOptions();
  bookModal.style.display = 'flex';
}

function updateBookSkillOptions() {
  bookSkill.innerHTML = '';
  const selectedPeerId = parseInt(bookPeer.value);
  const peerSkills = dbSimulator.getTableData('skills').filter(s => s.User_ID === selectedPeerId && s.Skill_Type === 'teach');

  if (peerSkills.length > 0) {
    peerSkills.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.Skill_Name;
      opt.innerText = s.Skill_Name;
      bookSkill.appendChild(opt);
    });
  } else {
    const opt = document.createElement('option');
    opt.value = 'Python';
    opt.innerText = 'Python';
    bookSkill.appendChild(opt);
  }
}

bookPeer.addEventListener('change', updateBookSkillOptions);

function closeBook() {
  bookModal.style.display = 'none';
  bookForm.reset();
}
closeBookModal.addEventListener('click', closeBook);
cancelBookBtn.addEventListener('click', closeBook);

bookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const peerId = parseInt(bookPeer.value);
  const skill = bookSkill.value;
  const dateVal = bookDate.value;
  const durationVal = parseFloat(document.getElementById('bookDuration').value);

  dbSimulator.bookSession(currentUser.User_ID, peerId, skill, dateVal, durationVal);
  closeBook();
  switchView('sessions');
});


// --- MODAL ENGINE (ADD SKILL) ---

addSkillBtn.addEventListener('click', () => {
  skillModal.style.display = 'flex';
});

function closeSkill() {
  skillModal.style.display = 'none';
  skillForm.reset();
}
closeSkillModal.addEventListener('click', closeSkill);
cancelSkillBtn.addEventListener('click', closeSkill);

skillForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('skillNameInput').value.trim();
  const level = document.getElementById('skillLevelSelect').value;
  const cat = document.getElementById('skillCategorySelect').value;
  const type = document.getElementById('skillTypeSelect').value;

  dbSimulator.addSkill(currentUser.User_ID, name, level, cat, type);
  closeSkill();
  populateViewData('settings');
});


// --- MODAL ENGINE (FEEDBACK) ---

function openFeedbackModal(sessionId) {
  feedbackSessionId.value = sessionId;
  feedbackModal.style.display = 'flex';
}

function closeFeedback() {
  feedbackModal.style.display = 'none';
  feedbackForm.reset();
}
closeFeedbackModal.addEventListener('click', closeFeedback);
cancelFeedbackBtn.addEventListener('click', closeFeedback);

feedbackForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const sId = parseInt(feedbackSessionId.value);
  const rating = parseFloat(feedbackRating.value);
  const comment = feedbackComments.value.trim();

  dbSimulator.completeSession(sId, rating, comment);
  closeFeedback();
  switchView('sessions');
});


// --- RELATIONAL DATABASE VISUALIZER ENGINE ---

function updateSqlLogs() {
  sqlLogFeed.innerHTML = '';
  const logs = dbSimulator.getLogs();

  if (logs.length === 0) {
    sqlLogFeed.innerHTML = '<p style="color: var(--text-muted); font-size: 0.75rem; text-align: center; padding-top: 2rem;">No SQL operations recorded.</p>';
    return;
  }

  logs.forEach(log => {
    const div = document.createElement('div');
    div.className = 'sql-query-item';
    const highlighted = highlightSQL(log.query);
    
    div.innerHTML = `
      <div class="sql-query-time">
        <span><i class="lucide-terminal" style="font-size:0.65rem;"></i> QUERY EXECUTED</span>
        <span>${log.timestamp}</span>
      </div>
      <div>${highlighted}</div>
    `;
    sqlLogFeed.appendChild(div);
  });
}

function highlightSQL(sql) {
  const keywords = [
    'SELECT', 'INSERT INTO', 'UPDATE', 'DELETE FROM', 'CREATE TABLE', 'CREATE DATABASE', 'USE',
    'FOREIGN KEY', 'REFERENCES', 'PRIMARY KEY', 'AUTO_INCREMENT', 'VALUES', 'WHERE',
    'SET', 'AND', 'OR', 'JOIN', 'ON', 'FROM', 'LIMIT', 'ENUM', 'NOT NULL', 'DEFAULT',
    'INT', 'VARCHAR', 'DECIMAL', 'TEXT', 'DATE', 'DISTINCT'
  ];

  let formatted = sql;
  formatted = formatted.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  formatted = formatted.replace(/(['"])(.*?)\1/g, '<span class="sql-val">\'$2\'</span>');
  formatted = formatted.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="sql-num">$1</span>');

  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    formatted = formatted.replace(regex, `<span class="sql-kw">${keyword}</span>`);
  });

  return formatted;
}

function updateVisualizerTables() {
  dbUsersTable.innerHTML = '';
  dbSkillsTable.innerHTML = '';
  dbExchangesTable.innerHTML = '';
  dbSessionsTable.innerHTML = '';
  dbProgressTable.innerHTML = '';
  dbFeedbackTable.innerHTML = '';

  // Users Table
  const users = dbSimulator.getTableData('users');
  users.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${u.User_ID}</strong></td>
      <td>${u.Name}</td>
      <td>${u.Email}</td>
      <td><span class="tag tag-teach">${u.Role || 'Student'}</span></td>
      <td style="font-family: monospace; color: var(--text-muted);">${u.Password}</td>
    `;
    dbUsersTable.appendChild(tr);
  });

  // Skills Table
  const skills = dbSimulator.getTableData('skills');
  skills.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${s.Skill_ID}</strong></td>
      <td>${s.User_ID}</td>
      <td>${s.Skill_Name}</td>
      <td>${s.Level || 'Intermediate'}</td>
      <td>${s.Category || 'General'}</td>
      <td><span class="tag ${s.Skill_Type === 'teach' ? 'tag-teach' : 'tag-learn'}">${s.Skill_Type}</span></td>
    `;
    dbSkillsTable.appendChild(tr);
  });

  // Exchanges Table
  const exchanges = dbSimulator.getTableData('exchanges');
  exchanges.forEach(ex => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${ex.Exchange_ID}</strong></td>
      <td>${ex.Requester_ID}</td>
      <td>${ex.Provider_ID}</td>
      <td>${ex.Requested_Skill}</td>
      <td>${ex.Offered_Skill}</td>
      <td><span class="session-status ${ex.Status === 'Accepted' ? 'status-completed' : 'status-scheduled'}">${ex.Status}</span></td>
    `;
    dbExchangesTable.appendChild(tr);
  });

  // Sessions Table
  const sessions = dbSimulator.getTableData('sessions');
  sessions.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${s.Session_ID}</strong></td>
      <td>${s.User_ID}</td>
      <td>${s.Partner_ID}</td>
      <td>${s.Skill_Name}</td>
      <td>${s.Date}</td>
      <td>${s.Duration} hrs</td>
      <td><span class="session-status ${s.Status === 'completed' ? 'status-completed' : 'status-scheduled'}">${s.Status}</span></td>
    `;
    dbSessionsTable.appendChild(tr);
  });

  // Progress Table
  const progress = dbSimulator.getTableData('progress');
  progress.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${p.Progress_ID}</strong></td>
      <td>${p.User_ID}</td>
      <td>${p.Skill_Name}</td>
      <td>${p.Hours_Completed} hrs</td>
      <td>${p.Proficiency}</td>
      <td style="color: var(--primary); font-weight: 500;">${p.Goal_Status}</td>
    `;
    dbProgressTable.appendChild(tr);
  });

  // Feedback Table
  const feedbacks = dbSimulator.getTableData('feedback');
  feedbacks.forEach(f => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${f.Feedback_ID}</strong></td>
      <td>${f.User_ID}</td>
      <td>${f.Session_ID}</td>
      <td>⭐ ${f.Rating}</td>
      <td style="max-width: 200px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${f.Comments}</td>
    `;
    dbFeedbackTable.appendChild(tr);
  });
}

resetDbBtn.addEventListener('click', () => {
  if (confirm("Reset skillbridge database to default seed state?")) {
    dbSimulator.resetDatabase();
    alert("Database re-initialized.");
    checkAuth();
  }
});

clearLogsBtn.addEventListener('click', () => {
  dbSimulator.clearLogs();
  updateSqlLogs();
});

// Start app
checkAuth();
