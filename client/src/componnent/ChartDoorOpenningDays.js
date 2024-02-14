import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ChartDoorOpenningDays() {
  const [ouvertures, setOuvertures] = useState([]);

  useEffect(() => {
    requeteAPI();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Nombre d'ouverture de la porte par jour",
      },
    },
    scale: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Jours",
        },
        stepSize: 1,
      },
    },
  };

  const requeteAPI = async () => {
    try {
      const response = await API.get("/ouverturesByDays");
      setOuvertures(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const labels = ouvertures.map((mesure) => mesure.jour);
  const content = ouvertures.map((mesure) => mesure.nombre);

  const data = {
    labels,
    datasets: [
      {
        label: "Nombre de dépot de courrier",
        data: content,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
}

export default ChartDoorOpenningDays;
