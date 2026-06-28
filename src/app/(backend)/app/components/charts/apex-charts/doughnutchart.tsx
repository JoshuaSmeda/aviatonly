"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ApexDoughnutChart = () => {
  const ChartData: ApexOptions = {
    series: [44, 55, 41, 17, 15],
    chart: {
      type: "donut",
      height: 300,
      fontFamily: `inherit`,
      foreColor: "var(--muted-foreground)",
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70px",
        },
      },
    },
    stroke: {
      width: 2,
      colors: ["var(--color-border)"],
    },
    legend: {
      show: true,
      position: "bottom",
    },
    colors: [
      "var(--color-chart-5)",
      "var(--color-primary)",
      "var(--color-destructive)",
      "var(--color-chart-2)",
      "var(--color-chart-4 )",
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <>
      <Chart
        options={ChartData}
        series={ChartData.series}
        type="donut"
        height="300px"
        width="100%"
      />
    </>
  );
};

export default ApexDoughnutChart;
