import React from 'react'
import Header from '@/components/Header';
import Dashboard from '@/components/DashboardPage/DashboardManagement';
import { ExportReport } from '@/components/ExportReport/exportReport';

const DashboardPage = () => {
    const isDashboard = true;
    return (
        <div className='catalog-management-page'>
            <Header title="DASHBOARD" isDashboard={isDashboard} />
            <div className="row">
                <div className="col-12">
                    <Dashboard />
                </div>
            </div>
        </div>
    )
}

export default DashboardPage