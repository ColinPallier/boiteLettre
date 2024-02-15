const express = require("express");
const router = express.Router();
const port = require("../utils/port");
const db = require("../utils/db");

// Centralized Error Handling Middleware
router.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

/* GET home page. */
router.get("/", (req, res) => {
  const data = { message: "projet boite aux lettres" };
  res.json(data);
});

router.get("/open", async (req, res, next) => {
  try {
    port.write("o");
    const data = await db.query(
      "INSERT INTO ouvertures DEFAULT VALUES returning id;"
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/mesures", async (req, res, next) => {
  try {
    const data = await db.query("SELECT * FROM mesures;");
    res.json(data.rows);
  } catch (error) {
    next(error);
  }
});

router.get("/lastMesure", async (req, res, next) => {
  try {
    const data = await db.query(
      "SELECT * FROM mesures ORDER BY date DESC LIMIT 1;"
    );
    res.json(data.rows);
  } catch (error) {
    next(error);
  }
});

router.get("/nbMesures", async (req, res, next) => {
  try {
    const data = await db.query("SELECT COUNT(*) AS total FROM mesures;");
    res.json(data.rows);
  } catch (error) {
    next(error);
  }
});

router.get("/mesure/:id", async (req, res, next) => {
  try {
    const data = await db.query("SELECT * FROM mesures WHERE id=$1;", [
      req.params.id,
    ]);
    res.json(data.rows);
  } catch (error) {
    next(error);
  }
});

router.get("/statut/:statut", async (req, res, next) => {
  try {
    const data = await db.query("SELECT * FROM mesures WHERE statut=$1;", [
      req.params.statut,
    ]);
    res.json(data.rows);
  } catch (error) {
    next(error);
  }
});

router.get("/ouvertureForEachDays", async (req, res, next) => {
  try {
    const data = await db.query(
      "SELECT TO_CHAR(mesures.date AT TIME ZONE 'Europe/Paris', 'DD-MM-YYYY') AS jour, COUNT(date) AS nombre FROM mesures WHERE statut='ouvert' AND mesures.date >= CURRENT_DATE - INTERVAL '6 days' GROUP BY TO_CHAR(mesures.date AT TIME ZONE 'Europe/Paris', 'DD-MM-YYYY') ORDER BY jour;"
    );
    res.json(data.rows);
  } catch (error) {
    next(error);
  }
});

router.get("/maxHourForEachDays", async (req, res, next) => {
  try {
    const data = await db.query(
      "SELECT TO_CHAR(mesures.date AT TIME ZONE 'Europe/Paris', 'DD-MM-YYYY') AS date_colonne, TO_CHAR((MAX(EXTRACT(EPOCH FROM mesures.date AT TIME ZONE 'Europe/Paris' - DATE_TRUNC('day', mesures.date AT TIME ZONE 'Europe/Paris')) / 3600) || ' hours')::interval, 'HH24:MI') AS heure_max FROM mesures WHERE statut = 'ouvert' AND mesures.date >= CURRENT_DATE - INTERVAL '6 days' GROUP BY date_colonne ORDER BY date_colonne;"
    );
    res.json(data.rows);
  } catch (error) {
    next(error);
  }
});

router.get("/minHourForEachDays", async (req, res, next) => {
  try {
    const data = await db.query(
      "SELECT TO_CHAR(mesures.date AT TIME ZONE 'Europe/Paris', 'DD-MM-YYYY') AS date_colonne, TO_CHAR((MIN(EXTRACT(EPOCH FROM mesures.date AT TIME ZONE 'Europe/Paris' - DATE_TRUNC('day', mesures.date AT TIME ZONE 'Europe/Paris')) / 3600) || ' hours')::interval, 'HH24:MI') AS heure_min FROM mesures WHERE statut = 'ouvert' AND mesures.date >= CURRENT_DATE - INTERVAL '6 days' GROUP BY date_colonne ORDER BY date_colonne;"
    );
    res.json(data.rows);
  } catch (error) {
    next(error);
  }
});

router.get("/ouverturesByDays", async (req, res, next) => {
  try {
    const data = await db.query(
      "SELECT TO_CHAR(ouvertures.date, 'DD-MM-YYYY') AS jour, COUNT(*) AS nombre FROM ouvertures WHERE ouvertures.date >= CURRENT_DATE - INTERVAL '6 days' GROUP BY jour ORDER BY jour;"
    );
    res.json(data.rows);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
