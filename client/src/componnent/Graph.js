import React from "react";
import { Bar } from "react-chartjs-2";

const Graph = ({ options, data }) => {
  return (
    <div>
      <Bar options={options} data={data} />
    </div>
  );
};

export default Graph;
