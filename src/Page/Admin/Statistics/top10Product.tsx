import { useState,ChangeEvent,useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import {message} from "antd"
import { useStatisticsByDayMutation } from '../../../Services/Api_Statistic';
import Loading from '../../../Component/Loading';
import LoadingAdmin from '../../../Component/LoadingAdmin';

const Top10Product = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chartData, setChartData] = useState([]);
  const [statisticsByDay, {isLoading}] = useStatisticsByDayMutation()
  const [totalQuantitySold,setTotalQuantitySold] = useState(0)
  const [loading, setLoading] = useState(false);


  const fetchInitialData = () => {
    // Calculate the start date as 7 days ago from the current date
    const sevenDaysAgo = moment()
      .subtract(7, "days")
      .startOf("day")
      .format("YYYY-MM-DD");
    const currentDate = moment().endOf("day").format("YYYY-MM-DD");
    setStartDate(sevenDaysAgo);
    setEndDate(currentDate);
    
  };

  useEffect(()=>{
    fetchInitialData();
  },[])

  useEffect(() => {
    if (startDate && endDate) {
      handleSearch();
    }
  }, [startDate, endDate]);


  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };


  const handleSearch = async () => {
    setLoading(true);
    try {
      const formattedStartDay = moment(startDate).startOf('day').format('YYYY-MM-DD');
      const formattedEndDay = moment(endDate).endOf('day').format('YYYY-MM-DD');
      // Kiểm tra nếu ngày kết thúc nhỏ hơn ngày bắt đầu
      if (moment(formattedEndDay).isBefore(formattedStartDay)) {
        message.error("Không xác định được ngày")
        setChartData([])
        setLoading(false);
        return;
      }
      const response = await statisticsByDay({ startDate: formattedStartDay, endDate: formattedEndDay });
      setLoading(false);
      handleResponse(response);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const handleResponse = (response:any) => {
    if (response.data && response.data.success) {
      const { totalQuantity, orders } = response.data.statistics;
      
      if(Array.isArray(orders) && orders.length>0){
        // Tính tổng số lượng của từng sản phẩm dựa trên productId
         const productQuantities: { [key: string]: { name: string; quantity: number } } = {};
         const validOrders = orders.filter((order: any) => order.status !== '2');
         validOrders.forEach((order:any) => {      
            order.products.forEach((product:any) => {
              const productId = product.productId?._id
              const productName = product.productId?.name
              productQuantities[productId] = {
              name: productName,
              quantity: (productQuantities[productId] ? productQuantities[productId].quantity : 0) + product.quantity,
            };
            });
        });
        // Chuyển object thành mảng để sử dụng trong biểu đồ
        const newChartData = Object.values(productQuantities)
        .sort((a, b) => b.quantity - a.quantity) // Sắp xếp giảm dần
        .slice(0, 10) // Chỉ lấy 10 sản phẩm
        .map((product: any) => ({
          name: product.name,
          y: product.quantity,
        }));
      
    
      const newTotalQuantity = validOrders.reduce((sum: number, order: any) => {
        order.products.forEach((product: any) => {
          sum += product.quantity;
        });
        return sum;
      }, 0);

      setTotalQuantitySold(newTotalQuantity);
        setChartData(newChartData);
      }else{
        console.log("Không có dữ liệu");
        setTotalQuantitySold(0);
        setChartData([]);
      }
  
    } else {
      console.error('Error fetching data from the server');
    }
  };
  
  

  const options = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Thống Kê Top 10 Sản Phẩm Bán Chạy',
    },
    xAxis: {
      categories: chartData.map((item:any) => item.name),
    },
    yAxis: {
      title: {
        text: 'Số lượng sản phẩm',
      },
    },
    series: [
      {
        name: 'Sản phẩm',
        data: chartData,
        colorByPoint: true,
      },
    ],    
  };

  return (
    <div>
      <div className='statistics ml-9 mb-3'>
          <div>
            <label htmlFor="startDate">Ngày bắt đầu:</label>
            <input type="date" id="startDate" 
            value={startDate} 
            onChange={handleStartDateChange} 
            max={
              endDate
                ? endDate
                : new Date().toISOString().split("T")[0]
            }/>
          </div>
          <div>
            <label htmlFor="endDate">Ngày kết thúc:</label>
            <input type="date" id="endDate" 
            max={new Date().toISOString().split("T")[0]}
            value={endDate} onChange={handleEndDateChange} />
          </div>
      </div>
      
      {isLoading ? <LoadingAdmin /> : <div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>}
      
    </div>
  );
};

export default Top10Product;