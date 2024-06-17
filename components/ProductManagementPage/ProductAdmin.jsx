import React, { useState, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { swalert, swtoast } from "@/mixins/swal.mixin";
import { FaTrash, FaPencilAlt } from "react-icons/fa"
import { homeAPI } from '@/config';
import { Button, Switch } from 'antd';

const ProductAdmin = (props) => {
    const [status, setStatus] = useState(props.product_status);

    const addPointToPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    const token = localStorage.getItem('token');

    const handleDelete = async () => {
        swalert
            .fire({
                title: "Xóa sản phẩm",
                icon: "warning",
                text: "Bạn muốn xóa sản phẩm này?",
                showCloseButton: true,
                showCancelButton: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.delete(`${homeAPI}api/cms/item/delete-item/${props.product_id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                        props.refreshProductVariantTable()
                        swtoast.success({
                            text: 'Xóa biến thể sản phẩm thành công!'
                        })
                    } catch (err) {
                        console.log(err)
                        swtoast.error({
                            text: 'Xảy ra lỗi khi xóa biến thể sản phẩm vui lòng thử lại!'
                        })
                    }
                }
            })
    }

    const handleChangeStatus = async (prduct_id) => {
        const newStatus = status === 0 ? 1 : 0;
        setStatus(newStatus);
        try {
            await axios.get(`${homeAPI}api/cms/item/change-status-item?id=${props.product_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            props.refreshProductVariantTable()
            swtoast.success({
                text: 'Đổi trạng thái sản phẩm thành công!'
            })
        } catch (err) {
            console.log(err)
            setStatus(status);
            swtoast.error({
                text: 'Xảy ra lỗi khi đổi trạng thái sản phẩm vui lòng thử lại!'
            })
        }
    }

    const getStatusName = (status) => {
        switch (status) {
            case 0:
                return 'Ngừng bán';
            case 1:
                return 'Đang bán';
            default:
                return 'Đang bán';
        }
    };

    return (
        <div className="table-responsive">
            <table className="table align-middle product-admin w-100">
                <tbody className='w-100 text-center'>
                    <tr className="w-100">
                        <td className='col-infor-product'>
                            <p className="name">
                                {props.product_name}
                            </p>
                        </td>
                        <td className='col-infor-image' >
                            <img className='image' src={props.product_image} style={{ width: '50px', height: '50px' }} />
                        </td>
                        <td className="text-danger fw-bold col-price">
                            <p className='d-flex align-items-center justify-content-center'>
                                {addPointToPrice(props.price)}
                            </p>
                        </td>
                        <td className="col-createAt">
                            {getStatusName(status)}
                            <br />
                            <Switch checked={status === 0} onClick={handleChangeStatus}></Switch>
                        </td>
                        <td className="col-action manipulation">
                            <Button type="primary" href={`/product/update/${props.product_id}`}>
                                Chỉnh sửa
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
export default ProductAdmin