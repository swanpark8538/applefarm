import "./productTab.css";

/*
1.  productTab 컴포넌트를 사용할 상위 컴포넌트에서 tab 제목으로 사용될 문자열의 리스트를 생성한다.
      - const tabNameArr = [탭 안에 표시할 문자들]//탭 안에 표시할 문자들의 배열(순서대로)
      - 예시)
        const tabNameMainArr = ["LIST", "CHART", "RECENT", "REFUND&DELIVERY"]

2.  ProductTab 컴포넌트를 사용할 상위 컴포넌트에서 다음의 useState를 생성한다
      - const [productTab, setProductTab] = useState("초기값");
      - 주의!! 여기서 초기값은 화면 첫 로드시 active클래스가 적용되어 있을 탭이름이다.
      - 예시) 만약 상위 파일이 productMain이라면, 
        const [productMainTab, setProductMainTab] = useState("CHART");

3.  ProductTab 컴포넌트를 사용할 상위 컴포넌트에서 다음의 함수를 선언한다.
      - const changeTab = (e) => {
          setProductTab(e.target.id);
        };
      - 예시) 만약 상위 파일이 ProductMain이라면,
        const changeMainTab = (e) => {
          setProductMainTab(e.target.id);
        };

4.  ProductTab 컴포넌트를 사용할 상위 컴포넌트에서 ProductTab컴포넌트 안에 다음의 속성을 입력한다.
      - <ProductTab
          productTab={productMainTab}
          changeTab={changeMainTab}
          tabNameArr={tabNameArr}
        />
      - 주의!!! tabNameArr 배열 안의 각각의 값인 tabName은 id속성으로 활용되기 때문에, 그 상위 컴포넌트에서 tabName을 id속성으로 활용하면 안 된다!!!
      - 예시)
        <ProductTab
          productTab={productMainTab}
          changeTab={changeMainTab}
          tabNameArr={tabNameMainArr}
        />

5.  ProductTab 컴포넌트의 width는 그 컴포넌트를 감싼 상위태그의 width의 100%임.

6.  productMainTab의 값이 무엇이냐에 따라서 class에 display:none을 넣으면 됨
*/

/*이 js파일 수정하면 안 됩니다!!!*/

const ProductTab = (props) => {
  const { productTab, changeTab, tabNameArr } = props;

  const tabWidth = 100 / tabNameArr.length + "%";

  const tabWidthStyle = {
    width: tabWidth,
  };

  return (
    <div className="productTab-wrap">
      <ul className="productTab">
        {tabNameArr.map((tabName, index) => (
          <ProductTabLi
            key={productTab + tabName + tabWidth + index}
            tabWidthStyle={tabWidthStyle}
            productTab={productTab}
            tabName={tabName}
            changeTab={changeTab}
          />
        ))}
      </ul>
    </div>
  );
};

export default ProductTab;

const ProductTabLi = (props) => {
  const { productTab, changeTab, tabName, tabWidthStyle } = props;
  return (
    <li
      className={productTab === tabName ? "active-productTab" : ""}
      onClick={changeTab}
      id={tabName}
      style={tabWidthStyle}
    >
      {tabName}
    </li>
  );
};
