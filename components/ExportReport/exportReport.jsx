import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import { homeAPI } from '@/config';
import openSansRegular from './OpenSans-Regular.ttf.base64';

const addFontToDoc = (doc) => {
    const fontName = 'OpenSans';
    const font = openSansRegular;
    doc.addFileToVFS(`${fontName}.ttf`, font);
    doc.addFont(`${fontName}.ttf`, fontName, 'normal');
    doc.setFont(fontName);
};

export const ExportReport = (props) => {
    const [loading, setLoading] = useState(false);
    const [statistics, setStatistics] = useState({ day: [], week: [], month: [] });
    const token = localStorage.getItem('token');
    const [revenueData, setRevenueData] = useState([]);
    const [categotyData, setCategoryData] = useState([]);
    const [revenueRate, setRevenueRate] = useState([]);

    useEffect(() => {
        const fetchData = async (option) => {
            try {
                let url = `${homeAPI}api/cms/dashboard/get-daily-item-top-revenue`;
                if (option === 'week') url = `${homeAPI}api/cms/dashboard/get-week-item-top-revenue`;
                if (option === 'month') url = `${homeAPI}api/cms/dashboard/get-month-item-top-revenue`;

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return response.data.data;
            } catch (error) {
                console.error(`Error fetching ${option} statistics:`, error);
                return [];
            }
        };

        const fetchAllData = async () => {
            const dayData = await fetchData('day');
            const weekData = await fetchData('week');
            const monthData = await fetchData('month');
            setStatistics({ day: dayData, week: weekData, month: monthData });
        };

        fetchAllData();
    }, []);

    useEffect(() => {
        const fetchData = async (option) => {
            try {
                let url = `${homeAPI}api/cms/dashboard/get-revenue-and-rate`;

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const updatedRevenueRate = response.data.data.matrix.map(item => {
                    let quality = "";
                    if (item.evaluate_point < 0.7) {
                        quality = "Bad";
                    } else if (item.evaluate_point < 0.9) {
                        quality = "Medium";
                    } else {
                        quality = "Good";
                    }
                    return {
                        ...item,
                        quality: quality
                    };
                });

                setRevenueRate(updatedRevenueRate);
            } catch (error) {
                console.error(`Error fetching ${option} statistics:`, error);
                return [];
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.post(`${homeAPI}api/cms/dashboard/get-time-revenue-for-category`, {
                    startDate: props.date.start,
                    endDate: props.date.end
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setCategoryData(result.data.data);
            } catch (err) {
                console.log(err)
            }
        };
        fetchData();
    }, [props.date]);

    const handleDownload = () => {
        const doc = new jsPDF();
        addFontToDoc(doc);
        doc.text('Báo cáo Doanh thu', 14, 14);

        const generateTable = (data, title, startY) => {
            const tableColumn = ["Tên sản phẩm", "Doanh thu"];
            const tableRows = data.map(item => [
                item.name,
                item.total.toLocaleString()
            ]);
            doc.text(title, 14, startY);
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: startY + 6,
                theme: 'grid',
                headStyles: { fillColor: [52, 73, 94] },
                styles: { fontSize: 10, cellPadding: 3, font: "OpenSans" }
            });
            return doc.autoTable.previous.finalY + 10;
        };

        const generateDetailedTable = (data, title, startY) => {
            if (!data || data.length === 0) return startY;
            const tableColumn = [
                "Name", "Last Revenue", "Current Revenue",
                "Change Revenue", "Last Rate",
                "Curent Rate", "Change Rate", "Evaluate", "Quality"
            ];
            const tableRows = data.map(item => {
                let quality = "";
                if (item.evaluate_point < 0.7) {
                    quality = "Bad";
                } else if (item.evaluate_point < 0.9) {
                    quality = "Medium";
                } else {
                    quality = "Good";
                }

                return [
                    item.name,
                    item.last_total.toLocaleString(),
                    item.current_total.toLocaleString(),
                    item.price_change_percentage.toFixed(2) + "%",
                    item.last_average_rate,
                    item.current_average_rate,
                    item.rate_change_percentage.toFixed(2) + "%",
                    { content: item.evaluate_point.toFixed(3) },
                    quality
                ];
            });
            doc.text(title, 14, startY);
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: startY + 6,
                theme: 'grid',
                headStyles: { fillColor: [52, 73, 94] },
                styles: { fontSize: 10, cellPadding: 3, font: "OpenSans" },
                didParseCell: function (data) {
                    if (data.column.dataKey === "Evaluate") {
                        data.cell.styles.fillColor = data.row.raw[7].styles.cellBackgroundColor;
                    }
                }
            });
            return doc.autoTable.previous.finalY + 10;
        };

        const generateCategoryTable = (data, title, startY) => {
            const tableColumns = ["Category", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Total"];

            const tableRows = Object.keys(data).map(category => {
                const rowData = [category];
                let totalSum = 0;
                for (let i = 0; i < 7; i++) {
                    const date = `2024-06-${10 + i}`;
                    const entry = data[category].find(item => item.date === date);
                    if (entry) {
                        const revenue = parseInt(entry.total);
                        rowData.push(revenue.toLocaleString());
                        totalSum += revenue;
                    } else {
                        rowData.push("0");
                    }
                }
                rowData.push(totalSum.toLocaleString());
                return rowData;
            });

            const totalsRow = ["Total"];
            let weeklyTotals = [0, 0, 0, 0, 0, 0, 0];
            Object.keys(data).forEach(category => {
                for (let i = 0; i < 7; i++) {
                    const date = `2024-06-${10 + i}`;
                    const entry = data[category].find(item => item.date === date);
                    if (entry) {
                        weeklyTotals[i] += parseInt(entry.total);
                    }
                }
            });
            weeklyTotals.forEach(total => totalsRow.push(total.toLocaleString()));
            const totalSum = weeklyTotals.reduce((acc, curr) => acc + curr, 0);
            totalsRow.push(totalSum.toLocaleString());

            doc.text(title, 14, startY);
            doc.autoTable({
                head: [tableColumns],
                body: tableRows,
                startY: startY + 10,
                theme: 'grid',
                styles: { fontSize: 9, cellPadding: 3, font: "OpenSans" },
                headStyles: { fillColor: [52, 73, 94] },
                didParseCell: function (data) {
                    if (data.row.in === "Total") {
                        data.cell.styles.fillColor = data.row.raw[7].styles.cellBackgroundColor;
                    }
                }
            });

            return doc.autoTable.previous.finalY + 10;
        };
        let finalY = generateTable(statistics.day, 'Doanh thu Ngày', 25);
        finalY = generateTable(statistics.week, 'Doanh thu Tuần', finalY);
        generateTable(statistics.month, 'Doanh thu Tháng', finalY);
        generateDetailedTable(revenueRate, 'Chi tiết Doanh thu và Đánh giá', finalY - 130);
        generateCategoryTable(categotyData, 'Doanh thu theo Loại sản phẩm', finalY - 130);

        doc.save('report_all_options.pdf');
    };

    return (
        <div className='chartDashboard'>
            <div className='navBar'>
                <Button type="primary" onClick={handleDownload} style={{ marginRight: '12px' }}>
                    Export Report
                </Button>
            </div>
        </div>
    );
};
