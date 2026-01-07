import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { currencyFormat } from '../DataServices/Utils';

const ApexChart = ({ memoChartValueProps }) => {
  const chartData = memoChartValueProps?.data || [];

  const getMaxY = (data = []) => {
    if (!data.length) return 0;
    return Math.max(...data.map(item => item.y || 0));
  };

  const series = useMemo(() => {
    return chartData.map(item => ({
      name: item.name,
      data: item.data?.slice(0, 7) || [], // limit to 7 days
    }));
  }, [chartData]);

  const payOutSeries = chartData.find(s => s.name === "Pay out");
  const payInSeries = chartData.find(s => s.name === "Pay In");

  const payOutMax = getMaxY(payOutSeries?.data);
  const payInMax = getMaxY(payInSeries?.data);
  const yMax = Math.ceil(Math.max(payOutMax, payInMax) / 1000) * 1000;
  const options = useMemo(() => ({
    chart: {
      height: 350,
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: series[0]?.data?.map(d => d.x) || [],
      labels: {
        style: { fontSize: '12px' },
      },
    },
    yaxis: {
      min: 0,
      max: yMax || 1000,
      labels: {
        formatter: val => `${val}`,
        style: { fontSize: '12px' },
      },
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const seriesName = w.globals.seriesNames?.[seriesIndex];
        const data = chartData.find(s => s.name === seriesName)?.data?.[dataPointIndex];
        if (!data) return '';

        return `
          <div style="padding: 8px; font-size: 13px;">
            <strong>${seriesName}</strong><br/>
            Date: ${data?.x}<br/>
            Count: ${data?.no_of_trans || 0}<br/>
            Volume: ${currencyFormat(data?.y) || 0}
          </div>
        `;
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '14px'
    },
    colors: ['#34A853', '#FBBC05'], // Example colors for Pay In, Pay Out
  }), [series, chartData, yMax]);

  return (
    <Chart
      options={options}
      series={series}
      type="bar"
      width="100%"
      height={350}
    />
  );
};

export default ApexChart;