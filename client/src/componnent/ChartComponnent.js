import React, { useEffect, useState } from "react";
import API from "../api";
import moment from "moment";

import { Line } from "react-chartjs-2";
import "bulma/css/bulma.min.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ChartComponnent() {
  const [dataMin, setDataMin] = useState([]);
  const [dataMax, setDataMax] = useState([]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Heure du premier et dernier depot de courrier",
      },
      scales: {
        xAxis: {
          type: "time",
          time: {
            unit: "day",
            displayFormats: {
              day: "DD-MM-YYYY",
            },
          },
        },
        yAxis: {
          type: "linear",
          title: {
            display: true,
            text: "Heure",
          },
          ticks: {
            beginAtZero: true,
            max: 24,
            min: 0,
          },
        },
      },
    },
  };

  useEffect(() => {
    requeteMesures();
  }, []);

  const requeteMesures = async () => {
    try {
      const response = await API.get("/maxHourForEachDays");
      const response2 = await API.get("/minHourForEachDays");

      console.log(response2);

      setDataMax(response.data);
      setDataMin(response2.data);
    } catch (error) {
      console.error(error);
    }
  };

  const labels = dataMax.map((data) => data.date_colonne);
  const nombreMax = dataMax.map((data) => data.heure_moyenne_formattee);
  const nombreMin = dataMin.map((data) => data.heure_moyenne_formattee);

  const data = {
    labels,
    datasets: [
      {
        label: "Heure du premier dépot de courrier",
        data: nombreMin.map((timeString) =>
          moment.duration(timeString).asHours()
        ),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Heure du dernier dépot de courrier",
        data: nombreMax.map((timeString) =>
          moment.duration(timeString).asHours()
        ),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return <Line options={options} data={data} />;
}

export default ChartComponnent;
