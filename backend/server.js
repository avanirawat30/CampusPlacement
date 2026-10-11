const express = require("express");
const cors = require("cors");

const driver = require("./config/neo4j");

const app = express();

app.use(cors());
app.use(express.json());

const DATABASE = "campusplacement";

// ============================================================
// HOME
// ============================================================

app.get("/", (req, res) => {
    res.json({
        message: "Campus Placement Backend is running!",
        database: DATABASE
    });
});

// ============================================================
// TEST NEO4J CONNECTION
// ============================================================

app.get("/api/test-db", async (req, res) => {
    const session = driver.session({
        database: DATABASE
    });

    try {
        const result = await session.run(`
            RETURN "Neo4j Local Database Connected!" AS message
        `);

        res.json({
            message: result.records[0].get("message")
        });

    } catch (error) {
        console.error("Neo4j Error:", error);

        res.status(500).json({
            error: "Database connection failed"
        });

    } finally {
        await session.close();
    }
});

// ============================================================
// GET ALL DEPARTMENTS
// ============================================================

app.get("/api/departments", async (req, res) => {
    const session = driver.session({
        database: DATABASE
    });

    try {
        const result = await session.run(`
            MATCH (d:Department)
            RETURN d
            ORDER BY d.deptId
        `);

        const departments = result.records.map(record =>
            record.get("d").properties
        );

        res.json(departments);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch departments"
        });

    } finally {
        await session.close();
    }
});

// ============================================================
// GET ALL STUDENTS
// ============================================================

app.get("/api/students", async (req, res) => {
    const session = driver.session({
        database: DATABASE
    });

    try {
        const result = await session.run(`
            MATCH (s:Student)-[:BELONGS_TO]->(d:Department)

            RETURN
                s,
                d.deptId AS deptId,
                d.deptName AS department

            ORDER BY s.studentId
        `);

        const students = result.records.map(record => ({
            ...record.get("s").properties,
            deptId: record.get("deptId").toNumber(),
            department: record.get("department")
        }));

        res.json(students);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch students"
        });

    } finally {
        await session.close();
    }
});

// ============================================================
// GET ALL COMPANIES
// ============================================================

app.get("/api/companies", async (req, res) => {
    const session = driver.session({
        database: DATABASE
    });

    try {
        const result = await session.run(`
            MATCH (c:Company)
            RETURN c
            ORDER BY c.companyId
        `);

        const companies = result.records.map(record =>
            record.get("c").properties
        );

        res.json(companies);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch companies"
        });

    } finally {
        await session.close();
    }
});

// ============================================================
// GET ALL JOB DRIVES
// ============================================================

app.get("/api/drives", async (req, res) => {
    const session = driver.session({
        database: DATABASE
    });

    try {
        const result = await session.run(`
            MATCH (j:JobDrive)-[:POSTED_BY]->(c:Company)

            RETURN
                j,
                c.companyId AS companyId,
                c.companyName AS companyName

            ORDER BY j.driveId
        `);

        const drives = result.records.map(record => ({
            ...record.get("j").properties,
            companyId: record.get("companyId").toNumber(),
            companyName: record.get("companyName")
        }));

        res.json(drives);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch job drives"
        });

    } finally {
        await session.close();
    }
});

// ============================================================
// GET ALL APPLICATIONS OF A STUDENT
// ============================================================

app.get("/api/students/:id/applications", async (req, res) => {
    const session = driver.session({
        database: DATABASE
    });

    try {
        const result = await session.run(`
            MATCH (s:Student {studentId: $studentId})
                  -[:SUBMITTED]->(a:Application)
                  -[:FOR_DRIVE]->(j:JobDrive)
                  -[:POSTED_BY]->(c:Company)

            RETURN
                a,
                j,
                c

            ORDER BY a.applicationId
        `, {
            studentId: Number(req.params.id)
        });

        const applications = result.records.map(record => ({
            application: record.get("a").properties,
            drive: record.get("j").properties,
            company: record.get("c").properties
        }));

        res.json(applications);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch student applications"
        });

    } finally {
        await session.close();
    }
});

// ============================================================
// GET ALL APPLICATIONS FOR A DRIVE
// ============================================================
app.get("/api/applications", async (req, res) => {
    const session = driver.session({ database: DATABASE });

    try {
        const result = await session.run(`
            MATCH (s:Student)-[:SUBMITTED]->(a:Application)
                  -[:FOR_DRIVE]->(j:JobDrive)
                  -[:POSTED_BY]->(c:Company)
            RETURN
                a.applicationId AS applicationId,
                a.appliedDate AS appliedDate,
                a.status AS status,
                s.regNo AS regNo,
                s.name AS studentName,
                j.driveId AS driveId,
                j.roleOffered AS roleOffered,
                j.packageLpa AS packageLpa,
                j.driveType AS driveType,
                c.companyName AS companyName
            ORDER BY a.applicationId
        `);

        res.json(result.records.map(record => ({
            applicationId: record.get("applicationId"),
            appliedDate: record.get("appliedDate"),
            status: record.get("status"),
            regNo: record.get("regNo"),
            studentName: record.get("studentName"),
            driveId: record.get("driveId"),
            roleOffered: record.get("roleOffered"),
            packageLpa: record.get("packageLpa"),
            driveType: record.get("driveType"),
            companyName: record.get("companyName")
        })));

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch applications"
        });
    } finally {
        await session.close();
    }
});
app.get("/api/drives/:id/applications", async (req, res) => {
    const session = driver.session({
        database: DATABASE
    });

    try {
        const result = await session.run(`
            MATCH (j:JobDrive {driveId: $driveId})
                  <-[:FOR_DRIVE]-(a:Application)
                  <-[:SUBMITTED]-(s:Student)

            RETURN
                a,
                s

            ORDER BY a.applicationId
        `, {
            driveId: Number(req.params.id)
        });

        const applications = result.records.map(record => ({
            application: record.get("a").properties,
            student: record.get("s").properties
        }));

        res.json(applications);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch drive applications"
        });

    } finally {
        await session.close();
    }
});

// ============================================================
// GET ALL DRIVES POSTED BY A COMPANY
// ============================================================

app.get("/api/companies/:id/drives", async (req, res) => {
    const session = driver.session({
        database: DATABASE
    });

    try {
        const result = await session.run(`
            MATCH (c:Company {companyId: $companyId})
                  <-[:POSTED_BY]-(j:JobDrive)

            RETURN j
            ORDER BY j.driveId
        `, {
            companyId: Number(req.params.id)
        });

        const drives = result.records.map(record =>
            record.get("j").properties
        );

        res.json(drives);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch company drives"
        });

    } finally {
        await session.close();
    }
});

// ============================================================
// GET STUDENT'S ELIGIBLE DRIVES
// ============================================================

// ============================================================
// GET STUDENT'S ELIGIBLE DRIVES
// ============================================================

app.get("/api/students/:id/eligible-drives", async (req, res) => {
    const session = driver.session({
        database: DATABASE
    });

    try {
        const result = await session.run(`
            MATCH (s:Student {studentId: $studentId})
                  -[:BELONGS_TO]->(studentDept:Department)

            MATCH (j:JobDrive)-[:HAS_ELIGIBILITY]->(e:EligibilityCriteria)

            OPTIONAL MATCH (e)-[:ELIGIBLE_FOR]->(requiredDept:Department)

            WITH s, studentDept, j, e, requiredDept

            WHERE s.cgpa >= e.minCgpa
              AND s.backlogs <= e.maxBacklogs
              AND (
                  requiredDept IS NULL
                  OR requiredDept.deptId = studentDept.deptId
              )

            MATCH (j)-[:POSTED_BY]->(c:Company)

            RETURN
                j.driveId AS driveId,
                j.driveDate AS driveDate,
                j.driveType AS driveType,
                j.packageLpa AS packageLpa,
                j.roleOffered AS roleOffered,
                c.companyName AS companyName,
                e.minCgpa AS minimumCgpa,
                e.maxBacklogs AS maximumBacklogs

            ORDER BY j.driveId
        `, {
            studentId: Number(req.params.id)
        });

        const drives = result.records.map(record => ({
            driveId: record.get("driveId"),
            driveDate: record.get("driveDate"),
            driveType: record.get("driveType"),
            packageLpa: record.get("packageLpa"),
            roleOffered: record.get("roleOffered"),
            companyName: record.get("companyName"),
            minimumCgpa: record.get("minimumCgpa"),
            maximumBacklogs: record.get("maximumBacklogs")
        }));

        res.json(drives);

    } catch (error) {
        console.error("Eligible drives error:", error);

        res.status(500).json({
            error: "Failed to calculate eligible drives"
        });

    } finally {
        await session.close();
    }
});

// ============================================================
// GET STUDENT'S COMPLETE PLACEMENT JOURNEY
// ============================================================

app.get("/api/students/:id/journey", async (req, res) => {
    const session = driver.session({
        database: DATABASE
    });

    try {
        const result = await session.run(`
            MATCH (s:Student {studentId: $studentId})
                  -[:SUBMITTED]->(a:Application)
                  -[:FOR_DRIVE]->(j:JobDrive)
                  -[:POSTED_BY]->(c:Company)

            OPTIONAL MATCH (a)-[:HAS_ROUND]->(r:InterviewRound)
            OPTIONAL MATCH (a)-[:RECEIVED]->(o:Offer)

            RETURN
                s,
                a,
                j,
                c,
                collect(DISTINCT r) AS rounds,
                o

            ORDER BY a.applicationId
        `, {
            studentId: Number(req.params.id)
        });

        const journey = result.records.map(record => ({
            student: record.get("s").properties,
            application: record.get("a").properties,
            drive: record.get("j").properties,
            company: record.get("c").properties,

            interviewRounds: record
                .get("rounds")
                .filter(round => round !== null)
                .map(round => round.properties),

            offer: record.get("o")
                ? record.get("o").properties
                : null
        }));

        res.json(journey);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch placement journey"
        });

    } finally {
        await session.close();
    }
});

// ============================================================
// GET PLACEMENT ANALYTICS
// ============================================================

app.get("/api/analytics/placements", async (req, res) => {
    const session = driver.session({
        database: DATABASE
    });

    try {

        // Total students
        const studentsResult = await session.run(`
            MATCH (s:Student)
            RETURN count(s) AS count
        `);

        // Total applications
        const applicationsResult = await session.run(`
            MATCH (a:Application)
            RETURN count(a) AS count
        `);

        // Selected applications
        const selectedResult = await session.run(`
            MATCH (a:Application)
            WHERE a.status = "Selected"
            RETURN count(a) AS count
        `);

        // Accepted offers
        const offersResult = await session.run(`
            MATCH (o:Offer)
            WHERE o.status = "Accepted"
            RETURN count(o) AS count
        `);

        // Companies
        const companiesResult = await session.run(`
            MATCH (c:Company)
            RETURN count(c) AS count
        `);

        // Drives
        const drivesResult = await session.run(`
            MATCH (j:JobDrive)
            RETURN count(j) AS count
        `);

        res.json({
            totalStudents:
                studentsResult.records[0].get("count").toNumber(),

            totalApplications:
                applicationsResult.records[0].get("count").toNumber(),

            selectedApplications:
                selectedResult.records[0].get("count").toNumber(),

            acceptedOffers:
                offersResult.records[0].get("count").toNumber(),

            totalCompanies:
                companiesResult.records[0].get("count").toNumber(),

            totalDrives:
                drivesResult.records[0].get("count").toNumber()
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch placement analytics"
        });

    } finally {
        await session.close();
    }
});

// ============================================================
// SUBMIT AN APPLICATION
// ============================================================

app.post("/api/applications", async (req, res) => {
    const session = driver.session({
        database: DATABASE
    });

    try {
        const {
            applicationId,
            studentId,
            driveId,
            applicationDate,
            status
        } = req.body;

        const result = await session.run(`
            MATCH (s:Student {studentId: $studentId})
            MATCH (j:JobDrive {driveId: $driveId})

            CREATE (a:Application {
                applicationId: $applicationId,
                applicationDate: $applicationDate,
                status: $status
            })

            CREATE (s)-[:SUBMITTED]->(a)
            CREATE (a)-[:FOR_DRIVE]->(j)

            RETURN a
        `, {
            applicationId: Number(applicationId),
            studentId: Number(studentId),
            driveId: Number(driveId),

            applicationDate:
                applicationDate ||
                new Date().toISOString().split("T")[0],

            status: status || "Applied"
        });

        res.status(201).json({
            message: "Application created successfully",
            application: result.records[0].get("a").properties
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to create application"
        });

    } finally {
        await session.close();
    }
});

// ============================================================
// START SERVER
// ============================================================

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});