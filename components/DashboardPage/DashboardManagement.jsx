import React, { useState, useEffect } from 'react';
import TotalType from './total';
import axios from 'axios'
import { homeAPI } from '@/config'
import TableType from './tableStatistic';
import RevenueChart from './chart';

const Dashboard = () => {
    const [totalOrder, setTotalOrder] = useState('');
    const [totalUser, setTotalUser] = useState('');
    const [timeKey, setTimeKey] = useState(0);
    const token = localStorage.getItem('token');

    const getTotalOrder = async () => {
        try {
            const result = await axios.get(`${homeAPI}api/cms/dashboard/get-bill-number`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setTotalOrder(result.data.data);
        } catch (err) {
            console.log(err)
        }
    }

    const getTotalUser = async () => {
        try {
            const result = await axios.get(`${homeAPI}api/cms/dashboard/get-new-user-number`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setTotalUser(result.data.data);
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getTotalOrder();
        getTotalUser();

        const interval = setInterval(() => {
            getTotalOrder();
            getTotalUser();
            setTimeKey(prevKey => prevKey + 1);
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [])

    return (
        <div className="dashboard">
            <div className='row' style={{ display: 'flex', flexDirection: 'column' }}>
                <div className='col-8' style={{ height: '200px', display: 'flex', float: 'left' }}>
                    <div className='totalOrder' style={{ width: '50%', height: '200px' }}>
                        <TotalType name={"Total Order"} total={totalOrder.bill} percent={totalOrder.percent} />
                    </div>
                    <div className='totalUser' style={{ width: '50%', height: '200px' }}>
                        <TotalType name={"Total New User"} total={totalUser.accountNumber} percent={totalUser.percent} />
                    </div>
                </div>
                <div className='col-8' style={{ float: 'left' }}>
                    <div className='revenue' style={{ height: '424px' }}>
                        <RevenueChart />
                    </div>
                </div>
                <div className='col-4' style={{ float: 'left' }}>
                    <div className='revenueTime' style={{ height: '624px' }}>
                        <TableType key={timeKey} />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Dashboard