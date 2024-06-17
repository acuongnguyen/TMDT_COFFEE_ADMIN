import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from "sweetalert2";

import Heading from '../Heading'
import { swtoast } from '@/mixins/swal.mixin'
import { homeAPI } from '@/config'

const Category = () => {
    const [categoryList, setCategoryList] = useState([])
    const token = localStorage.getItem('token');

    useEffect(() => {
        const getAllCategory = async () => {
            try {
                const result = await axios.get(`${homeAPI}api/cms/category/get-list-category`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setCategoryList(result.data.data)
            } catch (err) {
                console.log(err)
            }
        }

        getAllCategory()
    }, [])

    const refreshCategoryTable = async () => {
        try {
            const result = await axios.get(homeAPI + 'api/cms/category/get-list-category', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setCategoryList(result.data.data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleCreateCategory = async () => {
        const { value: formData } = await Swal.fire({
            title: 'Nhập thông tin danh mục mới',
            html:
                `<input id="swal-input1" class="swal2-input" placeholder="Tên danh mục mới...">` +
                `<input id="swal-input2" class="swal2-input" placeholder="Mô tả...">`,
            showCloseButton: true,
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value
                ];
            }
        });
        if (!formData || !formData[0]) {
            swtoast.fire({
                text: "Thêm danh mục mới không thành công!"
            });
            return;
        }
        const [newCategory, newDescription] = formData;
        try {
            await axios.post(homeAPI + 'api/cms/category/create-category',
                {
                    name: newCategory,
                    description: newDescription
                }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            refreshCategoryTable()
            swtoast.success({
                text: 'Thêm danh mục mới thành công!'
            })
        } catch (e) {
            swtoast.error({
                text: e.response.data.data.message
            })
        }
    }

    return (
        <div className="catalog-management-item">
            <Heading title="Tất cả danh mục" />
            <div className='create-btn-container'>
                <button className='btn btn-dark btn-sm' onClick={handleCreateCategory}>Thêm danh mục mới</button>
            </div>
            <div className='table-container' style={{ height: "520px" }}>
                <table className='table  table-hover table-bordered'>
                    <thead>
                        <tr>
                            <th className='text-center'>STT</th>
                            <th>
                                Tên danh mục
                            </th>
                            <th>Mô tả</th>
                        </tr>
                    </thead>
                    <tbody >
                        {
                            categoryList.map((category, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='text-center'>{index + 1}</td>
                                        <td>{category.name}</td>
                                        <td>{category.description}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Category