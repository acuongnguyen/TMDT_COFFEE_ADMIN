import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Router from 'next/router'
import { Empty } from 'antd'
import axios from 'axios'

import Header from '@/components/Header';
import Heading from '@/components/Heading';
import OrderRow from '@/components/OrderManagementPage/OrderRow';
import { homeAPI } from '@/config';

const OrderManagementPage = () => {
    let [orderList, setOrderList] = useState([]);
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');
    useEffect(() => {
        const getOrderList = async () => {
            try {
                const result = await axios.get(`${homeAPI}api/cms/order/get-list-order`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setOrderList(result.data.data)
            } catch (err) {
                console.log(err);
            }
        }
        getOrderList();
    }, [])

    const refreshOrderTable = async () => {
        try {
            const result = await axios.get(`${homeAPI}api/cms/order/get-list-order`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setOrderList(result.data.data)
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="">
            <Header title="Quản Lý Đơn Hàng" />
            <div className="wrapper manager-box">
                <Heading title="Tất cả đơn hàng" />
                <div className="wrapper-product-admin table-responsive" style={{ overflowY: 'auto' }}>
                    <table className='table order-manage-table w-100' >
                        <thead className="w-100 align-middle text-center">
                            <tr className="fs-6 w-100">
                                <th title='Mã đơn hàng' className="col-order-id">
                                    Mã đơn hàng
                                </th>
                                <th title='PTTT' className="col-state">PTTT</th>
                                <th title='Trạng thái' className="col-state">Trạng thái</th>
                                <th title="Ngày tạo" className="col-create-at">Ngày tạo</th>
                                <th title='Tổng giá trị' className="col-total-value">Tổng giá trị</th>
                                <th title="Thao tác" className="col-action manipulation">Thao tác</th>
                            </tr>
                        </thead>
                    </table>
                    {
                        orderList.length ?
                            orderList.map((order, index) => {
                                return (
                                    <OrderRow
                                        key={index}
                                        order_id={order.id}
                                        state_id={order.status}
                                        state_name={order.status}
                                        created_at={order.created_at}
                                        paymentOptionId={order.paymentOptionId}
                                        total_order_value={order.total}
                                        refreshOrderTable={refreshOrderTable}
                                    />
                                );
                            })
                            :
                            <table className="table w-100 table-hover align-middle table-bordered" style={{ height: "400px" }}>
                                <tbody>
                                    <tr><td colSpan={6}><Empty /></td></tr>
                                </tbody>
                            </table>
                    }
                </div>
            </div>
        </div>
    )
}

export default OrderManagementPage