import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs, Pagination } from "swiper/modules";
import { useParams } from "react-router-dom";
import {
  useGetOneProductQuery,
  useGetAllProductQuery,
} from "../Services/Api_Product";
import { PlusOutlined, MinusOutlined, CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAddToCartMutation, useGetCartQuery } from "../Services/Api_cart";
import { ProductItem } from "../Models/interfaces";
import { useGetAllSizeQuery } from "./../Services/Api_Size";
import { Button, Modal, message } from "antd";
import Loading from "../Component/Loading";
import {
  useCreateCommentMutation,
  useDeleteCommentByAdminMutation,
  useDeleteCommentByIdUserMutation,
  useGetCommentsByProductIdQuery,
  useUpdateCommentByIdMutation,
} from "../Services/Api_Comment";
import { useGetUserOrdersQuery } from "../Services/Api_Order";
import { MdDeleteForever } from "react-icons/md";
import { FaTools } from "react-icons/fa";
import parse from "html-react-parser";
import { format } from "date-fns";
import { AiOutlineMinus } from "react-icons/ai";

type Variant = {
  color_id: {
    unicode: string;
  };
  size_id: {
    name: string;
  };
};

const ProductDetail = () => {
  // state Swiper
  const [thumbsSwiper, setThumbsSwiper]: any = useState(null);
  const [indexSlider, setIndexSlider]: any = useState(0);
  const [getQuantityBuy, setQuantityBuy]: any = useState(1);
  const [getSizeByColor, setSizeByColor]: any = useState([]);
  const [getColor, setColor]: any = useState("");
  const [getSize, setSize]: any = useState("");
  const { id } = useParams();
  const { data: allProducts, isLoading: loadingProducts }: any =
    useGetAllProductQuery();
  const { data: productDataOne, isLoading: isLoadingProduct }: any =
    useGetOneProductQuery(id || "");
  const [addToCart] = useAddToCartMutation();
  const { data: cartData, error } = useGetCartQuery();
  const { data: getAllSize } = useGetAllSizeQuery();
  const [imageUrl, setImageUrl] = useState<any[]>([]);
  const [totalVariant, setTotalVariant]: any = useState(0); //sau khi chọn size lập tức hiện số lượng của biến thể đó
  const [sellingPrice, setSellingPrice] = useState<number | undefined>(
    undefined
  ); // lưu giá bán ra
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(
    undefined
  ); // lưu giá gốc
  const [grossProduct, setGrossProduct] = useState("");
  const [importPrice,setImportPrice] = useState<number | undefined>(undefined);



  // thực hiện in ra giá của từng biến thể sản phẩm variants trong bảng Product
  const prices = productDataOne?.variants?.map(
    ({
      sellingPrice,
      original_price,
      importPrice
    }: {
      sellingPrice: number;
      original_price: number;
      importPrice: number
    }) => ({
      sellingPrice,
      original_price,
      importPrice
    })
  );
  

  const priceMap = prices?.map((item: any) => item.sellingPrice);
  const minSellingPrice = priceMap ? Math.min(...priceMap) : 0;
  const maxSellingPrice = prices ? Math.max(...priceMap) : 0;

  useEffect(() => {
    let arrSize = [];
    arrSize = productDataOne?.variants.map((variant: any) => {
      if (variant.color_id.unicode === getColor) {
        return variant.size_id.name;
      }
    });

    setSizeByColor(arrSize);
  }, [getColor]);

  let arrayPR: any = [];
  const arrayRelate = productDataOne?.categoryId;
  if (!isLoadingProduct && !loadingProducts) {
    for (let i = 0; i < arrayRelate.length; i++) {
      allProducts?.map((product: any) => {
        if (product.categoryId == arrayRelate) {
          arrayPR.push(product);
        }
      });
    }
  }
  arrayPR = arrayPR.filter((item: any) => item._id != id);
  function filterUniqueObjectsById(array: any, key: any) {
    return array.filter(
      (obj: any, index: any, self: any) =>
        index === self.findIndex((o: any) => o[key] === obj[key])
    );
  }

  arrayPR = filterUniqueObjectsById(arrayPR, "_id");

  // Sử lý chọn màu sắc hiện ra size tương ứng
  const ChooseColor = (color: any, indColor: number) => {
    setColor(color);
    setIndexSlider(indColor);


    // Tìm URL hình ảnh tương ứng cho màu đã chọn
    const selectedVariant = productDataOne?.variants.find(
      (variant: any) => variant.color_id.unicode === color
    );


    const selectedImgUrl = selectedVariant ? selectedVariant.imgUrl[0] : "";

    setImageUrl(selectedImgUrl);

    const sizesForColor = productDataOne?.variants
      .filter((variant: any) => variant.color_id.unicode === color)
      .map((variant: any) => variant.size_id.name);

    setSizeByColor(sizesForColor);

    setSize("");
    setTotalVariant(0);
  };



  // Chọn size
  const ChooseSize = (size: any) => {
    setSize(size);
    const selectedVariant = productDataOne?.variants.find(
      (variant: Variant) =>
        variant.color_id.unicode === getColor && variant.size_id.name === size
    );

    const totalAvailableQuantity = selectedVariant.inventory;
    setTotalVariant(totalAvailableQuantity);

    const selectedSellingPrice = selectedVariant?.sellingPrice;
    setSellingPrice(selectedSellingPrice);
  };

  
  //THỰC THI CHẠY LỆNH KHI CHỌN MÀU VÀ SIZE SẼ RA GIÁ TƯƠNG ỨNG CỦA SẢN PHẨM
  useEffect(() => {
    const selectedVariant = productDataOne?.variants.find(
      (variant: any) =>
        variant.color_id.unicode === getColor &&
        variant.size_id.name === getSize
    );

    console.log(selectedVariant);
    
       const import_price = selectedVariant?.importPrice
       setImportPrice(import_price)
       
    const selectedSellingPrice = selectedVariant?.sellingPrice;
    const originalPrice = selectedVariant?.original_price;
    setSellingPrice(selectedSellingPrice);
    setOriginalPrice(originalPrice);
  }, [getColor, getSize, productDataOne]);

  console.log(importPrice);

  // giảm số lượng
  const Minus = () => {
    getQuantityBuy > 1 && setQuantityBuy(getQuantityBuy - 1);
  };

  // tăng số lượng
  const Plus = () => {
    setQuantityBuy(getQuantityBuy + 1);
  };

  const handleAddToCart = () => {
    if (!productDataOne || getQuantityBuy < 1 || !getColor || !getSize) {
      message.error("Vui lòng chọn đầy đủ thông tin sản phẩm");
      return;
    }

    const selectedVariant = productDataOne?.variants.find(
      (variant: Variant) =>
        variant.color_id.unicode === getColor &&
        variant.size_id.name === getSize
    );

    if (!selectedVariant) {
      message.error("Không tìm thấy biến thể phù hợp. Vui lòng kiểm tra lại.");
      return;
    }

    // const totalAvailableQuantity = selectedVariant.quantity;
    const totalAvailableQuantity = selectedVariant.quantity;

    if (getQuantityBuy < 1 || getQuantityBuy > totalAvailableQuantity) {
      message.error(`Số lượng không được vượt quá ${totalAvailableQuantity}`);
      return;
    }

    //Kiểm tra token
    const isAuthenticated = localStorage.getItem("token");

    if (isAuthenticated) {
      // thực hiện lần đầu tiên kiểm tra khi tài khoản chưa thêm vào giỏ hàng thực hiện thêm mới
      if (cartData === undefined || cartData?.products.length === 0) {
        if (typeof sellingPrice !== "undefined") {
          addToCart({
            productId: productDataOne._id,
            imgUrl: imageUrl,
            color: getColor,
            size: getSize,
            quantity: getQuantityBuy,
            price: sellingPrice,
            importPrice: importPrice,
            totalAmount: sellingPrice * getQuantityBuy,
          });
        } else {
          message.error("Đã có lỗi xảy ra vui lòng thử lại");
        }

        message.success("Thêm thành công");
      } else {
        const productItemIndex = cartData.products.findIndex(
          (product: any) =>
            product.productId?._id == productDataOne._id &&
            product.color == getColor &&
            product.size == getSize
        );

        const productItem = cartData.products[productItemIndex];

        if (productItemIndex !== -1) {
          const updatedProductItem = { ...productItem }; // Tạo bản sao của productItem
          console.log(updatedProductItem);

          if (typeof sellingPrice  !== "undefined") {
            addToCart({
              productId: updatedProductItem.productId._id,
              imgUrl: imageUrl,
              color: updatedProductItem.color,
              size: updatedProductItem.size,
              quantity: getQuantityBuy,
              price: sellingPrice,
              importPrice: importPrice,

            });
            message.success("Đã thêm sản phẩm vào giỏ hàng");
          } else {
            message.error("Đã có lỗi xảy ra vui lòng thử lại");
          }
        } else {
          if (typeof sellingPrice !== "undefined") {
            const newProduct = {
              productId: productDataOne._id,
              imgUrl: imageUrl,
              color: getColor,
              size: getSize,
              quantity: getQuantityBuy,
              price: sellingPrice,
              importPrice: importPrice,
              totalAmount: sellingPrice * getQuantityBuy,
            }
            console.log("new",newProduct);
            
            addToCart(newProduct);
            message.success("thêm oke");
          } else {
            message.error("Đã có lỗi xảy ra vui lòng thử lại");
          }
        }
      }
    } else {
      // Xử lý khi chưa đăng nhập, tương tự như trước
      const existingCartJSON = localStorage.getItem("cart");
      const existingCart = existingCartJSON ? JSON.parse(existingCartJSON) : [];

      // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
      const existingProductIndex = existingCart.findIndex(
        (item: any) =>
          item.productId === productDataOne._id &&
          item.color === getColor &&
          item.size === getSize
      );

      const maxId = existingCart.reduce(
        (max: any, item: any) => (item.id > max ? item.id : max),
        0
      );
      const newId = maxId + 1;

      if (existingProductIndex !== -1) {
        // Sản phẩm đã tồn tại trong giỏ hàng với cùng productId, color và size
        // Chỉ cập nhật giá trị quantity và giá cho sản phẩm này
        existingCart[existingProductIndex].quantity += getQuantityBuy;
        existingCart[existingProductIndex].price +=
          existingCart[existingProductIndex].priceItem * getQuantityBuy;
      } else {
        // Nếu sản phẩm không tồn tại trong giỏ hàng, tạo sản phẩm mới và thêm vào mảng giỏ hàng
        if (typeof sellingPrice !== "undefined") {
          existingCart.unshift({
            id: newId,
            productId: productDataOne._id,
            name: productDataOne.name,
            imgUrl: imageUrl,
            quantity: getQuantityBuy,
            color: getColor,
            size: getSize,
            price: sellingPrice,
            importPrice: importPrice,
            totalAmount: sellingPrice * getQuantityBuy,
          });
          console.log(existingCart);
          
          message.success("Đã thêm sản phẩm vào giỏ hàng");
        } else {
          message.error("Đã có lỗi xảy ra vui lòng thử lại");
        }
      }

      // Cập nhật localStorage với giỏ hàng mới
      localStorage.setItem("cart", JSON.stringify(existingCart));
    }
  };

  const uniqueColorIds: string[] = [];

  const uniqueColorButtons = productDataOne?.variants.reduce(
    (buttons: any, variant: any, indColor: number) => {
      const colorId = variant.color_id?.unicode;

      if (
        colorId &&
        Array.isArray(uniqueColorIds) &&
        !uniqueColorIds.includes(colorId)
      ) {
        uniqueColorIds.push(colorId);

        buttons.push(
          <button
            key={colorId}
            onClick={() => ChooseColor(colorId, indColor + 1)}
            className={`w-8 h-8 rounded-full ${
              getColor === colorId ? "borderChooseColor" : ""
            }`}
            style={{
              background: variant.color_id?.unicode,
              boxShadow: `0 0 6px 0.5px ${variant.color_id?.unicode}`,
            }}
          ></button>
        );
      }

      return buttons;
    },
    []
  );

  // nhập số lượng
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(e.target.value, 10);

    // Kiểm tra xem inputValue có phải là số hợp lệ và nằm trong phạm vi cho phép không
    if (!isNaN(inputValue) && inputValue >= 1) {
      setQuantityBuy(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 8) {
      setQuantityBuy(0);
    }
  };

  const [currentUser, setCurrentUser]: any = useState(null);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      // Chuyển đổi chuỗi JSON thành đối tượng JavaScript
      const userObj = JSON.parse(storedUser);

      setCurrentUser(userObj);
    }
  }, []);

  const [content, setContent] = useState("");
  const [createComment] = useCreateCommentMutation();
  const [messagecm, setMessagecm] = useState("");
  const [isLoadingcm, setIsLoadingcm]: any = useState(false);
  const { data: comments, refetch } = useGetCommentsByProductIdQuery(id);
  const [deleteCommentById] = useDeleteCommentByAdminMutation(); //delete của admin

  const [displayedComments, setDisplayedComments] = useState<any[]>([]);
  const [loadMoreVisible, setLoadMoreVisible] = useState(false);

  const { data: order } = useGetUserOrdersQuery();
  const hasPurchased = order?.some((order: any) => {
    return (
      order.userId?._id === currentUser?._id &&
      order.products.some((product: any) => product.productId?._id === id)
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUser?.role === "admin" || currentUser?.role === "staff") {
      // Gửi yêu cầu tạo bình luận mà không cần kiểm tra đã mua hàng
      createComment({ userId: currentUser?._id, productId: id, content })
        .unwrap()
        .then((response) => {
          // Xử lý phản hồi thành công
          // console.log('Bình luận đã được tạo:', response);
          // Cập nhật danh sách bình luận hiển thị
          refetch();
        })
        .catch((error) => {
          // Xử lý lỗi
          // console.error('Đã xảy ra lỗi khi tạo bình luận:', error);
          setMessagecm(error.data.message);
        });
    } else {
      // Kiểm tra đã mua hàng

      if (hasPurchased) {
        const purchasedOrder = order?.find((order: any) => {
          return (
            order.userId?._id === currentUser?._id &&
            order.products.some((product: any) => product.productId?._id === id)
          );
        });

        if (purchasedOrder) {
          // setMessagecm('Người dùng đã đặt mua sản phẩm này');
          const orderId = purchasedOrder._id;
          // setMessagecm(`OrderId của đơn hàng đã mua: ${orderId}`);

          // Gửi yêu cầu tạo bình luận với orderId
          createComment({
            userId: currentUser?._id,
            productId: id,
            orderId,
            content,
          })
            .unwrap()
            .then((response) => {
              // Cập nhật danh sách bình luận hiển thị
              refetch();
            })
            .catch((error) => {
              setMessagecm(error.data.message);
            });
        } else {
          setMessagecm("Không tìm thấy thông tin đơn hàng đã mua");
        }
      } else {
        setMessagecm(
          "Bạn chưa mua sản phẩm này. Hãy mua sản phẩm để có thể bình luận!"
        );
      }
    }

    // Đặt lại nội dung bình luận
    setContent("");
  };

  // xóa comment cho admin
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const handleDeleteComment = (commentId: any) => {
    setDeletingCommentId(commentId);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirmation = (confirmed: boolean) => {
    if (confirmed) {
      deleteCommentById(deletingCommentId)
        .unwrap()
        .then(() => {
          message.success("Xóa thành công");
          // Cập nhật danh sách bình luận hiển thị
          refetch();
        })
        .catch((error) => {
          console.error("Lỗi khi xóa bình luận:", error);
        });
    }

    setIsDeleteModalVisible(false);
  };

  // cập nhật + xóa bình luận cho user
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isDeleteCommentUserModalVisible, setIsDeleteCommentUserModalVisible] =
    useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const [updateCommentByIdMutation] = useUpdateCommentByIdMutation();
  const [deleteCommentByIdUserMutation] = useDeleteCommentByIdUserMutation();

  const handleDeleteCommentUser = (commentId: any) => {
    setSelectedComment(commentId);
    setIsDeleteCommentUserModalVisible(true);
  };

  const handleUpdateComment = (comment: any) => {
    setSelectedComment(comment);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateConfirmation = (commentId: any, content: string) => {
    updateCommentByIdMutation({
      id: commentId,
      content,
      userId: currentUser?._id,
    })
      .unwrap()
      .then(() => {
        setIsUpdateModalVisible(false);
        message.success("Cập nhật bình luận thành công");
        refetch();
      })
      .catch((error) => {
        console.error("Failed to update comment:", error);
      });
  };

  const handleDeleteCommentUserConfirmation = (confirmDelete: any) => {
    if (confirmDelete) {
      deleteCommentByIdUserMutation(selectedComment)
        .unwrap()
        .then(() => {
          setIsDeleteCommentUserModalVisible(false);
          message.success("Xóa bình luận thành công");
          refetch();
        })
        .catch((error) => {
          console.error("Failed to delete comment:", error);
        });
    } else {
      setIsDeleteCommentUserModalVisible(false);
    }
  };

  const ChangeProducts = (id: any) => {
    window.location.href = "/product/" + id;
  };

  const [updatedContent, setUpdatedContent] = useState("");

  useEffect(() => {
    const initialComments = comments?.slice(0, 2);
    setDisplayedComments(initialComments);

    if (comments?.length > 2) {
      setLoadMoreVisible(true);
    }
  }, [comments]);

  // Hàm xử lý khi nhấp vào nút "Load More"
  const handleLoadMore = () => {
    const remainingComments = comments?.slice(
      displayedComments.length,
      displayedComments.length + 2
    );
    setDisplayedComments([...displayedComments, ...remainingComments]);

    if (displayedComments.length + 2 >= comments.length) {
      setLoadMoreVisible(false);
    }
  };
  return (
    <div>
      {isLoadingProduct ? (
        <Loading />
      ) : (
        <div className="w-[90vw] mx-auto mt-36 relative">
          <div className="Single-product-location home2">
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
                        <strong>{productDataOne?.name}</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* detail */}
          <div className="single-product-details">
            <div className="container">
              <div className="row">
                <div className="col-lg-6">
                  <div className="single-product-img tab-content">
                    <Swiper
                      key={indexSlider}
                      style={
                        {
                          "--swiper-navigation-color": "#fff",
                          "--swiper-pagination-color": "#fff",
                        } as React.CSSProperties
                      }
                      spaceBetween={5}
                      navigation={true}
                      thumbs={{ swiper: thumbsSwiper }}
                      modules={[FreeMode, Navigation, Thumbs]}
                      className="mySwiper2"
                      initialSlide={indexSlider}
                    >
                      {productDataOne?.imgUrl.map(
                        (itemImg: any, index: any) => (
                          <SwiperSlide key={index}>
                            <img
                              className="h-96"
                              src={imageUrl.length > 0  ? imageUrl : itemImg}
                            />
                          </SwiperSlide>
                        )
                      )}
                    </Swiper>
                  </div>
                  <div className="nav product-page-slider">
                    <Swiper
                      onSwiper={(swiper) => {
                        setThumbsSwiper(swiper);
                      }}
                      spaceBetween={5}
                      slidesPerView={4}
                      freeMode={true}
                      watchSlidesProgress={true}
                      modules={[FreeMode, Navigation, Thumbs]}
                      className="mySwiper"
                    >
                      {productDataOne?.imgUrl.map(
                        (itemImg: any, index: any) => (
                          <SwiperSlide key={index}>
                            <img
                              src={itemImg}
                              onClick={() => setIndexSlider(index)}
                            />
                          </SwiperSlide>
                        )
                      )}
                    </Swiper>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="single-product-details">
                    <p className="product-name">{productDataOne?.name}</p>
                    <div className="list-product-info mt-2 mb-3">
                      <div className="price-rating flex">
                        <div className="star">
                          <p style={{ color: "#ffb21e", fontWeight: "bold" }}>
                            5.0
                          </p>
                        </div>
                        <div className="ratings">
                          <i
                            className="fa fa-star"
                            style={{ fontSize: 14 }}
                          ></i>
                          <i
                            className="fa fa-star "
                            style={{ fontSize: 14 }}
                          ></i>
                          <i
                            className="fa fa-star"
                            style={{ fontSize: 14 }}
                          ></i>
                          <i
                            className="fa fa-star"
                            style={{ fontSize: 14 }}
                          ></i>
                          <i
                            className="fa fa-star"
                            style={{ fontSize: 14 }}
                          ></i>
                        </div>
                        <p style={{ fontSize: "20px" }}>|</p>
                        <div className="evaluate">
                          {comments?.length} Đánh giá
                        </div>
                        <p style={{ fontSize: "20px" }}>|</p>
                        <div className="sold">
                          <p>{productDataOne.sell_quantity || 0} Đã Bán</p>
                        </div>
                      </div>
                    </div>
                    <p className="view">
                      Số lượt truy cập: {productDataOne?.views}
                    </p>
                    <div className="avalable">
                      <p>
                        Tình trạng:{" "}
                        <span>
                          {" "}
                          {productDataOne?.inventoryTotal > 0 &&
                          productDataOne?.isDeleted === false
                            ? "còn hàng"
                            : "hết hàng"}
                        </span>
                      </p>
                      <p>
                        Số lượng:{" "}
                        <span className="text-gray-600">
                          {" "}
                          {productDataOne?.isDeleted === false
                            ? productDataOne?.inventoryTotal
                            : 0}
                        </span>
                      </p>
                    </div>
                    <div className="item-price flex">
                      {sellingPrice ? (
                        <p
                          style={{
                            fontSize: 20,
                            color: "black",
                            fontWeight: 500,
                          }}
                        >
                          {sellingPrice?.toLocaleString()}đ
                        </p>
                      ) : (
                        <span
                          style={{
                            fontSize: 20,
                            color: "black",
                            fontWeight: 500,
                          }}
                        >
                          {minSellingPrice.toLocaleString()}đ
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: 20,
                          marginLeft: 10,
                          marginRight: 10,
                          color: "black",
                          fontWeight: 500,
                        }}
                      >
                        -
                      </span>
                      {originalPrice ? (
                        <p
                          style={{
                            fontSize: 20,
                            color: "black",
                            fontWeight: 500,
                            textDecoration: "line-through",
                          }}
                        >
                          {originalPrice?.toLocaleString()}đ
                        </p>
                      ) : (
                        <span
                          style={{
                            fontSize: 20,
                            color: "black",
                            fontWeight: 500,
                          }}
                        >
                          {maxSellingPrice.toLocaleString()}đ
                        </span>
                      )}
                    </div>

                    {productDataOne?.isDeleted === true ? (
                      <div>
                        <p
                          className="text-red-500"
                          style={{ fontSize: "25px" }}
                        >
                          Sản phẩm đã ngừng bán
                        </p>
                      </div>
                    ) : productDataOne?.inventoryTotal === 0 ? (
                      <div>
                        <p
                          className="text-red-500"
                          style={{ fontSize: "25px" }}
                        >
                          Hết hàng
                        </p>
                      </div>
                    ) : (
                      <div>
                        <h3 className="mt-4">Chọn màu:</h3>
                        <div className="flex space-x-2 my-4">
                          {uniqueColorButtons}
                        </div>

                        <div className="select-catagory">
                          <div>
                            <h3 className="mt-3 mb-4">Chọn kích cỡ:</h3>
                            <div className="mb-3 space-x-3 flex">
                              {getAllSize ? (
                                getAllSize?.map((size: any) => {
                                  const isSizeAvailable =
                                    getColor &&
                                    getSizeByColor.includes(size.name) &&
                                    productDataOne?.variants.some(
                                      (variant: any) =>
                                        variant.color_id.unicode === getColor &&
                                        variant.size_id.name === size.name
                                      // && variant.inventory > 0
                                    );

                                  return (
                                    <button
                                      key={size._id}
                                      disabled={!isSizeAvailable}
                                      style={{ marginRight: 10, paddingTop: 8 }}
                                      onClick={() => {
                                        ChooseSize(size.name);
                                      }}
                                      className={`w-14 h-10 cursor-pointer relative border-[1px] text-center 
                                        ${
                                          getSize === size.name
                                            ? "border-green-600"
                                            : ""
                                        } ${
                                        isSizeAvailable
                                          ? "bg-transparent"
                                          : "bg-slate-300"
                                      }`}
                                    >
                                      <p>{size.name}</p>
                                      {getSize === size.name ? (
                                        <img
                                          className="absolute top-[-7px] right-[-5px] w-3 h-3"
                                          src="../../img/icons/correct.png"
                                          alt=""
                                        />
                                      ) : (
                                        ""
                                      )}
                                    </button>
                                  );
                                })
                              ) : (
                                <p>Loading...</p>
                              )}
                            </div>
                            <div className="mt-4 -mb-4">
                              {totalVariant > 0 ? (
                                <p>{totalVariant} sản phẩm có sẵn</p>
                              ) : (
                                <p>
                                  Vui lòng chọn màu và kích cỡ của sản phẩm !
                                </p>
                              )}
                            </div>
                            <div>{grossProduct}</div>
                          </div>
                        </div>

                        <div className="cart-item">
                          <div className="price-box"></div>
                          <div className="single-cart">
                            <div className="cart-plus-minus">
                              <div className="quantity-cart">
                                <span style={{ fontSize: "16px" }}>
                                  Số lượng:{" "}
                                </span>
                                <div className="inp_group">
                                  <button>
                                    <MinusOutlined
                                      className="borderQuantity p-[3px] mt-1 border"
                                      onClick={() => Minus()}
                                    />
                                  </button>
                                  <input
                                    className="cart-plus-minus-box outline-0 h-10"
                                    type="text"
                                    name="qtybutton"
                                    id="quanityBuy"
                                    value={getQuantityBuy}
                                    onChange={(e) => handleQuantityChange(e)}
                                    onKeyDown={(e) => handleKeyDown(e)}
                                  />
                                  <button>
                                    <PlusOutlined
                                      className="borderQuantity p-[3px] mt-1 border"
                                      onClick={() => Plus()}
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <button
                              className="cart-btn"
                              onClick={handleAddToCart}
                            >
                              Thêm vào giỏ
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* kết th sử lý kiểm tra sản phẩm tồn kho  */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* mô tả + đánh giá + comment */}
          <div className="single-product-tab-area">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="single-product-tab">
                    <ul
                      className="nav single-product-tab-navigation"
                      role="tablist"
                    >
                      <li role="presentation" className="text-xl font-medium">
                        Mô tả sản phẩm
                      </li>
                    </ul>

                    {/* <!-- Tab panes --> */}
                    <div className="tab-content single-product-page">
                      <div
                        role="tabpanel"
                        className="tab-pane fade show active"
                        id="tab1"
                      >
                        <div className="single-p-tab-content">
                          <p>{parse(productDataOne?.description || "")} .</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="single-product-tab-area cm">
            <h2 className="cm_title">Đánh giá</h2>

            <div className="comments">
              {displayedComments?.map((comment: any) => (
                <div className="comment_detail" key={comment._id}>
                  <div className="comment_detail_header">
                    <div className="user_cm">
                      <img
                        className="user_cm_avt"
                        src={comment.userId.imgUrl}
                        alt=""
                      />
                      <div className="user_cm_inf">
                        <p className="user_cm_name">
                          @ {comment.userId.username}
                        </p>
                        <p className="date_created">
                          {format(
                            new Date(comment.createdAt),
                            "dd/MM/yyyy HH:mm:ss"
                          )}
                        </p>
                      </div>
                    </div>
                    {currentUser && currentUser?.role == "admin" ? (
                      <div className="favorites">
                        <p onClick={() => handleDeleteComment(comment._id)}>
                          <MdDeleteForever /> <span>Delete</span>
                        </p>
                      </div>
                    ) : (
                      currentUser &&
                      currentUser?._id === comment.userId._id && (
                        <div>
                          <div className="favorites">
                            <p
                              style={{ border: "none" }}
                              onClick={() => handleUpdateComment(comment)}
                            >
                              <FaTools style={{ color: "#18a3f4" }} />{" "}
                              <span style={{ color: "#18a3f4" }}>Sửa</span>
                            </p>
                          </div>
                          <div className="favorites">
                            <p
                              style={{ border: "none" }}
                              onClick={() =>
                                handleDeleteCommentUser(comment._id)
                              }
                            >
                              <MdDeleteForever /> <span>Xóa</span>
                            </p>
                          </div>

                          <Modal
                            title="Xác nhận xóa"
                            visible={isDeleteCommentUserModalVisible}
                            onOk={() =>
                              handleDeleteCommentUserConfirmation(true)
                            }
                            onCancel={() =>
                              handleDeleteCommentUserConfirmation(false)
                            }
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{
                              style: { backgroundColor: "red" },
                            }}
                          >
                            Bạn có chắc chắn muốn xóa không?
                          </Modal>

                          <Modal
                            title="Cập nhật bình luận"
                            visible={isUpdateModalVisible}
                            onOk={() =>
                              handleUpdateConfirmation(
                                comment._id,
                                updatedContent
                              )
                            }
                            onCancel={() => setIsUpdateModalVisible(false)}
                            okText="Cập nhật"
                            cancelText="Hủy"
                            style={{ marginTop: "140px" }}
                          >
                            <textarea
                              style={{
                                padding: "10px 20px",
                                outline: "auto",
                                width: "100%",
                              }}
                              value={updatedContent || comment?.content}
                              onChange={(e) =>
                                setUpdatedContent(e.target.value)
                              }
                            />
                            <input type="text" name="" id="" />
                          </Modal>
                        </div>
                      )
                    )}
                    <Modal
                      title="Xác nhận xóa"
                      visible={isDeleteModalVisible}
                      onOk={() => handleDeleteConfirmation(true)}
                      onCancel={() => handleDeleteConfirmation(false)}
                      okText="Xóa"
                      cancelText="Hủy"
                      okButtonProps={{ style: { backgroundColor: "red" } }}
                    >
                      Chắc chắn muốn xóa comment của user này không?
                    </Modal>
                  </div>
                  <div className="comment_content">
                    <p>{comment.content}</p>
                  </div>
                </div>
              ))}

              {loadMoreVisible && (
                <button
                  className="loadmore_btn"
                  onClick={handleLoadMore}
                  style={{
                    backgroundColor: "#00b7ff",
                    color: "white",
                    display: "block",
                    margin: "0 auto",
                  }}
                >
                  Xem thêm...
                </button>
              )}

              <div className="comment_form">
                {currentUser?._id ? (
                  <form onSubmit={handleSubmit}>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your comment"
                      maxLength={200}
                      cols={150}
                      rows={5}
                    />
                    <button type="submit" disabled={isLoadingcm}>
                      Gửi
                    </button>
                    {messagecm && <p style={{ color: "red" }}>{messagecm}</p>}
                  </form>
                ) : (
                  <p>Vui lòng đăng nhập để bình luận.</p>
                )}
              </div>
            </div>
          </div>
          {/* ============================================ khu SP liên quan */}
          <div className="container mb-20 -mt-16 productsRelative text-black">
            <h3 style={{ fontSize: 20 }}>Sản phẩm liên quan</h3>
            <div
              className={`productShow mt-4 flex flex-wrap space-x-5 ${
                arrayPR.length > 3 ? "justify-center" : ""
              }`}
            >
              {arrayPR.length ? (
                arrayPR?.map((items: any) => {
                  return (
                    <div
                      className="border rounded-2xl w-56 m-2 relative overflow-hidden"
                      key={items._id}
                    >
                      <Link to={`/product/${items._id}`}>
                        <img
                          onClick={() => ChangeProducts(items._id)}
                          className="w-56 h-48 rounded-lg hover:scale-110 duration-200 mb-2"
                          src={items.imgUrl[0]}
                          alt=""
                        />
                      </Link>
                      <p className="ml-2  text-gray-500">
                        {items.name}{" "}
                        <span className="float-right mr-2 text-gray-400 text-xs mt-2">
                          SL: {items.quantityTotal}
                        </span>
                      </p>
                      <div className="flex space-x-2">
                        <p className="text-xs ml-2">
                          {items.price ? items.price.toLocaleString() : 0} (VND)
                        </p>
                        {items.original_price > 0 && (
                          <p className="text-xs">
                            <del>
                              {items.original_price
                                ? items.original_price.toLocaleString()
                                : 0}
                            </del>
                          </p>
                        )}
                        {items.original_price > items.price ? (
                          <img
                            className=" absolute w-10 top-2"
                            src="../../img/IMAGE_CREATED/sale.png"
                            alt=""
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  );
                })
              ) : arrayPR.length > 0 ? (
                "...loading"
              ) : (
                <p className="text-center text-red-500">
                  Hiện chưa có sản phẩm cùng loại !
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
