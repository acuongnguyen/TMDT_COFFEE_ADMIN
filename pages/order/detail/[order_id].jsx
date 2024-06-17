import React, { useState, useEffect } from 'react'
import Router, { useRouter } from 'next/router'
import axios from 'axios'
import { swalert, swtoast } from "@/mixins/swal.mixin";
import Header from '@/components/Header'
import Loading from '@/components/Loading'
import { formatTime, formatPrice, formatAllInDate } from '@/helpers/format'
import { homeAPI } from '@/config'

const OrderDetailPage = () => {
	const router = useRouter()
	const id_order = router.query.order_id

	const [orderDetail, setOrderDetail] = useState('')
	const [information, setInformation] = useState('');
	const [billDetail, setBillDetail] = useState('');

	const [isLoading, setIsLoading] = useState(false);
	const token = localStorage.getItem('token');

	const [deliveryCharges, setDeliveryCharges] = useState(20000);
	const [totalOrder, setTotalOrder] = useState(0);
	const [totalProductValue, setTotalProductValue] = useState(totalOrder);

	useEffect(() => {
		if (totalOrder > 200000) {
			setDeliveryCharges(0);
			setTotalProductValue(totalOrder)
		} else {
			setDeliveryCharges(20000);
			setTotalProductValue(totalOrder - deliveryCharges);
		}
	}, [totalOrder])

	useEffect(() => {
		const getOrderItem = async () => {
			try {
				setIsLoading(true)
				const result = await axios.get(homeAPI + `api/cms/order/get-order-detail?orderId=${id_order}`, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				})
				setOrderDetail(result.data.data.bill);
				setInformation(result.data.data.information);
				setBillDetail(result.data.data.billDetail);
				setTotalOrder(result.data.data.bill.total)
				setIsLoading(false)
			} catch (err) {
				console.log(err)
				setIsLoading(false)
			}
		}

		if (id_order) getOrderItem()
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
						await axios.delete(`${homeAPI}api/cms/order/delete-order?orderId=${id_order}`, {
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

	const handleChangeStatus1 = () => {
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
						await axios.get(`${homeAPI}api/cms/order/update-order-confirmed?orderId=${id_order}`, {
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
	const handleChangeStatus2 = () => {
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
						await axios.get(`${homeAPI}api/cms/order/update-order-success?orderId=${id_order}`, {
							headers: {
								Authorization: `Bearer ${token}`
							}
						})
						Router.push('/order/manage');
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

	const renderCancelBtn = (status_id) => {
		if (status_id === 0) {
			return (
				<button className="text-danger" href="#" onClick={handleCancelOrder}>Hủy đơn hàng</button>
			)
		}
		if (status_id === 5) {
			return (
				<button className="text" href="#" onClick={handleChangeStatus1}>Xác nhận đơn hàng</button>
			)
		}
		if (status_id === 6) {
			return (
				<button className="text" href="#" onClick={handleChangeStatus2}>Xác nhận đã giao hàng thành công</button>
			)
		}
	}

	return (
		<div className="order-detail-page">
			<Header />
			<div className="header-order-detail-page">
				<p className="fw-bold" style={{ fontSize: "20px" }}>
					Đơn hàng #{orderDetail.id}
				</p>
				<p className="">
					Ngày đặt hàng {formatTime(orderDetail.created_at)}
				</p>
			</div>
			<div className="container-order-detail-page">
				<div>
					<p className="fw-bold heading-detail-page">Danh sách sản phẩm</p>
				</div>
				<div>
					<table className='table table-light table-bordered'>
						<thead>
							<tr>
								<th>Sản phẩm</th>
								<th>Giá</th>
								<th>Số lượng</th>
								<th>Tạm tính</th>
							</tr>
						</thead>
						<tbody>
							{
								billDetail && billDetail.map((item, index) => {
									return (
										<tr key={index}>
											<td>{item.item.name}</td>
											<td>{item.item.price} đ</td>
											<td>{item.orderItem.number}</td>
											<td>{item.item.price * item.orderItem.number} đ</td>
										</tr>
									)
								})
							}
						</tbody>
						<tfoot>
							<tr className=''>
								<td colSpan="3" className=''>Tổng giá trị sản phẩm</td>
								<td colSpan="1">{totalProductValue} đ</td>
							</tr>
							<tr className=''>
								<td colSpan="3" className=''>Phí giao hàng</td>
								<td colSpan="1">{deliveryCharges} đ</td>
							</tr>
							<tr className='total fw-bold'>
								<td colSpan="3" className=''>Tổng thanh toán</td>
								<td colSpan="1">{orderDetail.total} đ</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
			<div className="footer-order-detail-page">
				<div className="row">
					<div className="col-6">
						<div>
							<p className="fw-bold heading_order_histories">Thao tác đơn hàng</p>
						</div>
						<div>
							{orderDetail &&
								renderCancelBtn(orderDetail.status)}
						</div>
					</div>
					<div className="col-6">
						<div>
							<p className="fw-bold heading-detail-page">Thông tin khách hàng</p>
						</div>
						<div>
							<table className=''>
								<tbody>
									<tr className='row'>
										<td className="col-4">
											Họ tên
										</td>
										<td className="col-8 fw-bold d-flex justify-content-end text-end">
											{information.name}
										</td>
									</tr>
									<tr className='row'>
										<td className="col-4">
											Số điện thoại
										</td>
										<td className="col-8 fw-bold d-flex justify-content-end text-end">
											{information.phone}
										</td>
									</tr>
									<tr className='row'>
										<td className="col-4">
											Địa chỉ
										</td>
										<td className="col-8 fw-bold d-flex justify-content-end text-end">
											{information.city + " " + information.district + " " + information.ward}
										</td>
									</tr>
									<tr className='row'>
										<td className="col-4">
											Địa chỉ cụ thể
										</td>
										<td className="col-8 fw-bold d-flex justify-content-end text-end">
											{information.note}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			{isLoading && <Loading />}
		</div>
	)
}

export default OrderDetailPage