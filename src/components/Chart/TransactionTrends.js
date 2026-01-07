import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const PaymentModeLineChart = ({ transactionModes }) => {
  const acceptedModes = ['UPI', 'IMPS', 'RTGS', 'NEFT'];

  const transformToChartSeries = (payModes = []) => {
    if (!Array.isArray(payModes)) return [];

    return payModes
      .filter(mode => mode && acceptedModes.includes(mode._id))
      .map(mode => {
        const transformedData = Array.isArray(mode.data)
          ? mode.data
              .slice(0, 7)
              .map(item => ({
                x: item?._id ?? 'N/A',
                y: typeof item?.y === 'number' ? item.y : 0
              }))
          : [];

        return {
          name: mode._id ?? 'Unknown Mode',
          data: transformedData
        };
      });
  };

  const [series, setSeries] = useState([]);

  useEffect(() => {
    const transformed = transformToChartSeries(transactionModes);
    setSeries(transformed);
  }, [transactionModes]);

  const options = {
    chart: {
      type: 'line',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 600
      },
      toolbar: { show: false }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      type: 'category',
      // title: { text: 'Date' }
    },
    yaxis: {
      title: { text: 'Amount (₹)' },
      labels: {
        formatter: val => `₹${val?.toLocaleString?.() || 0}`
      }
    },
    tooltip: {
      x: { format: 'yyyy-MM-dd' },
      y: {
        formatter: val =>
          typeof val === 'number' ? `₹${val.toLocaleString()}` : '₹0'
      }
    },
    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560'],
    markers: { size: 4 },
    legend: { position: 'top' }
  };

  return (
    <div className="chart-wrapper fade-in-chart">
      <Chart options={options} series={series} type="line" height={400} />
    </div>
  );
};

export default PaymentModeLineChart;
