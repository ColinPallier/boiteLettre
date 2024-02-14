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

function ChartNumberOpenningDays() {
  const [mesures, setMesures] = useState([]);

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
        text: "Nombre de dépot de courrier par jour",
      },
    },
  };

  const requeteAPI = async () => {
    try {
      const response = await API.get("/ouvertureForEachDays");
      setMesures(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const labels = mesures.map((mesure) => mesure.jour);
  const content = mesures.map((mesure) => mesure.nombre);

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

export default ChartNumberOpenningDays;
