import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { swalert, swtoast } from "@/mixins/swal.mixin";
import { homeAPI } from '@/config';

const OrderRow = (props) => {
    const { order_id, state_id, state_name, paymentOptionId, created_at, total_order_value, refreshOrderTable } = props;
    const token = localStorage.getItem('token');

    // const addPointToPrice = (price) => {
    //     return price.toString(.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    // }

    const convertTime = (created_at) => {
        const date = new Date(created_at);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // tháng (giá trị từ 0 đến 11, nên cộng thêm 1)
        const day = date.getDate(); // ngày trong tháng
        const hours = date.getHours(); // giờ
        const minutes = date.getMinutes(); // phút
        const seconds = date.getSeconds(); // giây
        const formattedDate = `${day}/${month}/${year}`;
        const formattedTime = `${hours}:${minutes}:${seconds}`;
        return (
            <>
                {formattedDate} <br /> {formattedTime}
            </>
        )
    }

    const renderCancelOrderBtn = () => {
        if (state_id == 0) {
            return (
                <>
                    <br />
                    <a className="text-danger" href="#" onClick={handleCancelOrder}>Hủy đơn hàng</a>
                </>
            )
        }
    }

    const renderChangeStatusPTTT = () => {

        if (paymentOptionId == 1) {
            return (
                <>
                    <p>Chuyển khoản</p>
                    <br />
                </>
            )
        }
        if (paymentOptionId == 2) {
            return (
                <>
                    <p>Tiền mặt</p>
                    <br />
                </>
            )
        }
    }

    const renderChangeStatus = () => {
        if (state_id == 0) {
            return (
                <>
                    <p  >Chờ thanh toán</p>
                    <br />
                </>
            )
        }
        if (state_id == 5) {
            return (
                <>
                    <p  >Chờ xác nhận</p>
                    <br />
                </>
            )
        }
        if (state_id == 6) {
            return (
                <>
                    <p>Chờ giao hàng</p>
                    <br />
                </>
            )
        }
    }

    const renderChangeStatusBtn = () => {
        if (state_id == 5) {
            return (
                <>
                    <a href="#" onClick={handleChangeStatus}>Xác nhận đơn hàng</a>
                    <br />
                </>
            )
        }
        if (state_id == 2) {
            return (
                <>
                    <a href="#" onClick={handleChangeStatus}>Xác nhận đã bàn giao cho đơn vị vận chuyển</a>
                    <br />
                </>
            )
        }
        if (state_id == 6) {
            return (
                <>
                    <a href="#" onClick={handleChangeStatus}>Xác nhận đã giao hàng thành công</a>
                    <br />
                </>
            )
        }
    }

    const handleCancelOrder = () => {
        swalert
            .fire({
                title: "Hủy đơn hàng",
                icon: "warning",
                text: "Bạn muốn hủy đơn hàng này?",
                showCloseButton: true,
                showCancelButton: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.delete(`${homeAPI}api/cms/order/delete-order?orderId=${order_id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                        refreshOrderTable();
                        swtoast.success({
                            text: 'Hủy đơn hàng thành công!'
                        })
                    } catch (err) {
                        console.log(err)
                        swtoast.error({
                            text: 'Xảy ra lỗi khi hủy đơn hàng vui lòng thử lại!'
                        })
                    }
                }
            })
    }

    const handleChangeStatus = () => {
        if (state_id == 5) {
            swalert
                .fire({
                    title: "Xác nhận đơn hàng",
                    icon: "info",
                    text: "Bạn muốn tiếp nhận đơn hàng này?",
                    showCloseButton: true,
                    showCancelButton: true,
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            console.log(token);
                            await axios.get(`${homeAPI}api/cms/order/update-order-confirmed?orderId=${order_id}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            })
                            refreshOrderTable();
                            swtoast.success({
                                text: 'Xác nhận đơn hàng thành công!'
                            })
                        } catch (err) {
                            console.log(err)
                            swtoast.error({
                                text: 'Xảy ra lỗi khi xác nhận đơn hàng vui lòng thử lại!'
                            })
                        }
                    }
                })
        }
        if (state_id == 2) {
            swalert
                .fire({
                    title: "Xác nhận đã bàn giao cho đơn vị vận chuyển",
                    icon: "info",
                    text: "Đơn hàng này đã được bàn giao cho đơn vị vận chuyển?",
                    showCloseButton: true,
                    showCancelButton: true,
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await axios.put(`${homeAPI}api/cms/order/change-status/`, {
                                orderId: order_id
                            }, {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            })
                            refreshOrderTable();
                            swtoast.success({
                                text: 'Xác nhận bàn giao cho đơn vị vận chuyển thành công!'
                            })
                        } catch (err) {
                            console.log(err)
                            swtoast.error({
                                text: 'Xảy ra lỗi khi xác nhận bàn giao vui lòng thử lại!'
                            })
                        }
                    }
                })
        }
        if (state_id == 6) {
            swalert
                .fire({
                    title: "Xác nhận đã giao hàng thành công",
                    icon: "info",
                    text: "Đơn hàng này đã được giao thành công?",
                    showCloseButton: true,
                    showCancelButton: true,
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await axios.get(`${homeAPI}api/cms/order/update-order-success?orderId=${order_id}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            })
                            refreshOrderTable();
                            swtoast.success({
                                text: 'Xác nhận đã giao thành công!'
                            })
                        } catch (err) {
                            console.log(err)
                            swtoast.error({
                                text: 'Xảy ra lỗi khi xác nhận đã giao vui lòng thử lại!'
                            })
                        }
                    }
                })
        }
    }

    return (
        <div className="table-responsive">
            <table className="table align-middle order-manage-table w-100">
                <tbody className="w-100 text-center">
                    <tr className="w-100">
                        <td className="fw-bold col-order-id">
                            <p className="d-flex align-items-center justify-content-center">
                                #{order_id}
                            </p>
                        </td>
                        <td className="text-danger fw-bold col-state">
                            <p className="d-flex align-items-center justify-content-center">
                                {renderChangeStatusPTTT()}
                            </p>
                        </td>
                        <td className="text-danger fw-bold col-state">
                            <p className="d-flex align-items-center justify-content-center">
                                {renderChangeStatus()}
                                {/* {state_name} */}
                            </p>
                        </td>
                        <td className="col-create-at">
                            <p className="d-flex align-items-center justify-content-center">
                                {convertTime(created_at)}
                            </p>
                        </td>
                        <td className="text-danger fw-bold col-total-value">
                            <p>
                                {total_order_value}
                            </p>
                        </td>
                        <td className="col-action manipulation">
                            {renderChangeStatusBtn()}
                            <Link href={`/order/detail/${order_id}`}>Xem chi tiết</Link>
                            {renderCancelOrderBtn()}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default OrderRow