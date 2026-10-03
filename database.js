// Relational Mock Database Engine simulating MySQL
// Based on the database design of the Skill Exchange & Learning Tracker System

class MySQLSimulator {
  constructor() {
    this.storageKey = 'skillbridge_db';
    this.logKey = 'skillbridge_sql_logs';
    this.db = null;
    this.sqlLogs = [];
    this.initDatabase();
  }

  // Initialize DB from LocalStorage or seed defaults
  initDatabase() {
    const cachedData = localStorage.getItem(this.storageKey);
    const cachedLogs = localStorage.getItem(this.logKey);

    if (cachedLogs) {
      this.sqlLogs = JSON.parse(cachedLogs);
    } else {
      this.sqlLogs = [];
    }

    if (cachedData) {
      this.db = JSON.parse(cachedData);
    } else {
      // Seed Database for skillbridge
      this.db = {
        users: [
          { User_ID: 1, Name: 'Kani', Email: 'kani@gmail.com', Password: 'password123', Role: 'Student' },
          { User_ID: 2, Name: 'sharmila', Email: 'sharmila@gmail.com', Password: 'password123', Role: 'Mentor' }
        ],
        skills: [
          // Kani (Student): knows Java, Data Structures | wants Python, Web Development
          { Skill_ID: 1, User_ID: 1, Skill_Name: 'Java', Level: 'Intermediate', Category: 'Programming', Skill_Type: 'teach' },
          { Skill_ID: 2, User_ID: 1, Skill_Name: 'Data Structures', Level: 'Advanced', Category: 'Computer Science', Skill_Type: 'teach' },
          { Skill_ID: 3, User_ID: 1, Skill_Name: 'Python', Level: 'Beginner', Category: 'Programming', Skill_Type: 'learn' },
          { Skill_ID: 4, User_ID: 1, Skill_Name: 'Web Development', Level: 'Intermediate', Category: 'Development', Skill_Type: 'learn' },
          
          // Sharmila (Mentor): knows Python, Web Development | wants Java, Data Structures
          { Skill_ID: 5, User_ID: 2, Skill_Name: 'Python', Level: 'Beginner', Category: 'Programming', Skill_Type: 'teach' },
          { Skill_ID: 6, User_ID: 2, Skill_Name: 'Web Development', Level: 'Intermediate', Category: 'Development', Skill_Type: 'teach' },
          { Skill_ID: 7, User_ID: 2, Skill_Name: 'Java', Level: 'Intermediate', Category: 'Programming', Skill_Type: 'learn' },
          { Skill_ID: 8, User_ID: 2, Skill_Name: 'Data Structures', Level: 'Advanced', Category: 'Computer Science', Skill_Type: 'learn' }
        ],
        exchanges: [
          { Exchange_ID: 1, Requester_ID: 1, Provider_ID: 2, Requested_Skill: 'Python', Offered_Skill: 'Java', Status: 'Pending', Date: '2026-10-01' }
        ],
        sessions: [
          { Session_ID: 1, User_ID: 1, Partner_ID: 2, Skill_Name: 'Python', Date: '2026-10-02', Duration: 1.5, Status: 'scheduled' },
          { Session_ID: 2, User_ID: 2, Partner_ID: 1, Skill_Name: 'Java', Date: '2026-09-28', Duration: 2.0, Status: 'completed' }
        ],
        progress: [
          { Progress_ID: 1, User_ID: 1, Skill_Name: 'Python', Hours_Completed: 4.5, Proficiency: 'Beginner', Goal_Status: 'Learning Python from sharmila', Target_Hours: 10 },
          { Progress_ID: 2, User_ID: 1, Skill_Name: 'Web Development', Hours_Completed: 6.0, Proficiency: 'Intermediate', Goal_Status: 'Building Web Project', Target_Hours: 15 },
          { Progress_ID: 3, User_ID: 2, Skill_Name: 'Java', Hours_Completed: 8.0, Proficiency: 'Intermediate', Goal_Status: 'Mentoring & Exchange Java', Target_Hours: 12 }
        ],
        feedback: [
          { Feedback_ID: 1, User_ID: 1, Session_ID: 2, Rating: 5, Comments: 'Sharmila is a great mentor! Explained concepts very well.' },
          { Feedback_ID: 2, User_ID: 2, Session_ID: 2, Rating: 4.8, Comments: 'Kanimozhi has strong Java fundamentals.' }
        ]
      };
      
      this.logSQL('CREATE DATABASE skillbridge;');
      this.logSQL(`USE skillbridge;`);
      this.logSQL(`CREATE TABLE Users (
  User_ID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Email VARCHAR(100) UNIQUE NOT NULL,
  Password VARCHAR(255) NOT NULL,
  Role ENUM('Student', 'Mentor') NOT NULL DEFAULT 'Student'
);`);
      this.logSQL(`CREATE TABLE Skills (
  Skill_ID INT AUTO_INCREMENT PRIMARY KEY,
  User_ID INT,
  Skill_Name VARCHAR(100) NOT NULL,
  Level ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL,
  Category VARCHAR(100) NOT NULL,
  Skill_Type ENUM('teach', 'learn') NOT NULL,
  FOREIGN KEY (User_ID) REFERENCES Users(User_ID)
);`);
      this.logSQL(`CREATE TABLE Exchanges (
  Exchange_ID INT AUTO_INCREMENT PRIMARY KEY,
  Requester_ID INT,
  Provider_ID INT,
  Requested_Skill VARCHAR(100) NOT NULL,
  Offered_Skill VARCHAR(100) NOT NULL,
  Status ENUM('Pending', 'Accepted', 'Rejected', 'Completed') DEFAULT 'Pending',
  Date DATE NOT NULL,
  FOREIGN KEY (Requester_ID) REFERENCES Users(User_ID),
  FOREIGN KEY (Provider_ID) REFERENCES Users(User_ID)
);`);
      this.logSQL(`CREATE TABLE Sessions (
  Session_ID INT AUTO_INCREMENT PRIMARY KEY,
  User_ID INT,
  Partner_ID INT,
  Skill_Name VARCHAR(100) NOT NULL,
  Date DATE NOT NULL,
  Duration DECIMAL(3,1) NOT NULL,
  Status ENUM('scheduled', 'completed') DEFAULT 'scheduled',
  FOREIGN KEY (User_ID) REFERENCES Users(User_ID)
);`);
      this.logSQL(`CREATE TABLE Progress (
  Progress_ID INT AUTO_INCREMENT PRIMARY KEY,
  User_ID INT,
  Skill_Name VARCHAR(100) NOT NULL,
  Hours_Completed DECIMAL(5,1) DEFAULT 0.0,
  Proficiency VARCHAR(50) DEFAULT 'Beginner',
  Goal_Status VARCHAR(255) DEFAULT 'Active',
  Target_Hours DECIMAL(5,1) DEFAULT 10.0,
  FOREIGN KEY (User_ID) REFERENCES Users(User_ID)
);`);
      this.logSQL(`CREATE TABLE Feedback (
  Feedback_ID INT AUTO_INCREMENT PRIMARY KEY,
  User_ID INT,
  Session_ID INT,
  Rating DECIMAL(2,1),
  Comments TEXT,
  FOREIGN KEY (User_ID) REFERENCES Users(User_ID),
  FOREIGN KEY (Session_ID) REFERENCES Sessions(Session_ID)
);`);

      this.saveToStorage();
    }
  }

  saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.db));
    localStorage.setItem(this.logKey, JSON.stringify(this.sqlLogs));
  }

  logSQL(query) {
    const timestamp = new Date().toLocaleTimeString();
    this.sqlLogs.unshift({ timestamp, query });
    // Limit to last 50 SQL logs to keep storage clean
    if (this.sqlLogs.length > 50) {
      this.sqlLogs.pop();
    }
    this.saveToStorage();
  }

  getLogs() {
    return this.sqlLogs;
  }

  clearLogs() {
    this.sqlLogs = [];
    this.saveToStorage();
  }

  // --- CRUD Query Mocking Operations ---

  // 1. Authenticate user
  loginUser(email, password) {
    const sql = `SELECT * FROM Users WHERE Email = '${email}' AND Password = '${password}' LIMIT 1;`;
    this.logSQL(sql);
    
    const user = this.db.users.find(u => u.Email === email && u.Password === password);
    return user || null;
  }

  // 2. Register user
  registerUser(name, email, password, teachSkills, learnSkills) {
    // Check if email already exists
    const existing = this.db.users.find(u => u.Email === email);
    if (existing) {
      throw new Error("Email already registered");
    }

    const nextUserId = this.db.users.length > 0 ? Math.max(...this.db.users.map(u => u.User_ID)) + 1 : 1;
    const userSql = `INSERT INTO Users (User_ID, Name, Email, Password) VALUES (${nextUserId}, '${name}', '${email}', '${password}');`;
    this.logSQL(userSql);

    const newUser = { User_ID: nextUserId, Name: name, Email: email, Password: password };
    this.db.users.push(newUser);

    // Insert skills
    teachSkills.forEach(skillName => {
      if (!skillName.trim()) return;
      const nextSkillId = this.db.skills.length > 0 ? Math.max(...this.db.skills.map(s => s.Skill_ID)) + 1 : 1;
      const skillSql = `INSERT INTO Skills (Skill_ID, User_ID, Skill_Name, Skill_Type) VALUES (${nextSkillId}, ${nextUserId}, '${skillName}', 'teach');`;
      this.logSQL(skillSql);
      this.db.skills.push({ Skill_ID: nextSkillId, User_ID: nextUserId, Skill_Name: skillName, Skill_Type: 'teach' });
    });

    learnSkills.forEach(skillName => {
      if (!skillName.trim()) return;
      const nextSkillId = this.db.skills.length > 0 ? Math.max(...this.db.skills.map(s => s.Skill_ID)) + 1 : 1;
      const skillSql = `INSERT INTO Skills (Skill_ID, User_ID, Skill_Name, Skill_Type) VALUES (${nextSkillId}, ${nextUserId}, '${skillName}', 'learn');`;
      this.logSQL(skillSql);
      this.db.skills.push({ Skill_ID: nextSkillId, User_ID: nextUserId, Skill_Name: skillName, Skill_Type: 'learn' });
    });

    // Initialize progress record
    const nextProgressId = this.db.progress.length > 0 ? Math.max(...this.db.progress.map(p => p.Progress_ID)) + 1 : 1;
    const progressSql = `INSERT INTO Progress (Progress_ID, User_ID, Hours_Completed, Goal_Status) VALUES (${nextProgressId}, ${nextUserId}, 0.0, 'Active (Learn ${learnSkills[0] || 'Skills'})');`;
    this.logSQL(progressSql);
    this.db.progress.push({ Progress_ID: nextProgressId, User_ID: nextUserId, Hours_Completed: 0, Goal_Status: `Active (Learn ${learnSkills[0] || 'Skills'})` });

    this.saveToStorage();
    return newUser;
  }

  // 3. Get matches for a user
  // Find users who teach what this user wants to learn, OR who want to learn what this user teaches
  getMatches(userId) {
    const sql = `SELECT DISTINCT u.*, s_teach.Skill_Name AS Teach_Skill, s_learn.Skill_Name AS Learn_Skill 
FROM Users u
JOIN Skills s_teach ON u.User_ID = s_teach.User_ID AND s_teach.Skill_Type = 'teach'
JOIN Skills s_learn ON u.User_ID = s_learn.User_ID AND s_learn.Skill_Type = 'learn'
WHERE u.User_ID != ${userId} 
  AND (s_teach.Skill_Name IN (SELECT Skill_Name FROM Skills WHERE User_ID = ${userId} AND Skill_Type = 'learn')
       OR s_learn.Skill_Name IN (SELECT Skill_Name FROM Skills WHERE User_ID = ${userId} AND Skill_Type = 'teach'));`;
    this.logSQL(sql);

    const userSkills = this.db.skills.filter(s => s.User_ID === userId);
    const userTeaches = userSkills.filter(s => s.Skill_Type === 'teach').map(s => s.Skill_Name.toLowerCase());
    const userLearns = userSkills.filter(s => s.Skill_Type === 'learn').map(s => s.Skill_Name.toLowerCase());

    const matches = [];

    this.db.users.forEach(otherUser => {
      if (otherUser.User_ID === userId) return;

      const otherSkills = this.db.skills.filter(s => s.User_ID === otherUser.User_ID);
      const otherTeaches = otherSkills.filter(s => s.Skill_Type === 'teach').map(s => s.Skill_Name);
      const otherLearns = otherSkills.filter(s => s.Skill_Type === 'learn').map(s => s.Skill_Name);

      // Find overlap
      const matchingTeach = otherTeaches.find(s => userLearns.includes(s.toLowerCase()));
      const matchingLearn = otherLearns.find(s => userTeaches.includes(s.toLowerCase()));

      if (matchingTeach || matchingLearn) {
        matches.push({
          user: otherUser,
          teaches: otherTeaches,
          learns: otherLearns,
          matchType: (matchingTeach && matchingLearn) ? 'Mutual Match' : (matchingTeach ? 'They can teach you' : 'You can teach them'),
          matchedSkill: matchingTeach || matchingLearn
        });
      }
    });

    return matches;
  }

  // 4. Book a Session
  bookSession(userId, partnerId, skillName, date, duration) {
    const nextSessionId = this.db.sessions.length > 0 ? Math.max(...this.db.sessions.map(s => s.Session_ID)) + 1 : 1;
    const sql = `INSERT INTO Sessions (Session_ID, User_ID, Partner_ID, Skill_Name, Date, Duration, Status) 
VALUES (${nextSessionId}, ${userId}, ${partnerId}, '${skillName}', '${date}', ${duration}, 'scheduled');`;
    this.logSQL(sql);

    const newSession = {
      Session_ID: nextSessionId,
      User_ID: userId,
      Partner_ID: partnerId,
      Skill_Name: skillName,
      Date: date,
      Duration: parseFloat(duration),
      Status: 'scheduled'
    };

    this.db.sessions.push(newSession);
    this.saveToStorage();
    return newSession;
  }

  // 5. Complete a Session and update progress
  completeSession(sessionId, rating, feedbackText) {
    const sessionIndex = this.db.sessions.findIndex(s => s.Session_ID === sessionId);
    if (sessionIndex === -1) return;

    const session = this.db.sessions[sessionIndex];
    session.Status = 'completed';

    const sessionSql = `UPDATE Sessions SET Status = 'completed' WHERE Session_ID = ${sessionId};`;
    this.logSQL(sessionSql);

    // Add Feedback entry
    const nextFeedbackId = this.db.feedback.length > 0 ? Math.max(...this.db.feedback.map(f => f.Feedback_ID)) + 1 : 1;
    const feedbackSql = `INSERT INTO Feedback (Feedback_ID, User_ID, Session_ID, Rating, Comments) 
VALUES (${nextFeedbackId}, ${session.User_ID}, ${sessionId}, ${rating}, '${feedbackText.replace(/'/g, "''")}');`;
    this.logSQL(feedbackSql);
    this.db.feedback.push({
      Feedback_ID: nextFeedbackId,
      User_ID: session.User_ID,
      Session_ID: sessionId,
      Rating: parseFloat(rating),
      Comments: feedbackText
    });

    // Update Progress (Hours_Completed)
    const progressRecord = this.db.progress.find(p => p.User_ID === session.User_ID);
    if (progressRecord) {
      const oldHours = progressRecord.Hours_Completed;
      const newHours = oldHours + session.Duration;
      progressRecord.Hours_Completed = newHours;

      const progressSql = `UPDATE Progress SET Hours_Completed = ${newHours} WHERE User_ID = ${session.User_ID};`;
      this.logSQL(progressSql);
    } else {
      // Create progress if missing
      const nextProgressId = this.db.progress.length > 0 ? Math.max(...this.db.progress.map(p => p.Progress_ID)) + 1 : 1;
      this.db.progress.push({
        Progress_ID: nextProgressId,
        User_ID: session.User_ID,
        Hours_Completed: session.Duration,
        Goal_Status: 'Active'
      });
      const progressSql = `INSERT INTO Progress (Progress_ID, User_ID, Hours_Completed, Goal_Status) VALUES (${nextProgressId}, ${session.User_ID}, ${session.Duration}, 'Active');`;
      this.logSQL(progressSql);
    }

    // Also update progress for the tutor/partner
    const partnerProgress = this.db.progress.find(p => p.User_ID === session.Partner_ID);
    if (partnerProgress) {
      const oldHours = partnerProgress.Hours_Completed;
      const newHours = oldHours + session.Duration;
      partnerProgress.Hours_Completed = newHours;
      const partnerSql = `UPDATE Progress SET Hours_Completed = ${newHours} WHERE User_ID = ${session.Partner_ID};`;
      this.logSQL(partnerSql);
    }

    this.saveToStorage();
  }

  // 6. Update Learning Goal
  updateGoal(userId, newGoal) {
    const progressRecord = this.db.progress.find(p => p.User_ID === userId);
    if (progressRecord) {
      progressRecord.Goal_Status = newGoal;
      const sql = `UPDATE Progress SET Goal_Status = '${newGoal.replace(/'/g, "''")}' WHERE User_ID = ${userId};`;
      this.logSQL(sql);
      this.saveToStorage();
    }
  }

  // 7. Get user statistics (used for reporting dashboard)
  getUserStats(userId) {
    const sql = `SELECT 
    (SELECT COALESCE(SUM(Duration), 0) FROM Sessions WHERE User_ID = ${userId} AND Status = 'completed') AS Learning_Hours,
    (SELECT COALESCE(SUM(Duration), 0) FROM Sessions WHERE Partner_ID = ${userId} AND Status = 'completed') AS Teaching_Hours,
    (SELECT AVG(Rating) FROM Feedback f JOIN Sessions s ON f.Session_ID = s.Session_ID WHERE s.Partner_ID = ${userId}) AS Avg_Rating,
    (SELECT Goal_Status FROM Progress WHERE User_ID = ${userId}) AS Goal;`;
    this.logSQL(sql);

    const completedLearning = this.db.sessions.filter(s => s.User_ID === userId && s.Status === 'completed');
    const completedTeaching = this.db.sessions.filter(s => s.Partner_ID === userId && s.Status === 'completed');

    const learningHours = completedLearning.reduce((sum, s) => sum + s.Duration, 0);
    const teachingHours = completedTeaching.reduce((sum, s) => sum + s.Duration, 0);

    // Average rating received as a tutor
    const tutorSessions = this.db.sessions.filter(s => s.Partner_ID === userId && s.Status === 'completed').map(s => s.Session_ID);
    const tutorFeedback = this.db.feedback.filter(f => tutorSessions.includes(f.Session_ID));
    const avgRating = tutorFeedback.length > 0 
      ? (tutorFeedback.reduce((sum, f) => sum + f.Rating, 0) / tutorFeedback.length).toFixed(1)
      : '5.0';

    const progressRecord = this.db.progress.find(p => p.User_ID === userId);
    const goal = progressRecord ? progressRecord.Goal_Status : 'No active goals';

    return {
      learningHours,
      teachingHours,
      avgRating,
      goal,
      feedback: tutorFeedback
    };
  }

  // 8. Skill Exchange Management
  createExchangeRequest(requesterId, providerId, requestedSkill, offeredSkill) {
    const nextId = this.db.exchanges.length > 0 ? Math.max(...this.db.exchanges.map(e => e.Exchange_ID)) + 1 : 1;
    const date = new Date().toISOString().split('T')[0];
    const sql = `INSERT INTO Exchanges (Exchange_ID, Requester_ID, Provider_ID, Requested_Skill, Offered_Skill, Status, Date)
VALUES (${nextId}, ${requesterId}, ${providerId}, '${requestedSkill}', '${offeredSkill}', 'Pending', '${date}');`;
    this.logSQL(sql);

    const exchange = {
      Exchange_ID: nextId,
      Requester_ID: requesterId,
      Provider_ID: providerId,
      Requested_Skill: requestedSkill,
      Offered_Skill: offeredSkill,
      Status: 'Pending',
      Date: date
    };

    this.db.exchanges.push(exchange);
    this.saveToStorage();
    return exchange;
  }

  updateExchangeStatus(exchangeId, status) {
    const ex = this.db.exchanges.find(e => e.Exchange_ID === exchangeId);
    if (ex) {
      ex.Status = status;
      const sql = `UPDATE Exchanges SET Status = '${status}' WHERE Exchange_ID = ${exchangeId};`;
      this.logSQL(sql);

      // If accepted, automatically create a scheduled session for the exchange!
      if (status === 'Accepted') {
        const date = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]; // Scheduled 2 days from now
        this.bookSession(ex.Requester_ID, ex.Provider_ID, ex.Requested_Skill, date, 1.5);
      }

      this.saveToStorage();
    }
  }

  // 9. Skill Management
  addSkill(userId, skillName, level = 'Intermediate', category = 'General', skillType = 'teach') {
    const nextId = this.db.skills.length > 0 ? Math.max(...this.db.skills.map(s => s.Skill_ID)) + 1 : 1;
    const sql = `INSERT INTO Skills (Skill_ID, User_ID, Skill_Name, Level, Category, Skill_Type)
VALUES (${nextId}, ${userId}, '${skillName}', '${level}', '${category}', '${skillType}');`;
    this.logSQL(sql);

    const newSkill = {
      Skill_ID: nextId,
      User_ID: userId,
      Skill_Name: skillName,
      Level: level,
      Category: category,
      Skill_Type: skillType
    };

    this.db.skills.push(newSkill);
    this.saveToStorage();
    return newSkill;
  }

  deleteSkill(skillId) {
    this.db.skills = this.db.skills.filter(s => s.Skill_ID !== skillId);
    const sql = `DELETE FROM Skills WHERE Skill_ID = ${skillId};`;
    this.logSQL(sql);
    this.saveToStorage();
  }

  // 10. Settings & Profile Updates
  updateUserProfile(userId, name, email, role) {
    const user = this.db.users.find(u => u.User_ID === userId);
    if (user) {
      user.Name = name;
      user.Email = email;
      user.Role = role;

      const sql = `UPDATE Users SET Name = '${name.replace(/'/g, "''")}', Email = '${email}', Role = '${role}' WHERE User_ID = ${userId};`;
      this.logSQL(sql);
      this.saveToStorage();
    }
    return user;
  }

  // 11. Fetch raw tables for visualizer
  getTableData(tableName) {
    const sql = `SELECT * FROM ${tableName};`;
    this.logSQL(sql);
    return this.db[tableName.toLowerCase()] || [];
  }

  // Reset database to initial seeding
  resetDatabase() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.logKey);
    this.initDatabase();
  }
}

// Export a singleton instance
const dbSimulator = new MySQLSimulator();
export default dbSimulator;
