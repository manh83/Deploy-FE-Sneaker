import React, { useEffect,useState } from 'react';
import { useLocation,Link } from 'react-router-dom';
import ReactPaginate from "react-paginate";
import { ICategory, IColor, IProduct, ISize } from '../Models/interfaces';
import { useGetAllCategoryQuery } from '../Services/Api_Category';
import { useGetAllSizeQuery } from '../Services/Api_Size';
import { useGetColorsQuery } from '../Services/Api_Color';

const SearchResultsPage = () => {
  const location = useLocation();
  const searchData = location.state;
  const { data: categoryData, error: errorCategory } = useGetAllCategoryQuery();
  const { data: sizeData, error: errorSize } = useGetAllSizeQuery();
  const { data: colorData, error: errorColor } = useGetColorsQuery();
  console.log(searchData);
  

    //Lọc sản phẩm theo bộ lọc
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
    const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
    const [selectedPriceRange, setSelectedPriceRange] = useState<string | undefined>(undefined);
  
  
    const handlePriceRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      setSelectedPriceRange(selectedValue);
      // Đây là nơi bạn sẽ áp dụng bộ lọc dựa trên khoảng giá
      // Bạn có thể thêm logic lọc vào ở đây
    };
  
    const isPriceInRange = (price: number, priceRange: string) => {
      if (priceRange === "0-500000") {
        return price >= 0 && price < 500000;
      } else if (priceRange === "500000-1000000") {
        return price >= 500000 && price <= 1000000;
      } else if (priceRange === "1000000") {
        return price > 1000000;
      }
      // Thêm các khoảng giá khác ở đây
      return true; // Mặc định hiển thị sản phẩm nếu không có khoảng giá nào được chọn
    };
  
    const filteredProduct = searchData ? searchData.data.filter((product: IProduct) => {
      const isCategoryMatch = !selectedCategory || product.categoryId === selectedCategory;
      const isSizeMatch = !selectedSize || product.variants?.some((variant: any) => variant.size_id === selectedSize);
      const isColorMatch = !selectedColor || product.variants?.some((variant: any) => variant.color_id === selectedColor);
      const isPriceRangeMatch = !selectedPriceRange || product.variants?.some((variant: any) => isPriceInRange(variant.sellingPrice, selectedPriceRange));
  
  
      return isCategoryMatch && isSizeMatch && isColorMatch && isPriceRangeMatch;
    }): [];
  
  
  
    const sortedProducts = [...filteredProduct];
    
  
    const [sortOption, setSortOption] = useState("ascending"); // Mặc định sắp xếp theo giá tăng dần
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      setSortOption(selectedValue);
    };
  
    if (sortOption === "ascending") {
      sortedProducts.sort((a, b) => {
        const minPriceA = Math.min(...(a.variants?.map((variant: any) => variant.sellingPrice || 0)));
        const minPriceB = Math.min(...(b.variants?.map((variant: any) => variant.sellingPrice || 0)));   
        return minPriceA - minPriceB;
      });
    } else if (sortOption === "decreasing") {
      sortedProducts.sort((a, b) => {
        const minPriceA = Math.min(...(a.variants?.map((variant: any) => variant.sellingPrice || 0) || [0]));
        const minPriceB = Math.min(...(b.variants?.map((variant: any) => variant.sellingPrice || 0) || [0]));
        return minPriceB - minPriceA;
      });
    }
  
  
    // Phân trang
    const [currentPage, setCurrentPage] = useState(0);
    const [productsPerPage, setProductsPerPage] = useState(9);
  
  
    const totalProducts = sortedProducts?.length || 0;
    const pageCount = Math.ceil(totalProducts / productsPerPage);
    const startIndex = currentPage * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const displayedProducts = sortedProducts?.slice(startIndex, endIndex);
  
    const handlePageChange = ({ selected }: { selected: number }) => {
      setCurrentPage(selected);
    };
    const handleProductsPerPageChange = (
      event: React.ChangeEvent<HTMLSelectElement>
    ) => {
      const selectedValue = parseInt(event.target.value);
      setProductsPerPage(selectedValue);
      setCurrentPage(0); // Đặt lại về trang đầu tiên khi thay đổi số lượng sản phẩm trên mỗi trang
    };
  
    // Xử lý sự kiện khi click vào nút reset filter
    const handleResetFilter = () => {
      setSelectedCategory(undefined);
      setSelectedSize(undefined);
      setSelectedColor(undefined);
      setSelectedPriceRange(undefined);
    };

  return (
    <div className="w-[90vw] mx-auto" style={{ marginTop: '10%' }}>
      <div className="product-banner">
        <img src="img/product/banner.jpg" alt="" />
      </div>
      <div className="product-main-items">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="location">
                <ul>
                  <li>
                    <a href="index.html" title="go to homepage">
                      Home<span>/</span>
                    </a>{" "}
                  </li>
                  <li>
                    <strong> shop</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* Danh mục  */}
          <div className="row">
            <div className="col-lg-3">
              <div className="product-sidebar">
                <div className="sidebar-title">
                  <h2>Danh mục sản phẩm</h2>
                </div>
                <div className="single-sidebar">
                  <div className="single-sidebar-title">
                    <h3>Thương hiệu</h3>
                  </div>
                  {/*Load dữ liệu Category */}
                  <div className="single-sidebar-content">
                    {categoryData?.map((category: ICategory) => {
                      const isSelected = selectedCategory === category._id;
                      return (
                        <button
                          style={{
                            backgroundColor: isSelected ? "#FF0000" : "white",
                            border: isSelected ? "1px solid #FF0000" : "1px solid",
                            color: isSelected ? "white" : "black",
                          }}
                          className={`hover:bg-red-500 hover:text-white m-1 ${isSelected ? "bg-red-500 text-white" : ""}`}
                          key={category._id}
                          onClick={() => {
                            if (selectedCategory === category._id) {
                              setSelectedCategory(undefined);
                            } else {
                              setSelectedCategory(category._id?.toString());
                            }
                          }}
                        >
                          {category.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="single-sidebar">
                  <div className="single-sidebar-title">
                    <h3>Size</h3>
                  </div>
                  <div className="single-sidebar-content">
                    {sizeData?.map((size: ISize) => {
                      const isSelected = selectedSize === size._id;
                      return (
                        <button
                          style={{
                            backgroundColor: isSelected ? "#FF0000" : "white",
                            border: isSelected ? "1px solid #FF0000" : "1px solid",
                            color: isSelected ? "white" : "black",
                          }}
                          className={`hover:bg-red-500 hover:text-white m-1 ${isSelected ? "bg-red-500 text-white" : ""}`}
                          key={size._id}
                          onClick={() => {
                            if (selectedSize === size._id) {
                              setSelectedSize(undefined);
                            } else {
                              setSelectedSize(size._id?.toString());
                            }
                          }}
                        >
                          {size.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="single-sidebar">
                  <div className="single-sidebar-title">
                    <h3>Màu Sắc</h3>
                  </div>
                  <div className="single-sidebar-content" >
                    {colorData?.map((color: IColor) => {
                      const isSelected = selectedColor === color._id;
                      return (
                        <button
                          style={{ marginRight: 9, marginBottom: 10, backgroundColor: color.unicode, boxShadow: isSelected ? "0 0 5px 2px rgba(255, 0, 0, 0.5)" : "none", }}
                          className={`hover:bg-red-500 ${selectedColor === color._id ? "bg-red-500 text-white" : ""}`}
                          key={color._id}
                          onClick={() => {
                            if (selectedColor === color._id) {
                              setSelectedColor(undefined);
                            } else {
                              setSelectedColor(color._id);
                            }
                          }}
                        >
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="single-sidebar price">
                  <div className="single-sidebar-title">
                    <h3>Khoảng giá</h3>
                  </div>
                  <div className="single-sidebar-content">
                    <select
                      className="w-[90%] px-4 py-2 border border-gray-300 rounded-md text-base bg-white"
                      name="priceRange"
                      onChange={handlePriceRangeChange}
                      value={selectedPriceRange}
                    >
                      <option value="">Tất cả</option>
                      <option value="0-500000">Dưới 500k</option>
                      <option value="500000-1000000">500k - 1 triệu</option>
                      <option value="1000000">Trên 1 triệu</option>
                      {/* Thêm các khoảng giá khác tại đây */}
                    </select>
                  </div>
                </div>
                <button onClick={handleResetFilter} style={{width: '90%', backgroundColor: 'red', color: 'white', marginTop: '20px'}}>Đặt lại</button>
                <div className="banner-left">
                  <a href="#">
                    <img src="img/product/banner_left.jpg" alt="" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-9">
              <div className="product-bar">
                <div className="sort-by">
                  <label>Giá: </label>
                  <select
                    name="sort"
                    onChange={handleSortChange}
                    value={sortOption}
                  >
                    <option value="ascending" selected>
                      Thấp đến cao
                    </option>
                    <option value="decrease">Cao đến thấp </option>
                  </select>
                </div>
                <div className="limit-product">
                  <label>Show</label>
                  <select
                    name="show"
                    onChange={handleProductsPerPageChange}
                    value={productsPerPage}
                  >
                    <option value="6">6</option>
                    <option value="9">9</option>
                    <option value="12">12</option>
                    <option value="15">15</option>
                  </select>
                </div>
              </div>
              {/* Nhập dữ liệu category */}
              <div className="row">
                <div className="product-content">
                  <div className="tab-content">
                    <div
                      role="tabpanel"
                      className="tab-pane fade home2 active show"
                      id="gird"
                    >
                      <div className="row">
                        {displayedProducts && displayedProducts.length > 0 ? (
                          displayedProducts?.map((product: IProduct) => {
                      const minPrices = product.variants?.map((variant) => variant.sellingPrice || 0);
                      const maxPrices = product.variants?.map((variant) => variant.sellingPrice || 0);
                      const minSellingPrice = minPrices ? Math.min(...minPrices) : 0;
                      const maxSellingPrice = maxPrices ? Math.max(...maxPrices) : 0;

                      const formattedMinSellingPrice = new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(minSellingPrice);
            
                      const formattedMaxSellingPrice = new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(maxSellingPrice);

                            return (
                              <div
                                className="col-lg-4 col-md-6"
                                key={product._id}
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

                                    <div className="product-price">
                                      <div className="product-name">
                                        <h1>{product.name}</h1>
                                      </div>
                                      <div className="price-rating">
     
                                        <span className="mr-1">{formattedMinSellingPrice}</span>-
                                        <span className="ml-1">{formattedMaxSellingPrice}</span>

                                        <div className="ratings">
                                          <i className="fa fa-star"></i>
                                          <i className="fa fa-star"></i>
                                          <i className="fa fa-star"></i>
                                          <i className="fa fa-star"></i>
                                          <i className="fa fa-star"></i>
                                          <span className="ml-2">Đã bán {product.sell_quantity}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            );
                          })
                        ) : (
                          <div>Sản phẩm không tồn tại</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <ReactPaginate
                    previousLabel={"Prev"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={6}
                    onPageChange={handlePageChange}
                    containerClassName={"paginations"}
                    activeClassName={"actives"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
