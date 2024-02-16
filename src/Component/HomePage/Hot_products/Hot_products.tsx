import React, { useState } from 'react'
import {  useGetAllProductQuery, useGetHotProductsQuery } from '../../../Services/Api_Product'
import { IProduct } from '../../../Models/interfaces';
import { Link } from 'react-router-dom';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
const Hot_products = () => {
    const { data: productData, isError, isLoading }: any = useGetAllProductQuery()
    const [currentIndex, setCurrentIndex] = useState(0);

    if (isLoading) {
        return <div>Đang tải...Sản Phẩm HOT</div>;
    }

    if (isError) {
        return <div>Error.....Sản Phẩm HOT</div>;
    }
    // Sắp xếp sản phẩm theo lượt xem giảm dần (giả sử views là thuộc tính trong đối tượng sản phẩm)
    const hotProducts = productData.slice().sort((a:any, b:any) => b.views - a.views).slice(0, 8); 
    // Số lượng sản phẩm hiển thị mỗi lần
    const itemsPerPage = 4;

    // Tính toán số trang
    const totalPages = Math.ceil(hotProducts.length / itemsPerPage);

    // Xác định chỉ mục bắt đầu và kết thúc cho danh sách sản phẩm
    const startIndex = currentIndex * itemsPerPage;
    const endIndex = (currentIndex + 1) * itemsPerPage;

    const visibleProducts = hotProducts.slice(startIndex, endIndex);
    console.log(visibleProducts);
    


    // Xử lý khi bấm nút "Sang trang trước" và "Sang trang sau"
    const handlePrevClick = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNextClick = () => {
        if (currentIndex < totalPages - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const numberFormat = (value:number) => new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
    }).format(value)
    
    return (
        <div className="w-[90vw] mx-auto">
            <div className="new-products-area">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="section-heading">
                                <h2>Sản PHẨM HOT</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="relative">
                            <div className="overflow-hidden">
                                <div className="flex justify-center">
                                    {visibleProducts.map((product: IProduct) => {
                                        console.log(product.sell_quantity);
                                        
                                        const prices = product.variants?.map((variant) => variant.sellingPrice)
                                        const minSellingPrice = prices ? Math.min(...prices) : 0
                                        const maxSellingPrice = prices ? Math.max(...prices) : 0

                                        return (
                                            <div className='ml-2' key={product._id}>
                                                <Link to={`/product/${product._id}`} >
                                                    <div className="single-product w-[280px] h-auto">
                                                        <div className="level-pro-new">
                                                            <span>HOT</span>
                                                        </div>
                                                        <div className="product-img">
                                                            <div>
                                                                <img
                                                                    src={product.imgUrl?.[0]}
                                                                    alt=""
                                                                    className="primary-img h-[300px] w-[280px]"
                                                                />
                                                                <img
                                                                    src={product.imgUrl?.[1]}
                                                                    alt=""
                                                                    className="secondary-img h-[300px] w-[280px]"
                                                                />
                                                            </div>
                                                        </div>
                                                      
                                                        <div className="product-price -mt-3 ">
                                                            <div className="product-name">
                                                                <h1>{product.name}</h1>
                                                                <p>Lượt xem: {product.views}</p>
                                                            </div>
                                                            <div className="price-rating -mt-3">
                                                            <span>
                                                                {numberFormat(minSellingPrice)}
                                                            </span>
                                                            <span style={{fontSize:20,marginLeft:5,marginRight:5}}>-</span>
                                                            <span>{numberFormat(maxSellingPrice)}</span>
                                                            <div className="ratings" style={{ display: 'flex', alignItems: 'center' }}>
                                                                <i className="fa fa-star"></i>
                                                                <i className="fa fa-star"></i>
                                                                <i className="fa fa-star"></i>
                                                                <i className="fa fa-star"></i>
                                                                <i className="fa fa-star"></i>
                                                                <div style={{ marginLeft: 'auto', marginTop: '-1px' }}>Đã bán: {product.sell_quantity}</div>
                                                            </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className=' text-2xl'>
                                <div
                                    className="absolute scale-150 top-1/2 transform -translate-y-1/2 left-[-20px] rounded-full shadow cursor-pointer"
                                    onClick={handlePrevClick}
                                >
                                    <LeftCircleOutlined/>
                                </div>
                                <div
                                    className="absolute scale-150 top-1/2 transform -translate-y-1/2  right-[-20px] rounded-full shadow cursor-pointer"
                                    onClick={handleNextClick}
                                >
                                    <RightCircleOutlined />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hot_products