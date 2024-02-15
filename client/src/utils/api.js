import axios from "axios";

const baseURL =
  `https://${process.env.REACT_APP_IP_SERVEUR}:9000/api` ||
  "https://localhost:9000/api";

export default axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Header":
      "Origin, X-Requested-With, Content-Type, Accept",
  },
});
