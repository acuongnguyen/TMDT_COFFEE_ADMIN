import React, { useEffect, useState } from 'react'
import { Statistic } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

const TotalType = (props) => {
    const [colorArrow, setColorArrow] = useState('#3f8600');
    const [isActive, setIsActive] = useState('Active');

    useEffect(() => {
        if (props.percent < 0) {
            setColorArrow('#cf1322');
            setIsActive('Idle');
        }
        if (props.percent > 0) {
            setColorArrow('#3f8600');
            setIsActive('Active');
        }
    }, [props])
    return (
        <div className="total-dashboard">
            <div className='' style={{ marginLeft: '1.5rem', marginRight: '1.5rem', marginTop: '0.75rem', border: '1px #ccc solid' }}>
                <div className='m-4'>
                    <Statistic title={props.name} value={props.total} className="font-semibold" />
                    <Statistic
                        title={isActive}
                        value={props.percent + "%"}
                        precision={2}
                        valueStyle={{ color: `${colorArrow}` }}
                        prefix={props.percent < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                        suffix={<span style={{ color: 'black', fontSize: '14px' }}>Since 7 days</span>}
                        className="font-semibold"
                    />
                </div>
            </div>
        </div>
    )
}

export default TotalType