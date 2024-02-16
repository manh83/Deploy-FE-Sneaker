import { useEffect, useState } from 'react';
import { Button, Form, Input, Select, message,InputNumber } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetOneProductQuery, useGetOneVariantProductQuery, useUpdateProductMutation, useUpdateVariantProductMutation } from '../../../Services/Api_Product';
import Loading from '../../../Component/Loading';
import { useGetAllCategoryQuery } from '../../../Services/Api_Category';
import { ICategory, IProduct } from '../../../Models/interfaces';
import ReactQuill from 'react-quill';
const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
}


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};


const UpdateVariantProduct = () => {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const { productId, variantId } = useParams()
  const { data: productDataOne, isLoading } = useGetOneVariantProductQuery({productId: productId || '',variantId: variantId || ''})
  const [updateProduct, { error }] = useUpdateVariantProductMutation()
  const [isLoadingScreen, setIsLoadingScreen] = useState(false);


  useEffect(() => {
    if (error) {
      if ("data" in error) {
        const errDetails = error.data as { message: string }
        messageApi.open({
          type: "error",
          content: errDetails.message
        })
      }
    }
  }, [error])

  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      id: productDataOne?._id,
      quantity: productDataOne?.quantity,
      sellingPrice: productDataOne?.sellingPrice,
      original_price: productDataOne?.original_price,
      importPrice: productDataOne?.importPrice

    })
  }, [productDataOne])


  const onFinish = (values: any) => {
    try {
      
      const payload = {
        quantity: values.quantity,
        quantityImported: values.quantityImported || 0,
        sellingPrice: values.sellingPrice,
        original_price: values.original_price,
        importPrice: values.importPrice
      };
      console.log(payload);
      setIsLoadingScreen(true)
      updateProduct({productId: productId || '',variantId: variantId || '',...payload}).unwrap().then(() => {
        messageApi.open({
          type: "success",
          content: "Cập nhật thành công"
        })
        setIsLoadingScreen(false)
        // setTimeout(() => {
        //   navigate("/admin/product/list")
        // }, 1500)
      })
    } catch (error) {
      message.error("Đã xảy ra lỗi xin vui lòng thử lại sau")
      setIsLoadingScreen(false)
    }

  };


  return (

    <div>
      {contextHolder}
      {isLoadingScreen && <Loading />}
      {isLoading ? <Loading /> : <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
 
        <Form.Item
          name="quantity"
          label="Số lượng hàng hiện có"
          rules={[
            { required: true, message: 'Số lượng nhập hàng không được để trống' },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          name="quantityImported"
          label="Nhập thêm hàng"
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          name="sellingPrice"
          label="Giá bán ra"
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          name="original_price"
          label="Giá gốc"
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          name="importPrice"
          label="Giá nhập hàng"
        >
          <InputNumber />
        </Form.Item>
        

        <Form.Item wrapperCol={{ offset: 4, span: 11 }}>
          <Button
            type="primary"
            danger
            htmlType="submit"
            style={{ marginRight: 20 }}
          >
            Cập nhật
          </Button>
          <Button
            htmlType="button"
            onClick={() => navigate(`/admin/product/details/${productId}`)}
          >
            Quay lại
          </Button>
        </Form.Item>
      </Form>}
    </div>

  );
};

export default UpdateVariantProduct;