import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import { Input, InputNumber } from 'antd'

import Header from '@/components/Header';
import Category from '@/components/Category';
import RowProductVariant from '@/components/UpdateProductPage/RowProductVariant';
import Loading from '@/components/Loading';
import { swtoast } from "@/mixins/swal.mixin";
import { homeAPI } from '@/config'

const UpdateProductPage = () => {
    const { product_id } = Router.query

    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const [productVariantList, setProductVariantList] = useState([]);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const getProductDetail = async () => {
            try {
                setIsLoading(true)
                const result = await axios.get(`${homeAPI}api/cms/item/get-item`, {
                    params: {
                        id: product_id
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setProductId(result.data.data.id)
                setProductName(result.data.data.name)
                setCategoryId(result.data.data.itemTypeId)
                setCategoryName(result.data.data.itemTypeId)
                setPrice(result.data.data.price)
                setDescription(result.data.data.description)
                setProductVariantList(await convertProductVariantList(result.data.product_variant_list))
                setIsLoading(false)
            } catch (err) {
                console.log(err);
                setIsLoading(false)
                // Router.push("/404")
            }
        }
        if (product_id) getProductDetail()
    }, [product_id]);

    useEffect(() => {
        let rowProductVariantTemp = [];
        for (let i in productVariantList) {
            rowProductVariantTemp.push(
                <RowProductVariant
                    key={i}
                    index={i}
                    productVariantList={productVariantList}
                    setProductVariantList={setProductVariantList}
                    setIsLoading={setIsLoading}
                    refreshPage={refreshPage}
                />
            );
        }
    }, [productVariantList]);

    const refreshPage = async () => {
        if (product_id) {
            try {
                const result = await axios.get(`${homeAPI}api/cms/item/get-list-item`, {
                    id: product_id
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setProductId(result.data.data.id)
                setProductName(result.data.data.name)
                setCategoryId(result.data.data.itemTypeId)
                setCategoryName(result.data.data.itemTypeId)
                setPrice(result.data.data.price)
                setDescription(result.data.data.description)
                setProductVariantList(await convertProductVariantList(result.data.product_variant_list))
            } catch (err) {
                console.log(err);
            }
        }
    }

    const updateProduct = async () => {
        if (Validate()) {
            try {
                setIsLoading(true)
                let result = await axios.post(`${homeAPI}api/cms/item/update-item/${productId}`, {
                    name: productName,
                    itemTypeId: categoryId,
                    price: price,
                    description: description
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setIsLoading(false)
                swtoast.success({ text: 'Cập nhập sản phẩm thành công!' })
                Router.push('/product/manage')
            } catch (err) {
                console.log(err);
                setIsLoading(false)
            }
        }
    }

    const Validate = () => {
        if (!productName) {
            swtoast.error({ text: 'Tên sản phẩm không được bỏ trống' })
            return false
        }
        if (!categoryId) {
            swtoast.error({ text: 'Danh mục sản phẩm không được bỏ trống' })
            return false
        }
        if (!price) {
            swtoast.error({ text: 'Giá sản phẩm không được bỏ trống' })
            return false
        }
        if (!description) {
            swtoast.error({ text: 'Mô tả sản phẩm không được bỏ trống' })
            return false
        }
        return true
    }

    return (
        <div className='update-product-page'>
            <Header title="Cập nhật sản phẩm" />
            <div className="update-product-form">
                {/* Input Ten san pham */}
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-name' className="fw-bold">Tên sản phẩm:</label>
                        <Input
                            id='product-name' placeholder='Nhập tên sản phẩm'
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>
                </div>
                {/* Component danh muc */}
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-category' className="fw-bold">Danh mục:</label>
                        <Category setCategoryId={setCategoryId} categoryName={categoryName} setCategoryName={setCategoryName} />
                    </div>
                    <div className="col-6">
                        <label htmlFor='product-price' className="fw-bold">Giá sản phẩm:</label>
                        <br />
                        <InputNumber
                            id='product-price' placeholder='Nhập giá sản phẩm'
                            value={price === 0 ? null : price}
                            style={{ width: '100%' }}
                            onChange={setPrice}
                            step={1000}
                            min={0}
                            defaultValue={0}
                        />
                    </div>
                </div>
                {/* Mo ta san pham */}
                <div className="description">
                    <label htmlFor='description' className="fw-bold">Mô tả sản phẩm:</label>
                    <div className="ckeditor-box">
                        <Input
                            id='description' placeholder="Mô tả ..."
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                            }}
                        />
                    </div>
                </div>
                <div className="btn-box text-left">
                    <button className='text-light bg-dark' onClick={updateProduct}>
                        Cập nhật sản phẩm
                    </button>
                </div>
            </div>
            {isLoading && <Loading />}
        </div>
    )
}

export default UpdateProductPage