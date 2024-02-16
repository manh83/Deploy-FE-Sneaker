import React, { useState } from 'react';
import { Divider, Select, Table, message } from 'antd';
import { useGetAllOrdersQuery, useUpdateOrderMutation } from '../../../Services/Api_Order';
import { IOrder } from '../../../Models/interfaces';
import Loading from '../../../Component/Loading';
import { Link } from 'react-router-dom';
import { Option } from 'antd/es/mentions';
import moment from 'moment';
import Input from 'antd/es/input/Input';
import { deburr } from 'lodash';

const BillList = () => {
  const { data, isLoading, error } = useGetAllOrdersQuery(undefined);
  const [updateOrder] = useUpdateOrderMutation();

  const [filterStatus, setFilterStatus] = useState('');
  const [filterNameOrCode, setFilterNameOrCode] = useState('');
  const [filterPhone, setFilterPhone] = useState('')

  

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

  const handleNameOrCodeFilter = (e: any) => {
    const filterValue = deburr(e.target?.value); // Loại bỏ các dấu trong chuỗi
    setFilterNameOrCode(filterValue);
  };

  const handlePhoneFilter = (e: any) => {
    const filterValue = deburr(e.target?.value);
    setFilterPhone(filterValue);
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'code_order',
      key: 'code_order',
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'userId',
      key: 'userId',
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
      render: (status: any, record: IOrder) => {
        let options: JSX.Element[] = [];
  
        if (status === '0') {
          options.push(<Option key="0" value="0" hidden>Đang chờ xác nhận</Option>);
          options.push(<Option key="1" value="1">Đã xác nhận</Option>);
          options.push(<Option key="2" value="2">Đã hủy</Option>);
        } else if (status === '2') {
          options.push(<Option key="2" value="2" disabled>Đã hủy</Option>);
        } else if (status === '1') {
          options.push(<Option key="1" value="1" hidden>Đã xác nhận</Option>);
          options.push(<Option key="3" value="3">Đang giao hàng</Option>);
          options.push(<Option key="2" value="2">Đã hủy</Option>);
        } else if (status === '3') {
          options.push(<Option key="2" value="2">Đã hủy</Option>);
          options.push(<Option key="3" value="3" hidden>Đang giao hàng</Option>);
          options.push(<Option key="4" value="4">Đã nhận hàng</Option>);
        } else if (status === '4') {
          options.push(<Option key="4" value="4" disabled>Đã nhận hàng</Option>);
        }
  
        return (
          <Select
            value={status}
            onChange={(value) => handleStatusChange(value, record.key)}
            style={{ width: 150 }}
            disabled={status === '2' || status === '4'}
          >
            {options}
          </Select>
        );
      },
    },
    {
      title: 'Hành động',
      render: (record: any) => (
        <Link to={`/admin/bill/detail/${record.key}`}>Chi tiết</Link>
      ),
      key: 'actions',
    },
  ];

  const handleStatusFilter = (value: string) => {
    setFilterStatus(value);
  };

  const filteredData = dataSource?.filter((order: IOrder) => {
    const matchStatus = !filterStatus || order.status === filterStatus;
    const matchNameOrCode =
      !filterNameOrCode ||
      deburr(order.code_order.toLowerCase()).includes(deburr(filterNameOrCode.toLowerCase())) ||
      deburr(order.userId.toLowerCase()).includes(deburr(filterNameOrCode.toLowerCase())) 
      // deburr(order?.phone?.toLowerCase()).includes(deburr(filterNameOrCode.toLowerCase()));
      
    const matchPhone = !filterPhone || deburr(order.phone.toLowerCase()).includes(deburr(filterPhone.toLowerCase()));

    return matchStatus && matchNameOrCode && matchPhone;
  });

  return (
    <div>
      <Divider />

      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'end' }}>
        <div>
          <span style={{ marginRight: '8px' }}>Tìm kiếm đơn hàng:</span>
          <Input
            value={filterNameOrCode}
            onChange={handleNameOrCodeFilter}
            style={{ width: 150 }}
          />
        </div>

        <div>
          <span style={{ marginRight: '8px', marginLeft: 50 }}>Lọc theo trạng thái:</span>
          <Select
            value={filterStatus}
            onChange={handleStatusFilter}
            style={{ width: 150 }}
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

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Table columns={columns} dataSource={filteredData} />
        </>
      )}
    </div>
  );
};

export default BillList;