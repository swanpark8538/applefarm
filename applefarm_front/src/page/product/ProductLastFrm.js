import axios from "axios";
import { useState, useEffect } from "react";
import TextEditor from "../../component/TextEditor";
import ProductChart from "./ProductChart";



const ProductLastFrm = (props) => {
  //데이터 전송용
  const title = props.title;
  const setTitle = props.setTitle;
  const content = props.content;
  const setContent = props.setContent;
  const price = props.price;
  const setPrice = props.setPrice;
  const file = props.file;
  const setFile = props.setFile;
  const thumbnail = props.thumbnail;
  const setThumbnail = props.setThumbnail;
  //chart용
  const selectedProduct = props.selectedProduct;

  // 서버 변수
  const backServer = process.env.REACT_WEB_BACK_SERVER;

  const productNo = props.productNo;
  const type = props.type;
  const product = props.product;
  const productFileList = props.productFileList;
  const productQualityInit = props.productQualityInit;
  

  const grade = props.grade;
  const setGrade = props.setGrade;
  const partOrder = props.partOrder;
  const setPartOrder = props.setPartOrder;

  // 버튼 조건
  const changeBtnActiveTrue = props.changeBtnActiveTrue;
  const changeBtnActiveFalse = props.changeBtnActiveFalse;

  // 선택된 이미지
  const [selectedImage, setSelectedImage] = useState(null);

  //화면구성
  const [image, setImage] = useState(null);
  const [fileList, setFileList] = useState(null);

  //화면구성메세지
  const [checkTitleMsg, setCheckTitleMsg] = useState("");
  const [checkPriceMsg, setCheckPriceMsg] = useState("");

  //유효성 검사
  const titleReg = /^[^]{4,30}$/;
  const priceReg = /^[0-9]{4,7}$/;

  // 제목 && 가격 유효성 검사
  const titleCheck = () => {
    console.log(titleReg.test(title));

    if (titleReg.test(title)) {
      setCheckTitleMsg("");
    } else {
      setCheckTitleMsg("제목은 4~30글자 입니다.");
    }
  };
  const priceCheck = () => {
    if (priceReg.test(price)) {
      setCheckPriceMsg("");
    } else {
      setCheckPriceMsg(
        "가격설정이 잘못되었습니다. 1000-9999999사이의 숫자를 입력해주세요."
      );
    }
  };




  //버튼 조건문
  useEffect(() => {
    if (
      title &&
      content &&
      price &&
      file &&
      thumbnail &&
      priceReg.test(price) &&
      titleReg.test(title)
    ) {
      changeBtnActiveTrue();
    } else {
      changeBtnActiveFalse();
    }
  }, [title, content, price, file, thumbnail]);

  if(type === "update"){
    //productFileList에서 이미지가 보이게
  }

  // 미리보기 이미지
  const [filePreviews, setFilePreviews] = useState([]);

  const changeFile = (e) => {
    const files = e.target.files;

    if (files) {
      const fileArray = Array.from(files); // 파일 객체를 배열로 변환 [File, File, File]

      const previews = [];

      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // previews.push(reader.result); // 파일 읽기가 완료되면 previews 배열에 추가
          previews.push({ dataUrl: reader.result, file: file }); // 파일 객체와 Data URL 함께 저장
          if (previews.length === fileArray.length) {
            setFilePreviews(previews); // 모든 파일이 읽혀지면 상태 업데이트
          }
        };
        reader.readAsDataURL(file); // 각 파일을 Data URL로 읽기
      });

      setFile(files); // 기존의 파일 상태 업데이트 로직을 유지
      const arr = fileArray.map((file) => file.name);
      setFileList(arr); // 파일 이름 목록 상태 업데이트
    }
    console.log("changeFile종료");
  };

  //filePreviews 상태가 변경될 때마다
  //(즉, 새로운 파일 미리보기가 생성될 때마다) 원하는 함수를 호출
  useEffect(() => {
    if (filePreviews.length > 0) {
      handleImageSelect(filePreviews[0]);
    }
  }, [filePreviews]);

  // 대표 이미지를 선택할때 동작하는 함수
  const handleImageSelect = (selectedPreview) => {
    setSelectedImage(selectedPreview.dataUrl); // 선택된 이미지의 Data URL을 상태에 저장
    setImage(selectedPreview.dataUrl); // 화면에 보여줄 이미지 설정
    setThumbnail(selectedPreview.file); // 선택된 이미지의 파일 객체를 setThumbnail에 저장
  };

  return (
    <div className="insert-last-write-wrap">
      <div className="insert-last-frm-title">상세 입력 페이지</div>
      <div className="insert-last-frm-wrap">
        <table className="insert-last-frm-tbl">
          <tbody>
            <tr style={{ height: "100px" }}>
              <th>타이틀</th>
              <td>
                <Input
                  data={title}
                  setData={setTitle}
                  type="text"
                  blurEvent={titleCheck}
                  blurText={checkTitleMsg}
                ></Input>
              </td>
            </tr>
            <tr style={{ height: "400px" }} className="">
              <th>제품 상세 설명</th>
              <td>
                <TextEditor
                  data={content}
                  setData={setContent}
                  url={backServer + "/board/editor"}
                ></TextEditor>
              </td>
            </tr>
            <tr style={{ height: "50px" }}>
              <th>판매 희망가</th>
              <td>
                <Input
                  data={price}
                  setData={setPrice}
                  type="text"
                  blurEvent={priceCheck}
                  blurText={checkPriceMsg}
                ></Input>
              </td>
            </tr>
            <tr style={{ height: "400px" }}>
              <th>차트</th>
              <td>
                <ProductChart product={selectedProduct} />
              </td>
            </tr>
            <tr style={{ height: "300px" }}>
              <th>썸내일 등록</th>
              <td>
                <div className="insert-last-thumbnail">
                  {image ? (
                    <img src={image} alt="Thumbnail" />
                  ) : (
                    <img src="/image/default.png" alt="Default" />
                  )}
                </div>
              </td>
            </tr>
            <tr style={{ height: "100px" }}>
              <th>사진등록</th>
              <td className="thumbnail-area">
                <input
                  type="file"
                  onChange={changeFile}
                  multiple
                  id="upload1"
                />
              </td>
            </tr>
            <tr style={{ height: "200px" }}>
              <th>사진</th>
              <td>
                <div className="file-preview-zone">
                  {filePreviews.map((preview, index) => (
                    <div className="file-preview" key={index}>
                      <img
                        src={preview.dataUrl}
                        alt="Preview"
                        className={
                          selectedImage === preview.dataUrl
                            ? "file-preview-image selected-image"
                            : "file-preview-image"
                        }
                        onClick={() => handleImageSelect(preview)}
                      />
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return;
};

export default ProductLastFrm;

const Input = (props) => {
  const data = props.data;
  const setData = props.setData;
  const type = props.type;
  const id = props.id;
  const blurEvent = props.blurEvent;
  const blurText = props.blurText;

  const changeData = (e) => {
    setData(e.target.value);
  };

  return (
    <div>
      <input
        id={id}
        type={type}
        value={data || ""}
        onChange={changeData}
        className="input-form"
        onBlur={blurEvent}
      />
      {blurEvent !== undefined ? (
        <div className="productInsert-blurText">
          <input className="blur-form" type="text" value={blurText} disabled />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
