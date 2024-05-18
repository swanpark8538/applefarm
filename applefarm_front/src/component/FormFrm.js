import "./formFrm.css";
import React, { useState } from "react";
import { useEffect } from "react";
import { createContext, useContext } from "react";

//  ---------Input---------- 완료: 240324, 상태관리:자식
const Input = (props) => {
  const { data, setData, type, id, blurEvent, placeholder, disabled, onKeyUp } =
    props;
  const changeData = (e) => {
    setData(e.target.value);
  };

  return (
    <input
      className="input_form"
      id={id}
      type={type}
      value={data}
      onChange={changeData}
      onBlur={blurEvent}
      placeholder={placeholder}
      disabled={disabled}
      onKeyUp={onKeyUp}
    />
  );
};

// ------------Textaraea ----------
const Textarea = (props) => {
  const { content, setContent } = props;
  const handleChange = (event) => {
    setContent(event.target.value);
  };

  return <textarea value={content} onChange={handleChange} />;
};

const Input2 = (props) => {
  const { data, setData, type, id, blurEvent, placeholder, disabled, ref } =
    props;

  const changeData = (e) => {
    setData(e.target.value);
  };
  return (
    <input
      className="input_form2 input_focus"
      id={id}
      type={type}
      value={data}
      onChange={changeData}
      onBlur={blurEvent}
      placeholder={placeholder}
      disabled={disabled}
      ref={ref}
    />
  );
};

const InputReadOnly = (props) => {
  const { data, setData, type, id, blurEvent, placeholder } = props;
  const changeData = (e) => {
    setData(e.target.value);
  };
  return (
    <input
      className="input_form2"
      id={id}
      type={type}
      value={data}
      onChange={changeData}
      onBlur={blurEvent}
      placeholder={placeholder}
      readOnly
    />
  );
};
//  ---------Join---------- 완료: 240324, 상태관리: 자식(Input)
const InputWrap = (props) => {
  const { data, setData, type, id, label, blurEvent, checkMsg, placeholder } =
    props;
  return (
    <div className="input_wrap">
      <div>
        <div className="label">
          <label htmlFor={id}>{label}</label>
        </div>
        <div className="input_item">
          <Input
            data={data}
            setData={setData}
            type={type}
            id={id}
            blurEvent={blurEvent}
            placeholder={placeholder}
          />
        </div>
      </div>
      {checkMsg ? <div className="check-msg">{checkMsg}</div> : ""}
    </div>
  );
};

//  ---------Button----------완료: 240324, 상태관리: 부모
const Button = (props) => {
  const { text, icon, addId, clickEvent } = props;
  return (
    <button
      className="button_form"
      type="button"
      id={addId}
      onClick={clickEvent}
    >
      {text}
      {icon}
    </button>
  );
};
const Button1 = (props) => {
  const { text, icon, clickEvent, addId, disabled, style } = props;
  return (
    <button
      className="btn_form bg1"
      type="button"
      onClick={clickEvent}
      id={addId}
      disabled={disabled}
      style={style}
    >
      {text}
      {icon}
    </button>
  );
};
const Button2 = (props) => {
  const { text, icon, clickEvent, disabled, onKeyDown, addId } = props;
  return (
    <button
      className="btn_form bg2"
      type="button"
      onClick={clickEvent}
      disabled={disabled}
      onKeyDown={onKeyDown}
      id={addId}
    >
      {text}
      {icon}
    </button>
  );
};
const Button3 = (props) => {
  const { text, icon, clickEvent, disabled, style, addId } = props;
  return (
    <button
      className="btn_form bg3"
      type="button"
      onClick={clickEvent}
      disabled={disabled}
      style={style}
      id={addId}
    >
      {text}
      {icon}
    </button>
  );
};
const Button4 = (props) => {
  const { text, icon, clickEvent, disabled } = props;
  return (
    <button
      className="btn_form bg4"
      type="button"
      onClick={clickEvent}
      disabled={disabled}
    >
      {text}
      {icon}
    </button>
  );
};

//  ---------뱃지 태그----------완료: 240324
const BadgeBlue = (props) => {
  const text = props.text;
  return <span className="badge blue outline">{text}</span>;
};

const BadgeRed = (props) => {
  const text = props.text;
  return <span className="badge red outline">{text}</span>;
};

const BadgeGray = (props) => {
  const text = props.text;
  return <span className="badge gray outline">{text}</span>;
};

const BadgeBlack = (props) => {
  const text = props.text;
  return <span className="badge black outline">{text}</span>;
};

//  ---------메시지----------
const MsgSuccess = (props) => {
  const text = props.text;
  return (
    <>
      <p className="msgSuccess">{text}</p>
    </>
  );
};

const MsgFail = (props) => {
  const text = props.text;
  return (
    <>
      <p className="msgFail">{text}</p>
    </>
  );
};

//  ---------체크박스----------
function Checkbox({ children, disabled, value, checked, onChange }) {
  const context = useContext(CheckboxContext);

  if (!context) {
    return (
      <label>
        <input
          type="checkbox"
          disabled={disabled}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        {children}
      </label>
    );
  }

  const { isChecked, toggleValue } = context;
  return (
    <label>
      <input
        type="checkbox"
        disabled={disabled}
        checked={isChecked(value)}
        onChange={(event) =>
          toggleValue({ checked: event.target.checked, value })
        }
      />
      {children} {/* 여기서 children이 라벨(텍스트)를 렌더링 */}
    </label>
  );
}

// Context를 사용하는 경우, 그룹 내 체크박스 처리
const CheckboxContext = createContext(); //컨텍스트 함수, 개별체크박스-그룹체크박스 간 정보공유를 위해 사용

// -------------체크박스 그룹 -------------------
function CheckboxGroup({ label, children, values, onChange }) {
  const isChecked = (value) => values.includes(value); //values에 포함되어있다면 true
  const toggleValue = ({ checked, value }) => {
    if (checked) {
      onChange(values.concat(value)); //체크박스 선택 시 그 값을 values 배열에 추가 후 onChange함수 호출
      console.log("zz", checked);
    } else {
      onChange(values.filter((v) => v !== value));
    }
  };
  return (
    <fieldset>
      <legend>{label}</legend>
      <CheckboxContext.Provider value={{ isChecked, toggleValue }}>
        {children}
      </CheckboxContext.Provider>
    </fieldset>
  );
}

//  ---------Selcet----------
const Select = (props) => {
  const { changeEvent, options, addId } = props;

  return (
    <select className="select_form" onChange={changeEvent} id={addId}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

//  ---------Radio----------
const Radio = (props) => {
  const { name, val, selectValue, setSelectValue } = props;
  const handleChange = (event) => {
    setSelectValue(event.target.value);
  };
  console.log(selectValue);
  return (
    <div className="input_wrap">
      <input
        type="radio"
        id={val}
        name={name}
        defaultValue={val}
        checked={selectValue === val}
        onChange={handleChange}
      />
      <label htmlFor={val}>{val}</label>
    </div>
  );
};

// 박성완
const PswRadio = (props) => {
  const { name, val, selectValue, setSelectValue, color } = props;
  const handleChange = (event) => {
    setSelectValue(event.target.value);
  };
  return (
    <label htmlFor={name === "model2" ? name + val : val}>
      <div
        className={
          selectValue === val
            ? "input_wrap_psw input_wrap_psw_focus"
            : "input_wrap_psw"
        }
      >
        <input
          className="psw_radio"
          type="radio"
          id={name === "model2" ? name + val : val}
          //↑↑ model2의 M1,M2,M3의 경우 gen의 M1,M2,M3와 id가 겹쳐서 클릭 안 되므로, 위와 같이 해결.
          name={name}
          defaultValue={val}
          checked={selectValue === val}
          onChange={handleChange}
        />
        <label
          className="psw_radio_label"
          htmlFor={name === "model2" ? name + val : val}
        >
          {val}
        </label>
        {name === "color" ? (
          <span className="psw_radio_span">
            <img src={"/image/colorImage/" + color + ".png"} />
          </span>
        ) : (
          <></>
        )}
      </div>
    </label>
  );
};

// 박성완
const PswRadioQuality = (props) => {
  const { name, val, selectValue, setSelectValue } = props;
  const handleChange = (event) => {
    setSelectValue(event.target.value);
  };
  return (
    <label htmlFor={val}>
      <div
        className={
          selectValue === val
            ? "input_wrap_quality_psw input_wrap_psw_focus"
            : "input_wrap_quality_psw"
        }
      >
        <input
          className="psw_radio"
          type="radio"
          id={val}
          name={name}
          defaultValue={val}
          checked={selectValue === val}
          onChange={handleChange}
        />
        <label className="psw_radio_label" htmlFor={val}>
          {val}
        </label>
      </div>
    </label>
  );
};

export {
  Input,
  Input2,
  InputReadOnly,
  Button,
  Button1,
  Button2,
  Button3,
  Button4,
  Select,
  BadgeBlue,
  BadgeBlack,
  BadgeRed,
  BadgeGray,
  InputWrap,
  MsgSuccess,
  MsgFail,
  Radio,
  PswRadio,
  PswRadioQuality,
  Checkbox,
  CheckboxGroup,
  Textarea,
};
