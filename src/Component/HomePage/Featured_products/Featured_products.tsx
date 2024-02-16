// import React from 'react'
// import "../../../../lib/home"

// import { Link } from "react-router-dom";
import { Link } from "react-router-dom";
import { IProduct } from "../../../Models/interfaces";
import { useGetAllProductQuery } from "../../../Services/Api_Product";
import Loading from "../../Loading";

const Featured_products = () => {
    const { data: getProduct, isLoading } = useGetAllProductQuery();

    const numberFormat = (value: number) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);

        
    return (
        <div className='w-[90vw] mx-auto'>
            {isLoading ? <Loading /> :
                <div className="features-product-area">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="section-heading">
                                    <h2>Sản Phẩm Mới</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row-new">
                            <div className="product-new">
                                {getProduct?.slice(0, 6).map((product: IProduct) => {
                                    const price = product.variants?.map((variant) => variant.sellingPrice || 0)
                                    const minSellingPrice = price ? Math.min(...price) : 0
                                    const maxSellingPrice = price ? Math.max(...price) : 0
                                    return (
                                        <div
                                            // className="col-lg-4 col-md-6"
                                            key={product._id}
                                            style={{margin: 12}}
                                        >
                                            <Link to={`/product/${product._id}`}>
                                                <div className="single-product">
                                                    <div className="level-pro-new">
                                                        <span>new</span>
                                                    </div>
                                                    <div className="product-img">
                                                        <div>
                                                            <img
                                                                src={product.imgUrl?.[0]}
                                                                alt=""
                                                                className="primary-img h-[300px] w-[250px]"
                                                            />
                                                            <img
                                                                src={product.imgUrl?.[1]}
                                                                alt=""
                                                                className="secondary-img"
                                                            />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="product-price -mt-3">
                                                        <div className="product-name">
                                                            <h1>{product.name}</h1>
                                                        </div>
                                                        <div className="price-rating">
                                                            <span>
                                                                {numberFormat(minSellingPrice)}
                                                            </span>
                                                            <span style={{fontSize:20,marginLeft:5,marginRight:5}}>-</span>
                                                            <span>{numberFormat(maxSellingPrice)}</span>
                                                            <div className="ratings">
                                                                <i className="fa fa-star"></i>
                                                                <i className="fa fa-star"></i>
                                                                <i className="fa fa-star"></i>
                                                                <i className="fa fa-star"></i>
                                                                <i className="fa fa-star"></i>
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
                    </div>
                </div>
            }
        </div>
    )
}

export default Featured_products