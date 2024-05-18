import { Route, Routes } from "react-router-dom";
import ProductMain from "./ProductMain";
import ProductDetail from "./ProductDetail";
import ProductInsert from "./ProductInsert";
import ProductQualityFrm from "./ProductQualityFrm";
import ProductUpdate from "./ProductUpdate";

const Product = (props) => {
  const isLogin = props.isLogin;
  /*
  const obj = {
    navTable: "IPHONE_TBL",
    navProductLine: "iPhone",
    navProductGen: "iPhone 15 Series",
  };*/

  return (
    <Routes>
      <Route
        path="/main/:productLine/:productGen"
        element={<ProductMain isLogin={isLogin} />}
      />
      <Route path="/:productNo" element={<ProductDetail isLogin={isLogin} />} />
      <Route
        path="/insert/:productTable/:productLine/:productGen"
        element={<ProductInsert isLogin={isLogin} />}
      />
      <Route
        path="/update/:productNo/:productTable/:productLine/:productGen"
        element={<ProductUpdate isLogin={isLogin} />}
      />
    </Routes>
  );
};
export default Product;
