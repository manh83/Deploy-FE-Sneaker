import { useState, useEffect } from "react"
import {
  Button,
  Form,
  Input,
  Upload,
  Modal,
  Select,
  message,
  InputNumber,
} from "antd"
import { PlusOutlined,CloseCircleOutlined } from "@ant-design/icons"
import axios from "axios"
import { IProduct, IColor } from "../../../Models/interfaces"
import type { UploadFile } from "antd/es/upload/interface"
import type { RcFile, UploadProps } from "antd/es/upload"
import { useAddProductDetailsMutation, useAddProductMutation } from "../../../Services/Api_Product"
import { useGetAllCategoryQuery } from "../../../Services/Api_Category"
import Loading from "../../../Component/Loading"
import { useNavigate, useParams } from "react-router-dom"
import { useGetAllSizeQuery } from "../../../Services/Api_Size"
import { useGetColorsQuery } from "../../../Services/Api_Color"



const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

type urlObject = {
  url: string
}

const AddProductDetails = () => {
  const navigate = useNavigate()
  const [addProduct, { error }] = useAddProductDetailsMutation()
  const { data: getAllSize, isLoading: isLoadingSize } = useGetAllSizeQuery()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState("")
  const [previewTitle, setPreviewTitle] = useState("")
  const [isLoadingScreen, setIsLoadingScreen] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const { data:getAllColor } = useGetColorsQuery()
  const {id} = useParams()
  const [importPriceValue, setImportPriceValue] = useState(''); // hiện ra dữ liêu input dạng tiền tệ VN
  const [importPrice, setImportPrice] = useState('');
  const [sellingPrice,setSellingPrice] = useState('')
  const [sellingPriceValue,setSellingPriceValue] = useState('')  // hiện ra dữ liêu input dạng tiền tệ VN
  const [originalPriceValue,setOriginalPriceValue] = useState('') // hiện ra dữ liêu input dạng tiền tệ VN
  const [originalPrice,setOriginalPrice] = useState('')



  const handleCancel = () => setPreviewOpen(false)

  const iconStyles = {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: 'rgba(0, 0, 0, 0.25)',
  };

  const handleCancelImportPrice = () => {
    setImportPriceValue('');
    setImportPrice('')
  };

  const handleCancelSellingPrice = () => {
    setSellingPrice('');
    setSellingPriceValue('')
  };

  const handleCancelOriginalPrice = () => {
    setOriginalPrice('');
    setOriginalPriceValue('')
  };

  const clearIconImportPrice = importPriceValue ? (
    <CloseCircleOutlined onClick={handleCancelImportPrice} style={iconStyles} />
  ) : null;

  const clearIconSellingPrice = sellingPriceValue ? (
    <CloseCircleOutlined onClick={handleCancelSellingPrice} style={iconStyles} />
  ) : null;

  const clearIconOriginalPrice = originalPriceValue ? (
    <CloseCircleOutlined onClick={handleCancelOriginalPrice} style={iconStyles} />
  ) : null;



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
  
    // Loại bỏ tất cả các ký tự không phải số
    value = value.replace(/[^0-9]/g, '');
  
    if (value !== '') {
      const priceValue:any = parseInt(value, 10);
  
      const formattedValue = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(priceValue);
        // .formatToParts(priceValue)
        // .map((part) => (part.type === 'currency' ? '' : part.value))
        // .join('');
  
      setImportPriceValue(formattedValue);
      setImportPrice(priceValue);
    } else {
      setImportPriceValue('');
      setImportPrice('');
    }
  };

  const handleInputSellingPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
  
    // Loại bỏ tất cả các ký tự không phải số
    value = value.replace(/[^0-9]/g, '');
  
    if (value !== '') {
      const priceValue:any = parseInt(value, 10);
  
      const formattedValue = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(priceValue);
        // .formatToParts(priceValue)
        // .map((part) => (part.type === 'currency' ? '' : part.value))
        // .join('');
  
      setSellingPriceValue(formattedValue);
      setSellingPrice(priceValue);
    } else {
      setImportPriceValue('');
      setImportPrice('');
    }
  };

  const handleInputOriginalPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
  
    // Loại bỏ tất cả các ký tự không phải số
    value = value.replace(/[^0-9]/g, '');
  
    if (value !== '') {
      const priceValue:any = parseInt(value, 10);
  
      const formattedValue = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(priceValue);
        // .formatToParts(priceValue)
        // .map((part) => (part.type === 'currency' ? '' : part.value))
        // .join('');
  
      setOriginalPriceValue(formattedValue);
      setOriginalPrice(priceValue);
    } else {
      setOriginalPriceValue('');
      setOriginalPrice('');
    }
  };
  

  const handleKeyImportPrice = (e:any) => {
    // Kiểm tra nếu người dùng thực hiện hành động xóa
    if (e.key === 'Backspace' || e.key === 'Delete') {
      // Giảm giá trị khi xóa một ký tự
      let newValue = importPriceValue.replace(/[^0-9]/g, '');
      if (newValue.length > 1) {
        newValue = newValue.slice(0, -1);
      } else {
        newValue = '';
      }

      // Định dạng giá trị và cập nhật vào trạng thái
      if (newValue !== '') {
        const formattedValue = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(parseInt(newValue, 10));

        setImportPriceValue(formattedValue);
        setImportPrice(newValue);
      } else {
        setImportPriceValue('');
        setImportPrice('');
      }
    }
  };

  const handleKeySellingPrice = (e:any) => {
    // Kiểm tra nếu người dùng thực hiện hành động xóa
    if (e.key === 'Backspace' || e.key === 'Delete') {
      // Giảm giá trị khi xóa một ký tự
      let newValue = sellingPriceValue.replace(/[^0-9]/g, '');
      if (newValue.length > 1) {
        newValue = newValue.slice(0, -1);
      } else {
        newValue = '';
      }

      // Định dạng giá trị và cập nhật vào trạng thái
      if (newValue !== '') {
        const formattedValue = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(parseInt(newValue, 10));

        setSellingPriceValue(formattedValue);
        setSellingPrice(newValue);
      } else {
        setSellingPriceValue('');
        setSellingPrice('');
      }
    }
  };

  const handleKeyOriginalPrice = (e:any) => {
    // Kiểm tra nếu người dùng thực hiện hành động xóa
    if (e.key === 'Backspace' || e.key === 'Delete') {
      // Giảm giá trị khi xóa một ký tự
      let newValue = originalPriceValue.replace(/[^0-9]/g, '');
      if (newValue.length > 1) {
        newValue = newValue.slice(0, -1);
      } else {
        newValue = '';
      }

      // Định dạng giá trị và cập nhật vào trạng thái
      if (newValue !== '') {
        const formattedValue = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(parseInt(newValue, 10));

        setOriginalPriceValue(formattedValue);
        setOriginalPrice(newValue);
      } else {
        setOriginalPriceValue('');
        setOriginalPrice('');
      }
    }
  };

  

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    )
  }

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList)

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  const beforeUpload = (file: RcFile): boolean => {
    return false
  }

  useEffect(() => {
    if (error && "data" in error) {
      const errDetails = error.data as { message: string }
      messageApi.open({
        type: "error",
        content: errDetails.message,
      })
    }
  }, [error])

  const onFinish = async (values: any) => {
    try {
      // mở loading
      setIsLoadingScreen(true)
      const formData = new FormData()
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj)
        }
      })

      const response = await axios.post(
        "http://localhost:8080/api/images/upload",
        formData
      )

      // Assuming response.data contains the uploaded image URLs
      const imageUrls = response.data.urls.map((urls: urlObject) => urls.url)

      if (response.status === 200) {
        const newProduct:any = {
        imgUrl: imageUrls,
        color_id: values.color_id,
        size_id: values.size_id,
        quantity: values.quantity, 
        importPrice: importPrice,
        sellingPrice: sellingPrice,
        original_price: originalPrice 
        }
        console.log("newProduct",newProduct);
        

        await addProduct({...newProduct,_id:id})
        messageApi.open({
          type: "success",
          content: "Thêm sản phẩm thành công",
        })

        // đóng loading
        setIsLoadingScreen(false)

        setTimeout(() => {
          navigate(`/admin/product/details/${id}`)
        }, 1500)
      }
    } catch (error) {
      console.error("Error uploading images:", error)
      setIsLoadingScreen(false)
    }
  }

  return (
    <div>
      {contextHolder}
      {isLoadingScreen && <Loading />}
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        name="control-ref"
        onFinish={onFinish}
        style={{ maxWidth: 800, margin: "0 auto" }}
      >
        
        <Form.Item label="Color" name="color_id" rules={[{ required: true }]}>
          <Select  style={{ width: 200 }} >
            {getAllColor?.map((color: IColor) => (
              <Select.Option key={color._id} value={color._id}>
                {color.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Size" name="size_id" rules={[{ required: true }]}>
          <Select style={{ width: 200 }} loading={isLoadingSize}>
            {getAllSize ? (
              getAllSize?.map((size: any) => (
                <Select.Option key={size._id} value={size._id}>
                  {size.name}
                </Select.Option>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </Select>
        </Form.Item>


        <Form.Item
          name="quantity"
          label="Số lượng nhập hàng"
          rules={[
            { required: true, message: "Số lượng không được để trống" },
            {
              validator: (_, values) => {
                if (!isNaN(values)) {
                  return Promise.resolve()
                } else {
                  return Promise.reject(new Error("Số lượng phải là số"))
                }
              },
            },
          ]}
        >
          <InputNumber />
        </Form.Item>


        <Form.Item
          label="Giá nhập hàng"
          rules={[
            { required: true, message: 'Giá nhập hàng không được để trống' }
          ]}
          style={{ flexDirection: 'column', alignItems: 'flex-start' }}
        >
          <div style={{ position: 'relative' }}>
              <Input
                type="text"
                style={{ width: 470 }}
                value={importPriceValue}
                onChange={handleInputChange} 
                onKeyDown={handleKeyImportPrice} // hàm thực hiện xóa tác vụ input 
                placeholder="Nhập số tiền"
              />
              {clearIconImportPrice}
          </div>
        </Form.Item>


        
        <Form.Item
          name="sellingPrice"
          label="Giá bán hiện tại"
          rules={[
            { required: true, message: 'Giá hiện tại không được để trống' },
          ]}
        >
          <div style={{ position: 'relative' }}>
              <Input
                type="text"
                style={{ width: 470 }}
                value={sellingPriceValue}
                onChange={handleInputSellingPrice} 
                onKeyDown={handleKeySellingPrice} // hàm thực hiện xóa tác vụ input 
                placeholder="Nhập số tiền"
              />
              {clearIconSellingPrice}
          </div>
        </Form.Item>


        <Form.Item
          name="original_price"
          label="Giá gốc"
          rules={[
            { required: false, message: "Giá gốc không được để trống" },
            // {
            //   validator: (_, values) => {
            //     if (!isNaN(values)) {
            //       return Promise.resolve()
            //     } else {
            //       return Promise.reject(new Error("Giá gốc phải là số"))
            //     }
            //   },
            // },
          ]}
        >
          <div style={{ position: 'relative' }}>
              <Input
                type="text"
                style={{ width: 470 }}
                value={originalPriceValue}
                onChange={handleInputOriginalPrice}
                onKeyDown={handleKeyOriginalPrice}    // hàm thực hiện xóa tác vụ input 
                placeholder="Nhập số tiền"
              />
              {clearIconOriginalPrice}
          </div>
        </Form.Item>


        <Form.Item label="Tải lên">
          <Upload
            listType="picture-card"
            name="images"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={beforeUpload} // Prevent automatic uploading
            multiple
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
        </Form.Item>

        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>

        <Form.Item wrapperCol={{ offset: 4, span: 11 }}>
          <Button
            type="primary"
            danger
            htmlType="submit"
            style={{ marginRight: 20 }}
          >
            Thêm mới
          </Button>
          <Button
            htmlType="button"
            onClick={() => navigate(`/admin/product/details/${id}`)}
          >
            Quay lại
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default AddProductDetails
