import axios from "axios";
import "./productInsert.css";
import React, { useEffect, useState } from "react";
import { Button1, Button2, Button3 } from "../../component/FormFrm";

const ProductQualityFrm = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const grade = props.grade;
  const setGrade = props.setGrade;
  const partOrder = props.partOrder;
  const setPartOrder = props.setPartOrder;
  const changeBtnActiveTrue = props.changeBtnActiveTrue;
  const changeBtnActiveFalse = props.changeBtnActiveFalse;
  const navTable = props.navTable;

  const [score, setScore] = useState({});
  const [tableName, setTableName] = useState(navTable);
  const [image, setImage] = useState({});
  const [qualityState, setQualityState] = useState({});
  const [qualityList, setQualityList] = useState([]);

  // 품질 참조 리스트 불러오기
  useEffect(() => {
    axios
      .get(backServer + "/product/quality/" + tableName)
      .then((res) => {
        console.log(res.data);
        setQualityList(res.data.data);

        for (let i = 0; i < res.data.data.length; i++) {
          // console.log(res.data.data[i]);
          const obj = null;
          arr.push(obj);
        }

        setPartOrder(arr);
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);

  // 다음 입력 컴포넌트로 이동하기 위한 조건
  useEffect(() => {
    if (Object.keys(score).length === qualityList.length) {
      changeBtnActiveTrue();
    } else {
      changeBtnActiveFalse();
    }
  }, [Object.keys(score).length]);

  // 품질목록 선택할때마다 도는 함수
  const handleQualityChange = (part, value, index_,part2) => {
    const item = qualityList.find((item) => item.part === part);

    const index = qualityList
      .find((item) => item.part === part)
      .productStatus.split("/")
      .indexOf(value);

    const imageName = item.productStatusImage
      ? item.productStatusImage.split("/")[index]
      : "default";

      console.log(item);

    setScore((prevScores) => ({
      ...prevScores,
      [part]: index,
    }));

    //const obj = { part: part, value: value };
    const obj = {part2 : part2,value:value};
    partOrder[index_] = obj;
    setPartOrder(partOrder);

    setQualityState((prev) => ({
      ...prev,
      [part]: value,
    }));

    setImage((prevImages) => ({
      ...prevImages,
      [part]:
        imageName !== "default"
          ? "/image/qualityImage/" + imageName + ".png"
          : undefined,
    }));
  };

  //품목 선택할때마다 점수 변경
  const calculateTotalScore = () => {
    const s = Object.values(score).reduce((total, num) => total + num + 1, 0);

    return s;
  };


  // 품목 선택할때마다 점수 등급 설정
  useEffect(() => {
    if (calculateTotalScore() / qualityList.length < 1.4) {
      setGrade("A");
    } else if (calculateTotalScore() / qualityList.length < 1.8) {
      setGrade("B");
    } else if (calculateTotalScore() / qualityList.length < 2.2) {
      setGrade("C");
    } else {
      setGrade("D");
    }

    // console.log(calculateTotalScore() / qualityList.length);
    // console.log(grade);
    // console.log(image);
  }, [handleQualityChange]);

  const arr = new Array();

  

  return (
    <div className="quality-select-total-wrap">
      <div className="quality-select-wrap">
        <div className="quality-select-title">품질 선택</div>

        {qualityList.map((item, index) => {
          const arr = item.productStatus.split("/");
          const imagePath = image[item.part];
          // console.log(arr);

          // console.log(item);
          return (
            <QualitySelectInputWrap
              key={item.part + index}
              type="radio"
              className={
                arr.length === 1
                  ? "radio radio1"
                  : arr.length === 2
                  ? "radio radio2"
                  : arr.length === 3
                  ? "radio radio3"
                  : arr.length === 4
                  ? "radio radio4"
                  : ""
              }
              part={item.part}
              value1={arr[0]}
              id1={arr[0] ? item.part + "1" : undefined}
              value2={arr[1]}
              id2={arr[1] ? item.part + "2" : undefined}
              value3={arr[2]}
              id3={arr[2] ? item.part + "3" : undefined}
              value4={arr[3]}
              id4={arr[3] ? item.part + "4" : undefined}
              data={qualityState[item.part]} // 이 부분이 `qualityState` 객체에서 해당 `part`의 상태를 참조합니다.
              //value전달
              setData={(value) => handleQualityChange(item.part, value, index,item.part2)}
              // 이 부분이 상태를 설정하는 함수를 전달합니다.
              name={item.part}
              // img1={
              //   "/image/qualityImage/" +
              //   item.productStatusImage.split("/")[0] +
              //   ".png"
              // }
              // img1={"/image/qualityImage/phoneAfterimage_A.png"}

              // onChange={(value) => handleQualityChange(item.part, value)}
              img1={imagePath}
            />
          );
        })}
        {/* 기록된 점수의 키 개수와 리스트의 전체 길이와 같다면,
        즉 전부 선택했다면 평점 라디오가 뜨도록한다. */}

        {Object.keys(score).length === qualityList.length ? (
          <QualitySelectInputWrap2
            type="radio"
            className="score-radio radio4"
            part="평점"
            value1="A"
            value2="B"
            value3="C"
            value4="D"
            id1="score1"
            id2="score2"
            id3="score3"
            id4="score4"
            name="score"
            data={grade}
            setData={setGrade}
            selectedGrade={grade} // 현재 선택된 grade를 전달
          ></QualitySelectInputWrap2>
        ) : (
          ""
        )}

        {/* <div>
          <div>{calculateTotalScore()}</div>
        </div> */}
      </div>
    </div>
  );
};

const QualitySelectInputWrap = (props) => {
  const part = props.part;
  const type = props.type;
  const className = props.className;

  const value1 = props.value1;
  const id1 = props.id1;

  const value2 = props.value2;
  const id2 = props.id2;

  const value3 = props.value3;
  const id3 = props.id3;

  const value4 = props.value4;
  const id4 = props.id4;

  const name = props.name;
  const setData = props.setData;
  const data = props.data;

  const img1 = props.img1;
  const img2 = props.img2;

  // const selectedGrade = props.selectedGrade;

  return (
    <div className="quality-select-input-area">
      {/* <div className="quality-type">
        <div>액정</div>
        <div>기스</div>
      </div> */}
      <QualityTypeLavel part={part} data={data} />

      <div>
        <RadioInput
          type={type}
          className={className}
          value={value1}
          id={id1}
          name={name}
          setData={setData}
          // checked={selectedGrade === value1} // "A"가 현재 선택된 grade와 일치하면 true
        ></RadioInput>
        <RadioInput
          type={type}
          className={className}
          value={value2}
          id={id2}
          name={name}
          setData={setData}
          // checked={selectedGrade === value2}
        ></RadioInput>
        <RadioInput
          type={type}
          className={className}
          value={value3}
          id={id3}
          name={name}
          setData={setData}
          // checked={selectedGrade === value3}
        ></RadioInput>
        <RadioInput
          type={type}
          className={className}
          value={value4}
          id={id4}
          name={name}
          setData={setData}
          // checked={selectedGrade === value4}
        ></RadioInput>
      </div>

      {/* <div className="quality-select-image">
            <img src="/image/default.png" />
            <img src="/image/default.png" />
          </div> */}
      <ImageInput img1={img1} img2={img2} />
    </div>
  );
};

const QualitySelectInputWrap2 = (props) => {
  const part = props.part;
  const type = props.type;
  const className = props.className;

  const value1 = props.value1;
  const id1 = props.id1;

  const value2 = props.value2;
  const id2 = props.id2;

  const value3 = props.value3;
  const id3 = props.id3;

  const value4 = props.value4;
  const id4 = props.id4;

  const name = props.name;
  const setData = props.setData;
  const data = props.data;

  const img1 = props.img1;
  const img2 = props.img2;

  const selectedGrade = props.selectedGrade;

  return (
    <div className="quality-select-input-area">
      {/* <div className="quality-type">
        <div>액정</div>
        <div>기스</div>
      </div> */}
      <QualityTypeLavel part={part} data={data} />

      <div>
        <RadioInput2
          type={type}
          className={className}
          value={value1}
          id={id1}
          name={name}
          setData={setData}
          checked={selectedGrade === value1} // "A"가 현재 선택된 grade와 일치하면 true
        ></RadioInput2>
        <RadioInput2
          type={type}
          className={className}
          value={value2}
          id={id2}
          name={name}
          setData={setData}
          checked={selectedGrade === value2}
        ></RadioInput2>
        <RadioInput2
          type={type}
          className={className}
          value={value3}
          id={id3}
          name={name}
          setData={setData}
          checked={selectedGrade === value3}
        ></RadioInput2>
        <RadioInput2
          type={type}
          className={className}
          value={value4}
          id={id4}
          name={name}
          setData={setData}
          checked={selectedGrade === value4}
        ></RadioInput2>
      </div>

      {/* <div className="quality-select-image">
            <img src="/image/default.png" />
            <img src="/image/default.png" />
          </div> */}
      <ImageInput img1={img1} img2={img2} />
    </div>
  );
};

const RadioInput = (props) => {
  const type = props.type;
  const id = props.id;
  const className = props.className;
  const name = props.name;
  const value = props.value;
  const labelText = props.value;
  const setData = props.setData;
  // const checked = props.checked;

  const changeData = (e) => {
    setData(e.target.value);
    // console.log(e.target.value);
  };

  return (
    <>
      {value !== undefined ? (
        <div className="quality-select-input-wrap">
          <input
            type={type}
            id={id}
            defaultValue={value}
            className={className}
            name={name}
            onChange={changeData}
            // checked={checked}
          />
          <label htmlFor={id}>{labelText}</label>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

const RadioInput2 = (props) => {
  const type = props.type;
  const id = props.id;
  const className = props.className;
  const name = props.name;
  const value = props.value;
  const labelText = props.value;
  const setData = props.setData;
  const checked = props.checked;
  // const disabled = props.disabled;

  const changeData = (e) => {
    setData(e.target.value);
    // console.log(e.target.value);
  };

  return (
    <>
      {value !== undefined ? (
        <div className="quality-select-input-wrap">
          <input
            type={type}
            id={id}
            defaultValue={value}
            className={className}
            name={name}
            onChange={changeData}
            checked={checked}
            disabled={true}
          />
          <label htmlFor={id}>{labelText}</label>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

const QualityTypeLavel = (props) => {
  const part = props.part;
  const data = props.data;

  return (
    <>
      <div className="quality-type">
        <div>{part}</div>
        <div>{data}</div>
      </div>
    </>
  );
};

const ImageInput = (props) => {
  const img1 = props.img1;
  const img2 = props.img2;

  return (
    <>
      {img2 !== undefined ? (
        <div className="quality-select-image1">
          <img className="quality-image" src={img1} />
          <img src={img2} />
        </div>
      ) : (
        <div className="quality-select-image2">
          <img src={img1} className={img1 ? "quality-image" : ""} />
        </div>
      )}
    </>
  );
};

export default ProductQualityFrm;
