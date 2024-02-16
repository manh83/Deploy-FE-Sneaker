import React, { useState, useEffect, ChangeEvent } from "react";
import moment from "moment";
import { useStatisticsByDayMutation } from "../../Services/Api_Statistic";
import Highcharts from "highcharts";
import { message, Table } from "antd";
import HighchartsReact from "highcharts-react-official";
import { MdFreeCancellation } from "react-icons/md";
import { LuCircleDollarSign } from "react-icons/lu";
import { FaCartPlus } from "react-icons/fa";

import LoadingAdmin from "../../Component/LoadingAdmin";

interface HighchartsChartProps {
  chartData: {
    categories: string[];
    series: { name: string; data: number[] }[];
  };
}

const Dashboard = () => {
  const [totalQuantitySold, setTotalQuantitySold] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [statisticsByDay, {isLoading}] = useStatisticsByDayMutation();
  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalCanceledOrders, setTotalCanceledOrders] = useState(0);
  const [chartData, setChartData] = useState({
    categories: [],
    series: [],
  });
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

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      handleSearch();
    }
  }, [startDate, endDate]);

  //Thống kê cột của HighChatrs
  const HighchartsChart: React.FC<HighchartsChartProps> = ({ chartData }) => {
    const options: Highcharts.Options = {
      chart: {
        type: "column",
      },
      title: {
        text: "Tổng doanh số",
        // align: 'left',
      },
      xAxis: {
        categories: chartData.categories,
        accessibility: {
          description: "Countries",
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Doanh Thu (VND)",
        },
      },
      tooltip: {
        valueSuffix: " VND",
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

  //---------------------------------------------//

  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const formattedStartDay = moment(startDate)
        .startOf("day")
        .format("YYYY-MM-DD");
      const formattedEndDay = moment(endDate).endOf("day").format("YYYY-MM-DD");

      if (moment(formattedEndDay).isBefore(formattedStartDay)) {
        message.error("Không xác định được ngày");
        setChartData({ categories: [], series: [] });
        setTableData([]);
        setLoading(false);
        return;
      }
      if (formattedStartDay && formattedEndDay) {
        const response = await statisticsByDay({
          startDate: formattedStartDay,
          endDate: formattedEndDay,
        });
        setLoading(false);
        handleResponse(response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleResponse = (response: any) => {
    if (response.data && response.data.success) {
      const { orders } = response.data.statistics;

      const dailyTotalRevenue: { [key: string]: number } = {};

      const dailyTotalOrders: { [key: string]: number } = {};
      let totalCanceledOrders = 0;
      let totalQuantitySold = 0;

      const selectedDates = getSelectedDates(startDate, endDate);
      setTableData(orders);

      // Lặp qua các ngày đã chọn
      selectedDates.forEach((selectedDate) => {
        const orderDate = moment(selectedDate).format("DD/MM/YYYY");

        // Filter orders for the selected date
        const matchingOrders = orders.filter(
          (order: any) =>
            moment(order.createdAt).format("DD/MM/YYYY") === orderDate
        );

        const validOrders = matchingOrders.filter(
          (order: any) => order.status === "4"
        );

        // Calculate the total quantity for the day from valid orders
        totalQuantitySold += validOrders.length;

        // Accumulate total canceled orders
        totalCanceledOrders += matchingOrders.filter(
          (order: any) => order.status === "2"
        ).length;

        if (validOrders.length > 0) {
          // If there are valid orders, calculate total revenue and total orders
          dailyTotalRevenue[orderDate] = validOrders.reduce(
            (acc: number, order: any) => acc + order.totalPrice,
            0
          );
          dailyTotalOrders[orderDate] = validOrders.length;
        } else {
          // If no valid orders, set values to 0
          dailyTotalOrders[orderDate] = 0;
          dailyTotalRevenue[orderDate] = 0;
        }
      });

      // Set the total canceled orders using setTotalCanceledOrders
      setTotalCanceledOrders(totalCanceledOrders);

      setTotalQuantitySold(totalQuantitySold);

      const categories: string[] = Object.keys(dailyTotalRevenue);
      const series = [
        {
          name: "Doanh số",
          data: Object.values(dailyTotalRevenue),
          colorByPoint: true,
        },
      ];

      const totalRevenueForAllDays = Object.values(dailyTotalRevenue).reduce(
        (acc, revenue) => acc + revenue,
        0
      );

      setChartData({ categories, series });
      setTotalRevenue(totalRevenueForAllDays);
      // setTotalItems(orders.length);
      const aggregatedTableData = Object.keys(dailyTotalRevenue).map(
        (orderDate) => ({
          time: orderDate,
          numberOrders: dailyTotalOrders[orderDate],
          totalRevenue: dailyTotalRevenue[orderDate].toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }),
        })
      );

      setTableData(aggregatedTableData);
    } else {
      console.error("Không bán được đơn này trong ngày");
    }
  };

  // Hàm để lấy danh sách các ngày giữa startDate và endDate
  const getSelectedDates = (startDate: any, endDate: any) => {
    const start = moment(startDate);
    const end = moment(endDate);
    const selectedDates = [];

    while (start <= end) {
      selectedDates.push(start.format("YYYY-MM-DD"));
      start.add(1, "days");
    }

    return selectedDates;
  };

  const columns = [
    {
      title: "Ngày",
      dataIndex: "time",
      key: "time",
      align: "center",
    },
    {
      title: "Số lượng đơn hàng",
      dataIndex: "numberOrders",
      key: "numberOrders",
      align: "center",
    },
    {
      title: "Doanh số",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      align: "center",
    },
  ];

  return (
    <div>
      <div className="statistics ml-9 mb-3">
        <div>
          <label htmlFor="startDate">Ngày bắt đầu:</label>
          <input
            type="date"
            id="startDate"
            defaultValue={startDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div>
          <label htmlFor="endDate">Ngày kết thúc:</label>
          <input
            type="date"
            id="endDate"
            defaultValue={endDate}
            onChange={handleEndDateChange}
          />
        </div>
      </div>

      <div className="satatic-box flex ml-8 mb-10">
        <div className="box flex">
          <div className="flex items-center justify-center ml-3">
            <LuCircleDollarSign className="text-green-500 text-3xl " />
          </div>
          <div className="flex items-center justify-center ml-3">
            <div>
              <span style={{ fontSize: 15, color: "green", fontWeight: 450 }}>
                {totalRevenue.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
              <br />
              <span style={{ color: "green", fontWeight: 450 }}>
                Tổng doanh số
              </span>
            </div>
          </div>
        </div>
        <div className="box1 flex">
          <div className="flex items-center justify-center ml-3">
            <FaCartPlus className="text-orange-400 text-3xl" />
          </div>
          <div className="flex items-center justify-center ml-3">
            <div>
              <span style={{ fontSize: 15, color: "orange", fontWeight: 450 }}>
                {totalQuantitySold}
              </span>
              <br />
              <span style={{ color: "orange", fontWeight: 450 }}>
                Số lượng đơn bán ra
              </span>
            </div>
          </div>
        </div>
        <div className="box2 flex">
          <div className="flex items-center justify-center ml-3">
            <MdFreeCancellation className="text-red-500 text-3xl" />
          </div>
          <div className="flex items-center justify-center ml-3">
            <div>
              <span style={{ fontSize: 15, color: "red", fontWeight: 450 }}>
                {totalCanceledOrders}
              </span>
              <br />
              <span style={{ color: "red", fontWeight: 450 }}>
                Số lượng đơn đã hủy
              </span>
            </div>
          </div>
        </div>
      </div>
      {isLoading ? <LoadingAdmin /> : <div>
          <HighchartsChart chartData={chartData} />
          <Table columns={columns} dataSource={tableData} />
        </div> }
    </div>
  );
};

export default Dashboard;