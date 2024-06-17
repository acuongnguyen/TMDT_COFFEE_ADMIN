import React, { useEffect } from 'react'
import moment from 'moment';
import { useState } from 'react';

const Revenue = (props) => {
    const [kpiCurrent, setKpiCurrent] = useState(0);
    const currentMonth = moment().month();
    useEffect(() => {
        setKpiCurrent(props.kpi);
    }, [props])

    const kpi = 100000000;

    return (
        <div>
            <p>KPI = {kpiCurrent}/{kpi}</p>
        </div>
    )
}

export default Revenue;