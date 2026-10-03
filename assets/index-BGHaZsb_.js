(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))l(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&l(s)}).observe(document,{childList:!0,subtree:!0});function a(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function l(r){if(r.ep)return;r.ep=!0;const n=a(r);fetch(r.href,n)}})();class fe{constructor(){this.storageKey="skillbridge_db",this.logKey="skillbridge_sql_logs",this.db=null,this.sqlLogs=[],this.initDatabase()}initDatabase(){const t=localStorage.getItem(this.storageKey),a=localStorage.getItem(this.logKey);a?this.sqlLogs=JSON.parse(a):this.sqlLogs=[],t?this.db=JSON.parse(t):(this.db={users:[{User_ID:1,Name:"Kani",Email:"kani@gmail.com",Password:"password123",Role:"Student"},{User_ID:2,Name:"sharmila",Email:"sharmila@gmail.com",Password:"password123",Role:"Mentor"}],skills:[{Skill_ID:1,User_ID:1,Skill_Name:"Java",Level:"Intermediate",Category:"Programming",Skill_Type:"teach"},{Skill_ID:2,User_ID:1,Skill_Name:"Data Structures",Level:"Advanced",Category:"Computer Science",Skill_Type:"teach"},{Skill_ID:3,User_ID:1,Skill_Name:"Python",Level:"Beginner",Category:"Programming",Skill_Type:"learn"},{Skill_ID:4,User_ID:1,Skill_Name:"Web Development",Level:"Intermediate",Category:"Development",Skill_Type:"learn"},{Skill_ID:5,User_ID:2,Skill_Name:"Python",Level:"Beginner",Category:"Programming",Skill_Type:"teach"},{Skill_ID:6,User_ID:2,Skill_Name:"Web Development",Level:"Intermediate",Category:"Development",Skill_Type:"teach"},{Skill_ID:7,User_ID:2,Skill_Name:"Java",Level:"Intermediate",Category:"Programming",Skill_Type:"learn"},{Skill_ID:8,User_ID:2,Skill_Name:"Data Structures",Level:"Advanced",Category:"Computer Science",Skill_Type:"learn"}],exchanges:[{Exchange_ID:1,Requester_ID:1,Provider_ID:2,Requested_Skill:"Python",Offered_Skill:"Java",Status:"Pending",Date:"2026-10-01"}],sessions:[{Session_ID:1,User_ID:1,Partner_ID:2,Skill_Name:"Python",Date:"2026-10-02",Duration:1.5,Status:"scheduled"},{Session_ID:2,User_ID:2,Partner_ID:1,Skill_Name:"Java",Date:"2026-09-28",Duration:2,Status:"completed"}],progress:[{Progress_ID:1,User_ID:1,Skill_Name:"Python",Hours_Completed:4.5,Proficiency:"Beginner",Goal_Status:"Learning Python from sharmila",Target_Hours:10},{Progress_ID:2,User_ID:1,Skill_Name:"Web Development",Hours_Completed:6,Proficiency:"Intermediate",Goal_Status:"Building Web Project",Target_Hours:15},{Progress_ID:3,User_ID:2,Skill_Name:"Java",Hours_Completed:8,Proficiency:"Intermediate",Goal_Status:"Mentoring & Exchange Java",Target_Hours:12}],feedback:[{Feedback_ID:1,User_ID:1,Session_ID:2,Rating:5,Comments:"Sharmila is a great mentor! Explained concepts very well."},{Feedback_ID:2,User_ID:2,Session_ID:2,Rating:4.8,Comments:"Kanimozhi has strong Java fundamentals."}]},this.logSQL("CREATE DATABASE skillbridge;"),this.logSQL("USE skillbridge;"),this.logSQL(`CREATE TABLE Users (
  User_ID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Email VARCHAR(100) UNIQUE NOT NULL,
  Password VARCHAR(255) NOT NULL,
  Role ENUM('Student', 'Mentor') NOT NULL DEFAULT 'Student'
);`),this.logSQL(`CREATE TABLE Skills (
  Skill_ID INT AUTO_INCREMENT PRIMARY KEY,
  User_ID INT,
  Skill_Name VARCHAR(100) NOT NULL,
  Level ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL,
  Category VARCHAR(100) NOT NULL,
  Skill_Type ENUM('teach', 'learn') NOT NULL,
  FOREIGN KEY (User_ID) REFERENCES Users(User_ID)
);`),this.logSQL(`CREATE TABLE Exchanges (
  Exchange_ID INT AUTO_INCREMENT PRIMARY KEY,
  Requester_ID INT,
  Provider_ID INT,
  Requested_Skill VARCHAR(100) NOT NULL,
  Offered_Skill VARCHAR(100) NOT NULL,
  Status ENUM('Pending', 'Accepted', 'Rejected', 'Completed') DEFAULT 'Pending',
  Date DATE NOT NULL,
  FOREIGN KEY (Requester_ID) REFERENCES Users(User_ID),
  FOREIGN KEY (Provider_ID) REFERENCES Users(User_ID)
);`),this.logSQL(`CREATE TABLE Sessions (
  Session_ID INT AUTO_INCREMENT PRIMARY KEY,
  User_ID INT,
  Partner_ID INT,
  Skill_Name VARCHAR(100) NOT NULL,
  Date DATE NOT NULL,
  Duration DECIMAL(3,1) NOT NULL,
  Status ENUM('scheduled', 'completed') DEFAULT 'scheduled',
  FOREIGN KEY (User_ID) REFERENCES Users(User_ID)
);`),this.logSQL(`CREATE TABLE Progress (
  Progress_ID INT AUTO_INCREMENT PRIMARY KEY,
  User_ID INT,
  Skill_Name VARCHAR(100) NOT NULL,
  Hours_Completed DECIMAL(5,1) DEFAULT 0.0,
  Proficiency VARCHAR(50) DEFAULT 'Beginner',
  Goal_Status VARCHAR(255) DEFAULT 'Active',
  Target_Hours DECIMAL(5,1) DEFAULT 10.0,
  FOREIGN KEY (User_ID) REFERENCES Users(User_ID)
);`),this.logSQL(`CREATE TABLE Feedback (
  Feedback_ID INT AUTO_INCREMENT PRIMARY KEY,
  User_ID INT,
  Session_ID INT,
  Rating DECIMAL(2,1),
  Comments TEXT,
  FOREIGN KEY (User_ID) REFERENCES Users(User_ID),
  FOREIGN KEY (Session_ID) REFERENCES Sessions(Session_ID)
);`),this.saveToStorage())}saveToStorage(){localStorage.setItem(this.storageKey,JSON.stringify(this.db)),localStorage.setItem(this.logKey,JSON.stringify(this.sqlLogs))}logSQL(t){const a=new Date().toLocaleTimeString();this.sqlLogs.unshift({timestamp:a,query:t}),this.sqlLogs.length>50&&this.sqlLogs.pop(),this.saveToStorage()}getLogs(){return this.sqlLogs}clearLogs(){this.sqlLogs=[],this.saveToStorage()}loginUser(t,a){const l=`SELECT * FROM Users WHERE Email = '${t}' AND Password = '${a}' LIMIT 1;`;return this.logSQL(l),this.db.users.find(n=>n.Email===t&&n.Password===a)||null}registerUser(t,a,l,r,n){if(this.db.users.find(o=>o.Email===a))throw new Error("Email already registered");const e=this.db.users.length>0?Math.max(...this.db.users.map(o=>o.User_ID))+1:1,c=`INSERT INTO Users (User_ID, Name, Email, Password) VALUES (${e}, '${t}', '${a}', '${l}');`;this.logSQL(c);const u={User_ID:e,Name:t,Email:a,Password:l};this.db.users.push(u),r.forEach(o=>{if(!o.trim())return;const h=this.db.skills.length>0?Math.max(...this.db.skills.map(b=>b.Skill_ID))+1:1,L=`INSERT INTO Skills (Skill_ID, User_ID, Skill_Name, Skill_Type) VALUES (${h}, ${e}, '${o}', 'teach');`;this.logSQL(L),this.db.skills.push({Skill_ID:h,User_ID:e,Skill_Name:o,Skill_Type:"teach"})}),n.forEach(o=>{if(!o.trim())return;const h=this.db.skills.length>0?Math.max(...this.db.skills.map(b=>b.Skill_ID))+1:1,L=`INSERT INTO Skills (Skill_ID, User_ID, Skill_Name, Skill_Type) VALUES (${h}, ${e}, '${o}', 'learn');`;this.logSQL(L),this.db.skills.push({Skill_ID:h,User_ID:e,Skill_Name:o,Skill_Type:"learn"})});const p=this.db.progress.length>0?Math.max(...this.db.progress.map(o=>o.Progress_ID))+1:1,m=`INSERT INTO Progress (Progress_ID, User_ID, Hours_Completed, Goal_Status) VALUES (${p}, ${e}, 0.0, 'Active (Learn ${n[0]||"Skills"})');`;return this.logSQL(m),this.db.progress.push({Progress_ID:p,User_ID:e,Hours_Completed:0,Goal_Status:`Active (Learn ${n[0]||"Skills"})`}),this.saveToStorage(),u}getMatches(t){const a=`SELECT DISTINCT u.*, s_teach.Skill_Name AS Teach_Skill, s_learn.Skill_Name AS Learn_Skill 
FROM Users u
JOIN Skills s_teach ON u.User_ID = s_teach.User_ID AND s_teach.Skill_Type = 'teach'
JOIN Skills s_learn ON u.User_ID = s_learn.User_ID AND s_learn.Skill_Type = 'learn'
WHERE u.User_ID != ${t} 
  AND (s_teach.Skill_Name IN (SELECT Skill_Name FROM Skills WHERE User_ID = ${t} AND Skill_Type = 'learn')
       OR s_learn.Skill_Name IN (SELECT Skill_Name FROM Skills WHERE User_ID = ${t} AND Skill_Type = 'teach'));`;this.logSQL(a);const l=this.db.skills.filter(e=>e.User_ID===t),r=l.filter(e=>e.Skill_Type==="teach").map(e=>e.Skill_Name.toLowerCase()),n=l.filter(e=>e.Skill_Type==="learn").map(e=>e.Skill_Name.toLowerCase()),s=[];return this.db.users.forEach(e=>{if(e.User_ID===t)return;const c=this.db.skills.filter(h=>h.User_ID===e.User_ID),u=c.filter(h=>h.Skill_Type==="teach").map(h=>h.Skill_Name),p=c.filter(h=>h.Skill_Type==="learn").map(h=>h.Skill_Name),m=u.find(h=>n.includes(h.toLowerCase())),o=p.find(h=>r.includes(h.toLowerCase()));(m||o)&&s.push({user:e,teaches:u,learns:p,matchType:m&&o?"Mutual Match":m?"They can teach you":"You can teach them",matchedSkill:m||o})}),s}bookSession(t,a,l,r,n){const s=this.db.sessions.length>0?Math.max(...this.db.sessions.map(u=>u.Session_ID))+1:1,e=`INSERT INTO Sessions (Session_ID, User_ID, Partner_ID, Skill_Name, Date, Duration, Status) 
VALUES (${s}, ${t}, ${a}, '${l}', '${r}', ${n}, 'scheduled');`;this.logSQL(e);const c={Session_ID:s,User_ID:t,Partner_ID:a,Skill_Name:l,Date:r,Duration:parseFloat(n),Status:"scheduled"};return this.db.sessions.push(c),this.saveToStorage(),c}completeSession(t,a,l){const r=this.db.sessions.findIndex(m=>m.Session_ID===t);if(r===-1)return;const n=this.db.sessions[r];n.Status="completed";const s=`UPDATE Sessions SET Status = 'completed' WHERE Session_ID = ${t};`;this.logSQL(s);const e=this.db.feedback.length>0?Math.max(...this.db.feedback.map(m=>m.Feedback_ID))+1:1,c=`INSERT INTO Feedback (Feedback_ID, User_ID, Session_ID, Rating, Comments) 
VALUES (${e}, ${n.User_ID}, ${t}, ${a}, '${l.replace(/'/g,"''")}');`;this.logSQL(c),this.db.feedback.push({Feedback_ID:e,User_ID:n.User_ID,Session_ID:t,Rating:parseFloat(a),Comments:l});const u=this.db.progress.find(m=>m.User_ID===n.User_ID);if(u){const o=u.Hours_Completed+n.Duration;u.Hours_Completed=o;const h=`UPDATE Progress SET Hours_Completed = ${o} WHERE User_ID = ${n.User_ID};`;this.logSQL(h)}else{const m=this.db.progress.length>0?Math.max(...this.db.progress.map(h=>h.Progress_ID))+1:1;this.db.progress.push({Progress_ID:m,User_ID:n.User_ID,Hours_Completed:n.Duration,Goal_Status:"Active"});const o=`INSERT INTO Progress (Progress_ID, User_ID, Hours_Completed, Goal_Status) VALUES (${m}, ${n.User_ID}, ${n.Duration}, 'Active');`;this.logSQL(o)}const p=this.db.progress.find(m=>m.User_ID===n.Partner_ID);if(p){const o=p.Hours_Completed+n.Duration;p.Hours_Completed=o;const h=`UPDATE Progress SET Hours_Completed = ${o} WHERE User_ID = ${n.Partner_ID};`;this.logSQL(h)}this.saveToStorage()}updateGoal(t,a){const l=this.db.progress.find(r=>r.User_ID===t);if(l){l.Goal_Status=a;const r=`UPDATE Progress SET Goal_Status = '${a.replace(/'/g,"''")}' WHERE User_ID = ${t};`;this.logSQL(r),this.saveToStorage()}}getUserStats(t){const a=`SELECT 
    (SELECT COALESCE(SUM(Duration), 0) FROM Sessions WHERE User_ID = ${t} AND Status = 'completed') AS Learning_Hours,
    (SELECT COALESCE(SUM(Duration), 0) FROM Sessions WHERE Partner_ID = ${t} AND Status = 'completed') AS Teaching_Hours,
    (SELECT AVG(Rating) FROM Feedback f JOIN Sessions s ON f.Session_ID = s.Session_ID WHERE s.Partner_ID = ${t}) AS Avg_Rating,
    (SELECT Goal_Status FROM Progress WHERE User_ID = ${t}) AS Goal;`;this.logSQL(a);const l=this.db.sessions.filter(o=>o.User_ID===t&&o.Status==="completed"),r=this.db.sessions.filter(o=>o.Partner_ID===t&&o.Status==="completed"),n=l.reduce((o,h)=>o+h.Duration,0),s=r.reduce((o,h)=>o+h.Duration,0),e=this.db.sessions.filter(o=>o.Partner_ID===t&&o.Status==="completed").map(o=>o.Session_ID),c=this.db.feedback.filter(o=>e.includes(o.Session_ID)),u=c.length>0?(c.reduce((o,h)=>o+h.Rating,0)/c.length).toFixed(1):"5.0",p=this.db.progress.find(o=>o.User_ID===t),m=p?p.Goal_Status:"No active goals";return{learningHours:n,teachingHours:s,avgRating:u,goal:m,feedback:c}}createExchangeRequest(t,a,l,r){const n=this.db.exchanges.length>0?Math.max(...this.db.exchanges.map(u=>u.Exchange_ID))+1:1,s=new Date().toISOString().split("T")[0],e=`INSERT INTO Exchanges (Exchange_ID, Requester_ID, Provider_ID, Requested_Skill, Offered_Skill, Status, Date)
VALUES (${n}, ${t}, ${a}, '${l}', '${r}', 'Pending', '${s}');`;this.logSQL(e);const c={Exchange_ID:n,Requester_ID:t,Provider_ID:a,Requested_Skill:l,Offered_Skill:r,Status:"Pending",Date:s};return this.db.exchanges.push(c),this.saveToStorage(),c}updateExchangeStatus(t,a){const l=this.db.exchanges.find(r=>r.Exchange_ID===t);if(l){l.Status=a;const r=`UPDATE Exchanges SET Status = '${a}' WHERE Exchange_ID = ${t};`;if(this.logSQL(r),a==="Accepted"){const n=new Date(Date.now()+1728e5).toISOString().split("T")[0];this.bookSession(l.Requester_ID,l.Provider_ID,l.Requested_Skill,n,1.5)}this.saveToStorage()}}addSkill(t,a,l="Intermediate",r="General",n="teach"){const s=this.db.skills.length>0?Math.max(...this.db.skills.map(u=>u.Skill_ID))+1:1,e=`INSERT INTO Skills (Skill_ID, User_ID, Skill_Name, Level, Category, Skill_Type)
VALUES (${s}, ${t}, '${a}', '${l}', '${r}', '${n}');`;this.logSQL(e);const c={Skill_ID:s,User_ID:t,Skill_Name:a,Level:l,Category:r,Skill_Type:n};return this.db.skills.push(c),this.saveToStorage(),c}deleteSkill(t){this.db.skills=this.db.skills.filter(l=>l.Skill_ID!==t);const a=`DELETE FROM Skills WHERE Skill_ID = ${t};`;this.logSQL(a),this.saveToStorage()}updateUserProfile(t,a,l,r){const n=this.db.users.find(s=>s.User_ID===t);if(n){n.Name=a,n.Email=l,n.Role=r;const s=`UPDATE Users SET Name = '${a.replace(/'/g,"''")}', Email = '${l}', Role = '${r}' WHERE User_ID = ${t};`;this.logSQL(s),this.saveToStorage()}return n}getTableData(t){const a=`SELECT * FROM ${t};`;return this.logSQL(a),this.db[t.toLowerCase()]||[]}resetDatabase(){localStorage.removeItem(this.storageKey),localStorage.removeItem(this.logKey),this.initDatabase()}}const g=new fe;let d=null,U=null;const I=document.getElementById("authOverlay"),V=document.getElementById("loginForm"),G=document.getElementById("registerForm"),P=document.getElementById("tabLogin"),H=document.getElementById("tabRegister"),te=document.getElementById("loginView"),se=document.getElementById("registerView"),ne=document.querySelectorAll(".nav-item"),ve=document.querySelectorAll(".view-panel"),ke=document.getElementById("logoutBtn"),Te=document.getElementById("welcomeTitle"),Le=document.getElementById("statLearningHours"),be=document.getElementById("statTeachingHours"),Ue=document.getElementById("statAvgRating"),Ne=document.getElementById("dashActiveExchanges"),N=document.getElementById("dashExchangeRequests"),R=document.getElementById("dashUpcomingSessions"),$=document.getElementById("dashRecommendedPeers"),ae=document.getElementById("goalDisplay"),Re=document.getElementById("goalForm"),K=document.getElementById("newGoalInput"),$e=document.getElementById("dashRequestBtn"),Ae=document.getElementById("dashBookBtn"),A=document.getElementById("exchangeRequestsList"),x=document.getElementById("exchangePeersList"),xe=document.getElementById("openExchangeModalBtn"),le=document.getElementById("exchangeModal"),Ce=document.getElementById("closeExchangeModal"),Be=document.getElementById("cancelExchangeBtn"),re=document.getElementById("exchangeForm"),S=document.getElementById("exchangeProvider"),y=document.getElementById("exchangeRequestedSkill"),f=document.getElementById("exchangeOfferedSkill"),W=document.getElementById("progressSkillList"),C=document.getElementById("scheduleSessionList"),Me=document.getElementById("scheduleBookBtn"),oe=document.getElementById("bookModal"),Pe=document.getElementById("closeBookModal"),He=document.getElementById("cancelBookBtn"),ie=document.getElementById("bookForm"),_=document.getElementById("bookPeer"),v=document.getElementById("bookSkill"),q=document.getElementById("bookDate"),ce=document.getElementById("feedbackModal"),qe=document.getElementById("closeFeedbackModal"),Oe=document.getElementById("cancelFeedbackBtn"),de=document.getElementById("feedbackForm"),me=document.getElementById("feedbackSessionId"),Fe=document.getElementById("feedbackRating"),we=document.getElementById("feedbackComments"),ze=document.getElementById("settingsProfileForm"),ge=document.getElementById("settingsName"),ue=document.getElementById("settingsEmail"),he=document.getElementById("settingsRole"),B=document.getElementById("settingsSkillList"),Qe=document.getElementById("addSkillBtn"),pe=document.getElementById("skillModal"),Ve=document.getElementById("closeSkillModal"),Ge=document.getElementById("cancelSkillBtn"),Ee=document.getElementById("skillForm"),M=document.getElementById("sqlLogFeed"),Ke=document.getElementById("clearLogsBtn"),We=document.getElementById("resetDbBtn"),Y=document.getElementById("dbUsersTable").querySelector("tbody"),J=document.getElementById("dbSkillsTable").querySelector("tbody"),j=document.getElementById("dbExchangesTable").querySelector("tbody"),X=document.getElementById("dbSessionsTable").querySelector("tbody"),Z=document.getElementById("dbProgressTable").querySelector("tbody"),ee=document.getElementById("dbFeedbackTable").querySelector("tbody");function Ie(){const i=localStorage.getItem("skillbridge_active_user");i?(d=JSON.parse(i),I.classList.add("hidden"),T()):I.classList.remove("hidden")}P.addEventListener("click",()=>{P.classList.add("active"),H.classList.remove("active"),te.classList.add("active"),se.classList.remove("active")});H.addEventListener("click",()=>{H.classList.add("active"),P.classList.remove("active"),se.classList.add("active"),te.classList.remove("active")});V.addEventListener("submit",i=>{i.preventDefault();const t=document.getElementById("loginEmail").value.trim(),a=document.getElementById("loginPassword").value;try{const l=g.loginUser(t,a);l?(d=l,localStorage.setItem("skillbridge_active_user",JSON.stringify(d)),I.classList.add("hidden"),T(),V.reset()):alert("Invalid credentials. Try kani@gmail.com or sharmila@gmail.com (pass: password123)")}catch(l){alert(l.message)}});G.addEventListener("submit",i=>{i.preventDefault();const t=document.getElementById("regName").value.trim(),a=document.getElementById("regEmail").value.trim(),l=document.getElementById("regRole").value,r=document.getElementById("regPassword").value,n=document.getElementById("regTeach").value.split(",").map(e=>e.trim()),s=document.getElementById("regLearn").value.split(",").map(e=>e.trim());try{const e=g.registerUser(t,a,r,n,s);e.Role=l,g.updateUserProfile(e.User_ID,t,a,l),d=e,localStorage.setItem("skillbridge_active_user",JSON.stringify(d)),I.classList.add("hidden"),T(),G.reset()}catch(e){alert(e.message)}});ke.addEventListener("click",()=>{g.logSQL("/* User Logged Out */"),localStorage.removeItem("skillbridge_active_user"),d=null,I.classList.remove("hidden")});ne.forEach(i=>{i.addEventListener("click",t=>{t.preventDefault();const a=i.getAttribute("data-view");D(a)})});function D(i){ne.forEach(t=>{t.getAttribute("data-view")===i?t.classList.add("active"):t.classList.remove("active")}),ve.forEach(t=>{t.id===`view-${i}`?t.classList.remove("hidden"):t.classList.add("hidden")}),E(i)}function T(){const i=g.getTableData("users").find(a=>a.User_ID===d.User_ID);i&&(d=i),document.getElementById("navAvatar").innerText=d.Name.charAt(0),document.getElementById("navName").innerText=d.Name,document.getElementById("navRole").innerText=d.Role||"Student",Te.innerText=`Welcome, ${d.Name} (${d.Role})`;const t=new Date().toISOString().split("T")[0];q.min=t,q.value=t,D("dashboard"),Q(),ye()}function E(i){Q(),ye();const t=g.getUserStats(d.User_ID),l=g.getTableData("exchanges").filter(r=>r.Requester_ID===d.User_ID||r.Provider_ID===d.User_ID);if(i==="dashboard"){Ne.innerText=l.length,Le.innerText=`${t.learningHours.toFixed(1)}h`,be.innerText=`${t.teachingHours.toFixed(1)}h`,Ue.innerText=t.avgRating,ae.innerText=t.goal,N.innerHTML="",l.length===0?N.innerHTML='<p style="color: var(--text-muted); font-size: 0.9rem;">No active exchange requests.</p>':l.slice(0,3).forEach(e=>{const c=e.Requester_ID===d.User_ID?e.Provider_ID:e.Requester_ID,u=g.getTableData("users").find(o=>o.User_ID===c),p=e.Requester_ID===d.User_ID?`Requested ${e.Requested_Skill} from ${u?u.Name:"Mentor"}`:`${u?u.Name:"Student"} requested ${e.Requested_Skill}`,m=document.createElement("div");m.className="session-item",m.innerHTML=`
          <div class="session-info">
            <h4 style="font-size: 0.95rem;">Skill: ${e.Requested_Skill} <span style="font-size:0.75rem; color: var(--text-muted);">(Offer: ${e.Offered_Skill})</span></h4>
            <p style="font-size: 0.8rem;">${p} | ${e.Date}</p>
          </div>
          <span class="session-status ${e.Status==="Accepted"?"status-completed":"status-scheduled"}">${e.Status}</span>
        `,N.appendChild(m)});const n=g.getTableData("sessions").filter(e=>(e.User_ID===d.User_ID||e.Partner_ID===d.User_ID)&&e.Status==="scheduled");R.innerHTML="",n.length===0?R.innerHTML='<p style="color: var(--text-muted); font-size: 0.9rem;">No upcoming sessions scheduled.</p>':n.slice(0,3).forEach(e=>{const c=e.User_ID===d.User_ID?e.Partner_ID:e.User_ID,u=g.getTableData("users").find(o=>o.User_ID===c),p=e.User_ID===d.User_ID?"Learning from":"Teaching",m=document.createElement("div");m.className="session-item",m.innerHTML=`
          <div class="session-info">
            <h4 style="font-size: 0.95rem;">${e.Skill_Name}</h4>
            <p style="font-size: 0.8rem;">${p} ${u?u.Name:"Peer"} | <i class="lucide-calendar"></i> ${e.Date}</p>
          </div>
          <span class="session-status status-scheduled">${e.Duration} hrs</span>
        `,R.appendChild(m)});const s=g.getMatches(d.User_ID);$.innerHTML="",s.length===0?$.innerHTML='<p style="color: var(--text-muted); font-size: 0.9rem;">No peer matches found. Add skills in settings to find peers!</p>':(s.slice(0,3).forEach(e=>{const c=document.createElement("div");c.className="match-item",c.innerHTML=`
          <div class="match-avatar-info">
            <div class="profile-avatar" style="width: 36px; height: 36px; font-size: 0.85rem;">${e.user.Name.charAt(0)}</div>
            <div>
              <h4 style="font-size: 0.9rem; font-weight:600;">${e.user.Name} <span class="tag tag-teach" style="font-size: 0.65rem;">${e.user.Role}</span></h4>
              <p style="font-size: 0.75rem; color: var(--text-secondary);">${e.matchType}</p>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary quick-exchange-btn" data-peer-id="${e.user.User_ID}" style="padding: 0.35rem 0.6rem; font-size: 0.75rem;">
              Request Exchange
            </button>
          </div>
        `,$.appendChild(c)}),document.querySelectorAll(".quick-exchange-btn").forEach(e=>{e.addEventListener("click",()=>{const c=parseInt(e.getAttribute("data-peer-id"));k(c)})}))}else if(i==="exchange"){A.innerHTML="",l.length===0?A.innerHTML='<p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 1.5rem;">No exchange requests found. Click "New Exchange Request" to begin!</p>':(l.forEach(n=>{const s=n.Requester_ID===d.User_ID,e=s?n.Provider_ID:n.Requester_ID,c=g.getTableData("users").find(m=>m.User_ID===e),u=document.createElement("div");u.className="match-item";let p="";!s&&n.Status==="Pending"?p=`
            <div style="display:flex; gap: 0.5rem;">
              <button class="btn btn-primary accept-ex-btn" data-ex-id="${n.Exchange_ID}" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">Accept</button>
              <button class="btn btn-secondary reject-ex-btn" data-ex-id="${n.Exchange_ID}" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; color: var(--danger);">Reject</button>
            </div>`:p=`<span class="session-status ${n.Status==="Accepted"?"status-completed":"status-scheduled"}">${n.Status}</span>`,u.innerHTML=`
          <div class="match-avatar-info">
            <div class="profile-avatar">${c?c.Name.charAt(0):"P"}</div>
            <div>
              <h4 style="font-weight: 700;">${c?c.Name:"Partner"} <span class="tag tag-teach">${c?c.Role:"Peer"}</span></h4>
              <p style="font-size: 0.85rem; color: var(--text-primary); margin-top: 0.25rem;">
                <strong>Requested Skill:</strong> ${n.Requested_Skill} | <strong>Offered Skill:</strong> ${n.Offered_Skill}
              </p>
              <p style="font-size: 0.75rem; color: var(--text-secondary);">${s?"Sent by you":"Sent to you"} on ${n.Date}</p>
            </div>
          </div>
          <div>
            ${p}
          </div>
        `,A.appendChild(u)}),document.querySelectorAll(".accept-ex-btn").forEach(n=>{n.addEventListener("click",()=>{const s=parseInt(n.getAttribute("data-ex-id"));g.updateExchangeStatus(s,"Accepted"),E("exchange")})}),document.querySelectorAll(".reject-ex-btn").forEach(n=>{n.addEventListener("click",()=>{const s=parseInt(n.getAttribute("data-ex-id"));g.updateExchangeStatus(s,"Rejected"),E("exchange")})}));const r=g.getMatches(d.User_ID);x.innerHTML="",r.length===0?x.innerHTML=`
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
          <i class="lucide-users" style="font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.5;"></i>
          <p>No compatible peer profiles found matching your current skill interests.</p>
        </div>`:(r.forEach(n=>{const s=document.createElement("div");s.className="match-item",s.innerHTML=`
          <div class="match-avatar-info">
            <div class="profile-avatar">${n.user.Name.charAt(0)}</div>
            <div>
              <h4 style="font-weight: 700;">${n.user.Name} <span class="tag tag-teach">${n.user.Role}</span></h4>
              <p style="font-size: 0.8rem; color: var(--primary); font-weight:600;">${n.matchType}</p>
              <div class="match-skills-tag">
                <span style="font-size: 0.75rem; color: var(--text-muted); align-self: center;">Teaches:</span>
                ${n.teaches.map(e=>`<span class="tag tag-teach">${e}</span>`).join("")}
              </div>
              <div class="match-skills-tag">
                <span style="font-size: 0.75rem; color: var(--text-muted); align-self: center;">Learns:</span>
                ${n.learns.map(e=>`<span class="tag tag-learn">${e}</span>`).join("")}
              </div>
            </div>
          </div>
          <button class="btn btn-primary request-exchange-peer-btn" data-peer-id="${n.user.User_ID}">
            <i class="lucide-arrow-left-right"></i> Request Exchange
          </button>
        `,x.appendChild(s)}),document.querySelectorAll(".request-exchange-peer-btn").forEach(n=>{n.addEventListener("click",()=>{const s=parseInt(n.getAttribute("data-peer-id"));k(s)})}))}else if(i==="progress"){const n=g.getTableData("progress").filter(e=>e.User_ID===d.User_ID);g.getTableData("skills").filter(e=>e.User_ID===d.User_ID),W.innerHTML="",[{name:"Java",level:"Intermediate",category:"Programming",hrs:8,target:12},{name:"Python",level:"Beginner",category:"Programming",hrs:4.5,target:10},{name:"Web Development",level:"Intermediate",category:"Development",hrs:6,target:15},{name:"Data Structures",level:"Advanced",category:"Computer Science",hrs:10,target:15}].forEach(e=>{const c=n.find(h=>h.Skill_Name===e.name),u=c?c.Hours_Completed:e.hrs,p=c&&c.Target_Hours||e.target,m=Math.min(100,Math.round(u/p*100)),o=document.createElement("div");o.className="match-item",o.style.flexDirection="column",o.style.alignItems="stretch",o.innerHTML=`
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
          <div>
            <h4 style="font-size: 1.1rem; font-weight:700;">${e.name}</h4>
            <span class="tag tag-teach" style="font-size: 0.75rem;">${e.level}</span>
            <span class="tag tag-learn" style="font-size: 0.75rem;">${e.category}</span>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 1rem; font-weight:700; color: var(--primary);">${m}% Mastery</span>
            <p style="font-size: 0.8rem; color: var(--text-secondary);">${u} / ${p} Hours Completed</p>
          </div>
        </div>
        <div style="width: 100%; height: 10px; background: rgba(255,255,255,0.08); border-radius: 5px; overflow: hidden; margin-top: 0.25rem;">
          <div style="width: ${m}%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); border-radius: 5px; transition: width 0.5s ease;"></div>
        </div>
      `,W.appendChild(o)})}else if(i==="sessions"){const n=g.getTableData("sessions").filter(s=>s.User_ID===d.User_ID||s.Partner_ID===d.User_ID);C.innerHTML="",n.length===0?C.innerHTML=`
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
          <i class="lucide-calendar-x" style="font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.5;"></i>
          <p>No booked sessions yet. Use the Skill Exchange page to schedule meetings.</p>
        </div>`:(n.slice().reverse().forEach(s=>{const e=s.User_ID===d.User_ID?s.Partner_ID:s.User_ID,c=g.getTableData("users").find(o=>o.User_ID===e),u=s.User_ID===d.User_ID,p=document.createElement("div");p.className="session-item";let m="";s.Status==="scheduled"?u?m=`
              <button class="btn btn-primary complete-session-btn" data-session-id="${s.Session_ID}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">
                <i class="lucide-check-circle"></i> Complete & Rate
              </button>`:m='<span style="font-size:0.8rem; color: var(--accent);"><i class="lucide-clock"></i> Upcoming (Tutor Mode)</span>':m='<span class="session-status status-completed"><i class="lucide-check"></i> Finished</span>',p.innerHTML=`
          <div class="session-info">
            <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">${s.Skill_Name}</h4>
            <p style="margin-top: 0.25rem;">
              <strong>${u?"Tutor/Mentor":"Learner"}:</strong> ${c?c.Name:"Peer"} | 
              <strong>Duration:</strong> ${s.Duration} hrs | 
              <strong>Date:</strong> ${s.Date}
            </p>
          </div>
          <div>
            ${m}
          </div>
        `,C.appendChild(p)}),document.querySelectorAll(".complete-session-btn").forEach(s=>{s.addEventListener("click",()=>{const e=parseInt(s.getAttribute("data-session-id"));Je(e)})}))}else if(i==="reports"){const r=g.getTableData("feedback"),n=g.getTableData("sessions").filter(c=>c.Partner_ID===d.User_ID).map(c=>c.Session_ID),s=r.filter(c=>n.includes(c.Session_ID)),e=document.getElementById("feedbackList");e.innerHTML="",s.length===0?e.innerHTML='<p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 2rem;">No feedback reviews received yet.</p>':s.slice().reverse().forEach(c=>{const u=g.getTableData("users").find(o=>o.User_ID===c.User_ID),p="⭐".repeat(Math.round(c.Rating)),m=document.createElement("div");m.className="match-item",m.style.flexDirection="column",m.style.alignItems="flex-start",m.innerHTML=`
          <div style="display:flex; justify-content:space-between; width:100%; margin-bottom: 0.5rem;">
            <strong style="font-size: 0.9rem;">${u?u.Name:"Peer student"}</strong>
            <span style="font-size: 0.8rem;">${p} (${c.Rating})</span>
          </div>
          <p style="font-style: italic; font-size: 0.85rem; color: var(--text-secondary);">"${c.Comments}"</p>
        `,e.appendChild(m)}),setTimeout(()=>{Ye(t.learningHours,t.teachingHours)},100)}else if(i==="settings"){ge.value=d.Name,ue.value=d.Email,he.value=d.Role||"Student";const r=g.getTableData("skills").filter(n=>n.User_ID===d.User_ID);B.innerHTML="",r.length===0?B.innerHTML='<p style="color: var(--text-muted); font-size: 0.85rem;">No skills added yet.</p>':(r.forEach(n=>{const s=document.createElement("div");s.className="session-item",s.innerHTML=`
          <div class="session-info">
            <h4 style="font-size: 0.95rem;">${n.Skill_Name}</h4>
            <p style="font-size: 0.8rem; color: var(--text-secondary);">Level: ${n.Level||"Intermediate"} | Category: ${n.Category||"Programming"}</p>
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <span class="tag ${n.Skill_Type==="teach"?"tag-teach":"tag-learn"}">${n.Skill_Type==="teach"?"Taught":"Learning"}</span>
            <button class="btn btn-secondary delete-skill-btn" data-skill-id="${n.Skill_ID}" style="padding:0.25rem 0.5rem; font-size:0.75rem; color: var(--danger);">&times;</button>
          </div>
        `,B.appendChild(s)}),document.querySelectorAll(".delete-skill-btn").forEach(n=>{n.addEventListener("click",()=>{const s=parseInt(n.getAttribute("data-skill-id"));g.deleteSkill(s),E("settings")})}))}}Re.addEventListener("submit",i=>{i.preventDefault();const t=K.value.trim();t&&(g.updateGoal(d.User_ID,t),ae.innerText=t,K.value="",E("dashboard"))});ze.addEventListener("submit",i=>{i.preventDefault();const t=ge.value.trim(),a=ue.value.trim(),l=he.value;d=g.updateUserProfile(d.User_ID,t,a,l),localStorage.setItem("skillbridge_active_user",JSON.stringify(d)),alert("Profile updated successfully!"),T()});function Ye(i,t){const a=document.getElementById("hoursChart");if(!a)return;const l=a.getContext("2d");U&&U.destroy(),U=new Chart(l,{type:"bar",data:{labels:["Learning Hours","Teaching / Mentoring Hours"],datasets:[{label:"Hours Completed",data:[i,t],backgroundColor:["rgba(6, 182, 212, 0.45)","rgba(16, 185, 129, 0.45)"],borderColor:["#06b6d4","#10b981"],borderWidth:2,borderRadius:8}]},options:{responsive:!0,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255, 255, 255, 0.05)"},ticks:{color:"#9ca3af"}},x:{grid:{display:!1},ticks:{color:"#9ca3af"}}}}})}$e.addEventListener("click",()=>k());xe.addEventListener("click",()=>k());function k(i=null){S.innerHTML="";const t=g.getMatches(d.User_ID);if(t.length===0){alert("No matching peers found. Add skills in Settings to match with campus peers.");return}t.forEach(a=>{const l=document.createElement("option");l.value=a.user.User_ID,l.innerText=`${a.user.Name} (${a.user.Role}) - ${a.matchType}`,i&&a.user.User_ID===i&&(l.selected=!0),S.appendChild(l)}),Se(),le.style.display="flex"}function Se(){y.innerHTML="",f.innerHTML="";const i=parseInt(S.value),t=g.getTableData("skills").filter(l=>l.User_ID===i&&l.Skill_Type==="teach"),a=g.getTableData("skills").filter(l=>l.User_ID===d.User_ID&&l.Skill_Type==="teach");if(t.length>0)t.forEach(l=>{const r=document.createElement("option");r.value=l.Skill_Name,r.innerText=l.Skill_Name,y.appendChild(r)});else{const l=document.createElement("option");l.value="Python",l.innerText="Python",y.appendChild(l)}if(a.length>0)a.forEach(l=>{const r=document.createElement("option");r.value=l.Skill_Name,r.innerText=l.Skill_Name,f.appendChild(r)});else{const l=document.createElement("option");l.value="Java",l.innerText="Java",f.appendChild(l)}}S.addEventListener("change",Se);function O(){le.style.display="none",re.reset()}Ce.addEventListener("click",O);Be.addEventListener("click",O);re.addEventListener("submit",i=>{i.preventDefault();const t=parseInt(S.value),a=y.value,l=f.value;g.createExchangeRequest(d.User_ID,t,a,l),O(),D("exchange")});Ae.addEventListener("click",()=>_e());Me.addEventListener("click",()=>_e());function _e(i=null){_.innerHTML="";const t=g.getMatches(d.User_ID);if(t.length===0){alert("You don't have matching peer profiles yet.");return}t.forEach(a=>{const l=document.createElement("option");l.value=a.user.User_ID,l.innerText=`${a.user.Name} (${a.user.Role})`,i&&a.user.User_ID===i&&(l.selected=!0),_.appendChild(l)}),De(),oe.style.display="flex"}function De(){v.innerHTML="";const i=parseInt(_.value),t=g.getTableData("skills").filter(a=>a.User_ID===i&&a.Skill_Type==="teach");if(t.length>0)t.forEach(a=>{const l=document.createElement("option");l.value=a.Skill_Name,l.innerText=a.Skill_Name,v.appendChild(l)});else{const a=document.createElement("option");a.value="Python",a.innerText="Python",v.appendChild(a)}}_.addEventListener("change",De);function F(){oe.style.display="none",ie.reset()}Pe.addEventListener("click",F);He.addEventListener("click",F);ie.addEventListener("submit",i=>{i.preventDefault();const t=parseInt(_.value),a=v.value,l=q.value,r=parseFloat(document.getElementById("bookDuration").value);g.bookSession(d.User_ID,t,a,l,r),F(),D("sessions")});Qe.addEventListener("click",()=>{pe.style.display="flex"});function w(){pe.style.display="none",Ee.reset()}Ve.addEventListener("click",w);Ge.addEventListener("click",w);Ee.addEventListener("submit",i=>{i.preventDefault();const t=document.getElementById("skillNameInput").value.trim(),a=document.getElementById("skillLevelSelect").value,l=document.getElementById("skillCategorySelect").value,r=document.getElementById("skillTypeSelect").value;g.addSkill(d.User_ID,t,a,l,r),w(),E("settings")});function Je(i){me.value=i,ce.style.display="flex"}function z(){ce.style.display="none",de.reset()}qe.addEventListener("click",z);Oe.addEventListener("click",z);de.addEventListener("submit",i=>{i.preventDefault();const t=parseInt(me.value),a=parseFloat(Fe.value),l=we.value.trim();g.completeSession(t,a,l),z(),D("sessions")});function Q(){M.innerHTML="";const i=g.getLogs();if(i.length===0){M.innerHTML='<p style="color: var(--text-muted); font-size: 0.75rem; text-align: center; padding-top: 2rem;">No SQL operations recorded.</p>';return}i.forEach(t=>{const a=document.createElement("div");a.className="sql-query-item";const l=je(t.query);a.innerHTML=`
      <div class="sql-query-time">
        <span><i class="lucide-terminal" style="font-size:0.65rem;"></i> QUERY EXECUTED</span>
        <span>${t.timestamp}</span>
      </div>
      <div>${l}</div>
    `,M.appendChild(a)})}function je(i){const t=["SELECT","INSERT INTO","UPDATE","DELETE FROM","CREATE TABLE","CREATE DATABASE","USE","FOREIGN KEY","REFERENCES","PRIMARY KEY","AUTO_INCREMENT","VALUES","WHERE","SET","AND","OR","JOIN","ON","FROM","LIMIT","ENUM","NOT NULL","DEFAULT","INT","VARCHAR","DECIMAL","TEXT","DATE","DISTINCT"];let a=i;return a=a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),a=a.replace(/(['"])(.*?)\1/g,`<span class="sql-val">'$2'</span>`),a=a.replace(/\b(\d+(\.\d+)?)\b/g,'<span class="sql-num">$1</span>'),t.forEach(l=>{const r=new RegExp(`\\b${l}\\b`,"gi");a=a.replace(r,`<span class="sql-kw">${l}</span>`)}),a}function ye(){Y.innerHTML="",J.innerHTML="",j.innerHTML="",X.innerHTML="",Z.innerHTML="",ee.innerHTML="",g.getTableData("users").forEach(s=>{const e=document.createElement("tr");e.innerHTML=`
      <td><strong>${s.User_ID}</strong></td>
      <td>${s.Name}</td>
      <td>${s.Email}</td>
      <td><span class="tag tag-teach">${s.Role||"Student"}</span></td>
      <td style="font-family: monospace; color: var(--text-muted);">${s.Password}</td>
    `,Y.appendChild(e)}),g.getTableData("skills").forEach(s=>{const e=document.createElement("tr");e.innerHTML=`
      <td><strong>${s.Skill_ID}</strong></td>
      <td>${s.User_ID}</td>
      <td>${s.Skill_Name}</td>
      <td>${s.Level||"Intermediate"}</td>
      <td>${s.Category||"General"}</td>
      <td><span class="tag ${s.Skill_Type==="teach"?"tag-teach":"tag-learn"}">${s.Skill_Type}</span></td>
    `,J.appendChild(e)}),g.getTableData("exchanges").forEach(s=>{const e=document.createElement("tr");e.innerHTML=`
      <td><strong>${s.Exchange_ID}</strong></td>
      <td>${s.Requester_ID}</td>
      <td>${s.Provider_ID}</td>
      <td>${s.Requested_Skill}</td>
      <td>${s.Offered_Skill}</td>
      <td><span class="session-status ${s.Status==="Accepted"?"status-completed":"status-scheduled"}">${s.Status}</span></td>
    `,j.appendChild(e)}),g.getTableData("sessions").forEach(s=>{const e=document.createElement("tr");e.innerHTML=`
      <td><strong>${s.Session_ID}</strong></td>
      <td>${s.User_ID}</td>
      <td>${s.Partner_ID}</td>
      <td>${s.Skill_Name}</td>
      <td>${s.Date}</td>
      <td>${s.Duration} hrs</td>
      <td><span class="session-status ${s.Status==="completed"?"status-completed":"status-scheduled"}">${s.Status}</span></td>
    `,X.appendChild(e)}),g.getTableData("progress").forEach(s=>{const e=document.createElement("tr");e.innerHTML=`
      <td><strong>${s.Progress_ID}</strong></td>
      <td>${s.User_ID}</td>
      <td>${s.Skill_Name}</td>
      <td>${s.Hours_Completed} hrs</td>
      <td>${s.Proficiency}</td>
      <td style="color: var(--primary); font-weight: 500;">${s.Goal_Status}</td>
    `,Z.appendChild(e)}),g.getTableData("feedback").forEach(s=>{const e=document.createElement("tr");e.innerHTML=`
      <td><strong>${s.Feedback_ID}</strong></td>
      <td>${s.User_ID}</td>
      <td>${s.Session_ID}</td>
      <td>⭐ ${s.Rating}</td>
      <td style="max-width: 200px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${s.Comments}</td>
    `,ee.appendChild(e)})}We.addEventListener("click",()=>{confirm("Reset skillbridge database to default seed state?")&&(g.resetDatabase(),alert("Database re-initialized."),Ie())});Ke.addEventListener("click",()=>{g.clearLogs(),Q()});Ie();
