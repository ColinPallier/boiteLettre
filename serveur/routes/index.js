const express = require("express");
const router = express.Router();
const port = require("../utils/port");
const db = require("../utils/db");

/* GET home page. */
router.get("/", (req, res) => {
  const data = { message: "projet boite aux lettres" };
  res.json(data);
});

router.get("/open", async (req, res) => {
  try {
    port.write("o");
    const data = await db.query(
      "INSERT INTO ouvertures DEFAULT VALUES returning id;"
    );
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
      "select to_char(mesures.date AT TIME ZONE 'Europe/Paris', 'dd-mm-yyyy') as jour, count(date) as nombre from mesures where statut='ouvert'  group by to_char(mesures.date AT TIME ZONE 'Europe/Paris', 'dd-mm-yyyy') order by to_char(mesures.date AT TIME ZONE 'Europe/Paris', 'dd-mm-yyyy');"
    );
    res.json(data.rows);
  } catch (error) {
    console.error("Error fetching ouvertureForEachDays:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/maxHourForEachDays", async (req, res) => {
  try {
    const data = await db.query(
      "SELECT TO_CHAR(mesures.date AT TIME ZONE 'Europe/Paris', 'DD-MM-YYYY') AS date_colonne, TO_CHAR( (MAX(EXTRACT(EPOCH FROM mesures.date AT TIME ZONE 'Europe/Paris' - DATE_TRUNC('day', mesures.date AT TIME ZONE 'Europe/Paris')) / 3600) || ' hours')::interval, 'HH24:MI' ) AS heure_max FROM mesures WHERE statut = 'ouvert' GROUP BY date_colonne ORDER BY date_colonne;"
    );
    res.json(data.rows);
  } catch (error) {
    console.error("Error fetching ouvertureForEachDays:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/minHourForEachDays", async (req, res) => {
  try {
    const data = await db.query(
      "SELECT TO_CHAR(mesures.date AT TIME ZONE 'Europe/Paris', 'DD-MM-YYYY') AS date_colonne, TO_CHAR( (MIN(EXTRACT(EPOCH FROM mesures.date AT TIME ZONE 'Europe/Paris' - DATE_TRUNC('day', mesures.date AT TIME ZONE 'Europe/Paris')) / 3600) || ' hours')::interval, 'HH24:MI' ) AS heure_min FROM mesures WHERE statut = 'ouvert' GROUP BY date_colonne ORDER BY date_colonne;"
    );
    res.json(data.rows);
  } catch (error) {
    console.error("Error fetching ouvertureForEachDays:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/ouverturesByDays", async (req, res) => {
  try {
    const data = await db.query(
      "select TO_CHAR(ouvertures.date , 'DD-MM-YYYY') as jour,  count(*) as nombre from ouvertures group by jour order by jour;"
    );
    res.json(data.rows);
  } catch (error) {
    console.error("Error fetching mesures:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
