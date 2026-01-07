

import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';

const getCombinedPieData = (overall = {}) => {
  const debit = overall?.DEBIT || {};
  const credit = overall?.CREDIT || {};

  return [
    {
      label: 'Debit Success',
      count: debit?.successCount || 0,
      volume: debit?.successVolume || 0,
      successRate: debit?.successRate || 0,
    },
    {
      label: 'Debit Pending',
      count: debit?.initiatedCount || 0,
      volume: debit?.initiatedVolume || 0,
    },
    {
      label: 'Debit Failed',
      count: debit?.failedCount || 0,
      volume: debit?.failedVolume || 0,
    },
    {
      label: 'Credit Success',
      count: credit?.successCount || 0,
      volume: credit?.successVolume || 0,
      successRate: credit?.successRate || 0,
    },
    {
      label: 'Credit Pending',
      count: credit?.initiatedCount || 0,
      volume: credit?.initiatedVolume || 0,
    },
    {
      label: 'Credit Failed',
      count: credit?.failedCount || 0,
      volume: credit?.failedVolume || 0,
    },
  ];
};

const TransactionPieChart = ({ overall }) => {
  const data = useMemo(() => {
    if (!overall) return [];
    return getCombinedPieData(overall);
  }, [overall]);

  const series = data.map((item) => item.count);
  const labels = data.map((item) => item.label);

  const options = {
    chart: { type: 'donut' },
    labels,
    customData: data, // <-- Add custom data to access in tooltip
    legend: {
      position: 'bottom',
      fontSize: '14px',
    },
    tooltip: {
      custom: function ({ series, seriesIndex, w }) {
        const label = w?.config?.labels?.[seriesIndex];
        const count = series?.[seriesIndex];
        const dataItem = w?.config?.customData?.[seriesIndex];
        const volume = dataItem?.volume || 0;
        const successRate =
          dataItem?.successRate !== undefined
            ? (dataItem.successRate * 100).toFixed(2) + '%'
            : null;

        return `
          <div style="padding: 8px; font-size: 13px;">
            <strong>${label}</strong><br/>
            Count: ${count}<br/>
            Volume: ₹${volume.toLocaleString()}<br/>
            ${
              successRate
                ? `<span>Success Rate: ${successRate}</span>`
                : ''
            }
          </div>
        `;
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => (val > 3 ? `${val.toFixed(1)}%` : ''),
    },
    plotOptions: {
      pie: {
        donut: {
          size: '50%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: function (w) {
                const total =
                  w.globals?.series?.reduce((sum, val) => sum + val, 0) || 0;
                return `${total}`;
              },
            },
          },
        },
      },
    },
    colors: ['#28a745', '#ffc107', '#dc3545', '#007bff', '#fd7e14', '#6c757d'],
  };

  return (
    <>
      <div className="text-center recent-transaction-info">
        Combined Transaction Summary
      </div>
      <div>
        <Chart options={options} series={series} type="donut" width="100%" />
      </div>
    </>
  );
};

export default TransactionPieChart;
