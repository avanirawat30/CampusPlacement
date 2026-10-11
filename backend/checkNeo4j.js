const driver = require("./config/neo4j");

async function check() {
    const session = driver.session({
        database: "campusplacement"
    });

    try {
        const result = await session.run(`
            MATCH (n)
            RETURN count(n) AS total
        `);

        console.log("Database: campusplacement");
        console.log("Nodes:", result.records[0].get("total").toNumber());
    } catch (error) {
        console.error(error);
    } finally {
        await session.close();
        await driver.close();
    }
}

check();