import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select } from 'antd';
import { homeAPI } from '@/config'

const Category = ({ setCategoryId, categoryName, setCategoryName }) => {
    let [listCategory, setListCategory] = useState([]);
    const token = localStorage.getItem('token');
    useEffect(() => {
        const getListCategory = async () => {
            try {
                const result = await axios.get(`${homeAPI}api/cms/category/get-list-category`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setListCategory(result.data.data)
            } catch (err) {
                console.log(err);
            }
        }
        getListCategory();
    }, [token])

    const [options, setOptions] = useState([])

    useEffect(() => {
        let options = listCategory.map((category) => {
            return {
                label: category.name,
                value: category.id
            }
        })
        setOptions(options)
    }, [listCategory])

    return (
        <div className='category col-12'>
            <div className="">
                <Select
                    id='product-category'
                    value={!categoryName ? null : categoryName}
                    options={options}
                    placeholder={'Chọn danh mục sản phẩm'}
                    style={{ width: '100%' }}
                    onChange={(value, option) => { setCategoryId(value); setCategoryName(option.label) }}
                />
            </div>
        </div>
    )
}

export default Category