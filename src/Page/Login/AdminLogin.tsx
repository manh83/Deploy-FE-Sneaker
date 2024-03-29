
import { Button, Form, Input } from 'antd';
import { useSiginMutation } from '../../Services/Api_User';
import { IUser } from '../../Models/interfaces';
import { useNavigate } from 'react-router';


const AdminLogin = () => {
  const [login] = useSiginMutation()
  const navigate = useNavigate()

  const onFinish = async (values: IUser) => {
    try {
      const response = await login(values);
      if ('data' in response) { // Kiểm tra xem response có thuộc tính 'data' không
        const user = response.data && 'user' in response.data ? response.data.user : null;
        if (typeof user === 'object' && user !== null && 'role' in user && user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          alert("Bạn không có quyền đăng nhập");
        }
      } else {
        console.log("Lỗi khi đăng nhập", response.error);
      }
    } catch (error) {
      console.log("Lỗi khi đăng nhập", error);
    }
  };
  
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div>
        <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="Tên đăng nhập"
      name="email"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Mật khẩu"
      name="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
    </div>
  )
}


export default AdminLogin;