import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const DonutChart = (props) => {

  const [chartOptions, setChartOptions] = useState({
    series: [],
    options: {
      chart: {
        type: 'donut',
      },
      labels: [],
      colors: ['#3bcc7c', '#ff8b07', '#f84f7a'], // Colors for success, pending, and failure
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270,
        },
      },
      dataLabels: {
        enabled: true, // Enable labels for better visualization
      },
      fill: {
        type: 'gradient',
      },
      legend: {
        formatter: function (val, opts) {
          return val + ' - ' + opts.w.globals.series[opts.seriesIndex] + '%';
        },
      },
      title: {
        text: 'Credit Transaction Count Percentage',
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  });



  useEffect(() => {
    // Extract percentages and set the series and labels
    const { successPercentage, pendingPercentage, failurePercentage } =
      props.percentage.transaction_count?.CREDIT;

    const series = [successPercentage, pendingPercentage, failurePercentage];
    const labels = ['Success', 'Pending', 'Failure'];

    // Update the chart state
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      series,
      options: {
        ...prevOptions.options,
        labels,
      },
    }));
  }, []);

  return (
    <div className='donutCredit'>
      <div id="chart">
        <ReactApexChart
          options={chartOptions.options}
          series={chartOptions.series}
          type="donut"
          width={480}
        />
      </div>
    </div>
  );
};

export default DonutChart;
