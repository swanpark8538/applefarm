import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./productDetail.css"; //박성완
//import "./productDetail2.css"; //박근열
import Swal from "sweetalert2";
import PaginationComponent from "../../component/Pagination";

// 스와이프
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import ProductTab from "./ProductTab";
import ProductChart from "./ProductChart";
import {
  BadgeBlack,
  BadgeBlue,
  BadgeGray,
  BadgeRed,
} from "../../component/FormFrm";

const ProductDetail = (props) => {
  const navigate = useNavigate();

  const isLogin = props.isLogin;
  const params = useParams();

  const [productNo, setProductNo] = useState(params.productNo);

  console.log(params.productNo);

  // const productNo = params.productNo;
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const [loginMember, setLoginMember] = useState(null);
  const [likeBoolean, setLikeBoolean] = useState(null);
  const [likeCount, setLikeCount] = useState(0);

  const [product, setProduct] = useState({});
  const [seller, setSeller] = useState(null);
  // const [sellerProductList, setSellerProductList] = useState([]);
  const [productFileList, setProductFileList] = useState([]);
  const [qualityHistory, setQualityHistory] = useState([]);
  const [reliableList, setReliableList] = useState([]);

  const [reviewList, setReviewList] = useState([]);
  const [reviewPageInfo, setReviewPageInfo] = useState({});
  const [reviewReqPage, setReviewReqPage] = useState(1);

  const [sellerProductList, setSellerProductList] = useState([]);
  const [sellerProductPageInfo, setSellerProductPageInfo] = useState({});
  const [sellerProductReqPage, setSellerProductReqPage] = useState(1);

  const [salesInquiriesList, setSalesInquiriesList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [reqPage, setReqPage] = useState(1);
  const [writeTrigger, setWriteTrigger] = useState(0);

  const [navTable, setNavTable] = useState();
  const [navLine, setNavLine] = useState();
  const [navGen, setNavGen] = useState();
  const [navModel, setNavModel] = useState();

  useEffect(() => {
    if (isLogin) {
      axios
        .get(backServer + "/member")
        .then((res) => {
          if (res.data.message === "success") {
            console.log(productNo);
            setLoginMember(res.data.data);
            axios
              .get(backServer + "/product/likeBoolean/" + productNo)
              .then((res) => {
                if (res.data.message === "success") {
                  setLikeBoolean(res.data.data);
                }
              });
          }
        })
        .catch((res) => {
          console.log(res.data);
        });
    }
    axios
      .get(backServer + "/product/detail/" + productNo)
      .then((res) => {
        if (res.data.message === "success") {
          setProduct(res.data.data.product);
          setSeller(res.data.data.seller);
          // setSellerProductList(res.data.data.sellerProductList);
          setProductFileList(res.data.data.productFileList);
          setQualityHistory(res.data.data.qualityHistory);
          setReliableList(res.data.data.reliableList);
          //likeCount는 따로 저장
          setLikeCount(res.data.data.product.likeCount);

          console.log(res.data.data);

          // 업데이트용
          setNavTable(res.data.data.product.tableName);
          setNavLine(res.data.data.product.productLine);
          setNavGen(res.data.data.product.productGen);
          setNavModel(res.data.data.product.productModel);
        } else if (res.data.message === "fail") {
        }
      })
      .catch((res) => {
        console.log(res.data);
      });
  }, [productNo]);

  useEffect(() => {
    axios
      .get(backServer + "/product/inquiry/" + productNo + "?reqPage=" + reqPage)
      .then((res) => {
        console.log(res.data.data);
        setSalesInquiriesList(res.data.data.salesInquiriesList);
        setPageInfo(res.data.data.pi);
      })
      .catch((res) => {
        console.log(res.data);
      });
  }, [reqPage, writeTrigger, productNo]);

  useEffect(() => {
    axios
      .get(
        backServer +
          "/product/review/" +
          productNo +
          "?reviewReqPage=" +
          reviewReqPage
      )
      .then((res) => {
        console.log(res.data.data);
        setReviewList(res.data.data.reviewList);
        setReviewPageInfo(res.data.data.pi);
      })
      .catch((res) => {
        console.log(res.data);
      });
  }, [reviewReqPage, productNo]);

  useEffect(() => {
    axios
      .get(
        backServer +
          "/product/seller/" +
          productNo +
          "?sellerProductReqPage=" +
          sellerProductReqPage
      )
      .then((res) => {
        console.log(res.data.data);
        setSellerProductList(res.data.data.sellerProductList);
        setSellerProductPageInfo(res.data.data.pi);
      })
      .catch((res) => {
        console.log(res.data);
      });
  }, [sellerProductReqPage, productNo]);

  //탭
  const productDetailTabArr = ["1:1 문의", "거래 후기", "판매 상품"];
  const [productDetailTab, setProductDetailTab] = useState(
    productDetailTabArr[0]
  );
  const changeDetailTab = (e) => {
    setProductDetailTab(e.target.id);
  };

  //PswProductDetailBtn 클릭이벤트들
  const clickUpdate = () => {
    if (!product.tradeState) {
      navigate(
        "/product/update/" +
          productNo +
          "/" +
          navTable +
          "/" +
          navLine +
          "/" +
          navGen
      );
    } else {
      Swal.fire({
        icon: "warning",
        title: "수정 불가",
        text: "이미 거래중인 상품입니다.",
      });
    }
  };

  const clickDelete = () => {
    if (
      !product.tradeState ||
      (product.tradeState &&
        (product.tradeState === "구매확정" ||
          product.tradeState === "환불완료"))
    ) {
      Swal.fire({ title: "정말 삭제하시겠습니까?", showDenyButton: true })
        .then((result) => {
          if (result.isConfirmed) {
            axios
              .patch(backServer + "/product/hide", {
                productNo: product.productNo,
              })
              .then((res) => {
                if (res.data.message === "success") {
                  navigate("/");
                } else {
                  console.log(res.data);
                }
              })
              .catch((res) => {
                console.log(res.data);
              });
          } else if (result.isDenied) {
          }
        })
        .catch(() => {});
    } else {
      Swal.fire({
        icon: "warning",
        title: "삭제 불가",
        text: "거래 중인 경우 구매확정 또는 환불완료가 되어야 삭제할 수 있습니다.",
      });
    }
  };
  const likeClick = () => {
    //좋아요를 누르지 않은 상태일 때 -> 좋아요 Insert
    if (likeBoolean === 0) {
      axios
        .post(backServer + "/product/like", { productNo: product.productNo }) //memberNo는 @RequestAttribute로
        .then((res) => {
          if (res.data.message === "success") {
            setLikeCount(likeCount + 1); //화면에 표시되는 좋아요 개수 변경
            setLikeBoolean(1); //화면에 표시되는 좋아요 이미지 변경
          }
        })
        .catch((res) => {
          console.log(res.data);
        });
    }
    //좋아요를 누른 상태일 때 -> 좋아요 Delete
    else if (likeBoolean === 1) {
      axios
        .delete(backServer + "/product/like/" + product.productNo) //memberNo는 @RequestAttribute로
        .then((res) => {
          if (res.data.message === "success") {
            setLikeCount(likeCount - 1); //화면에 표시되는 좋아요 개수 변경
            setLikeBoolean(0); //화면에 표시되는 좋아요 이미지 변경
          }
        })
        .catch((res) => {
          console.log(res.data);
        });
    }
  };

  //리폿 버튼
  const report = () => {
    Swal.fire({
      title: "신고 내용 입력",
      input: "text",
      inputPlaceholder: "신고 내용....",
      confirmButtonText: "신고",
      showCancelButton: true,
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) {
        const reportContent = res.value;
        const obj = {
          reportTarget: product.productNo,
          reportedMember: seller.memberNo,
          reportContent: reportContent,
        };
        console.log(obj);

        axios
          .post(backServer + "/product/report", obj)
          .then((res) => {
            console.log(res.data);
          })
          .catch((res) => {
            console.log(res.data);
          });
      } else if (res.isDismissed) {
      }
    });
  };

  return (
    <div className="productDetail-wrap">
      {/* productDetail-top */}
      <div className="productDetail-top">
        <div className="productDetail-top-title">
          {product.tableName === "IPHONE_TBL"
            ? "iPhone"
            : product.tableName === "MACBOOK_TBL"
            ? "MacBook"
            : product.tableName === "IPAD_TBL"
            ? "iPad"
            : product.tableName === "WATCH_TBL"
            ? "Apple Watch"
            : product.tableName === "AIRPODS_TBL"
            ? "에어팟"
            : ""}
        </div>
        <div className="productDetail-top-btns">
          {
            //로그인 되어 있고, 로그인한 회원이 글 작성자일 때
            loginMember && loginMember.memberNo === product.memberNo ? (
              <>
                <div className="productDetail-updateBtn">
                  <PswProductDetailBtn clickEvent={clickUpdate} text="수정" />
                </div>
                <div className="productDetail-deleteBtn">
                  <PswProductDetailBtn clickEvent={clickDelete} text="삭제" />
                </div>
                <div className="productDetail-ikeBtn">
                  <span className="material-icons like-image">favorite</span>
                  <span className="productDetail-likeCount">
                    {likeCount + "개"}
                  </span>
                </div>
              </>
            ) : //로그인 되어 있고, 로그인한 회원이 글 작성자가 아닐 때
            loginMember && loginMember.memberNo !== product.memberNo ? (
              <>
                <div className="productDetail-ikeBtn">
                  <span
                    className="material-icons like-image"
                    onClick={likeClick}
                  >
                    {likeBoolean === 1 ? "favorite" : "favorite_border"}
                  </span>
                  <span className="productDetail-likeCount">
                    {likeCount + "개"}
                  </span>
                </div>
              </>
            ) : (
              //로그인 안 되어 있을 때
              <>
                <div className="productDetail-ikeBtn">
                  <span className="material-icons like-image">favorite</span>
                  <span className="productDetail-likeCount">
                    {likeCount + "개"}
                  </span>
                </div>
              </>
            )
          }
        </div>
      </div>
      {/* //productDetail-top */}

      {/* productDetail-content */}
      <div className="productDetail-content">
        {/* //productDetail-content-left */}
        <div className="productDetail-content-left">
          <div className="productDetail-image-area">
            <ProductImage productFileList={productFileList} />
          </div>
          <div className="productDetail-explain">
            <div className="productDetail-explain-summary">
              <ProductSummary product={product} />
            </div>
            <div className="productDetail-explain-seller">
              <ProductSeller
                product={product}
                seller={seller}
                report={report}
                isLogin={isLogin}
              />
            </div>
          </div>
          <div className="productDetail-explain-detail productArticle2">
            <ProductExplainDetail product={product} />
          </div>
        </div>
        {/* //productDetail-content-left */}

        {/* productDetail-content-right */}
        <div className="productDetail-content-right">
          <div className="productDetail-chart">
            <ProductChart product={product} path="productDetail" />
          </div>
          <div className="productDetail-bid productArticle">
            <ProductBid
              isLogin={isLogin}
              backServer={backServer}
              product={product}
              setProduct={setProduct}
              productNo={productNo}
              loginMember={loginMember}
              navigate={navigate}
            />
          </div>
          <div className="productDetail-quality productArticle3">
            <ProductQuality product={product} qualityHistory={qualityHistory} />
          </div>
        </div>
        {/* //productDetail-content-right */}
      </div>
      {/* //productDetail-content */}

      {/* productDetail-tab-area */}
      <div className="productDetail-tab-area">
        <div className="productDetail-tab">
          <ProductTab
            productTab={productDetailTab}
            changeTab={changeDetailTab}
            tabNameArr={productDetailTabArr}
          />
        </div>
        <div
          className={
            productDetailTab === productDetailTabArr[0]
              ? "productDetail-oneToOne"
              : "displayNone"
          }
        >
          <ProductOneToOne
            isLogin={isLogin}
            productNo={productNo}
            salesInquiriesList={salesInquiriesList}
            pageInfo={pageInfo}
            reqPage={reqPage}
            setReqPage={setReqPage}
            setWriteTrigger={setWriteTrigger}
          />
        </div>
        <div
          className={
            productDetailTab === productDetailTabArr[1]
              ? "productDetail-tradeReview"
              : "displayNone"
          }
        >
          <ProductTradeReview
            reviewList={reviewList}
            setReviewReqPage={setReviewReqPage}
            reviewPageInfo={reviewPageInfo}
            reviewReqPage={reviewReqPage}
          />
        </div>
        <div
          className={
            productDetailTab === productDetailTabArr[2]
              ? "productDetail-productList"
              : "displayNone"
          }
        >
          <ProductProductList
            sellerProductList={sellerProductList}
            sellerProductPageInfo={sellerProductPageInfo}
            sellerProductReqPage={sellerProductReqPage}
            setSellerProductReqPage={setSellerProductReqPage}
            setProductNo={setProductNo}
          />
        </div>
      </div>
      {/* //productDetail-tab-area */}

      {/* productDetail-reliableList */}
      <div className="productDetail-reliableList">
        <ProductReliable />
      </div>
      {/* //productDetail-reliableList */}
    </div>
  );
};

export default ProductDetail;

const ProductImage = (props) => {
  const productFileList = props.productFileList;
  const backServer = process.env.REACT_APP_BACK_SERVER;

  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      spaceBetween={0}
      slidesPerView={1}
      // onSlideChange={() => console.log("slide change")}
      // onSwiper={(swiper) => console.log(swiper)}
    >
      {productFileList.map((file, index) => {
        return (
          <SwiperSlide key={"productFile" + index}>
            <img
              src={backServer + "/product/img/" + file.filepath}
              className="productDetail-image"
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

//박성완
const PswProductDetailBtn = (props) => {
  const clickEvent = props.clickEvent;
  const text = props.text;
  return (
    <div className="pswProductDetailBtn" onClick={clickEvent}>
      {text}
    </div>
  );
};

//박근열
const ProductSummary = (props) => {
  const product = props.product;
  const selectedProduct = props.product;

  const [summaryQuality, setSummaryQuality] = useState("");
  const [summaryCpu, setSummaryCpu] = useState("");
  const [summaryGpu, setSummaryGpu] = useState("");
  useEffect(() => {
    if (selectedProduct.productQuality) {
      setSummaryQuality(selectedProduct.productQuality + "급");
    } else {
      setSummaryQuality("");
    }
  }, [selectedProduct]);
  useEffect(() => {
    if (selectedProduct.productCpu) {
      setSummaryCpu("CPU(" + selectedProduct.productCpu + ")");
    } else {
      setSummaryCpu("");
    }
  }, [selectedProduct]);
  useEffect(() => {
    if (selectedProduct.productGpu) {
      setSummaryGpu("GPU(" + selectedProduct.productGpu + ")");
    } else {
      setSummaryGpu("");
    }
  }, [selectedProduct]);
  return (
    <>
      <div className="productSummary-content">
        {
          //아이폰
          product.productLine === "iPhone"
            ? product.productModel + " " + summaryQuality
            : //맥북
            product.productLine === "MacBook Pro" ||
              product.productLine === "MacBook Air"
            ? product.productLine +
              " " +
              product.productGen +
              " " +
              product.productModel +
              " " +
              summaryQuality
            : //아이패드
            product.productLine === "iPad Pro 12.9" ||
              product.productLine === "iPad Pro 11" ||
              product.productLine === "iPad Air" ||
              product.productLine === "iPand Mini" ||
              product.productLine === "iPad"
            ? product.productLine +
              " " +
              product.productGen +
              " " +
              summaryQuality
            : //애플워치
            product.productLine === "Apple Watch Ultra" ||
              product.productLine === "Apple Watch Series" ||
              product.productLine === "Apple Watch SE"
            ? product.productLine +
              " " +
              product.productGen +
              " " +
              summaryQuality
            : //에어팟
            product.productLine === "AirPods" ||
              product.productLine === "AirPods Pro" ||
              product.productLine === "AirPods Max"
            ? product.productLine +
              " " +
              product.productGen +
              " " +
              summaryQuality
            : ""
        }
      </div>
      <div className="productSummary-content-detail">
        {
          //아이폰
          product.productLine === "iPhone"
            ? product.productStorage + " " + product.productColor
            : //맥북
            (product.productLine === "MacBook Pro" ||
                product.productLine === "MacBook Air") &&
              (product.productGen === "2018년" ||
                product.productGen === "2019년" ||
                product.productGen === "2020년")
            ? summaryCpu + " " + summaryGpu
            : product.productLine === "MacBook Pro" ||
              product.productLine === "MacBook Air"
            ? product.productChip
            : //아이패드
            product.productLine === "iPad Pro 12.9" ||
              product.productLine === "iPad Pro 11" ||
              product.productLine === "iPad Air" ||
              product.productLine === "iPand Mini" ||
              product.productLine === "iPad"
            ? product.productStorage +
              " " +
              product.productConnectivity +
              " " +
              product.productColor
            : //애플워치
            product.productLine === "Apple Watch Ultra" ||
              product.productLine === "Apple Watch Series" ||
              product.productLine === "Apple Watch SE"
            ? product.productModel +
              " " +
              product.productSize +
              " " +
              product.productConnectivity +
              " " +
              product.productColor
            : //에어팟
            product.productLine === "AirPods" ||
              product.productLine === "AirPods Pro" ||
              product.productLine === "AirPods Max"
            ? product.productCharge + " " + product.productColor
            : ""
        }
      </div>
      <div className="productSummary-content-detail">
        {
          //맥북
          (product.productLine === "MacBook Pro" ||
            product.productLine === "MacBook Air") &&
          (product.productGen === "2018년" ||
            product.productLine === "2019년" ||
            product.productLine === "2020년")
            ? product.productModel2 +
              " " +
              product.productStorage +
              " " +
              product.productMemory +
              " " +
              product.productColor
            : product.productLine === "MacBook Pro" ||
              product.productLine === "MacBook Air"
            ? product.productStorage +
              " " +
              product.productMemory +
              " " +
              product.productColor
            : ""
        }
      </div>
    </>
  );
};

//박근열
const ProductSeller = (props) => {
  const product = props.product;
  const seller = props.seller;
  const isLogin = props.isLogin;
  const report = props.report;

  // const [modalOpen, setModalOpen] = useState(false); // 모달 상태 관리
  // const modalBackground = useRef();
  // // 모달 열기 함수
  // const openModal = () => {
  //   setModalOpen(true);
  // };

  return (
    <>
      {seller ? (
        <>
          <div className="productDetail-explain-seller-name-area">
            {seller.memberNickName}
          </div>
          <div className="productDetail-explain-seller-score-area">
            <div className="productDetail-explain-seller-score-icon">
              {0 <= seller.sellerScore && seller.sellerScore <= 36 ? (
                <img src="/image/scoreImage/썩은사과.png" />
              ) : 36 < seller.sellerScore && seller.sellerScore <= 70 ? (
                <img src="/image/scoreImage/보통사과.png" />
              ) : 70 < seller.sellerScore && seller.sellerScore <= 100 ? (
                <img src="/image/scoreImage/금사과.png" />
              ) : (
                ""
              )}
            </div>

            <div className="productDetail-explain-seller-score-text">
              사과점수 {seller.sellerScore}점
            </div>
          </div>
          <div className="productDetail-explain-seller-grade-area">
            {/* 
          seller.sellerGrade는 1~6까지 존재
          1
          2
          3
          */}
            {seller.sellerGrade === 1
              ? 1
              : seller.sellerGrade === 2
              ? 2
              : seller.sellerGrade === 3
              ? 3
              : ""}
            등급 회원
          </div>
          <div className="productDetail-explain-seller-report-area">
            <div className="productDetail-explain-seller-report-icon">
              <img
                src="/image/report/report.png"
                onClick={isLogin ? report : null}
              />
            </div>

            {/* {modalOpen && <Modal setModalOpen={setModalOpen} modalBackground={modalBackground}/>} */}

            <div className="productDetail-explain-seller-report-text">
              신고하기
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

const Modal = (props) => {
  const setModalOpen = props.setModalOpen;
  const modalBackground = props.modalBackground;
  return (
    <>
      <div
        className={"modal-container"}
        ref={modalBackground}
        onClick={(e) => {
          if (e.target === modalBackground.current) {
            setModalOpen(false);
          }
        }}
      >
        <div className={"modal-content"}>
          <p>리액트로 모달 구현하기</p>
          <button
            className={"modal-close-btn"}
            onClick={() => setModalOpen(false)}
          >
            모달 닫기
          </button>
        </div>
      </div>
    </>
  );
};

//박근열
const ProductExplainDetail = (props) => {
  const product = props.product;

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: product.productExplain }}></div>
    </>
  );
};

//박성완
//const ProductChart = (props) => {};

//박성완
const ProductBid = (props) => {
  const isLogin = props.isLogin;
  const backServer = props.backServer;
  const product = props.product;
  const setProduct = props.setProduct;
  const productNo = props.productNo;
  const loginMember = props.loginMember;

  const navigate = useNavigate();

  const [bidList, setBidList] = useState([]);
  //"등록"버튼 활성화하는데에 활용
  const [alreadyBidder, setAlreadyBidder] = useState(-1);

  //bidList 구하기
  useEffect(() => {
    bidListAxios();
  }, []);
  const bidListAxios = () => {
    axios
      .get(backServer + "/product/bid/" + productNo)
      .then((res) => {
        if (res.data.message === "success") {
          setBidList(res.data.data);
        }
      })
      .catch((res) => {
        console.log(res.data);
      });
  };
  //setAlreadyBidder 구하기
  useEffect(() => {
    const bidMemberNoArr = [];
    bidList.map((bid) => {
      bidMemberNoArr.push(bid.memberNo);
    });
    if (loginMember) {
      setAlreadyBidder(bidMemberNoArr.indexOf(loginMember.memberNo));
    }
  }, [loginMember, bidList]);

  //clear
  //판매자가 자신의 판매금액을 수정/삭제
  const priceUpdate = () => {
    if (!product.tradeState) {
      Swal.fire({
        title: "원하시는 가격을 입력해주세요.",
        text: "- 올바른 입력방법 : 1,000원(X) / 1000원(O) -",
        input: "text",
        inputAttributes: {
          autocapitalize: "off",
        },
        showCancelButton: true,
        confirmButtonText: "수정",
        cancelButtonText: "삭제",
      }).then((result) => {
        const productPrice = result.value;
        if (
          result.isConfirmed &&
          (bidList.length === 0 || productPrice > bidList[0].bidPrice)
        ) {
          axios
            .patch(backServer + "/product/price", {
              productPrice: productPrice,
              productNo: productNo,
            })
            .then((res) => {
              if (res.data.message === "success") {
                Swal.fire({ icon: "success", title: "수정 완료" }).then(() => {
                  setProduct({ ...product, productPrice: productPrice });
                });
              } else {
                Swal.fire({
                  icon: "warning",
                  title: "수정 실패. 다시 입력해주세요.",
                });
              }
            })
            .catch((res) => {
              Swal.fire({
                icon: "error",
                title: "에러 발생. 관리자에게 문의해주세요.",
              });
            });
        } else {
          Swal.fire({
            icon: "warning",
            title: "수정 실패. 돈이 많으시군요?",
            text: "판매 버튼을 눌러주세요.",
          });
        }
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "수정 불가",
        text: "이미 거래중인 상품입니다.",
      });
    }
  };

  //clear
  //판매자가 판매버튼을 클릭 -> trade_tbl에 insert되고, trade_status는 "예약중"
  const selling = (e) => {
    if (!product.tradeState) {
      const bidNo = e.target.id;
      Swal.fire({
        icon: "question",
        title: "이 가격으로 판매 예약 하시겠습니까?",
        showCancelButton: true,
        confirmButtonText: "판매",
        cancelButtonText: "취소",
      }).then((result) => {
        // #{tradeSeller}, #{tradeBuyer}, #{productNo}, #{tradePrice},
        if (result.isConfirmed) {
          const tradeSeller = product.memberNo;
          let index = bidList.findIndex((bid) => bid.bidNo == bidNo);
          const tradeBuyer = bidList[index].memberNo;
          const tradePrice = bidList[index].bidPrice;
          const trade = { tradeSeller, productNo, tradeBuyer, tradePrice };
          axios.post(backServer + "/product/trade", trade).then((res) => {
            if (res.data.message === "success") {
              Swal.fire({
                icon: "success",
                title: "현재 상태 : 예약중",
              });
              //판매버튼 여러개 클릭 가능한 오류 제거 -> 원인 : trade_tbl에는 insert 되었는데, 화면이 예약중으로 렌더링 안 되었음. 그래서 렌더링 강제.
              setProduct({ ...product, tradeState: "예약중" });
            } else {
              Swal.fire({
                icon: "error",
                title: "에러 발생. 관리자에게 문의해주세요.",
              });
            }
          });
        }
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "판매 불가",
        text: "이미 거래중인 상품입니다.",
      });
    }
  };

  //clear
  //구매자가 자신의 구매호가를 삭제
  const deleteBid = (e) => {
    if (!product.tradeState) {
      const bidNo = e.target.id;
      console.log(bidNo);
      Swal.fire({
        icon: "warning",
        title: "정말로 삭제하시겠습니까?",
        showCancelButton: true,
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(backServer + "/product/bid/" + bidNo)
            .then((res) => {
              if (res.data.message === "success") {
                setBidList([]); //초기화 먼저 안 하면, 렌더링 이상해짐
                bidListAxios();
                Swal.fire({
                  icon: "success",
                  title: "삭제 성공",
                });
              } else {
                Swal.fire({
                  icon: "warning",
                  title: "삭제 실패",
                  text: "다시 시도해주세요",
                });
              }
            })
            .catch(() => {
              Swal.fire({
                icon: "error",
                title: "에러 발생",
                text: "관리자에게 문의해주세요.",
              });
            });
        }
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "삭제 불가",
        text: "이미 거래중인 상품입니다.",
      });
    }
  };

  //clear
  //구매자가 자신의 구매호가를 수정
  const bidUpdate = (e) => {
    if (!product.tradeState) {
      const bidNo = e.target.id;
      Swal.fire({
        title: "원하시는 가격을 입력해주세요.",
        text: "- 올바른 입력방법 : 1,000원(X) / 1000원(O) -",
        input: "text",
        inputAttributes: {
          autocapitalize: "off",
        },
        showCancelButton: true,
        confirmButtonText: "수정",
        cancelButtonText: "취소",
      }).then((result) => {
        const bidPrice = result.value;
        if (result.isConfirmed && bidPrice >= product.productPrice) {
          Swal.fire({
            icon: "warning",
            title: "돈이 많으시군요?",
            text: "구매버튼을 눌러주세요.",
          });
        } else if (result.isConfirmed && bidPrice < product.productPrice) {
          axios
            .patch(backServer + "/product/bid", { bidNo, bidPrice })
            .then((res) => {
              if (res.data.message === "success") {
                Swal.fire({ icon: "success", title: "수정 완료" }).then(() => {
                  setBidList([]); //초기화 먼저 안 하면, 렌더링 이상해짐
                  bidListAxios();
                });
              } else {
                Swal.fire({
                  icon: "warning",
                  title: "수정 실패",
                  text: "다시 시도해주세요.",
                });
              }
            })
            .catch(() => {
              Swal.fire({
                icon: "error",
                title: "에러 발생",
                text: "관리자에게 문의해주세요.",
              });
            });
        }
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "수정 불가",
        text: "이미 거래중인 상품입니다.",
      });
    }
  };

  //clear
  //구매자가 구매버튼을 클릭
  const purchasing = () => {
    if (!product.tradeState) {
      if (!isLogin) {
        Swal.fire({
          icon: "info",
          title: "로그인 필요",
          text: "로그인 후 구매 가능",
        });
      } else {
        navigate("/purchase/" + productNo + "/" + "n");
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "구매 불가",
        text: "이미 거래중인 상품입니다.",
      });
    }
  };

  //clear
  //구매자가 매수호가 등록버튼 클릭
  const insertBId = () => {
    if (!product.tradeState) {
      if (!isLogin) {
        Swal.fire({
          icon: "info",
          title: "로그인 필요",
          text: "로그인 후 구매 가능",
        });
      } else {
        Swal.fire({
          title: "원하시는 가격을 입력해주세요.",
          text: "- 올바른 입력방법 : 1,000원(X) / 1000원(O) -",
          input: "text",
          inputAttributes: {
            autocapitalize: "off",
          },
          showCancelButton: true,
          confirmButtonText: "등록",
          cancelButtonText: "취소",
        }).then((result) => {
          const bidPrice = result.value;
          if (result.isConfirmed && bidPrice >= product.productPrice) {
            Swal.fire({
              icon: "warning",
              title: "돈이 많으시군요?",
              text: "구매버튼을 눌러주세요.",
            });
          } else if (result.isConfirmed && bidPrice < product.productPrice) {
            const bid = {
              productNo: productNo,
              memberNo: loginMember.memberNo,
              bidPrice: bidPrice,
            };
            axios
              .post(backServer + "/product/bid", bid)
              .then((res) => {
                if (res.data.message === "success") {
                  Swal.fire({ icon: "success", title: "등록 완료" }).then(
                    () => {
                      setBidList([]); //초기화 먼저 안 하면, 렌더링 이상해짐
                      bidListAxios();
                    }
                  );
                } else {
                  Swal.fire({
                    icon: "warning",
                    title: "등록 실패",
                    text: "다시 시도해주세요.",
                  });
                }
              })
              .catch(() => {
                Swal.fire({
                  icon: "error",
                  title: "에러 발생",
                  text: "관리자에게 문의해주세요.",
                });
              });
          }
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "수정 불가",
        text: "이미 거래중인 상품입니다.",
      });
    }
  };

  return (
    <div className="productBid">
      <div className="productBid-line"></div>
      <div className="productBid-title">
        <div div className="productBidBox-wrap">
          <div className="productBidBox-left">
            판매 희망가
            {product.tradeState && product.tradeState === "예약중" ? (
              <BadgeBlack text={product.tradeState} />
            ) : product.tradeState && product.tradeState === "결제완료" ? (
              <BadgeRed text={product.tradeState} />
            ) : product.tradeState && product.tradeState === "발송대기" ? (
              <BadgeGray text={product.tradeState} />
            ) : product.tradeState && product.tradeState === "배송중" ? (
              <BadgeGray text={product.tradeState} />
            ) : product.tradeState && product.tradeState === "배송완료" ? (
              <BadgeGray text={product.tradeState} />
            ) : product.tradeState && product.tradeState === "구매확정" ? (
              <BadgeBlue text={product.tradeState} />
            ) : (
              ""
            )}
          </div>
          <div className="productBidBox-right"></div>
        </div>
      </div>
      <div className="productBid-content">
        <div className="productBidBox-wrap">
          <div className="productBidBox-left">
            <div className="productBidBox pswProductDetailBtn productPrice">
              {product.productPrice
                ? product.productPrice.toLocaleString() + "원"
                : ""}
            </div>
          </div>
          <div className="productBidBox-right">
            <div
              className="productBidBox pswProductDetailBtn productPrice"
              onClick={
                loginMember && loginMember.memberNo === product.memberNo
                  ? priceUpdate
                  : purchasing
              }
            >
              {loginMember && loginMember.memberNo === product.memberNo
                ? "수정"
                : "구매"}
            </div>
          </div>
        </div>
      </div>
      <div className="productBid-title">
        <div className="productBidBox-wrap">
          <div className="productBidBox-left">구매 희망가</div>
          <div className="productBidBox-right">
            {(loginMember && loginMember.memberNo === product.memberNo) ||
            alreadyBidder !== -1 ? (
              ""
            ) : (
              <div
                className="productBidBox pswProductDetailBtn insertBidBtn"
                onClick={insertBId}
              >
                등록
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="productBid-content">
        {bidList.map((bid, index) => {
          return (
            <div
              className="productBidBox-wrap"
              key={bid.bidNo + bid.memberNo + index}
            >
              <div className="productBidBox-left">
                <BidPrice
                  bid={bid}
                  loginMember={loginMember}
                  product={product}
                  clickEvent={
                    loginMember && loginMember.memberNo === bid.memberNo
                      ? deleteBid
                      : null
                  }
                />
              </div>
              <div className="productBidBox-right">
                <BidBtn
                  bid={bid}
                  loginMember={loginMember}
                  product={product}
                  clickEvent={
                    loginMember && loginMember.memberNo === bid.memberNo //로그인한 사람이 입찰자일 때
                      ? bidUpdate
                      : loginMember && loginMember.memberNo === product.memberNo //로그인한 사람이 판매자일 때
                      ? selling
                      : null //그 밖에
                  }
                  text={
                    loginMember && loginMember.memberNo === bid.memberNo
                      ? "수정"
                      : loginMember && loginMember.memberNo === product.memberNo
                      ? "판매"
                      : null
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
//이어서
const BidPrice = (props) => {
  const bid = props.bid;
  const loginMember = props.loginMember;
  const product = props.product;
  const clickEvent = props.clickEvent;

  return (
    <div
      className={
        loginMember && loginMember.memberNo === bid.memberNo
          ? "productBidBox pswProductDetailBtn myBid"
          : loginMember && loginMember.memberNo === product.memberNo
          ? "productBidBox pswProductDetailBtn productOwner"
          : "productBidBox pswProductDetailBtn"
      }
    >
      <span>{bid.bidPrice ? bid.bidPrice.toLocaleString() + "원" : ""}</span>
      {loginMember && loginMember.memberNo === bid.memberNo ? (
        <span
          className="material-icons productBidDeleteBtn"
          title="삭제"
          id={bid.bidNo} //여기!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          onClick={clickEvent}
        >
          cancel
        </span>
      ) : (
        ""
      )}
    </div>
  );
};
//이어서
const BidBtn = (props) => {
  const bid = props.bid;
  const loginMember = props.loginMember;
  const clickEvent = props.clickEvent;
  const product = props.product;
  const text = props.text;
  if (!text) {
    return;
  } else {
    return (
      <div
        className={
          loginMember && loginMember.memberNo === bid.memberNo
            ? "productBidBox pswProductDetailBtn myBid"
            : loginMember && loginMember.memberNo === product.memberNo
            ? "productBidBox pswProductDetailBtn productOwner"
            : "productBidBox pswProductDetailBtn"
        }
        onClick={clickEvent}
        id={bid.bidNo} //bidUpdate에 사용
      >
        {text}
      </div>
    );
  }
};

//박성완
const ProductQuality = (props) => {
  const { product, qualityHistory } = props;
  console.log(product);
  console.log(qualityHistory);
  const key = Object.keys(qualityHistory).slice(2);
  const value = Object.values(qualityHistory).slice(2);

  // console.log(key);
  // console.log(value);

  if (product.tableName === "IPHONE_TBL") {
  } else if (product.tableName === "MACBOOK_TBL") {
  } else if (product.tableName === "IPAD_TBL") {
  } else if (product.tableName === "WATCH_TBL") {
  } else if (product.tableName === "AIRPODS_TBL") {
  }

  return (
    <>
      <div className="productDetail-quality-title">
        {product.tableName == "IPHONE_TBL"
          ? "아이폰 품질 상세"
          : product.tableName == "MACBOOK_TBL"
          ? "맥북 품질 상세"
          : product.tableName == "IPAD_TBL"
          ? "아이패드 품질 상세"
          : product.tableName == "WATCH_TBL"
          ? "애플워치 품질 상세"
          : product.tableName == "AIRPODS_TBL"
          ? "에어팟 품질 상세"
          : ""}
      </div>
      <div className="productDetail-quality-item-wrap">
        {key.map((item, index) => {
          return (
            <div className="productDetail-quality-item" key={"quality" + index}>
              <div className="productDetail-quality-item-left">{item}</div>
              <div className="productDetail-quality-item-right">
                {value[index]}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

//박근열
const ProductOneToOne = (props) => {
  const salesInquiriesList = props.salesInquiriesList;
  const pageInfo = props.pageInfo;
  const reqPage = props.reqPage;
  const setReqPage = props.setReqPage;
  const isLogin = props.isLogin;
  const productNo = props.productNo;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [content, setContent] = useState();
  const setWriteTrigger = props.setWriteTrigger;

  const changeData = (e) => {
    setContent(e.target.value);
  };

  const write = () => {
    if (content === "") {
      alert("등록할 내용을 입력해주세요.");
      return;
    } else {
      const obj = { inquiryContent: content, productNo: productNo };
      axios
        .post(backServer + "/product/inquiry", obj)
        .then((res) => {
          console.log(res.data.data);
          setWriteTrigger((count) => count + 1);
        })
        .catch((res) => {
          console.log(res.data);
        });
      setContent("");
    }
  };

  return (
    <>
      {salesInquiriesList.map((list, index) => {
        return (
          <SalesInquiriesItem key={"salesInquiries" + index} list={list} />
        );
      })}

      <>
        <div className="productDetail-SalesInquiries-write-wrap">
          {isLogin ? (
            <>
              <div className="productDetail-SalesInquiries-input">
                <textarea value={content} onChange={changeData}></textarea>
              </div>
              <button
                className="productDetail-SalesInquiries-writeBtn"
                onClick={write}
              >
                등록하기
              </button>
            </>
          ) : (
            ""
          )}
        </div>

        <div className="productDetail-salesInquiries-page">
          <PaginationComponent
            pageInfo={pageInfo}
            reqPage={reqPage}
            setReqPage={setReqPage}
          ></PaginationComponent>
        </div>
      </>
    </>
  );
};

const SalesInquiriesItem = (props) => {
  const list = props.list;
  return (
    <div className="productDetail-SalesInquiries-item">
      <div className="productDetail-SalesInquiries-item-left">
        <div className="productDetail-SalesInquiries-writer">
          {list.inquiryWriter}
        </div>
        <div className="productDetail-SalesInquiries-date">
          {list.inquiryDate}
        </div>
      </div>

      <div className="productDetail-SalesInquiries-item-right">
        {list.inquiryContent}
      </div>
    </div>
  );
};

//박근열
const ProductTradeReview = (props) => {
  const reviewList = props.reviewList;
  const reviewPageInfo = props.reviewPageInfo;
  const reviewReqPage = props.reviewReqPage;
  const setReviewReqPage = props.setReviewReqPage;

  return (
    <>
      {reviewList.map((item, index) => {
        return (
          <div
            className="productDetail-tradeReview-item"
            key={"review" + index}
          >
            <div className="productDetail-tradeReview-item-left">
              <div>구매한 상품</div>
              <div>만족도</div>
              <div>구매자</div>
              <div>리뷰 내용</div>
            </div>
            <div className="productDetail-tradeReview-item-right">
              <div>{item.productSummary}</div>
              <div>
                {item.reviewSatisfaction === 1
                  ? "만족"
                  : item.reviewSatisfaction === 0
                  ? "보통"
                  : item.reviewSatisfaction === 1
                  ? "불만족"
                  : ""}
              </div>
              <div>{item.memberNickname}</div>
              <div>{item.reviewDetail}</div>
            </div>
          </div>
        );
      })}
      <div className="productDetail-tradeReview-page">
        <PaginationComponent
          pageInfo={reviewPageInfo}
          reqPage={reviewReqPage}
          setReqPage={setReviewReqPage}
        ></PaginationComponent>
      </div>
    </>
  );
};

//박근열
const ProductProductList = (props) => {
  const sellerProductList = props.sellerProductList;
  const sellerProductPageInfo = props.sellerProductPageInfo;
  const sellerProductReqPage = props.sellerProductReqPage;
  const setSellerProductReqPage = props.setSellerProductReqPage;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const setProductNo = props.setProductNo;

  const moveProductDetail = (product) => {
    console.log(product);
  };
  return (
    <>
      {sellerProductList.map((product, index) => {
        return (
          <SellerProductItem
            backServer={backServer}
            product={product}
            key={"sellerProduct" + index}
            setProductNo={setProductNo}
          />
        );
      })}
      <div className="productDetail-tradeReview-page">
        <PaginationComponent
          pageInfo={sellerProductPageInfo}
          reqPage={sellerProductReqPage}
          setReqPage={setSellerProductReqPage}
        ></PaginationComponent>
      </div>
    </>
  );
};

//박성완
const ProductReliable = (props) => {};

const SellerProductItem = (props) => {
  const product = props.product;
  const backServer = props.backServer;
  const navigate = useNavigate();
  const setProductNo = props.setProductNo;

  const moveProductDetail = () => {
    navigate("/product/" + product.productNo);
    setProductNo(product.productNo);
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 이 부분이 스크롤을 부드럽게 해줍니다.
    });
  };

  return (
    <div className="productDetail-productList-item">
      <div className="productDetail-productList-item-left">
        <div className="productDetail-productList-item-left-productThumbnail">
          <img
            src={backServer + "/product/img/" + product.productThumbnail}
          ></img>
        </div>
        <div className="productDetail-productList-item-left-productSummary">
          {product.productSummary}
        </div>
      </div>

      <div
        className="productDetail-productList-item-right"
        onClick={moveProductDetail}
      >
        <div className="productDetail-productList-item-right-productQuality">
          품질 : {product.productQuality}
        </div>
        <div className="productDetail-productList-item-right-productPrice">
          가격 : {product.productPrice}
        </div>
        <div className="productDetail-productList-item-right-productTitle">
          제목 : {product.productTitle}
        </div>
        <div
          className="productDetail-productList-item-right-productExplain"
          dangerouslySetInnerHTML={{ __html: product.productExplain }}
        ></div>
      </div>
    </div>
  );
};
