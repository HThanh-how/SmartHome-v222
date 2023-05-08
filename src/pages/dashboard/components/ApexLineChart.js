import React, { useState, useEffect } from 'react';
import ApexCharts from "react-apexcharts";

  




const chartSettings = {
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  xaxis: {
    type: "category",
    categories: [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ],
    labels: {
      style: {
        colors: "#6B859E",
        opacity: 0.7,
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: ["#6B859E"],
        opacity: 0.7,
      },
    },
  },
  tooltip: {
    x: {
      show: false,
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 1,
      stops: [40, 90, 100]
    }
  },
  colors: ["#4D53E0", "#41D5E2"],
  chart: {
    toolbar: {
      show: false,
    },
  },
  legend: {
    show: true,
    horizontalAlign: "center",
  },
};

export default function ApexLineChart() {
  const [lastData, setLastData] = useState([]);
  const [humidData, setHumidData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/v1/data');
      const json = await response.json();
      setLastData(json.slice(0,7));
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/v2/data');
      const json = await response.json();
      setHumidData(json.slice(0,7));
    };

    fetchData();
  }, []);

  const series = [
    {
      name: "Nhiệt độ",
      data: [parseFloat(lastData[6]?.value), parseFloat(lastData[5]?.value), parseFloat(lastData[4]?.value), parseFloat(lastData[3]?.value), parseFloat(lastData[2]?.value), parseFloat(lastData[1]?.value), parseFloat(lastData[0]?.value)],
    },
    {
      name: "Độ ẩm",
      data: [parseFloat(humidData[6]?.value)%50, parseFloat(humidData[5]?.value)%50, parseFloat(humidData[4]?.value), parseFloat(humidData[3]?.value)%50, parseFloat(humidData[2]?.value)%50, parseFloat(humidData[1]?.value), parseFloat(humidData[0]?.value)],
    },
  ];


  return (
    <ApexCharts
      options={chartSettings}
      series={series}
      type="area"
      height={300}
    />
  );
}
