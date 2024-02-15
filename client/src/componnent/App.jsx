import React, { useEffect, useState } from "react";
import API from "../utils/api";
import "bulma/css/bulma.min.css";
import ChartFirstAndLast from "./ChartFirstAndLast";
import ChartNumberOpenningDays from "./ChartNumberOpenningDays";
import ChartDoorOpenningDays from "./ChartDoorOpenningDays";
import { io } from "socket.io-client";

const socket = io(`https://${process.env.REACT_APP_IP_SERVEUR}:9000`, {
  transports: ["websocket"],
  withCredentials: true,
  credentials: "include",
});

function App() {
  const [statut, setStatut] = useState("ferme");
  const [chartDoorUpdate, setChartDoorUpdate] = useState(false);
  const [chartLetterUpdate, setChartLetterUpdate] = useState(false);

  useEffect(() => {
    const initWebSocket = () => {
      socket.on("statut", (newStatut) => {
        setStatut(newStatut);
        if (newStatut === "ouvert") setChartLetterUpdate(!chartLetterUpdate);
      });
    };

    initWebSocket();
  }, [chartLetterUpdate]);

  const open = async () => {
    try {
      await API.get("/open");
      setChartDoorUpdate(!chartDoorUpdate);
    } catch (error) {}
  };

  return (
    <div>
      <nav
        className="navbar is-primary mb-4 p-4"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <h2 className="title is-1 has-text-white">Boite aux lettres</h2>
        </div>
      </nav>
      <div className="p-5">
        <div className="columns">
          <div className="column tile is-ancestor">
            <div className="tile is-parent is-vertical">
              <div className="tile is-child box">
                <div className="title has-text-left">
                  Etat de la boite aux lettres en temps réel
                </div>
                <div className="column is-offset-one-quarter is-half">
                  <div
                    className={`box has-text-centered  ${
                      statut === "ouvert"
                        ? "has-background-primary"
                        : "has-background-danger"
                    }`}
                  >
                    <p className="is-size-4 has-text-white">{statut}</p>
                  </div>
                </div>
              </div>
              <div className="tile is-child box">
                <div className="title has-text-left">
                  Ouverture de la boite au lettre
                </div>
                <div className="column is-offset-one-quarter is-half">
                  <div className="has-text-centered">
                    <button
                      className=" is-size-4 button is-primary"
                      onClick={open}
                    >
                      Ouvrir la boite
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="tile is-parent">
              <ChartNumberOpenningDays
                key={chartLetterUpdate}
              ></ChartNumberOpenningDays>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column is-half">
            <ChartDoorOpenningDays
              key={chartDoorUpdate}
            ></ChartDoorOpenningDays>
          </div>
          <div className="column is-half">
            <ChartFirstAndLast key={chartLetterUpdate}></ChartFirstAndLast>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="content has-text-centered">
          <p>Colin Pallier</p>
          <p>Projet IOT 2023-2024</p>
          <p>Université Le Havre Normandie</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
