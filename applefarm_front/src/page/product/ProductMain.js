import { useEffect, useState } from "react";
import "./productMain.css";
import ProductCategoryFrm from "./ProductCategoryFrm";
import ProductSummary from "./ProductSummary";
import ProductRecentTrade from "./ProductRecentTrade";
import ProductTab from "./ProductTab";
import { useLocation, useNavigate } from "react-router-dom";
import ProductChart from "./ProductChart";
import ProductMainList from "./productMainList";
import { useParams } from "react-router-dom";
import axios from "axios";
import RefundDelivery from "./RefuntDelivery";

const ProductMain = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const isLogin = props.isLogin;

  //const location = useLocation();
  const params = useParams();
  const nLine = params.productLine;
  const nGen = params.productGen;
  //const nModel = params.productModel;

  let nTable = "";

  if (nLine === "iPhone") {
    nTable = "IPHONE_TBL";
  } else if (nLine === "MacBook Pro" || nLine === "MacBook Air") {
    nTable = "MACBOOK_TBL";
  } else if (
    nLine === "iPad Pro 12.9" ||
    nLine === "iPad Pro 11" ||
    nLine === "iPad Air" ||
    nLine === "iPad Mini" ||
    nLine === "iPad"
  ) {
    nTable = "IPAD_TBL";
  } else if (
    nLine === "Apple Watch Ultra" ||
    nLine === "Apple Watch Series" ||
    nLine === "Apple Watch SE"
  ) {
    nTable = "WATCH_TBL";
  } else if (
    nLine === "AirPods Max" ||
    nLine === "AirPods Pro" ||
    nLine === "AirPods"
  ) {
    nTable = "AIRPODS_TBL";
  }

  /*
  useEffect(
    () => {
      axios
        .get(backServer + "/product/main/" + nLine + "/" + nGen)
        .then((res) => {})
        .catch((res) => {});
    },
    [nLine, nGen]
  );
  */

  console.log(nLine, nGen);

  //let navnavTable = navTable;

  const [navTable, setNavTable] = useState(nTable);
  const [navLine, setNavLine] = useState(nLine);
  const [navGen, setNavGen] = useState(nGen);
  const [navModel, setNavModel] = useState(""); //이거 어떻게 나중에...

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [productLine, setProductLine] = useState(navLine ? navLine : "");
  const [productGen, setProductGen] = useState(navGen ? navGen : "");
  const [productModel, setProductModel] = useState(""); //이거 어떻게 나중에...
  const [productModel2, setProductModel2] = useState("");
  const [productColor, setProductColor] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productStorage, setProductStorage] = useState("");
  const [productMemory, setProductMemory] = useState("");
  const [productChip, setProductChip] = useState("");
  const [productCpu, setProductCpu] = useState("");
  const [productGpu, setProductGpu] = useState("");
  const [productSize, setProductSize] = useState("");
  const [productConnectivity, setProductConnectivity] = useState("");
  const [productCharge, setProductCharge] = useState("");
  const [productQuality, setProductQuality] = useState("");

  useEffect(() => {
    setProductLine(nLine);
    setProductGen(nGen);
    //setProductModel(location.state.navProductModel);

    setNavTable(nTable);
    setNavLine(nLine);
    setNavGen(nGen);
    //setNavModel(location.state.navProductModel);
  }, [nLine, nGen]);

  const [selectedProduct, setSelectedProduct] = useState({}); //객체
  useEffect(() => {
    setSelectedProduct({
      productLine: productLine,
      productGen: productGen,
      productModel: productModel,
      productModel2: productModel2,
      productColor: productColor,
      productImage: productImage,
      productStorage: productStorage,
      productMemory: productMemory,
      productChip: productChip,
      productCpu: productCpu,
      productGpu: productGpu,
      productSize: productSize,
      productConnectivity: productConnectivity,
      productCharge: productCharge,
      productQuality: productQuality,
    });
  }, [
    productLine,
    productGen,
    productModel,
    productModel2,
    productColor,
    productImage,
    productStorage,
    productMemory,
    productChip,
    productCpu,
    productGpu,
    productSize,
    productConnectivity,
    productCharge,
    productQuality,
  ]);

  const [productMainTab, setProductMainTab] = useState("CHART");
  const changeMainTab = (e) => {
    setProductMainTab(e.target.id);
  };

  const navigate = useNavigate(); //상품등록버튼
  const ToProductInsert = () => {
    if (isLogin) {
      /*
      navigate("/product/insert", {
        state: {
          navTable: navTable,
          navProductLine: navLine,
          navProductGen: navGen,
          navProductModel: navModel,
        },
      });
      */
      navigate("/product/insert/" + navTable + "/" + navLine + "/" + navGen);
    } else {
      navigate("/login");
    }
  };
  //<화면 출력 순서>
  //카테고리js
  //차트js, 거래건js
  //리스트js
  return (
    <div className="productMain">
      <div className="productCategory-title">
        {navTable === "IPHONE_TBL"
          ? "iPhone"
          : navTable === "MACBOOK_TBL"
          ? "MacBook"
          : navTable === "IPAD_TBL"
          ? "iPad"
          : navTable === "WATCH_TBL"
          ? "Apple Watch"
          : navTable === "AIRPODS_TBL"
          ? "에어팟"
          : ""}
        <div className="productInsert-btn-wrap">
          <button className="productInsert-btn" onClick={ToProductInsert}>
            <span className="material-icons">add</span>
            <span>상품 등록</span>
          </button>
        </div>
      </div>
      <ProductCategoryFrm
        /*axios용*/
        navTable={navTable}
        navLine={navLine}
        navGen={navGen}
        navModel={navModel}
        /*--axios용*/
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        productQuality={productQuality}
        setProductQuality={setProductQuality}
        productLine={productLine}
        setProductLine={setProductLine}
        productGen={productGen}
        setProductGen={setProductGen}
        productModel={productModel}
        setProductModel={setProductModel}
        productModel2={productModel2}
        setProductModel2={setProductModel2}
        productColor={productColor}
        setProductColor={setProductColor}
        productImage={productImage}
        setProductImage={setProductImage}
        productStorage={productStorage}
        setProductStorage={setProductStorage}
        productMemory={productMemory}
        setProductMemory={setProductMemory}
        productChip={productChip}
        setProductChip={setProductChip}
        productCpu={productCpu}
        setProductCpu={setProductCpu}
        productGpu={productGpu}
        setProductGpu={setProductGpu}
        productSize={productSize}
        setProductSize={setProductSize}
        productConnectivity={productConnectivity}
        setProductConnectivity={setProductConnectivity}
        productCharge={productCharge}
        setProductCharge={setProductCharge}
        selectedProduct={selectedProduct}
      />

      {/*탭*/}
      <ProductTab
        productTab={productMainTab}
        changeTab={changeMainTab}
        tabNameArr={["LIST", "CHART", "REFUND&DELIVERY"]}
      />

      <div className="productMain-content-wrap">
        <div className="productMain-content">
          <div
            className={
              productMainTab === "LIST" ? "" : "productMain-content-hide"
            }
          >
            <ProductMainList selectedProduct={selectedProduct} />
          </div>
          <div
            className={
              productMainTab === "CHART"
                ? "productMain-content-chart"
                : "productMain-content-hide"
            }
          >
            {/*productQuality가 undefined또는null인거 조심!!!*/}
            <ProductChart product={selectedProduct} path="productMain" />
          </div>
          <div
            className={
              productMainTab === "REFUND&DELIVERY"
                ? ""
                : "productMain-content-hide"
            }
          >
            <RefundDelivery />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMain;
