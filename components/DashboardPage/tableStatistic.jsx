import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { homeAPI } from '@/config';
import { Button } from 'antd';
import { formatPrice } from '@/helpers/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TableType = (props) => {
    const [selectedOption, setSelectedOption] = useState('day');
    const [statistics, setStatistics] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = `${homeAPI}api/cms/dashboard/get-daily-item-top-revenue`;
                if (selectedOption === 'week') url = `${homeAPI}api/cms/dashboard/get-week-item-top-revenue`;
                if (selectedOption === 'month') url = `${homeAPI}api/cms/dashboard/get-month-item-top-revenue`;

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setStatistics(response.data.data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };
        fetchData();
    }, [selectedOption, props.key]);

    const formattedData = statistics.map((item, index) => ({
        name: item.name,
        revenue: item.total,
        index: index + 1
    }));

    return (
        <div className='chartDashboard'>
            <div className='navBar'>
                <Button type={selectedOption === 'day' ? 'primary' : 'default'} onClick={() => setSelectedOption('day')}>
                    Day
                </Button>
                <Button type={selectedOption === 'week' ? 'primary' : 'default'} onClick={() => setSelectedOption('week')}>
                    Week
                </Button>
                <Button type={selectedOption === 'month' ? 'primary' : 'default'} onClick={() => setSelectedOption('month')}>
                    Month
                </Button>
            </div>
            <div className='chartContainer'>
                <ResponsiveContainer width="100%" height={600}>
                    <BarChart
                        layout="vertical"
                        data={formattedData}
                        margin={{
                            top: 20, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: '12px' }} />
                        <Tooltip formatter={(value) => formatPrice(value)} />
                        <Legend />
                        <Bar dataKey="revenue" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default TableType;
