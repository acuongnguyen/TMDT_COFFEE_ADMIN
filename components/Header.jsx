import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import * as actions from '../store/actions';
import { ExportReport } from './ExportReport/exportReport';
import { Revenue } from './DashboardPage/revenue';
import moment from 'moment';

const Header = (props) => {
	const [selectedWeek, setSelectedWeek] = useState(null);

	useEffect(() => {
		const currentWeekStart = moment().startOf('week').add(1, 'day').format('YYYY-MM-DD');
		const currentWeekEnd = moment().endOf('week').add(1, 'day').format('YYYY-MM-DD');
		setSelectedWeek({ start: currentWeekStart, end: currentWeekEnd });
	}, []);

	const dispatch = useDispatch()
	const adminInfo = useSelector((state) => state.admin.adminInfo)

	const handleLogOut = () => {
		dispatch(actions.adminLogOut());
	}
	const sampleData = ['Dữ liệu 1', 'Dữ liệu 2', 'Dữ liệu 3'];
	return (
		<div className="header d-flex align-items-center justify-content-between">
			<h6 className="title-header">{props.title}</h6>
			<div className="account-box d-flex justify-content-between">
				{/* {props.isDashboard &&
					<div className="revenue d-flex align-items-center justify-content-center mr-4">
						<Revenue kpi={1000001} />
					</div>
				} */}
				{props.isDashboard &&
					<div className="export-report d-flex align-items-center justify-content-center mr-4">
						<ExportReport data={sampleData} date={selectedWeek} />
					</div>
				}
				<div className="user-icon-box position-relative">
					<Button
						className="d-flex align-items-center justify-content-center"
						type=""
						icon={<UserOutlined />}
						ghost='true'
						danger='true'
						style={{
							border: "1.5px solid #000",
						}}
					>
						{adminInfo.email}
					</Button>
				</div>
				<div className="logout-box">
					<Button
						className="btn btn-dark d-flex align-items-center justify-content-center"
						type=""
						icon={<LogoutOutlined />}
						danger='true'
						style={{ backgroundColor: "#000" }}
						onClick={handleLogOut}
					>
						Đăng xuất
					</Button>
				</div>
			</div>
		</div>
	)
}

export default Header