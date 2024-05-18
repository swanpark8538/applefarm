import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Link, useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate;
  const imgRote1 = () => {
    navigate("/product/main/iPhone/iPhone 15 Series");
  };
  const imgRote2 = () => {};
  const imgRote3 = () => {};
  const imgRote4 = () => {};
  const imgRote5 = () => {};

  return (
    <>
      <div className="main-wrap">
        {/**<Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
        >
          <SwiperSlide>
            <img className="main-img1" src="../image/wwdc2.jpg" />
          </SwiperSlide>
          <SwiperSlide>
            <img className="main-img2" src="../image/five.png" />
          </SwiperSlide>
        </Swiper> */}
        <div className="apple-main-wrap">
          <div className="main-title">
            <span className="main-text1">애플팜.</span>
            <div>중고 Apple 제품을 구입하는 가장 좋은 방법.</div>
          </div>

          <div className="mainImg-wrap">
            <Link to="/product/main/iPhone/iPhone 15 Series">
              <img className="iphoneMain" src="../image/iphoneMain2.png" />
            </Link>

            <Link to="/product/main/iPad Pro 12.9/6세대">
              <img className="ipadMain" src="../image/ipad2.png" />
            </Link>
            <Link to="/product/main/MacBook Pro/M3">
              <img className="macBookMain" src="../image/macbook2.png" />
            </Link>
            <Link to="/product/main/AirPods Max/1세대">
              <img className="airPodsMain" src="../image/airpods2.png" />
            </Link>
            <Link to="/product/main/Apple Watch Ultra/2세대">
              <img className="watchMain" src="../image/watch4.png" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
