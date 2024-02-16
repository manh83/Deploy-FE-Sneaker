import React from 'react';
import { Table, Tag ,Button , Popconfirm , message} from 'antd';
import { useGetOneProductQuery , useDeleteVariantMutation } from '../../../Services/Api_Product';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { QuestionCircleOutlined, DeleteFilled, EditOutlined} from '@ant-design/icons';
import Loading from '../../../Component/Loading';

const ProductListDetails = () => {
  const [removeVariant] = useDeleteVariantMutation()
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage()
  const { data: productDataOne, isLoading: isLoadingProduct }: any = useGetOneProductQuery(id || "");
  const flattenedData = productDataOne?.variants?.map((variant:any) => {
    return {
      key: variant._id,
      name: productDataOne.name,
      imgUrl: variant.imgUrl[0], // Assuming imgUrl is an array and you want the first element
      size: variant?.size_id?.name,
      color: {
        name: variant.color_id?.name || 'N/A',
        unicode: variant.color_id?.unicode || 'N/A',
      },
      quantity: variant.quantity || 0,
      sell_quantity: variant.sell_quantity || 0,
      inventory: variant.inventory || 0,
      importPrice: variant.importPrice || 0,
      totalQuantityVariant: variant.totalQuantityVariant || 0,
      sellingPrice: variant.sellingPrice || 0,
      original_price: variant.original_price || 0
    };
  });

  // const confirm = (id:number| string) => {    
  //     console.log(id);
  //   removeVariant(id).unwrap().then(() => {
  //     messageApi.open({
  //       type: "success",
  //       content: "Xóa sản phẩm thành công"
  //     })
  //   })
  // }
  
  // Define columns for the product details
  const columns: any[] = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Hình ảnh',
      dataIndex: "imgUrl",
      key: "imgUrl",
      render: (imgUrl: string) => (
        imgUrl ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={imgUrl} style={{ width: 100 }} alt="Product" />
          </div>
        ) : null
      ),
      align: 'center',
    },
    {
      title: 'Kích thước',
      dataIndex: 'size',
      key: 'size',
      align: 'center',
    },
    {
      title: 'Màu sắc',
      dataIndex: 'color',
      key: 'color',
      align: 'center',
      
      render: (color: { name: string, unicode: string }) => (
        <span>
          {color ? (
            <Tag color={color.unicode} key={color.unicode}>
              {color.name}
            </Tag>
          ) : "Không xác định"}
        </span>
      ),
    },
  
    {
      title: 'Giá nhập hàng',
      dataIndex: 'importPrice',
      key: 'importPrice',
      align: 'center',
      render: (importPrice:number) => (
         <span>{importPrice.toLocaleString('vi-VN', { style: "currency", currency: "VND" })}</span> 
      )
    },
    {
      title: 'Giá bán hiện tại',
      dataIndex: 'sellingPrice',
      key: 'sellingPrice',
      align: 'center',
      render: (sellingPrice:number) => (
        <span>{sellingPrice.toLocaleString('vi-VN', {style: "currency", currency: "VND" })}</span>
      )
    },
    {
      title: 'Giá gốc',
      dataIndex: 'original_price',
      key: 'original_price',
      align: 'center',
      render: (original_price:number) => (
        <span>{original_price.toLocaleString('vi-VN', {style: "currency",currency: "VND"})}</span>
      )
    },
    {
      title: 'Số lượng nhập hàng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    },
    {
      title: 'Tồn kho',
      dataIndex: 'inventory',
      key: 'inventory',
      align: 'center',
    },
    {
      title: 'Số lượng bán ra',
      dataIndex: 'sell_quantity',
      key: 'sell_quantity',
      align: 'center',
    },
    {
      title: 'Tổng số lượng đã nhập hàng',
      dataIndex: 'totalQuantityVariant',
      key: 'totalQuantityVariant',
      align: 'center',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: ({key: id}: any) => (
        <div className="flex space-x-4" style={{ justifyContent: 'center', alignItems: "center" }}>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa không?"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => confirm(id)}
            okText={
              <span style={{ color: 'black' }}>Yes</span>
            }
            cancelText="No"
          >
            <DeleteFilled style={{ color: '#FF0000', fontSize: "20px" }} />
          </Popconfirm>

          <Link to={`/admin/product/${productDataOne._id}/variant/${id}/update`}>

            <EditOutlined style={{ fontSize: "20px" }} />
          </Link>
        </div>
      ),
      align: 'center',
    },
  ];

  return (
    <div>
      {isLoadingProduct ? (
        <Loading />
      ) : (
        <div>
          <Button className='setSize-1' type="primary" style={{ background: "blue" }}>
             <Link to={"/admin/product/" + id + "/variants"}>Thêm mới</Link>
          </Button>
          <Table
            style={{ marginTop: 30}}
            columns={columns}
            dataSource={flattenedData} 
            pagination={false}
          />
        </div>
      )}
    </div>
  );
};

export default ProductListDetails;
