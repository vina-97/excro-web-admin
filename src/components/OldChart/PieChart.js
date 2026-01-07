
import React from "react";
import Chart from 'react-apexcharts';

const PieApexChart = () => {
    const series = [400, 140, 260]
    const options = {
        chart: {
           height:260,
            type: 'polarArea'
        },
        labels: ['Merchants', 'Payouts Merchants', 'Merchants'],
        fill: {
            opacity: 1,
            colors: ['#685dfa' , '#fe727c',  '#ffbc6e'],
        },
        stroke: {
            width: 1,
            colors: ['#685dfa', '#fe727c' , '#ffbc6e'],
        },
        yaxis: {
            show: false
        },
        legend: {
            show:false,
            position: 'bottom'
        },
        plotOptions: {
            polarArea: {
                rings: {
                    strokeWidth: 0
                },
                spokes: {
                    strokeWidth: 0
                },
            }
        },
        theme: {
            monochrome: {
                enabled: true,
                shadeTo: 'light',
                shadeIntensity: 0.6,
            }
        }
    };

    return <Chart options={options} type="polarArea" series={series}  />
        
}


export default PieApexChart;