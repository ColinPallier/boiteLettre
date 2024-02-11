const express = require("express");
const router = express.Router();
const port = require("../utils/port");
const db = require("../utils/db");

/* GET home page. */
router.get("/", (req, res) => {
  const data = { message: "projet boite aux lettres" };
  res.json(data);
});

router.get("/open", (req, res) => {
  try {
    port.write("o");
    const data = { message: "ouverture" };
    res.json(data);
  } catch (error) {
    console.error("Error opening:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/mesures", async (req, res) => {
  try {
    const data = await db.query("select * from mesures;");
    res.json(data.rows);
  } catch (error) {
    console.error("Error fetching mesures:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/lastMesure", async (req, res) => {
  try {
    const data = await db.query(
      "select * from mesures order by date desc limit 1;"
    );
    res.json(data.rows);
  } catch (error) {
    console.error("Error fetching lastMesure:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/nbMesures", async (req, res) => {
  try {
    const data = await db.query("select count(*) as total from mesures;");
    res.json(data.rows);
  } catch (error) {
    console.error("Error fetching nbMesures:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/mesure/:id", async (req, res) => {
  try {
    const data = await db.query("select * from mesures where id=$1;", [
      req.params.id,
    ]);
    res.json(data.rows);
  } catch (error) {
    console.error("Error fetching mesure by id:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/statut/:statut", async (req, res) => {
  try {
    const data = await db.query("select * from mesures where statut=$1;", [
      req.params.statut,
    ]);
    res.json(data.rows);
  } catch (error) {
    console.error("Error fetching mesure by statut:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/ouvertureForEachDays", async (req, res) => {
  try {
    const data = await db.query(
      "select to_char(mesures.date, 'yyyy-mm-dd') as jour, count(date) as nombre from mesures where statut='ouvert'  group by to_char(mesures.date, 'yyyy-mm-dd') order by to_char(mesures.date, 'yyyy-mm-dd');"
    );
    res.json(data.rows);
  } catch (error) {
    console.error("Error fetching ouvertureForEachDays:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
