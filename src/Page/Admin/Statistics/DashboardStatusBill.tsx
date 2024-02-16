import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import { useGetAllOrdersQuery } from "../../../Services/Api_Order";
import Loading from "../../../Component/Loading";
import { message } from "antd";
import LoadingAdmin from "../../../Component/LoadingAdmin";

const DashboardStatusBill = () => {
  const { data: dataGetOrder, isLoading: loadingOrder }: any =
    useGetAllOrdersQuery();
  const [totalstatusBill, setTotalstatusBill]: any = useState(); // default views
  const [getStartDate, setStartDate]: any = useState(""); // start time
  const [getEndDate, setEndDate]: any = useState(""); // end time
  const [totalBillTime, setTotalBillTime]: any = useState(0);

  if (!loadingOrder && getStartDate && getEndDate) {
    const status1 = totalstatusBill?.series[0].data[0].y;
    const status2 = totalstatusBill?.series[0].data[1].y;
    const status3 = totalstatusBill?.series[0].data[2].y;
    const status4 = totalstatusBill?.series[0].data[3].y;
    const status5 = totalstatusBill?.series[0].data[4].y;
    if (status1 + status2 + status3 + status4 + status5 == 0) {
      message.error(
        "Không có dữ liệu về trạng thái đơn hàng nào phù hợp trong khoảng thời gian này !"
      );
    }
  }

  const HandelViews = (): void => {
    Highcharts.chart({
      chart: {
        type: "pie",
        renderTo: "StatictisOrder",
      },
      plotOptions: {
        pie: {
          // innerSize: '30%',
          dataLabels: {
            format: "{point.name}: {point.percentage:.1f} %",
          },
        },
      },
      tooltip: {
        pointFormat: "{point.name}: <b>{point.y} đơn hàng</b>",
      },
      series: totalstatusBill.series,
    });
  };
  setTimeout(() => {
    HandelViews();
  }, 100);

  function handleStartDateChange(e: any) {
    const startTime = e.target.value;
    if (startTime) {
      setStartDate(startTime);
    } else {
      setStartDate("");
      setTotalBillTime(0);
    }
  }

  function handleEndDateChange(e: any) {
    const endTime = e.target.value;
    if (endTime) {
      setEndDate(endTime);
    } else {
      setEndDate("");
      setTotalBillTime(0);
    }
  }

  useEffect(() => {
    if (getStartDate && getEndDate) {
      // show data selected time
      let bill0: any = 0;
      let bill1: any = 0;
      let bill2: any = 0;
      let bill3: any = 0;
      let bill4: any = 0;
      let timeStart = new Date(getStartDate);
      let timeEnd = new Date(getEndDate);
      let timeStart2: any = timeStart.getMonth();
      let timeStart3: any = timeStart.getDate();
      let timeEnd2: any = timeEnd.getMonth();
      let timeEnd3: any = timeEnd.getDate();

      dataGetOrder.map((order: any) => {
        const timeCreateOrder = new Date(order.createdAt);
        let timeCreateOrder2: any = timeCreateOrder.getMonth();
        let timeCreateOrder3: any = timeCreateOrder.getDate();

        if (
          (order.status == "0" &&
            timeCreateOrder >= timeStart &&
            timeCreateOrder <= timeEnd) ||
          (order.status == "0" &&
            timeCreateOrder2 == timeStart2 &&
            timeCreateOrder3 == timeStart3 &&
            timeCreateOrder2 == timeEnd2 &&
            timeCreateOrder3 == timeEnd3)
        ) {
          bill0++;
        } else if (
          (order.status == "1" &&
            timeCreateOrder >= timeStart &&
            timeCreateOrder <= timeEnd) ||
          (order.status == "1" &&
            timeCreateOrder2 == timeStart2 &&
            timeCreateOrder3 == timeStart3 &&
            timeCreateOrder2 == timeEnd2 &&
            timeCreateOrder3 == timeEnd3)
        ) {
          bill1++;
        } else if (
          (order.status == "2" &&
            timeCreateOrder >= timeStart &&
            timeCreateOrder <= timeEnd) ||
          (order.status == "2" &&
            timeCreateOrder2 == timeStart2 &&
            timeCreateOrder3 == timeStart3 &&
            timeCreateOrder2 == timeEnd2 &&
            timeCreateOrder3 == timeEnd3)
        ) {
          bill2++;
        } else if (
          (order.status == "3" &&
            timeCreateOrder >= timeStart &&
            timeCreateOrder <= timeEnd) ||
          (order.status == "3" &&
            timeCreateOrder2 == timeStart2 &&
            timeCreateOrder3 == timeStart3 &&
            timeCreateOrder2 == timeEnd2 &&
            timeCreateOrder3 == timeEnd3)
        ) {
          bill3++;
        } else if (
          (order.status == "4" &&
            timeCreateOrder >= timeStart &&
            timeCreateOrder <= timeEnd) ||
          (order.status == "4" &&
            timeCreateOrder2 == timeStart2 &&
            timeCreateOrder3 == timeStart3 &&
            timeCreateOrder2 == timeEnd2 &&
            timeCreateOrder3 == timeEnd3)
        ) {
          bill4++;
        }
      });
      const totalTime: any = bill0 + bill1 + bill2 + bill3 + bill4;
      setTotalBillTime(totalTime);

      let data: any = [
        {
          name: "Đang chờ xác nhận",
          y: bill0,
          color: "#00B2EE",
        },
        {
          name: "Đã xác nhận",
          y: bill1,
          color: "#00FF00",
        },
        {
          name: "Đã hủy",
          y: bill2,
          color: "#FF0000",
        },
        {
          name: "Đang giao hàng",
          y: bill3,
          color: "#8DEEEE",
        },
        {
          name: "Đã nhận hàng",
          y: bill4,
          color: "#EEEE00",
        },
      ];
      setTotalstatusBill({
        series: [
          {
            data,
          },
        ],
      });
    } else {
      //show data default
      if (!loadingOrder) {
        let bill0: any = 0;
        let bill1: any = 0;
        let bill2: any = 0;
        let bill3: any = 0;
        let bill4: any = 0;

        dataGetOrder.map((order: any) => {
          if (order.status == "0") {
            bill0++;
          } else if (order.status == "1") {
            bill1++;
          } else if (order.status == "2") {
            bill2++;
          } else if (order.status == "3") {
            bill3++;
          } else {
            bill4++;
          }
        });
        //   setTotalAllOrders(countViews);
        //   let data: any = arrayNew.sort((a: any, b: any) => a.y - b.y)
        //   data = data.slice(-10)
        let data: any = [
          {
            name: "Đang chờ xác nhận",
            y: bill0,
            color: "#00B2EE",
          },
          {
            name: "Đã xác nhận",
            y: bill1,
            color: "#00FF00",
          },
          {
            name: "Đã hủy",
            y: bill2,
            color: "#FF0000",
          },
          {
            name: "Đang giao hàng",
            y: bill3,
            color: "#8DEEEE",
          },
          {
            name: "Đã nhận hàng",
            y: bill4,
            color: "#EEEE00",
          },
        ];
        setTotalstatusBill({
          series: [
            {
              data,
            },
          ],
        });
      }
    }
  }, [getStartDate, getEndDate, dataGetOrder]);

  return (
    <div className="h-[80vh] scrollDasboard">
      {loadingOrder ? (
        <LoadingAdmin />
      ) : (
        <div className="flex justify-between rounded-md ORDER select-none">
          <div className={`selector-Views`}>
            <h1 className="ml-4 text-xl mb-2 text-gray-600">
              Trạng thái các đơn hàng
            </h1>
            <hr />
            <p className="mt-1 ml-4 text-lg">
              Hiện có tất cả :{" "}
              <span className="text-orange-500 font-bold">
                {dataGetOrder?.length} đơn hàng
              </span>
            </p>
            <div className="flex ml-4">
              <div className="mb-4 mr-3">
                <label
                  className="block text-sm font-bold mb-2 ml-0"
                  htmlFor="startDate"
                >
                  Ngày bắt đầu:
                </label>
                <input
                  className="border border-gray-300 p-2 w-full rounded"
                  type="date"
                  id="startDate"
                  onChange={handleStartDateChange}
                  value={getStartDate}
                  max={
                    getEndDate
                      ? getEndDate
                      : new Date().toISOString().split("T")[0]
                  }
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-bold mb-2 ml-0"
                  htmlFor="endDate"
                >
                  Ngày kết thúc:
                </label>
                <input
                  className="border border-gray-300 p-2 w-full rounded"
                  type="date"
                  id="endDate"
                  onChange={handleEndDateChange}
                  value={getEndDate}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
            {totalBillTime > 0 && (
              <p className="ml-5">
                Khoảng thời gian này có:{" "}
                <span className="text-green-600 font-bold">
                  {totalBillTime} đơn hàng
                </span>
              </p>
            )}
            <div className="border h-[285px] ml-5">
              <div className="flex space-x-2 m-3">
                <input
                  className="w-7"
                  type="color"
                  value={"#00B2EE"}
                  disabled
                />
                <p>Đang chờ xác nhận</p>
              </div>
              <div className="flex space-x-2 m-3">
                <input
                  className="w-7"
                  type="color"
                  value={"#00FF00"}
                  disabled
                />
                <p>Đã xác nhận</p>
              </div>
              <div className="flex space-x-2 m-3">
                <input
                  className="w-7"
                  type="color"
                  value={"#FF0000"}
                  disabled
                />
                <p>Đã hủy</p>
              </div>
              <div className="flex space-x-2 m-3">
                <input
                  className="w-7"
                  type="color"
                  value={"#8DEEEE"}
                  disabled
                />
                <p>Đang giao hàng</p>
              </div>
              <div className="flex space-x-2 m-3">
                <input
                  className="w-7"
                  type="color"
                  value={"#EEEE00"}
                  disabled
                />
                <p>Đã nhận hàng</p>
              </div>
            </div>
          </div>
          <div className="w-[900px] h-[500px]" id={`StatictisOrder`}></div>
        </div>
      )}
    </div>
  );
};

export default DashboardStatusBill;
