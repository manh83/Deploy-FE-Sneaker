import React, { useEffect, useState } from "react";
import {
  useGetAllProductQuery,
  // useUpdateProductMutation,
  useGetOneProductQuery,
  useUpdateProductMutation,
} from "../../../Services/Api_Product";
import { Link } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Loading from "../../Loading";
import { useGetAllCategoryQuery } from "../../../Services/Api_Category";
import { ICategory, IProduct } from "../../../Models/interfaces";
import { dark } from "@mui/material/styles/createPalette";

const Product = () => {
  //   const [getId, setId]: any = useState("");
  // const { data: categoryData, isLoading: loadingCT }: any = useGetAllCategoryQuery();
  const { data: productData, isLoading } = useGetAllProductQuery();

  const sortedProducts = productData
    ?.slice()
    .sort((a: any, b: any) => (b.sell_quantity || 0) - (a.sell_quantity || 0))
    .filter(
      (product: IProduct) =>
        !product?.isDeleted && (product?.sell_quantity || 0) > 0
    )
    .slice(0, 6);

  console.log("data", sortedProducts);

  return (
    <div className="w-[90vw] mx-auto">
      <div className="products-area">
        <div className="container">
          <div className="products">
            <div className="row">
              {/* category */}
              <div className="col-lg-3">
                <div className="product-menu">
                  <div className="menu-title">
                    <h2>
                      Best seller <strong>Các Mẫu Giày</strong>
                    </h2>
                  </div>
                  <div className="side-menu">
                    {/* {Array.isArray(categoryData) ? (
                                        categoryData?.map((category: ICategory) => (
                                        <ul className="nav tab-navigation" role="tablist" key={category._id}>
                                            <li role="presentation">
                                            <Link to={`/`}>{category.name}</Link>
                                            </li>
                                        </ul>
                                        ))
                                    ) : (
                                        <div>No categories available</div>
                                    )} */}
                    <div>
                      <img
                        className="w-[300px] h-60"
                        src="img/banner/banner-5.jpg"
                      />
                    </div>
                    <div className=" h-[400px]">
                      <video autoPlay loop className="shadow-xl shadow-white">
                        <source
                          src="../../../../img/production_id_4380323 (1080p).mp4"
                          type="video/mp4"
                        />
                      </video>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-9">
                <div className="row-new">
                  <div className="product-new">
                    {sortedProducts != undefined
                      ? sortedProducts?.map((product: IProduct) => {
                          const price = product.variants?.map(
                            (variant) => variant.sellingPrice || 0
                          );

                          const minSellingPrice = price
                            ? Math.min(...price)
                            : 0;

                          const maxSellingPrice = price
                            ? Math.max(...price)
                            : 0;

                          return (
                            <div
                              className="col-lg-4 col-md-6"
                              key={product._id}
                              // style={{margin: 12}}
                            >
                              <Link to={`/product/${product._id}`}>
                                <div className="single-product">
                                  <div className="level-pro-hot">
                                    <img
                                      style={{ width: 100 }}
                                      src="https://res.cloudinary.com/dtgfqi0ek/image/upload/v1708582778/giay-sneaker/towrsvxcqeqzu7stngwy.png"
                                    />
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
                                    <div className="product-name whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                                      <h1>{product.name}</h1>
                                    </div>

                                    <div className="price-rating flex">
                                      <span>
                                        {minSellingPrice.toLocaleString(
                                          "vi-VN",
                                          {
                                            style: "currency",
                                            currency: "VND",
                                          }
                                        )}
                                      </span>

                                      <span className="ml-2 mr-2">-</span>

                                      <span>
                                        {maxSellingPrice.toLocaleString(
                                          "vi-VN",
                                          {
                                            style: "currency",
                                            currency: "VND",
                                          }
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex mt-1">
                                      <div className="ratings">
                                        <i className="fa fa-star"></i>
                                        <i className="fa fa-star"></i>
                                        <i className="fa fa-star"></i>
                                        <i className="fa fa-star"></i>
                                        <i className="fa fa-star"></i>
                                      </div>
                                      <span
                                        className="ml-auto"
                                        style={{
                                          color: "black",
                                          fontWeight: 500,
                                        }}
                                      >
                                        Đã bán:
                                        <span className="ml-1">
                                          {product.sell_quantity
                                            ? product.sell_quantity
                                            : 0}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          );
                        })
                      : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
