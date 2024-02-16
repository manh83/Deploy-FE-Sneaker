import React, { useState } from 'react';
import { Divider, Select, Table, message } from 'antd';
import { Link } from 'react-router-dom';
import { Option } from 'antd/es/mentions';
import moment from 'moment';
import Input from 'antd/es/input/Input';
import { deburr } from 'lodash';
import { useGetAllOrdersQuery, useUpdateOrderMutation } from '../Services/Api_Order';
import { IOrder } from '../Models/interfaces';
import Loading from '../Component/Loading';

const BillGuest = () => {
    const { data, isLoading, error } = useGetAllOrdersQuery(undefined);
    const [updateOrder] = useUpdateOrderMutation();

    const [filterStatus, setFilterStatus] = useState('');

    const [filterNameOrCode, setFilterNameOrCode] = useState('');

    const [dataNew, setdataNew] = useState('');

    const [isSearchCompleted, setSearchCompleted] = useState(false);

    const dataSource = data?.map((order: IOrder) => ({
        key: order._id,
        code_order: order?.code_order,
        userId: order?.userId?.username || "Khách hàng",
        createdAt: moment(order?.createdAt).format('HH:mm | DD-MM-YYYY'),
        status: order?.status,
        phone: order?.phone
    }));

    const handleStatusChange = (value: string, orderId: string) => {
        updateOrder({ _id: orderId, status: value }).unwrap().then(() => {
            console.log("Trạng thái đã được cập nhật thành công.");
            message.success("Trạng thái đã được cập nhật thành công.");
        }).catch((error) => {
            console.error("Lỗi khi cập nhật trạng thái:", error);
        });
    };

    const handleNameOrCodeFilter = () => {
        const filterValue = deburr(filterNameOrCode.toLowerCase()); // Loại bỏ các dấu trong chuỗi
        const nineDigitsWithLeadingZeroRegex = /^0[0-9]{9}$/;
        const threeLettersThreeDigitsRegex = /^[A-Za-z]{3}[0-9]{3}$/;
        const validFormat = nineDigitsWithLeadingZeroRegex.test(filterValue) || threeLettersThreeDigitsRegex.test(filterValue);

        if (validFormat) {
            // Định dạng đúng, tiếp tục xử lý
            if (filterValue === '') {
                setdataNew('');
            } else {
                if (filteredData?.length == 0) {
                    setdataNew('');
                    message.error("Không tìm thấy đơn hàng")
                } else {
                    message.success("Tìm thấy đơn hàng")
                    setdataNew(filteredData)
                };

            };
            setSearchCompleted(true);
        } else {
            // Định dạng không đúng, hiển thị thông báo
            message.error("Giá trị không hợp lệ. Định dạng kiểu 0******** hoặc XXX*** hoặc xxx***.");
        };


    };

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'code_order',
            key: 'code_order',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Ngày đặt hàng',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: any, record: IOrder) => (
                <p>{status === "0" ? "Đang chờ xác nhận" : status === "1" ? "Đã xác nhận" : 
                status === "2" ? "Đã hủy" : status === "3" ? "Đang giao hàng" : status === "4" ? "Đã nhận hàng" : "Không xác định"
                }</p>
            ),
        },
        {
            title: 'Hành động',
            render: (record: any) => (
                <Link to={`/order/view/detail/guest/${record.key}`}>Chi tiết</Link>
            ),
            key: 'actions',
        },
    ];

    // tìm kiếm đơn hàng theo mã đơn hàng, số điện thoại
    const handleStatusFilter = (value: string) => {
        setFilterStatus(value);
        const filteredDataNew = dataSource?.filter((order: IOrder) => {
            const matchStatus = !value || order.status === value;
            const matchNameOrCode =
                !filterNameOrCode ||
                deburr(order.code_order.toLowerCase()).includes(deburr(filterNameOrCode.toLowerCase())) ||
                deburr(order.phone.toLowerCase()).includes(deburr(filterNameOrCode.toLowerCase()));
            const matchUserId = order.userId.toLowerCase() === "khách hàng";

            return matchStatus && matchNameOrCode && matchUserId;
        });
        setdataNew(filteredDataNew);
    };

    const filteredData = dataSource?.filter((order: IOrder) => {
        const matchStatus = !filterStatus || order.status === filterStatus;
        const matchNameOrCode =
            !filterNameOrCode ||
            deburr(order.code_order.toLowerCase()).includes(deburr(filterNameOrCode.toLowerCase())) ||
            deburr(order?.phone?.toLowerCase()).includes(deburr(filterNameOrCode.toLowerCase()));
        const matchUserId = order.userId.toLowerCase() === "khách hàng";

        return matchStatus && matchNameOrCode && matchUserId;
    });

    const handleNameOrCodeChange = (e) => {
        const inputValue = e.target.value;
        let formattedValue = inputValue;

        setFilterNameOrCode(formattedValue);
        setdataNew('');
        setSearchCompleted(false);
    };

    return (
        <div className='container_u'>
            {isLoading ? <Loading /> : <div className='user_profile'>
                <Divider />
                <p className='text-center text-2xl mb-3 text-sky-500'>Bạn có thể tìm kiếm đơn hàng của bạn tại đây</p>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'end' }}>

                    <div>
                        <span style={{ marginRight: '8px' }}>Tìm kiếm đơn hàng:</span>
                        <Input 
                        value={filterNameOrCode} 
                        onChange={
                            handleNameOrCodeChange
                        } 
                        style={{ width: 150 }} />
                        <button style={{ marginLeft: 20, backgroundColor: 'blue', color: 'white', borderRadius: 10 }} onClick={handleNameOrCodeFilter}>Tìm kiếm</button>
                    </div>


                    <div>
                        <span style={{ marginRight: '8px', marginLeft: 50 }}>Lọc theo trạng thái:</span>
                        <Select
                            value={filterStatus}
                            onChange={handleStatusFilter}
                            style={{ width: 150 }}
                            disabled={!isSearchCompleted}
                        >
                            <Option value="">Tất cả</Option>
                            <Option value="0">Đang chờ xác nhận</Option>
                            <Option value="1">Đã xác nhận</Option>
                            <Option value="2">Đã hủy</Option>
                            <Option value="3">Đang giao hàng</Option>
                            <Option value="4">Đã nhận hàng</Option>
                        </Select>
                    </div>
                </div>
                <div>
                    <Table
                        columns={columns}
                        dataSource={dataNew}
                    />
                </div>
            </div>}
        </div>
    );
};

export default BillGuest;