import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import Category from '@/components/Category';
import RowProductVariant from '@/components/CreateProductPage/RowProductVariant';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import Loading from '@/components/Loading';
import { swtoast } from "@/mixins/swal.mixin";
import { homeAPI } from '@/config';
import { Input, InputNumber, Upload, Flex, message } from 'antd';

const CreateProductPage = () => {
    const [productName, setProductName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('')
    const [selectedColours, setSelectedColours] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [productVariantList, setProductVariantList] = useState([]);

    const token = localStorage.getItem('token');

    const handleFileRead = async (event) => {
        const file = event.target.files[0]
        const base64 = await convertBase64(file)
        setImageUrl(base64);
    }

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }

    useEffect(() => {
        let productVariantListTemp = [];
        for (let i in selectedColours) {
            for (let y in selectedSizes) {
                let productVariant = {
                    colour_id: selectedColours[i].colour_id,
                    colour_name: selectedColours[i].colour_name,
                    size_id: selectedSizes[y].size_id,
                    size_name: selectedSizes[y].size_name,
                    quantity: '',
                    fileList: []
                }
                productVariantListTemp.push(productVariant);
            }
        }
        setProductVariantList(productVariantListTemp);

    }, [selectedColours, selectedSizes]);

    // useEffect(() => {
    //     let rowProductVariantTemp = [];
    //     for (let i in productVariantList) {
    //         rowProductVariantTemp.push(
    //             <RowProductVariant
    //                 key={i}
    //                 index={i}
    //                 productVariantList={productVariantList}
    //                 setProductVariantList={setProductVariantList}
    //             />
    //         );
    //     }
    //     setRowProductVariant(rowProductVariantTemp);
    // }, [productVariantList]);

    const createProduct = async () => {
        if (Validate()) {
            try {
                setIsLoading(true)
                let result = await axios.post(`${homeAPI}api/cms/item/create-item`, {
                    name: productName,
                    price,
                    itemTypeId: categoryId,
                    description,
                    image: imageUrl
                },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                console.log(result.data);
                setIsLoading(false)
                swtoast.success({ text: 'Thêm sản phẩm thành công!' })
                clearPage()
            } catch (err) {
                console.log(err);
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

    const clearPage = () => {
        setProductName('')
        setCategoryId('')
        setCategoryName('')
        setPrice(0)
        setDescription('')
        setProductVariantList([])
        setSelectedColours([])
        setColourBoxValue([])
        setSelectedSizes([])
        setSizeBoxValue([])
    }

    return (
        <div className='create-product-page'>
            <Header title="Thêm sản phẩm" />
            <div className="create-product-form">
                {/* // Input Ten san pham */}
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-name' className="fw-bold">Tên sản phẩm:</label>
                        <Input
                            id='product-name' placeholder='Nhập tên sản phẩm'
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>
                    <div className="col-6">
                        <label htmlFor='product-image' className="fw-bold">Ảnh sản phẩm:</label>
                        <Input
                            id="originalFileName"
                            type="file"
                            inputProps={{ accept: 'image/*, .xlsx, .xls, .csv, .pdf, .pptx, .pptm, .ppt' }}
                            required
                            label="Document"
                            name="originalFileName"
                            onChange={e => handleFileRead(e)}
                            size="small"
                            variant="standard"
                        />
                    </div>
                </div>
                {/* // Component danh muc */}
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
                {/* // Mo ta san pham */}
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
                    <button className='text-light bg-dark' onClick={createProduct}>
                        Thêm sản phẩm
                    </button>
                </div>
            </div>
            {isLoading && <Loading />}
        </div >
    )
}

export default CreateProductPage