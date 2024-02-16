import React, { useEffect, useState } from 'react'
import { Table,Image } from 'antd';

const Guests = () => {
    const [idPr, setIdPr]: any = useState([]);
    const [idPrMany, setIdPrMany]: any = useState([]);
    const [dataGuests, setDataGuests]: any = useState();//OK
    const getDataLocal: any = localStorage.getItem("orderGuests") ? JSON.parse(localStorage.getItem("orderGuests")) : [];

    useEffect(() => {
        let arrayId: any = [];
        let arrayIdMany: any = [];

        getDataLocal?.map((items: any) => {
            if (items.length == 1) {
                arrayId.push(items[0]);
            } else {
                items.map((obj:any) => arrayIdMany.push(obj));
            }
        });

        setIdPr(arrayId);
        setIdPrMany(arrayIdMany);
    }, []);

    useEffect(()=>{
        const dataAll:any=[...idPr,...idPrMany];
        console.log("idPr: ",dataAll);
        setDataGuests(dataAll)
    },[idPrMany,idPr]);

    const columns: any = [
        {
          title: 'Tên sản phẩm',
          dataIndex: 'name',
          key: 'name',
          render: (text:any) => <a>{text}</a>,
        },
        {
          title: 'Ảnh',
          dataIndex: 'imgUrl',
          key: 'imgUrl',
          render: (text:any) => <Image
          width={80}
          src={text}
        />,
        },
        {
          title: 'Giá',
          dataIndex: 'price',
          key: 'price',
          render:((text:any)=><p>{text.toLocaleString()}</p>)
        },
        {
          title: 'Số lượng',
          dataIndex: 'quantity',
          key: 'quantity',
        },
        {
          title: 'Màu',
          dataIndex: 'color',
          key: 'color',
          render:((text:any)=><div className={`w-8 h-8 rounded-full`} style={{background:text}}></div>)
        },
        {
          title: 'Kích thước',
          dataIndex: 'size',
          key: 'size',
        }
      ];

    const data: any[] = dataGuests;
    return (
        <div className='h-56 bg-gray- mt-44 mb-[500px]'>
            <p className='text-center text-2xl'>Đơn hàng của bạn</p>
            <p className='text-center'>Các đơn sẽ được chúng tôi xử lí trong vòng 1 - 2 ngày và liên hệ đến bạn sớm nhất, mọi thắc mắc vui lòng liên hệ: <a className='hover:underline' href='tel://09886881440'>0988 688 1440</a> .</p>
            <div className="flex justify-center">
                <div className="w-[1200px] h-44  rounded-md">
                    <Table columns={columns} dataSource={data} pagination={{pageSize:4}}/>
                </div>
            </div>

        </div>
    )
}

export default Guests
