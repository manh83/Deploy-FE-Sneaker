// import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetOrderByIdQuery, useUpdateOrderMutation } from '../../../Services/Api_Order';
import { IOrder } from '../../../Models/interfaces';
// import { useGetOneUserQuery } from '../../../Services/Api_User';
import { Button, Popconfirm, message } from 'antd';
import LoadingAdmin from '../../../Component/LoadingAdmin';
// import moment from 'moment';


const DetailBill = () => {
    const { id } = useParams();
    const { data,isLoading } = useGetOrderByIdQuery(id || "");


    // tổng tiền của sản phẩm khi chưa dùng mã giảm giá
    const undiscountedMoney = data?.products?.reduce((acc:number,item:any) => acc + (item.price * item.quantity),0)

    
    const navigate = useNavigate();

    const [updateOrder] = useUpdateOrderMutation();

    const onFinish = (values: IOrder) => {
        try {
            updateOrder({ ...values, _id: id }).unwrap().then(() => {
                window.location.href = 'http://localhost:5173/admin/bill/list';
            });
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
        }
    };

    const handleConfirm = () => {
        onFinish({ ...data, status: '1' });
        message.success("Đơn hàng đã được xác nhận thành công");
    };

    const handleCancel = () => {
        onFinish({ ...data, status: '2' });
        message.success("Đơn hàng đã được hủy thành công");
    };

    const getStatusText = (status: any) => {
        switch (status) {
            case '0':
                return 'Đang chờ xác nhận';
            case '1':
                return 'Đã xác nhận';
            case '2':
                return 'Đã hủy';
            case '3':
                return 'Đang giao hàng';
            case '4':
                return 'Đã nhận hàng';
            default:
                return '';
        }
    };
    const getStatusColor = (status: any) => {
        switch (status) {
            case '0':
                return { color: 'orange' };
            case '1':
                return { color: 'blue' };
            case '2':
                return { color: 'red' };
            case '3':
                return { color: '#FFD700' };
            case '4':
                return { color: 'blue' };
            default:
                return {};
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {isLoading ? <LoadingAdmin /> : <div>
                <div>
                    {data && (
                        <div className='order' >
                            <div style={{ margin: 25 }}>
                                <div style={{ display: 'flex' }}>
                                <div style={{ marginBottom: 40, marginRight: 200 }}>
                                        <h3>Thông tin đơn hàng</h3>
                                        <p style={{fontSize: 18}}>Mã đơn hàng: {data?.code_order}</p>
                                        <p style={getStatusColor(data?.status)}>Trạng thái: {getStatusText(data?.status)}</p>
                                        {data?.discountCodeId ? <p>Tổng giá trị đơn hàng trước giảm giá: <span style={{color: 'red',fontWeight: 500}}>{undiscountedMoney.toLocaleString()}đ</span></p>: ''}
                                        {data?.discountCodeId ? <p> Đã sử dung mã giảm giá: <span style={{color: 'red',fontWeight: 500}}>{data?.discountCodeId.code}</span></p> : ''}
                                        {data?.discountCodeId ? <p style={{fontSize: 18}}>Được giảm giá: {data?.discountCodeId.percentage > 0 ? <span style={{color:'red',fontWeight: 500}}>{ data?.discountCodeId?.percentage}%</span> : <span style={{color:'red',fontWeight: 500}}>{data?.discountCodeId.amountDiscount.toLocaleString()}đ</span>}</p> : ''}
                                        {data?.discountCodeId || data.totalPrice ? <p>Tổng tiền thu hộ: <span style={{color: 'red',fontWeight: 500}}>{data.statusPayment === true ? 0 : data?.totalPrice.toLocaleString() }đ</span></p> : ''}
                                        <p style={{fontSize: 18}}>Thời gian đặt hàng: {`${new Date(data?.createdAt).toLocaleTimeString()} | ${new Date(data?.createdAt).toLocaleDateString()}`}</p>
                                        <p style={{fontSize: 18}}>Phương thức thanh toán: {data?.statusPayment === true ? <span style={{color: 'green',fontWeight: 500}}>Đã chuyển khoản</span> : <span style={{color: 'red',fontWeight: 500}}>Thanh toán khi nhận hàng</span>}</p>
                                </div>
                                    <div style={{display: "block", margin: "0 auto"}}>
                                        <h3>Địa chỉ giao hàng</h3>
                                        {data?.address && (
                                            <div>
                                                <p style={{fontSize: 18}}>Thành phố: {data?.address?.city}</p>
                                                <p style={{fontSize: 18}}>Quận/Huyện: {data?.address?.district}</p>
                                                <p style={{fontSize: 18}}>Địa chỉ: {data?.address?.location}</p>
                                            </div>
                                        )}
                                        <p style={{fontSize: 18}}>Người nhận: {data?.name}</p>
                                        <p style={{fontSize: 18}}>Số điện thoại: {data?.phone}</p>
                                        <p style={{fontSize: 18}}>Ghi chú: {data?.note}</p>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginRight: 30, marginLeft: 30 }}>
                                {/* <h2>Sản phẩm trong đơn hàng</h2> */}
                                <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f2f2f2', width: '20%', textAlign: 'center' }}>Mã sản phẩm</th>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f2f2f2', width: '20%', textAlign: 'center' }}>Tên sản phẩm</th>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f2f2f2', width: '15%', textAlign: 'center' }}>Ảnh</th>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f2f2f2', width: '8%', textAlign: 'center' }}>Màu sắc</th>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f2f2f2', width: '5%', textAlign: 'center' }}>Size</th>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f2f2f2', width: '7%', textAlign: 'center' }}>Số lượng</th>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f2f2f2', width: '10%', textAlign: 'center' }}>Đơn giá</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.products?.map((product: any) => (
                                            <tr key={product?._id}>
                                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{product?.productId?._id}</td>
                                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{product?.productId?.name}</td>
                                                <td style={{ border: '1px solid #ddd', padding: '8px', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    {product?.productId?.imgUrl && (
                                                        <img
                                                            src={product?.imgUrl[0]}
                                                            alt={product?.productId?.name}
                                                            style={{ width: '100px', height: '100px' }}
                                                        />
                                                    )}
                                                </td>
                                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                                    <div
                                                        style={{
                                                            backgroundColor: product?.color,
                                                            width: '20px',
                                                            height: '20px',
                                                            marginLeft: 'auto',
                                                            marginRight: 'auto',
                                                        }}
                                                    ></div>
                                                </td>
                                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{product?.size}</td>
                                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{product?.quantity}</td>
                                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{product.price ? product?.price.toLocaleString() : ''}đ</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan={6} style={{paddingTop: 30,textAlign: 'right', fontWeight: 600, borderTop: '1px solid #ddd', fontSize:18,color:"red" }}>Tổng tiền:</td>
                                            <td style={{paddingTop: 30, textAlign: 'center', fontWeight: 600, fontSize:18,color:"red"}}>{data.totalPrice ? data?.totalPrice.toLocaleString() : ''}đ</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
                <div style={{ marginTop: 25,marginLeft:30 }}>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xác nhận đơn hàng này?"
                        onConfirm={() => handleConfirm()}
                        okText="Yes"
                        cancelText="No"
                        disabled={data?.status === "2"}
                    >
                        <Button
                            style={{
                                borderRadius: 10,
                                height: 40,
                                marginRight: 20
                            }}
                            disabled={data?.status === "2" || data?.status === "4" || data?.status === "3" || data?.status === "1"}
                            className={data?.status === "0" ? "confirm-button" : "disabled-button"}
                        >
                            Xác nhận
                        </Button>
                    </Popconfirm>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn hủy đơn hàng này?"
                        onConfirm={() => handleCancel()}
                        okText="Yes"
                        cancelText="No"
                        disabled={data?.status === "2"}
                    >
                        <Button
                            style={{
                                borderRadius: 10,
                                height: 40,
                                marginRight: 20,
                                marginTop: 10,
                                marginBottom: 10
                            }}
                            disabled={data?.status === "1" || data?.status === "2" || data?.status === '3' || data?.status === '4'}
                            className={data?.status === "0" ? "cancel-button" : "disabled-button"}
                        >
                            Hủy
                        </Button>
                    </Popconfirm>
                    <Button style={{ height: 40 }} htmlType="button" onClick={() => navigate("/admin/bill/list")}>
                        Quay lại
                    </Button>
                </div>
            </div>}
            
        </div>
    );
};

export default DetailBill;