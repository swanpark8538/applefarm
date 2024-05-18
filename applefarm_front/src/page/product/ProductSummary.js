import { useEffect, useState } from "react";

const ProductSummary = (props) => {
  const selectedProduct = props.selectedProduct;

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
    <div className="productSummary-wrap">
      <div className="productSummary-box">
        <div className="productSummary-title">선택 제품</div>
        <div className="productSummary-content">
          {
            //아이폰
            selectedProduct.productLine === "iPhone"
              ? selectedProduct.productModel + " " + summaryQuality
              : //맥북
              selectedProduct.productLine === "MacBook Pro" ||
                selectedProduct.productLine === "MacBook Air"
              ? selectedProduct.productLine +
                " " +
                selectedProduct.productGen +
                " " +
                selectedProduct.productModel +
                " " +
                summaryQuality
              : //아이패드
              selectedProduct.productLine === "iPad Pro 12.9" ||
                selectedProduct.productLine === "iPad Pro 11" ||
                selectedProduct.productLine === "iPad Air" ||
                selectedProduct.productLine === "iPand Mini" ||
                selectedProduct.productLine === "iPad"
              ? selectedProduct.productLine +
                " " +
                selectedProduct.productGen +
                " " +
                summaryQuality
              : //애플워치
              selectedProduct.productLine === "Apple Watch Ultra" ||
                selectedProduct.productLine === "Apple Watch Series" ||
                selectedProduct.productLine === "Apple Watch SE"
              ? selectedProduct.productLine +
                " " +
                selectedProduct.productGen +
                " " +
                summaryQuality
              : //에어팟
              selectedProduct.productLine === "AirPods" ||
                selectedProduct.productLine === "AirPods Pro" ||
                selectedProduct.productLine === "AirPods Max"
              ? selectedProduct.productLine +
                " " +
                selectedProduct.productGen +
                " " +
                summaryQuality
              : ""
          }
        </div>
        <div className="productSummary-content-detail">
          {
            //아이폰
            selectedProduct.productLine === "iPhone"
              ? selectedProduct.productStorage +
                " " +
                selectedProduct.productColor
              : //맥북
              (selectedProduct.productLine === "MacBook Pro" ||
                  selectedProduct.productLine === "MacBook Air") &&
                (selectedProduct.productGen === "2018년" ||
                  selectedProduct.productGen === "2019년" ||
                  selectedProduct.productGen === "2020년")
              ? summaryCpu + " " + summaryGpu
              : selectedProduct.productLine === "MacBook Pro" ||
                selectedProduct.productLine === "MacBook Air"
              ? selectedProduct.productChip
              : //아이패드
              selectedProduct.productLine === "iPad Pro 12.9" ||
                selectedProduct.productLine === "iPad Pro 11" ||
                selectedProduct.productLine === "iPad Air" ||
                selectedProduct.productLine === "iPand Mini" ||
                selectedProduct.productLine === "iPad"
              ? selectedProduct.productStorage +
                " " +
                selectedProduct.productConnectivity +
                " " +
                selectedProduct.productColor
              : //애플워치
              selectedProduct.productLine === "Apple Watch Ultra" ||
                selectedProduct.productLine === "Apple Watch Series" ||
                selectedProduct.productLine === "Apple Watch SE"
              ? selectedProduct.productModel +
                " " +
                selectedProduct.productSize +
                " " +
                selectedProduct.productConnectivity +
                " " +
                selectedProduct.productColor
              : //에어팟
              selectedProduct.productLine === "AirPods" ||
                selectedProduct.productLine === "AirPods Pro" ||
                selectedProduct.productLine === "AirPods Max"
              ? selectedProduct.productCharge +
                " " +
                selectedProduct.productColor
              : ""
          }
        </div>
        <div className="productSummary-content-detail">
          {
            //맥북
            (selectedProduct.productLine === "MacBook Pro" ||
              selectedProduct.productLine === "MacBook Air") &&
            (selectedProduct.productGen === "2018년" ||
              selectedProduct.productLine === "2019년" ||
              selectedProduct.productLine === "2020년")
              ? selectedProduct.productModel2 +
                " " +
                selectedProduct.productStorage +
                " " +
                selectedProduct.productMemory +
                " " +
                selectedProduct.productColor
              : selectedProduct.productLine === "MacBook Pro" ||
                selectedProduct.productLine === "MacBook Air"
              ? selectedProduct.productStorage +
                " " +
                selectedProduct.productMemory +
                " " +
                selectedProduct.productColor
              : ""
          }
        </div>
      </div>
    </div>
  );
};

export default ProductSummary;
