import React, { useState, useEffect, ChangeEvent, useRef, useLayoutEffect } from 'react';
import moment from 'moment';
import { useStatisticsByDayMutation } from '../../../Services/Api_Statistic';
import Highcharts from 'highcharts';
import { message } from 'antd';
import HighchartsReact from 'highcharts-react-official';
import Loading from "../../../Component/Loading";
import LoadingAdmin from '../../../Component/LoadingAdmin';
interface HighchartsChartProps {
  chartData: {
    categories: string[];
    series: { name: string; data: number[] }[];
  };
}

const RevenueStatistics = () => {
  const searchButtonRef = useRef<HTMLButtonElement | null>(null); //setup để khi vào trang sẽ tự động submit 1 lần
  const [totalQuantitySold, setTotalQuantitySold] = useState(0);
  const [totalSales, setTotalSales] = useState(0);  // set tổng doanh số
  const [statisticsByDay, {isLoading}] = useStatisticsByDayMutation();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading , setLoading] = useState(false);
  const [autoFetch7Days, setAutoFetch7Days] = useState(true);
  const [chartData, setChartData] = useState({
    categories: [],
    series: [],
  });

  useEffect(() => {
    // setup 5ms sẽ tự động bấm submit khi mới vào trang
    setTimeout(() => {
      if (searchButtonRef.current) {
        searchButtonRef.current.click();
      }
    }, 5);
  }, []);
  
  

  useEffect(() => {
    const fetchLast7Days = async () => {
      const currentDate = moment().endOf('day');
      const sevenDaysAgo = currentDate.clone().subtract(7, 'days').startOf('day');
      setStartDate(sevenDaysAgo.format('YYYY-MM-DD'));
      setEndDate(currentDate.format('YYYY-MM-DD'));
    };
  
    if (autoFetch7Days) {
      fetchLast7Days();
    }
  }, []);
  
  useEffect(()=>{
    if(startDate){
     handleSearch();
    }
  },[startDate, endDate])



  const HighchartsChart: React.FC<HighchartsChartProps> = ({ chartData }) => {
    const options: Highcharts.Options = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Thống kê doanh số sản phẩm',
      },
      xAxis: {
        categories: chartData.categories,
        accessibility: {
          description: 'Countries',
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Doanh Số (VND)',
        },
      },
      tooltip: {
        valueSuffix: ' VND',
      },
      plotOptions: {
        column: {
          pointPadding: 0.3,
          borderWidth: 0,
        },
      },
      series: chartData.series,
    };

    return (
      <div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  };

  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const handleSearch = async () => {
    setLoading(true)
    try {
      const formattedStartDay = moment(startDate).startOf('day').format('YYYY-MM-DD');
      const formattedEndDay = moment(endDate).endOf('day').format('YYYY-MM-DD');

      if (moment(formattedEndDay).isBefore(formattedStartDay)) {
        message.error('Không xác định được ngày');
        setChartData({ categories: [], series: [] });
        setTableData([]);
        setLoading(false);
        return;
      }

      const response = await statisticsByDay({
        startDate: formattedStartDay,
        endDate: formattedEndDay,
      });
      setLoading(false);
      handleResponse(response);
    } catch (error) {
      console.error('Error:', error);
    }
  };


const handleResponse = (response: any) => {
  if (response.data && response.data.success) {
    const { totalQuantity, orders } = response.data.statistics;
  
    const dailyTotalSales: { [key: string]: number } = {}; // tổng doanh số
    const matchingOrders: any[] = []; // Tạo một mảng mới để lưu trữ các đơn hàng đã nhận hàng

    const selectedDates = getSelectedDates(startDate, endDate);
  
    // Lặp qua các ngày đã chọn
    selectedDates.forEach((selectedDate) => {
      const orderDate = moment(selectedDate).format('DD/MM/YYYY');
  
      // Kiểm tra xem có đơn hàng cho ngày được chọn không
      const matchingOrdersForDate = orders.filter((order: any) => {
        const orderDateFormatted = moment(order.createdAt).format('DD/MM/YYYY');
        return orderDateFormatted === orderDate && order.status === '4'; // Lọc chỉ những đơn hàng đã nhận hàng
      });

      matchingOrders.push(...matchingOrdersForDate); // Thêm các đơn hàng đã nhận hàng vào mảng matchingOrders
  
      // Tính tổng doanh số của các đơn hàng đã nhận hàng
      const totalSalesReceived = matchingOrdersForDate.reduce((total:number, order) => total + order.totalPrice, 0);
  
      // Gán giá trị vào dailyTotalSales
      dailyTotalSales[orderDate] = totalSalesReceived;
    });
  
    const categories: string[] = Object.keys(dailyTotalSales);
    const series = [{ name: 'Doanh số', data: Object.values(dailyTotalSales),colorByPoint: true }];
  
    setChartData({ categories, series });
    setTotalQuantitySold(matchingOrders.length);
    setTotalSales(matchingOrders.reduce((total, order) => total + order.totalPrice, 0)); // Tính tổng doanh số từ các đơn hàng đã nhận hàng
  } else {
    console.error('Không bán được đơn này trong ngày');
  }
};

  

  const getSelectedDates = (startDate: any, endDate: any) => {
    const start = moment(startDate);
    const end = moment(endDate);
    const selectedDates = [];

    while (start <= end) {
      selectedDates.push(start.format('YYYY-MM-DD'));
      start.add(1, 'days');
    }

    return selectedDates;
  };

  return (
    <div>
        <div className='statistics ml-9'>
          <div>
            <label htmlFor='startDate'>Ngày bắt đầu:</label>
            <input type='date' id='startDate' onChange={handleStartDateChange} defaultValue={startDate}/>
          </div>
          <div>
            <label htmlFor='endDate'>Ngày kết thúc:</label>
            <input type='date' id='endDate' onChange={handleEndDateChange} defaultValue={endDate}/>
          </div>
        </div>
        {isLoading ? <LoadingAdmin /> : <div>
          <HighchartsChart chartData={chartData} />
          <div className='ml-9'>
            <div style={{ fontSize: 20, color: 'black', fontWeight: 600 }}>
              Tổng số lượng đơn hàng đã bán: <samp className='text-red-600'>{totalQuantitySold} đơn hàng</samp>
            </div>
          </div>
          <div className='ml-9 mt-2'>
            <div style={{ fontSize: 25, color: 'black', fontWeight: 600 }}>
              Tổng doanh số: <samp className='text-red-600'> {totalSales.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</samp>
            </div>
          </div>
        </div>}
        
      </div>
  );
};

export default RevenueStatistics;