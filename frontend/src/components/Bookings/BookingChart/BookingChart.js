import React from "react";
import { Pie } from "react-chartjs-2";

const BOOKINGS_BUCKETS = {
  Cheap: {
    min: 0,
    max: 100,
  },
  Normal: {
    min: 100,
    max: 200,
  },
  Expensive: {
    min: 200,
    max: 100_000_000,
  },
};

const bookingChart = ({ bookings }) => {
  const chartData = { labels: [] };
  let values = [];
  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = bookings.reduce((prev, current) => {
      if (
        current.event.price > BOOKINGS_BUCKETS[bucket].min &&
        current.event.price < BOOKINGS_BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    values.push(filteredBookingsCount);
    chartData.labels.push(bucket);
  }

  chartData.datasets = [
    {
      data: values,
      backgroundColor: [
        "rgba(153, 102, 255, 0.8)",
        "rgba(75, 192, 192, 0.8)",
        "rgba(255, 206, 86, 0.8)",
      ],
      borderColor: [
        "rgba(255, 255, 255, 1)",
        "rgba(255, 255, 255, 1)",
        "rgba(255, 255, 255, 1)",
      ],
      borderWidth: 3,
    },
  ];

  console.log(chartData);

  return (
    <div style={{ textAlign: "center", marginTop: "15px" }}>
      <Pie
        data={chartData}
        width={500}
        height={500}
        options={{ maintainAspectRatio: false }}
      />
    </div>
  );
};

export default bookingChart;
