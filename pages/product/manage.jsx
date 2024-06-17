import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Empty, Input } from 'antd';
import axios from 'axios';
import Header from '@/components/Header';
import Heading from '@/components/Heading';
import ProductAdmin from '@/components/ProductManagementPage/ProductAdmin';
import Router from 'next/router';
import { useDebounce } from 'use-debounce';
import * as actions from '../../store/actions';
import { homeAPI } from '@/config';

const ProductManagementPage = () => {
    let [listProductVariant, setListProductVariant] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('token');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

    useEffect(() => {
        const getListProductVariant = async () => {
            try {
                const result = await axios.get(`${homeAPI}api/cms/item/get-list-item`, {
                    params: {
                        searchFields: ["name"],
                        search: debouncedSearchTerm
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setListProductVariant(result.data.data);
            } catch (err) {
                console.log(err);
            }
        }
        getListProductVariant();
    }, [token, debouncedSearchTerm])

    const refreshProductVariantTable = async () => {
        const result = await axios.get(`${homeAPI}api/cms/item/get-list-item`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setListProductVariant(result.data.data);
    }

    return (
        <div className="product-manager">
            <Header title="Quản lý sản phẩm" />
            <div className="wrapper manager-box">
                <div className="to-add-product-page" style={{ display: 'flex', flexDirection: 'row' }}>
                    <button onClick={() => Router.push('/product/create')} className="to-add-product-page-btn">
                        Thêm sản phẩm
                    </button>
                    <div className="search-bar" style={{ marginTop: '16px' }}>
                        <Input
                            placeholder="Tìm kiếm sản phẩm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ marginBottom: '20px', width: '300px' }}
                        />
                    </div>
                </div>
                <Heading title="Tất cả sản phẩm" />
                <div className="wrapper-product-admin table-responsive" style={{ overflowY: 'auto' }}>
                    <table className='table product-admin w-100'>
                        <thead className="w-100 align-middle text-center">
                            <tr className="fs-6 w-100">
                                <th title='Tên sản phẩm' className="name col-infor-product">
                                    Sản phẩm
                                </th>
                                <th title='Ảnh sản phẩm' className="image col-infor-image">
                                    Hình ảnh
                                </th>
                                <th title='Giá sản phẩm' className="col-price">Giá</th>
                                {/* <th title='Tồn kho' className="col-quantity">Tồn kho</th> */}
                                <th title="Trạng thái" className="col-createAt">Trạng thái</th>
                                <th title="Thao tác" className="col-action manipulation">Thao tác</th>
                            </tr>
                        </thead>
                    </table>
                    {
                        listProductVariant.length ?
                            listProductVariant.map((productVariant, index) => {
                                return (
                                    <ProductAdmin
                                        key={index}
                                        product_id={productVariant.id}
                                        product_variant_id={productVariant.id}
                                        product_name={productVariant.name}
                                        product_image={productVariant.image}
                                        product_status={productVariant.status}
                                        price={productVariant.price}
                                        refreshProductVariantTable={refreshProductVariantTable}
                                    />
                                )
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

export default ProductManagementPage