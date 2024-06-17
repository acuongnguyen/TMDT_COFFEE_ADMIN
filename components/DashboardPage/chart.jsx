import React, { useState, useEffect, useRef } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { homeAPI } from '@/config';
import { ExportReport } from '../ExportReport/exportReport';

const RevenueChart = () => {
    const [revenueData, setRevenueData] = useState([]);
    const chartRef = useRef(null);
    const token = localStorage.getItem('token');
    const [selectedWeek, setSelectedWeek] = useState(null);

    useEffect(() => {
        const currentWeekStart = moment().startOf('week').add(1, 'day').format('YYYY-MM-DD');
        const currentWeekEnd = moment().endOf('week').add(1, 'day').format('YYYY-MM-DD');
        setSelectedWeek({ start: currentWeekStart, end: currentWeekEnd });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.post(`${homeAPI}api/cms/dashboard/get-time-revenue`, {
                    startDate: selectedWeek.start,
                    endDate: selectedWeek.end
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setRevenueData(result.data.data)
            } catch (err) {
                console.log(err)
            }
        };
        fetchData();
    }, [selectedWeek]);



    useEffect(() => {
        if (revenueData.length > 0) {
            drawChart();
        }
    }, [revenueData]);

    const drawChart = () => {
        const ctx = chartRef.current.getContext('2d');
        const labels = revenueData.map(item => moment(item.date).format('MMM DD'));
        const data = revenueData.map(item => parseInt(item.total));

        if (chartRef.current.chartInstance) {
            chartRef.current.chartInstance.destroy();
        }

        const newChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Revenue',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        chartRef.current.chartInstance = newChartInstance;
    };

    const handleWeekChange = (dates) => {
        if (dates) {
            const start = dates.startOf('week').add(1, 'day').format('YYYY-MM-DD');
            const end = dates.endOf('week').add(1, 'day').format('YYYY-MM-DD');
            console.log("start", start, "end", end);
            setSelectedWeek({ start: start, end: end });
        } else {
            setSelectedWeek(null);
        }
    }

    return (
        <>
            <div>
                <DatePicker onChange={handleWeekChange} picker="week" defaultValue={selectedWeek} />
                <canvas ref={chartRef} id="revenueChart" width={743} height={400}></canvas>
            </div>
            <div style={{ display: 'none' }}>
                <ExportReport date={selectedWeek} />
            </div>
        </>
    );
};

export default RevenueChart;
