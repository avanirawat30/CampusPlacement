const driver = require("./config/neo4j");

async function populateDatabase() {
    const session = driver.session({
        database: "campusplacement"
    });

    try {
        console.log("\nStarting Campus Placement database population...\n");

        // =====================================================
        // 1. DEPARTMENTS
        // =====================================================
        await session.run(`
            UNWIND [
                {id: 1, name: "Computer Science Engineering", hod: "Dr. Jeipratha P N"},
                {id: 2, name: "Electronics & Communication Engineering", hod: "Dr. R Kumar"},
                {id: 3, name: "Information Technology", hod: "Dr. S Meenakshi"},
                {id: 4, name: "Mechanical Engineering", hod: "Dr. A Suresh"},
                {id: 5, name: "Electrical & Electronics Engineering", hod: "Dr. V Latha"}
            ] AS d

            MERGE (dept:Department {deptId: d.id})
            SET dept.deptName = d.name,
                dept.hodName = d.hod
        `);

        console.log("✓ Departments: 5");


        // =====================================================
        // 2. STUDENTS + BELONGS_TO
        // =====================================================
        await session.run(`
            UNWIND [
                {id: 1, reg: "23BCE1001", name: "Arjun Mehta", dept: 1, cgpa: 9.10, backlogs: 0, email: "arjun.mehta@vitstudent.ac.in"},
                {id: 2, reg: "23BCE1002", name: "Sneha Reddy", dept: 1, cgpa: 8.75, backlogs: 0, email: "sneha.reddy@vitstudent.ac.in"},
                {id: 3, reg: "23BCE1003", name: "Devesh Sharma", dept: 1, cgpa: 8.40, backlogs: 0, email: "devesh.sharma@vitstudent.ac.in"},
                {id: 4, reg: "23BCE1004", name: "Kavya Nair", dept: 1, cgpa: 7.20, backlogs: 1, email: "kavya.nair@vitstudent.ac.in"},
                {id: 5, reg: "23BCE1005", name: "Rohan Iyer", dept: 1, cgpa: 6.80, backlogs: 2, email: "rohan.iyer@vitstudent.ac.in"},
                {id: 6, reg: "23BCE1006", name: "Priya Das", dept: 1, cgpa: 9.35, backlogs: 0, email: "priya.das@vitstudent.ac.in"},
                {id: 7, reg: "23BEC1001", name: "Karthik Raja", dept: 2, cgpa: 8.10, backlogs: 0, email: "karthik.raja@vitstudent.ac.in"},
                {id: 8, reg: "23BEC1002", name: "Ananya Iyer", dept: 2, cgpa: 7.65, backlogs: 0, email: "ananya.iyer@vitstudent.ac.in"},
                {id: 9, reg: "23BEC1003", name: "Vishal Kumar", dept: 2, cgpa: 6.95, backlogs: 1, email: "vishal.kumar@vitstudent.ac.in"},
                {id: 10, reg: "23BEC1004", name: "Meera Pillai", dept: 2, cgpa: 8.55, backlogs: 0, email: "meera.pillai@vitstudent.ac.in"},
                {id: 11, reg: "23BIT1001", name: "Aditya Rao", dept: 3, cgpa: 8.90, backlogs: 0, email: "aditya.rao@vitstudent.ac.in"},
                {id: 12, reg: "23BIT1002", name: "Divya Krishnan", dept: 3, cgpa: 7.40, backlogs: 0, email: "divya.krishnan@vitstudent.ac.in"},
                {id: 13, reg: "23BIT1003", name: "Rahul Verma", dept: 3, cgpa: 6.60, backlogs: 2, email: "rahul.verma@vitstudent.ac.in"},
                {id: 14, reg: "23BIT1004", name: "Nisha Agarwal", dept: 3, cgpa: 8.20, backlogs: 0, email: "nisha.agarwal@vitstudent.ac.in"},
                {id: 15, reg: "23BME1001", name: "Suresh Babu", dept: 4, cgpa: 7.75, backlogs: 0, email: "suresh.babu@vitstudent.ac.in"},
                {id: 16, reg: "23BME1002", name: "Pooja Menon", dept: 4, cgpa: 8.05, backlogs: 0, email: "pooja.menon@vitstudent.ac.in"},
                {id: 17, reg: "23BME1003", name: "Aravind Swamy", dept: 4, cgpa: 6.50, backlogs: 1, email: "aravind.swamy@vitstudent.ac.in"},
                {id: 18, reg: "23BEE1001", name: "Lakshmi Narayanan", dept: 5, cgpa: 8.60, backlogs: 0, email: "lakshmi.narayanan@vitstudent.ac.in"},
                {id: 19, reg: "23BEE1002", name: "Harish Chandran", dept: 5, cgpa: 7.30, backlogs: 0, email: "harish.chandran@vitstudent.ac.in"},
                {id: 20, reg: "23BEE1003", name: "Swathi Ramesh", dept: 5, cgpa: 9.00, backlogs: 0, email: "swathi.ramesh@vitstudent.ac.in"}
            ] AS s

            MERGE (student:Student {studentId: s.id})
            SET student.regNo = s.reg,
                student.name = s.name,
                student.cgpa = s.cgpa,
                student.backlogs = s.backlogs,
                student.email = s.email

            WITH student, s
            MATCH (dept:Department {deptId: s.dept})
            MERGE (student)-[:BELONGS_TO]->(dept)
        `);

        console.log("✓ Students: 20");


        // =====================================================
        // 3. COMPANIES
        // =====================================================
        await session.run(`
            UNWIND [
                {id: 1, name: "TCS", industry: "IT Services", email: "hr.tcs@tcs.com"},
                {id: 2, name: "Infosys", industry: "IT Services", email: "campus.infosys@infosys.com"},
                {id: 3, name: "Amazon", industry: "E-Commerce / Cloud", email: "campus.amazon@amazon.com"},
                {id: 4, name: "Microsoft", industry: "Software Products", email: "university.msft@microsoft.com"},
                {id: 5, name: "Cognizant", industry: "IT Consulting", email: "campus.cts@cognizant.com"},
                {id: 6, name: "Zoho", industry: "Software Products", email: "careers@zoho.com"},
                {id: 7, name: "Deloitte", industry: "Consulting", email: "campus.deloitte@deloitte.com"},
                {id: 8, name: "L&T Technology Services", industry: "Engineering Services", email: "campus.ltts@ltts.com"}
            ] AS c

            MERGE (company:Company {companyId: c.id})
            SET company.companyName = c.name,
                company.industryType = c.industry,
                company.hrContactEmail = c.email
        `);

        console.log("✓ Companies: 8");


        // =====================================================
        // 4. JOB DRIVES + POSTED_BY
        // =====================================================
        await session.run(`
            UNWIND [
                {id: 1, company: 1, date: "2026-08-05", role: "Systems Engineer", package: 3.60, type: "Placement"},
                {id: 2, company: 2, date: "2026-08-08", role: "Systems Engineer Specialist", package: 6.25, type: "Placement"},
                {id: 3, company: 3, date: "2026-08-12", role: "SDE Intern", package: 12.00, type: "Internship"},
                {id: 4, company: 3, date: "2026-08-12", role: "SDE-1", package: 22.00, type: "Placement"},
                {id: 5, company: 4, date: "2026-08-15", role: "Software Engineer", package: 24.00, type: "Placement"},
                {id: 6, company: 5, date: "2026-08-18", role: "Programmer Analyst", package: 4.50, type: "Placement"},
                {id: 7, company: 6, date: "2026-08-20", role: "Software Developer", package: 8.00, type: "Placement"},
                {id: 8, company: 7, date: "2026-08-22", role: "Analyst Intern", package: 9.00, type: "Internship"},
                {id: 9, company: 8, date: "2026-08-25", role: "Graduate Engineer Trainee", package: 5.50, type: "Placement"},
                {id: 10, company: 4, date: "2026-08-28", role: "SWE Intern", package: 15.00, type: "Internship"}
            ] AS j

            MERGE (drive:JobDrive {driveId: j.id})
            SET drive.driveDate = j.date,
                drive.roleOffered = j.role,
                drive.packageLpa = j.package,
                drive.driveType = j.type

            WITH drive, j
            MATCH (company:Company {companyId: j.company})
            MERGE (drive)-[:POSTED_BY]->(company)
        `);

        console.log("✓ Job Drives: 10");


        // =====================================================
        // 5. ELIGIBILITY CRITERIA
        // =====================================================
        await session.run(`
            UNWIND [
                {id: 1, drive: 1, minCgpa: 6.00, maxBacklogs: 2, dept: null},
                {id: 2, drive: 2, minCgpa: 6.50, maxBacklogs: 1, dept: null},
                {id: 3, drive: 3, minCgpa: 8.00, maxBacklogs: 0, dept: 1},
                {id: 4, drive: 4, minCgpa: 8.50, maxBacklogs: 0, dept: 1},
                {id: 5, drive: 5, minCgpa: 8.50, maxBacklogs: 0, dept: null},
                {id: 6, drive: 6, minCgpa: 7.00, maxBacklogs: 1, dept: null},
                {id: 7, drive: 7, minCgpa: 8.00, maxBacklogs: 0, dept: 3},
                {id: 8, drive: 8, minCgpa: 7.50, maxBacklogs: 1, dept: null},
                {id: 9, drive: 9, minCgpa: 6.80, maxBacklogs: 1, dept: null},
                {id: 10, drive: 10, minCgpa: 8.00, maxBacklogs: 0, dept: null}
            ] AS e

            MERGE (criteria:EligibilityCriteria {criteriaId: e.id})
            SET criteria.minCgpa = e.minCgpa,
                criteria.maxBacklogs = e.maxBacklogs

            WITH criteria, e
            MATCH (drive:JobDrive {driveId: e.drive})
            MERGE (drive)-[:HAS_ELIGIBILITY]->(criteria)

            WITH criteria, e
            OPTIONAL MATCH (dept:Department {deptId: e.dept})
            FOREACH (_ IN CASE WHEN dept IS NULL THEN [] ELSE [1] END |
                MERGE (criteria)-[:ELIGIBLE_FOR]->(dept)
            )
        `);

        console.log("✓ Eligibility Criteria: 10");


        // =====================================================
        // 6. APPLICATIONS + RELATIONSHIPS
        // =====================================================
        await session.run(`
            UNWIND [
                {id: 1, student: 1, drive: 1, date: "2026-07-28", status: "Selected"},
                {id: 2, student: 1, drive: 4, date: "2026-07-29", status: "In Process"},
                {id: 3, student: 2, drive: 1, date: "2026-07-28", status: "Selected"},
                {id: 4, student: 2, drive: 2, date: "2026-07-29", status: "Rejected"},
                {id: 5, student: 3, drive: 1, date: "2026-07-28", status: "In Process"},
                {id: 6, student: 3, drive: 6, date: "2026-07-30", status: "Selected"},
                {id: 7, student: 4, drive: 1, date: "2026-07-28", status: "Applied"},
                {id: 8, student: 5, drive: 1, date: "2026-07-28", status: "Rejected"},
                {id: 9, student: 6, drive: 4, date: "2026-07-29", status: "Selected"},
                {id: 10, student: 6, drive: 5, date: "2026-07-30", status: "In Process"},
                {id: 11, student: 7, drive: 2, date: "2026-07-29", status: "Selected"},
                {id: 12, student: 8, drive: 2, date: "2026-07-29", status: "In Process"},
                {id: 13, student: 9, drive: 6, date: "2026-07-30", status: "Applied"},
                {id: 14, student: 10, drive: 2, date: "2026-07-29", status: "Selected"},
                {id: 15, student: 11, drive: 3, date: "2026-07-29", status: "Selected"},
                {id: 16, student: 11, drive: 7, date: "2026-08-01", status: "In Process"},
                {id: 17, student: 12, drive: 7, date: "2026-08-01", status: "Rejected"},
                {id: 18, student: 13, drive: 6, date: "2026-07-30", status: "Applied"},
                {id: 19, student: 14, drive: 7, date: "2026-08-01", status: "Selected"},
                {id: 20, student: 15, drive: 6, date: "2026-07-30", status: "In Process"},
                {id: 21, student: 16, drive: 8, date: "2026-08-02", status: "Selected"},
                {id: 22, student: 17, drive: 6, date: "2026-07-30", status: "Rejected"},
                {id: 23, student: 18, drive: 5, date: "2026-07-30", status: "Rejected"},
                {id: 24, student: 18, drive: 9, date: "2026-08-03", status: "Selected"},
                {id: 25, student: 19, drive: 9, date: "2026-08-03", status: "Applied"},
                {id: 26, student: 20, drive: 5, date: "2026-07-30", status: "In Process"},
                {id: 27, student: 20, drive: 10, date: "2026-08-04", status: "Selected"}
            ] AS a

            MERGE (application:Application {applicationId: a.id})
            SET application.applicationDate = a.date,
                application.status = a.status

            WITH application, a
            MATCH (student:Student {studentId: a.student})
            MATCH (drive:JobDrive {driveId: a.drive})

            MERGE (student)-[:SUBMITTED]->(application)
            MERGE (application)-[:FOR_DRIVE]->(drive)
        `);

        console.log("✓ Applications: 27");


        // =====================================================
        // 7. INTERVIEW ROUNDS
        // =====================================================
        await session.run(`
            UNWIND [
                {id: 1, app: 1, num: 1, type: "Aptitude", result: "Cleared", date: "2026-08-05"},
                {id: 2, app: 1, num: 2, type: "Technical", result: "Cleared", date: "2026-08-06"},
                {id: 3, app: 1, num: 3, type: "HR", result: "Cleared", date: "2026-08-07"},
                {id: 4, app: 2, num: 1, type: "Aptitude", result: "Cleared", date: "2026-08-12"},
                {id: 5, app: 2, num: 2, type: "Technical", result: "Pending", date: null},
                {id: 6, app: 3, num: 1, type: "Aptitude", result: "Cleared", date: "2026-08-05"},
                {id: 7, app: 3, num: 2, type: "Technical", result: "Cleared", date: "2026-08-06"},
                {id: 8, app: 3, num: 3, type: "HR", result: "Cleared", date: "2026-08-07"},
                {id: 9, app: 4, num: 1, type: "Aptitude", result: "Cleared", date: "2026-08-05"},
                {id: 10, app: 4, num: 2, type: "Technical", result: "Not Cleared", date: "2026-08-06"},
                {id: 11, app: 5, num: 1, type: "Aptitude", result: "Cleared", date: "2026-08-05"},
                {id: 12, app: 5, num: 2, type: "Technical", result: "Cleared", date: "2026-08-06"},
                {id: 13, app: 6, num: 1, type: "Aptitude", result: "Cleared", date: "2026-08-18"},
                {id: 14, app: 6, num: 2, type: "Technical", result: "Cleared", date: "2026-08-19"},
                {id: 15, app: 6, num: 3, type: "HR", result: "Cleared", date: "2026-08-20"},
                {id: 16, app: 9, num: 1, type: "Aptitude", result: "Cleared", date: "2026-08-15"},
                {id: 17, app: 9, num: 2, type: "Technical", result: "Cleared", date: "2026-08-16"},
                {id: 18, app: 9, num: 3, type: "HR", result: "Cleared", date: "2026-08-17"},
                {id: 19, app: 11, num: 1, type: "Aptitude", result: "Cleared", date: "2026-08-08"},
                {id: 20, app: 11, num: 2, type: "Technical", result: "Cleared", date: "2026-08-09"},
                {id: 21, app: 11, num: 3, type: "HR", result: "Cleared", date: "2026-08-10"},
                {id: 22, app: 14, num: 1, type: "Aptitude", result: "Cleared", date: "2026-08-12"},
                {id: 23, app: 14, num: 2, type: "Technical", result: "Cleared", date: "2026-08-13"},
                {id: 24, app: 15, num: 1, type: "Aptitude", result: "Cleared", date: "2026-08-22"},
                {id: 25, app: 15, num: 2, type: "Technical", result: "Not Cleared", date: "2026-08-23"},
                {id: 26, app: 19, num: 1, type: "Aptitude", result: "Cleared", date: "2026-08-22"},
                {id: 27, app: 19, num: 2, type: "Technical", result: "Cleared", date: "2026-08-23"},
                {id: 28, app: 19, num: 3, type: "HR", result: "Cleared", date: "2026-08-24"},
                {id: 29, app: 21, num: 1, type: "Aptitude", result: "Cleared", date: "2026-08-25"},
                {id: 30, app: 21, num: 2, type: "Technical", result: "Cleared", date: "2026-08-26"},
                {id: 31, app: 23, num: 1, type: "Aptitude", result: "Cleared", date: "2026-08-18"},
                {id: 32, app: 23, num: 2, type: "Technical", result: "Cleared", date: "2026-08-19"},
                {id: 33, app: 23, num: 3, type: "HR", result: "Cleared", date: "2026-08-20"},
                {id: 34, app: 27, num: 1, type: "Aptitude", result: "Cleared", date: "2026-08-28"},
                {id: 35, app: 27, num: 2, type: "Technical", result: "Cleared", date: "2026-08-29"}
            ] AS i

            MERGE (round:InterviewRound {roundId: i.id})
            SET round.roundNumber = i.num,
                round.roundType = i.type,
                round.result = i.result,
                round.roundDate = i.date

            WITH round, i
            MATCH (application:Application {applicationId: i.app})
            MERGE (application)-[:HAS_ROUND]->(round)
        `);

        console.log("✓ Interview Rounds: 35");


        // =====================================================
        // 8. OFFERS
        // =====================================================
        await session.run(`
            UNWIND [
                {id: 1, app: 1, package: 3.60, date: "2026-08-08", status: "Accepted"},
                {id: 2, app: 3, package: 24.00, date: "2026-08-08", status: "Accepted"},
                {id: 3, app: 6, package: 8.00, date: "2026-08-21", status: "Pending"},
                {id: 4, app: 9, package: 24.00, date: "2026-08-18", status: "Accepted"},
                {id: 5, app: 11, package: 6.25, date: "2026-08-11", status: "Accepted"},
                {id: 6, app: 14, package: 6.25, date: "2026-08-11", status: "Accepted"},
                {id: 7, app: 15, package: 12.00, date: "2026-08-13", status: "Accepted"},
                {id: 8, app: 19, package: 9.00, date: "2026-08-25", status: "Pending"},
                {id: 9, app: 21, package: 5.50, date: "2026-08-26", status: "Accepted"},
                {id: 10, app: 23, package: 4.50, date: "2026-08-21", status: "Accepted"},
                {id: 11, app: 27, package: 15.00, date: "2026-08-30", status: "Pending"}
            ] AS o

            MERGE (offer:Offer {offerId: o.id})
            SET offer.packageLpa = o.package,
                offer.offerDate = o.date,
                offer.status = o.status

            WITH offer, o
            MATCH (application:Application {applicationId: o.app})
            MERGE (application)-[:RECEIVED]->(offer)
        `);

        console.log("✓ Offers: 11");


        // =====================================================
        // 9. PLACEMENT COORDINATORS
        // =====================================================
        await session.run(`
            UNWIND [
                {id: 1, name: "Prof. Ramesh Babu", dept: 1, email: "ramesh.babu@vit.ac.in", phone: "9840012345"},
                {id: 2, name: "Prof. Anitha Suresh", dept: 2, email: "anitha.suresh@vit.ac.in", phone: "9840023456"},
                {id: 3, name: "Prof. Kishore Kumar", dept: 3, email: "kishore.kumar@vit.ac.in", phone: "9840034567"},
                {id: 4, name: "Prof. Deepa Ravi", dept: 4, email: "deepa.ravi@vit.ac.in", phone: "9840045678"},
                {id: 5, name: "Prof. Ganesh Iyer", dept: 5, email: "ganesh.iyer@vit.ac.in", phone: "9840056789"}
            ] AS p

            MERGE (coordinator:PlacementCoordinator {coordinatorId: p.id})
            SET coordinator.name = p.name,
                coordinator.email = p.email,
                coordinator.phone = p.phone

            WITH coordinator, p
            MATCH (dept:Department {deptId: p.dept})
            MERGE (coordinator)-[:COORDINATES]->(dept)
        `);

        console.log("✓ Placement Coordinators: 5");

        console.log("\n========================================");
        console.log("Campus Placement graph populated!");
        console.log("========================================\n");

    } catch (error) {
        console.error("\n❌ Population failed:");
        console.error(error);
    } finally {
        await session.close();
        await driver.close();
    }
}

populateDatabase().catch(error => {
    console.error("Unexpected error:", error);
});