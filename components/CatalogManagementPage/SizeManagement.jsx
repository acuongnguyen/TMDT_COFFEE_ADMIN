import React from 'react'
import Heading from '../Heading'
const SizeList = [
    { size_id: 1, size_name: "S" },
    { size_id: 2, size_name: "M" },
    { size_id: 3, size_name: "L" },
]

const SizeManage = () => {
    return (
        <div className="catalog-management-item">
            <Heading title="Tất cả size" />
            <div className='create-btn-container'>
                <div className='btn btn-dark btn-sm'>Tất cả Size</div>
            </div>
            <div className='table-container' style={{ height: "520px" }}>
                <table className='table table-hover table-bordered'>
                    <thead>
                        <tr>
                            <th className='text-center'>STT</th>
                            <th>
                                Tên size
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            SizeList.map((size, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='text-center'>{index + 1}</td>
                                        <td>{size.size_name}</td>
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

export default SizeManage