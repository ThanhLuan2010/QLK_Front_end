import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const formatTime = (minutes) => {
    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours} giờ ${remainingMinutes} phút`;
    }
    return `${minutes} phút`;
};

const ChartComponent = ({ data }) => {
    const chartData = {
        labels: [
            'Số lần đi trễ',
            'Số lần về sớm',
            'Tổng số giờ đi trễ',
            'Tổng số giờ bị trừ',
            'Thời gian OT',
            'Số giờ theo ca làm'
        ],
        datasets: [
            {
                label: 'Thông số về thời gian',
                data: [
                    data?.total_time_checkin_late,
                    data?.total_time_checkout_early,
                    data?.total_minutes_checkin_late,
                    data?.total_minutes_fined,
                    data?.total_overtime,
                    data?.total_time || 0
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Biểu đồ thời gian làm việc',
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const labelIndex = tooltipItem.dataIndex;
                        const value = tooltipItem.raw;
                        if (labelIndex === 2 || labelIndex === 3) {
                            return `${tooltipItem.label}: ${formatTime(value)}`;
                        }
                        return `${tooltipItem.label}: ${value}`;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    maxRotation: 0,
                    minRotation: 0,
                    autoSkip: false,
                    callback: function (value, index) {
                        const label = this.getLabelForValue(index);
                        const words = label.split(' ');

                        let lines = [];
                        for (let i = 0; i < words.length; i += 3) {
                            lines.push(words.slice(i, i + 3).join(' '));
                        }

                        return lines;
                    }
                }
            },
            y: {
                beginAtZero: true,
                stepSize: 1
            }
        }
    };

    return <Bar data={chartData} options={options} />;
};

export default ChartComponent;