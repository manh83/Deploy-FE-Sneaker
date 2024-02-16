
import { Divider, Table, Popconfirm, message, Button } from 'antd';
import { useDeleteBlogMutation, useGetAllBlogsQuery } from '../../../Services/Api_Blogs';
import { IBlog } from '../../../Models/interfaces';
import { QuestionCircleOutlined, DeleteFilled, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Loading from '../../../Component/Loading';


const rowSelection = {
    onChange: (selectedRowKeys:any, selectedRows:any) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
};

const BlogList = () => {
    const { data: getAllBlogs, isLoading } = useGetAllBlogsQuery();
    const [removeBlog] = useDeleteBlogMutation();
    const [messageApi, contextHolder] = message.useMessage();

    const dataSource = getAllBlogs?.data?.map((item:IBlog) => ({
        key: item?._id,
        title: item.title,
        imgUrl: item?.imgUrl,
        desc: item?.description,
        author: item?.author
    }));

    const confirm = (id:string) => {
        removeBlog(id).unwrap().then(() => {
            messageApi.open({
                type: "success",
                content: "Xóa sản phẩm thành công"
            });
        });
    };

    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: "title",
            render: (text:string) => (<a>{text}</a>),
            align: 'center',
        },
        {
            title: 'Hình ảnh',
            dataIndex: "imgUrl",
            key: "imgUrl",
            render: (imgUrls:string) => (
                imgUrls && imgUrls.length > 0 ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={imgUrls} style={{ width: 100 }} alt="Hình ảnh" />
                    </div>
                ) : null
            ),
            align: 'center',
        },
        {
            title: 'Action',
            key: 'action',
            render: ({ key: id }:any) => (
                <div className="flex space-x-4" style={{ justifyContent: 'center', alignItems: "center" }}>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa không?"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        onConfirm={() => confirm(id)}
                        okText={<span style={{ color: 'black' }}>Yes</span>}
                        cancelText="No"
                    >
                        <DeleteFilled style={{ color: '#FF0000', fontSize: "20px" }} />
                    </Popconfirm>
                    <Link to={`/admin/blog/${id}/update`}>
                        <EditOutlined style={{ fontSize: "20px" }} />
                    </Link>
                </div>
            ),
            align: 'center',
        },
    ];

    return (
        <div>
            {contextHolder}
            <div>
                <Button className='setSize-1' type="primary" style={{ background: "blue" }}>
                    <Link to={`/admin/blog/add`}>Thêm mới</Link>
                </Button>
            </div>
            <Divider />
            {isLoading ? <Loading /> : <Table rowSelection={rowSelection} columns={columns} dataSource={dataSource} />}
        </div>
    );
};

export default BlogList;
