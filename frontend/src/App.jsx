import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [journey, setJourney] = useState([]);
  const [eligibleDrives, setEligibleDrives] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    totalApplications: 0,
    selectedApplications: 0,
    acceptedOffers: 0,
    totalCompanies: 0,
    totalDrives: 0,
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Students:", err));

    fetch("http://localhost:5000/api/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error("Companies:", err));

    fetch("http://localhost:5000/api/drives")
      .then((res) => res.json())
      .then((data) => setDrives(data))
      .catch((err) => console.error("Drives:", err));

    fetch("http://localhost:5000/api/analytics/placements")
      .then((res) => res.json())
      .then((data) => setAnalytics(data))
      .catch((err) => console.error("Analytics:", err));
      fetch("http://localhost:5000/api/applications")
    .then(res => res.json())
    .then(data => setApplications(data));
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Students", icon: "👨‍🎓" },
    { name: "Companies", icon: "🏢" },
    { name: "Job Drives", icon: "💼" },
    { name: "Applications", icon: "📄" },
    { name: "Analytics", icon: "📊" },
    { name: "Student Journey", icon: "👨‍🎓"},
    { name: "Eligible Drives", icon: "📄"},
  ];
const loadStudentJourney = async (studentId) => {
    setSelectedStudent(studentId);

    if (!studentId) {
        setJourney([]);
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:5000/api/students/${studentId}/journey`
        );

        const data = await response.json();
        setJourney(data);
    } catch (error) {
        console.error("Failed to load student journey:", error);
        setJourney([]);
    }
};
const loadEligibleDrives = async (studentId) => {
    if (!studentId) {
        setEligibleDrives([]);
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:5000/api/students/${studentId}/eligible-drives`
        );

        const data = await response.json();
        setEligibleDrives(data);
    } catch (error) {
        console.error("Failed to load eligible drives:", error);
        setEligibleDrives([]);
    }
};
  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">CP</div>
          <div>
            <h2>Campus Placement</h2>
            <span>Management System</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <p className="menu-title">MAIN MENU</p>

          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}

        </nav>

        <div className="sidebar-bottom">
          <div className="neo4j-status">
            <span className="status-dot"></span>
            <div>
              <strong>Neo4j Connected</strong>
              <small>Database Online</small>
            </div>
          </div>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* HEADER */}
        <header className="topbar">

          <div>
            <h1>{activePage}</h1>
            <p>Campus Placement & Internship Database</p>
          </div>

          <div className="user-profile">
            <div className="user-avatar">A</div>
            <div>
              <strong>Admin</strong>
              <small>Placement Coordinator</small>
            </div>
          </div>

        </header>

        {/* DASHBOARD */}
        {activePage === "Dashboard" && (
          <>
            <section className="welcome-card">

              <div>
                <span className="welcome-label">WELCOME BACK</span>

                <h2>
                  Campus Placement
                  <br />
                  Management System
                </h2>

                <p>
                  Manage students, companies, job drives and applications
                  through your Neo4j-powered placement database.
                </p>
              </div>

              <div className="welcome-graphic">
                <div className="graph-node node-1">Student</div>
                <div className="graph-node node-2">Company</div>
                <div className="graph-node node-3">Job Drive</div>
                <div className="graph-node node-4">Application</div>
              </div>

            </section>

            {/* STAT CARDS */}
            <section className="stats-grid">

              <div className="stat-card">
                <div className="stat-icon blue">👨‍🎓</div>
                <div>
                  <span>Total Students</span>
                  <h2>{analytics.totalStudents}</h2>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon purple">🏢</div>
                <div>
                  <span>Companies</span>
                  <h2>{analytics.totalCompanies}</h2>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon orange">💼</div>
                <div>
                  <span>Job Drives</span>
                  <h2>{analytics.totalDrives}</h2>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">📄</div>
                <div>
                  <span>Applications</span>
                  <h2>{analytics.totalApplications}</h2>
                </div>
              </div>

            </section>

            {/* SECOND ROW */}
            <section className="dashboard-grid">

              <div className="content-card">

                <div className="card-header">
                  <div>
                    <h3>Placement Overview</h3>
                    <p>Current application and offer statistics</p>
                  </div>
                </div>

                <div className="overview-stats">

                  <div>
                    <span>Applications</span>
                    <strong>{analytics.totalApplications}</strong>
                  </div>

                  <div>
                    <span>Selected</span>
                    <strong>{analytics.selectedApplications}</strong>
                  </div>

                  <div>
                    <span>Accepted Offers</span>
                    <strong>{analytics.acceptedOffers}</strong>
                  </div>

                </div>

              </div>

              <div className="content-card">

                <div className="card-header">
                  <div>
                    <h3>Quick Access</h3>
                    <p>Navigate through the system</p>
                  </div>
                </div>

                <div className="quick-links">

                  <button onClick={() => setActivePage("Students")}>
                    👨‍🎓
                    <span>View Students</span>
                  </button>

                  <button onClick={() => setActivePage("Companies")}>
                    🏢
                    <span>View Companies</span>
                  </button>

                  <button onClick={() => setActivePage("Job Drives")}>
                    💼
                    <span>View Job Drives</span>
                  </button>

                  <button onClick={() => setActivePage("Applications")}>
                    📄
                    <span>View Applications</span>
                  </button>

                </div>

              </div>

            </section>
          </>
        )}

        {/* STUDENTS */}
{activePage === "Students" && (
  <section className="content-card page-card">

    <div className="card-header">
      <div>
        <h3>Students</h3>
        <p>Students registered in the placement system</p>
      </div>

      <strong>{students.length} Students</strong>
    </div>

    <div className="student-table">

      <div className="student-table-header">
        <span>Student</span>
        <span>Register No.</span>
        <span>Department</span>
        <span>CGPA</span>
        <span>Backlogs</span>
      </div>

      {students.map((student) => (
        <div
          className="student-table-row"
          key={student.regNo}
        >

          <div className="student-name">
            <div className="student-avatar">
              {student.name.charAt(0)}
            </div>

            <div>
              <strong>{student.name}</strong>
              <span>{student.email}</span>
            </div>
          </div>

          <span>{student.regNo}</span>

          <span>{student.department}</span>

          <strong>{student.cgpa.toFixed(2)}</strong>

          <span
            className={
              student.backlogs.low > 0
                ? "backlog-warning"
                : "backlog-clear"
            }
          >
            {student.backlogs.low}
          </span>

        </div>
      ))}

    </div>

  </section>
)}

        {/* COMPANIES */}
        {activePage === "Companies" && (
          <section className="content-card page-card">

            <div className="card-header">
              <div>
                <h3>Companies</h3>
                <p>Companies participating in campus recruitment</p>
              </div>
              <strong>{companies.length} Companies</strong>
            </div>

            <div className="data-list">

              {companies.map((company) => (
                <div className="data-row" key={company.companyId}>

                  <div>
                    <strong>{company.companyName}</strong>
                    <span>{company.industryType}</span>
                  </div>

                  <div>
                    <span>HR Contact</span>
                    <strong>{company.hrContactEmail}</strong>
                  </div>

                </div>
              ))}

            </div>

          </section>
        )}

        {/* JOB DRIVES */}
        {activePage === "Job Drives" && (
          <section className="content-card page-card">

            <div className="card-header">
              <div>
                <h3>Job Drives</h3>
                <p>Placement and internship opportunities</p>
              </div>
              <strong>{drives.length} Drives</strong>
            </div>

            <div className="data-list">

              {drives.map((drive) => (
                <div className="data-row" key={drive.driveId}>

                  <div>
                    <strong>{drive.roleOffered}</strong>
                    <span>{drive.companyName}</span>
                  </div>

                  <div>
                    <span>Package</span>
                    <strong>{drive.packageLpa} LPA</strong>
                  </div>

                  <div>
                    <span>Type</span>
                    <strong>{drive.driveType}</strong>
                  </div>

                </div>
              ))}

            </div>

          </section>
        )}

        {/* APPLICATIONS */}
        {activePage === "Applications" && (
    <section className="content-card page-card">

        <div className="card-header">
            <div>
                <h3>Applications</h3>
                <p>Student applications across placement and internship drives</p>
            </div>

            <strong>{applications.length} Applications</strong>
        </div>

        <div className="overview-stats">

            <div>
                <span>Total Applications</span>
                <strong>{analytics.totalApplications}</strong>
            </div>

            <div>
                <span>Selected</span>
                <strong>{analytics.selectedApplications}</strong>
            </div>

            <div>
                <span>Accepted Offers</span>
                <strong>{analytics.acceptedOffers}</strong>
            </div>

        </div>

        <div className="student-table">

            <div className="student-table-header application-header">
                <span>Student</span>
                <span>Company</span>
                <span>Role</span>
                <span>Type</span>
                <span>Package</span>
                <span>Status</span>
            </div>

            {applications.map((application) => (

                <div
                    className="student-table-row application-row"
                    key={application.applicationId.low}
                >

                    <div>
                        <strong>{application.studentName}</strong>
                        <small>{application.regNo}</small>
                    </div>

                    <span>{application.companyName}</span>

                    <span>{application.roleOffered}</span>

                    <span>{application.driveType}</span>

                    <span>₹{application.packageLpa} LPA</span>

                    <span className={`status-${application.status
                        .toLowerCase()
                        .replace(" ", "-")}`}>
                        {application.status}
                    </span>

                </div>

            ))}

        </div>

    </section>
)}
{activePage === "Student Journey" && (
    <section className="content-card page-card">

        <div className="card-header">
            <div>
                <h3>Student Journey</h3>
                <p>
                    Graph traversal from student application to company,
                    interviews and offers
                </p>
            </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
            <label>
                <strong>Select Student</strong>
            </label>

            <select
                value={selectedStudent}
                onChange={(e) => loadStudentJourney(e.target.value)}
                style={{
                    display: "block",
                    marginTop: "8px",
                    padding: "10px",
                    minWidth: "280px"
                }}
            >
                <option value="">Select a student</option>

                {students.map((student) => (
                    <option
                        key={student.studentId.low}
                        value={student.studentId.low}
                    >
                        {student.name} — {student.regNo}
                    </option>
                ))}
            </select>
        </div>

        {journey.length === 0 && selectedStudent && (
            <p>No journey data found.</p>
        )}

        {journey.map((item, index) => (

            <div
                key={item.application.applicationId.low}
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "20px"
                }}
            >

                <h3>
                    {item.company.companyName} —{" "}
                    {item.drive.roleOffered}
                </h3>

                <p>
                    <strong>Application:</strong>{" "}
                    {item.application.status}
                </p>

                <p>
                    <strong>Package:</strong>{" "}
                    ₹{item.drive.packageLpa} LPA
                </p>

                <p>
                    <strong>Drive Type:</strong>{" "}
                    {item.drive.driveType}
                </p>

                <hr />

                <h4>Interview Rounds</h4>

                {item.interviewRounds.length === 0 ? (
                    <p>No interview rounds yet.</p>
                ) : (
                    item.interviewRounds.map((round) => (

                        <div key={round.roundId.low}>
                            Round {round.roundNumber.low} —{" "}
                            {round.roundType} —{" "}
                            <strong>{round.result}</strong>
                        </div>

                    ))
                )}

                <hr />

                <h4>Offer</h4>

                {item.offer ? (
                    <p>
                        ₹{item.offer.packageLpa} LPA —{" "}
                        {item.offer.status}
                    </p>
                ) : (
                    <p>No offer yet.</p>
                )}

            </div>

        ))}

    </section>
)}
{activePage === "Eligible Drives" && (
    <section className="content-card page-card">

        <div className="card-header">
            <div>
                <h3>Eligible Drives</h3>
                <p>
                    Job drives a student is eligible for based on
                    CGPA, backlogs and department
                </p>
            </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
            <label>
                <strong>Select Student</strong>
            </label>

            <select
                value={selectedStudent}
                onChange={(e) => {
                    const studentId = e.target.value;
                    setSelectedStudent(studentId);
                    loadEligibleDrives(studentId);
                }}
                style={{
                    display: "block",
                    marginTop: "8px",
                    padding: "10px",
                    minWidth: "280px"
                }}
            >
                <option value="">Select a student</option>

                {students.map((student) => (
                    <option
                        key={student.studentId.low}
                        value={student.studentId.low}
                    >
                        {student.name} — {student.regNo}
                    </option>
                ))}
            </select>
        </div>

        {eligibleDrives.length > 0 && (
            <div className="overview-stats">
                <div>
                    <span>Eligible Drives</span>
                    <strong>{eligibleDrives.length}</strong>
                </div>
            </div>
        )}

        <div className="student-table">

            <div className="student-table-header">
                <span>Company</span>
                <span>Role</span>
                <span>Type</span>
                <span>Package</span>
                <span>Minimum CGPA</span>
                <span>Max Backlogs</span>
            </div>

            {eligibleDrives.map((drive) => (

                <div
                    className="student-table-row"
                    key={drive.driveId.low}
                >
                    <strong>{drive.companyName}</strong>

                    <span>{drive.roleOffered}</span>

                    <span>{drive.driveType}</span>

                    <span>₹{drive.packageLpa} LPA</span>

                    <span>{drive.minimumCgpa}</span>

                    <span>{drive.maximumBacklogs.low}</span>
                </div>

            ))}

        </div>

        {eligibleDrives.length === 0 && selectedStudent && (
            <p>No eligible drives found for this student.</p>
        )}

    </section>
)}
        {/* ANALYTICS */}
        {activePage === "Analytics" && (
          <section className="content-card page-card">

            <div className="card-header">
              <div>
                <h3>Placement Analytics</h3>
                <p>Overall system statistics</p>
              </div>
            </div>

            <div className="overview-stats">

              <div>
                <span>Students</span>
                <strong>{analytics.totalStudents}</strong>
              </div>

              <div>
                <span>Companies</span>
                <strong>{analytics.totalCompanies}</strong>
              </div>

              <div>
                <span>Job Drives</span>
                <strong>{analytics.totalDrives}</strong>
              </div>

              <div>
                <span>Applications</span>
                <strong>{analytics.totalApplications}</strong>
              </div>

              <div>
                <span>Selected</span>
                <strong>{analytics.selectedApplications}</strong>
              </div>

              <div>
                <span>Accepted Offers</span>
                <strong>{analytics.acceptedOffers}</strong>
              </div>

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default App;