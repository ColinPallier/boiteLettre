import React, { useEffect, useState } from "react";
import API from "./api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
//import { Bar } from "react-chartjs-2";
//import { faker } from "@faker-js/faker";
import "bulma/css/bulma.min.css";
import Graph from "./componnent/Graph";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [mesures, setMesures] = useState([]);
  const [statut, setStatut] = useState("");

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Nombre de dépot de courrier par jour",
      },
    },
  };

  useEffect(() => {
    requeteMesures();
  }, []);

  const requeteMesures = async () => {
    try {
      const response1 = await API.get("/ouvertureForEachDays");
      const response2 = await API.get("/lastMesure");
      setMesures(response1.data);
      setStatut(response2.data[0].statut);
    } catch (error) {
      console.error(error);
    }
  };

  const test = async () => {
    try {
      await API.get("/open");
    } catch (error) {}
  };

  //const setDate = new Set();
  //mesures.map((mesure) => labels.push(mesure.id));
  // mesures.forEach((element) => {
  //   const date = new Date(element.date).toISOString().split("T")[0];
  //   setDate.add(date);
  // });

  // const labels = [...setDate];

  const labels = mesures.map((mesure) => mesure.jour);
  const nombre = mesures.map((mesure) => mesure.nombre);

  const data = {
    labels,
    datasets: [
      {
        label: "Nombre de dépot de courrier",
        data: nombre,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      // {
      //   label: "Dataset 2",
      //   data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
      //   backgroundColor: "rgba(53, 162, 235, 0.5)",
      // },
    ],
  };

  return (
    <div>
      <nav
        className="navbar is-info mb-4"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <h2 className="title is-1 has-text-white">Boite aux lettres</h2>
        </div>
      </nav>
      <div className="columns">
        <div className="column is-half">
          <h1 className="title">{statut}</h1>
          <button className="button is-primary" onClick={test}>
            Ouvrir la boite
          </button>
        </div>
        <div className="column is-half">
          <Graph options={options} data={data} />
        </div>
      </div>
    </div>
  );
}

export default App;
