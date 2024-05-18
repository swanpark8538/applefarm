import axios from "axios";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const ProductChart = (props) => {
  const product = props.product;
  const path = props.path;

  const backServer = process.env.REACT_APP_BACK_SERVER;

  const [series, setSeries] = useState([
    //series[0]
    {
      type: "column",
      name: "거래량",
      data: [],
    },
    //series[1]
    {
      type: "line",
      name: "평균가격",
      data: [],
    },
  ]);

  const [options, setOptions] = useState({
    //options.chart
    chart: {
      zoom: {
        enabled: false,
      },
    },
    //options.dataLabels
    dataLabels: {
      enabled: false,
    },
    //options.legend
    legend: {
      position: "bottom",
    },
    //options.stroke
    stroke: {
      width: [0, 4], //첫번째 seires의 두께, 두 번째 시리즈의 두께
      curve: "smooth",
    },
    //options.markers
    markers: {
      size: [4, 4],
    },
    //options.title
    title: {
      text: "거래량/평균가격",
      align: "left",
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: "24px",
        fontWeight: "bold",
        fontFamily: "ns-b",
        color: "#263238",
      },
    },
    //options.grid
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    //options.xaxis
    xaxis: {
      categories: [],
      labels: {
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd MMM",
          hour: "HH:mm",
        },
      },
    },
    //options.yaxis
    yaxis: [
      ////optios.yaxis[0] = 거래량(좌측 Y축)
      {
        min: 0, //y축 시작이 0부터 시작
        stepSize: 1, //y축 한 칸의 단위
        labels: {
          style: {
            colors: ["rgba(0, 143, 251, 0.85)"],
            fontSize: path === "productDetail" ? "0px" : "15px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 400,
            cssClass: "apexcharts-yaxis-label",
          },
          offsetX: 0,
          offsetY: 0,
          rotate: 0,
          /*
          formatter: (value) => {
            return val;
          },
          */
        },
        axisBorder: {
          show: true,
          color: "#78909C",
          offsetX: 0,
          offsetY: 0,
        },
        axisTicks: {
          show: true,
          borderType: "solid",
          color: "#78909C",
          width: 6,
          offsetX: 0,
          offsetY: 0,
        },
        title: {
          text: [path === "productDetail" ? "" : "거래량"],
          rotate: -90,
          offsetX: 0,
          offsetY: 0,
          style: {
            color: "rgba(0, 143, 251, 0.85)",
            fontSize: "15px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 600,
            cssClass: "apexcharts-yaxis-title",
          },
        },
      },

      ////options.yaxis[1] = 거래가격(우측 Y축)
      {
        min: 0, //y축 시작이 0부터 시작
        opposite: true, //이거 있어야 오른쪽에 라벨 뜸!!!
        labels: {
          style: {
            colors: ["rgba(0, 227, 150, 0.85)"],
            fontSize: path === "productDetail" ? "0px" : "15px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 400,
            cssClass: "apexcharts-yaxis-label",
          },
          offsetX: 0,
          offsetY: 0,
          rotate: 0,
          /*
          formatter: (value) => {
            return val;
          },
          */
        },
        axisBorder: {
          show: true,
          color: "#78909C",
          offsetX: 0,
          offsetY: 0,
        },
        axisTicks: {
          show: true,
          borderType: "solid",
          color: "#78909C",
          width: 6,
          offsetX: 0,
          offsetY: 0,
        },
        title: {
          text: [path === "productDetail" ? "" : "평균가격"],
          rotate: -90,
          offsetX: 0,
          offsetY: 0,
          style: {
            color: "rgba(0, 227, 150, 0.85)",
            fontSize: "15px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 600,
            cssClass: "apexcharts-yaxis-title",
          },
        },
      },
    ],
  });

  const termArr = ["3일", "6일", "9일", "12일"];
  const [term, setTerm] = useState(termArr[0]);
  //탭
  const changeTerm = (e) => {
    setTerm(e.target.value);
  };
  //axios
  useEffect(() => {
    const obj = { product: product, tempTerm: term };
    axios
      .post(backServer + "/product/chart", obj)
      .then((res) => {
        if (res.data.message === "success") {
          const data = res.data.data;
          const dateArr = data.map((item) => {
            return item.tradeDate;
          });
          const volumeArr = data.map((item) => {
            return item.tradeVolume;
          });
          const priceArr = data.map((item) => {
            return item.tradePriceAvg;
          });
          //화살표함수 사용해봤음
          setSeries((prevSeries) => [
            (series[0] = { ...prevSeries[0], data: volumeArr }),
            (series[1] = { ...prevSeries[1], data: priceArr }),
          ]);
          setOptions((prevOptions) => ({
            ...prevOptions,
            xaxis: { ...prevOptions.xaxis, categories: dateArr },
          }));
        } else if (res.data.message === "fail") {
          //원래대로 해봤음(이거 화살표함수 쓰면 렌더링 조심...)
          setSeries([...series, (series[0].data = []), (series[1].data = [])]);
          setOptions({
            ...options,
            xaxis: { ...options.xaxis, categories: [] },
          });
          /*
          setOptions((prevOptions) => ({
            ...prevOptions,
            xaxis: { ...prevOptions.xaxis, categories: [] },
          }));
          */
        }
      })
      .catch((res) => {
        console.log(res.data);
      });
  }, [product, term]);

  //console.log(options.xaxis.categories); //확인!!!
  //console.log(series[0]); //확인!!!
  //console.log(series[1]); //확인!!!

  return (
    <div className="productChart-wrap">
      <div
        className={
          path === "productDetail"
            ? "productChart-btns bottomTermArr"
            : "productChart-btns"
        }
      >
        {termArr.map((termItem, index) => {
          return (
            <Btn
              key={termItem + term + index}
              bg={term === termItem ? "bg1" : "bg5"}
              text={termItem}
              value={termItem}
              clickEvent={changeTerm}
            />
          );
        })}
      </div>
      <div id="chart" className="productChart-chart">
        <Chart
          series={series}
          options={options}
          width={"100%"}
          height={"100%"}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ProductChart;

const Btn = (props) => {
  const { bg, text, value, clickEvent } = props;
  return (
    <button
      className={"button_form " + bg}
      type="button"
      onClick={clickEvent}
      value={value}
    >
      {text}
    </button>
  );
};
