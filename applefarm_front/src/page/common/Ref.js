import {
  BadgeBlack,
  BadgeBlue,
  BadgeGray,
  BadgeRed,
  Button,
  InputWrap,
  MsgSuccess,
  MsgFail,
  Checkbox,
  CheckboxGroup,
  Select,
  Radio,
} from "../../component/FormFrm";
import { useState } from "react";

const Ref = () => {
  // Input 상태관리
  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const [checkIdMsg, setCheckIdMsg] = useState("");
  console.log("아이디", memberId, "-비밀번호", memberPw);
  const idChk = () => {
    console.log("멤버 아이디");
  };

  // CheckBox 상태관리
  const [service, setService] = useState(false);
  const [marketing, setMarketing] = useState(false);
  console.log("서비스", service, "마케팅", marketing);

  const [colors, setColors] = useState(["green"]);

  // Select 상태관리
  const options = [
    { value: "", label: "All" },
    { value: "1", label: "Mac" },
    { value: "2", label: "iPad" },
    { value: "3", label: "iPhone" },
    { value: "4", label: "Watch" },
    { value: "5", label: "AirPods" },
  ];
  const [basicSelectedValue, setBasicSelectedValue] = useState("");
  const [buttonSelectedValue, setButtonSelectedValue] = useState("");
  const handleBasicSelectChange = (event) => {
    setBasicSelectedValue(event.target.value);
    console.log("Basicselect:", event.target.value);
  };
  const handleButtonSelectChange = (event) => {
    setButtonSelectedValue(event.target.value);
    console.log("Buttonselect:", event.target.value);
  };

  // Radio 상태관리
  const [gender, setGender] = useState("");

  return (
    <div>
      <h2>Common UI</h2>
      <h3>Layout</h3>
      <div className="ref_wrap">
        <div className="ref_header">
          header
          <div className="ref_inner_wrap">
            <p>topBar(최상단)</p>
            <p>header(로고/검색창/로그인)</p>
            <p>nav(메뉴)</p>
          </div>
        </div>
        <div className="ref_section">
          section
          <div className="ref_inner_wrap">
            <p>.inner_wrap : 서브 페이지 기본 레이아웃에 사용 (*1200px)</p>
            <p>h2 : 페이지 타이틀</p>
          </div>
        </div>
        <div className="ref_footer">footer</div>
      </div>

      <h3>Title</h3>
      <div className="ref_wrap">
        <div className="ref_title">
          <h2>h2 - 페이지 타이틀</h2>
          <h3>h3 - 페이지 서브 타이틀 </h3>
          <h4>h4 - 페이지 내 아이템 타이틀 </h4>
        </div>
      </div>

      <h3>Button</h3>
      <div className="ref_wrap">
        <div className="ref">
          <Button text="진한 파랑" />
          <Button addId="gray" text="진한 회색" />
          <Button addId="darkGray" text="연한 회색" />
          <Button addId="red" text="진한 빨강" />
        </div>
      </div>

      <h3>Badge</h3>
      <div className="ref_wrap">
        <div className="ref">
          <BadgeBlue text="배송대기" />
          <BadgeRed text="배송대기" />
          <BadgeGray text="배송대기" />
          <BadgeBlack text="배송대기" />
        </div>
      </div>

      <h3>Input</h3>
      <div className="ref_wrap">
        <div className="ref">
          <div className="ref_input">
            <InputWrap
              label="아이디"
              id="memberId"
              type="text"
              data={memberId}
              setData={setMemberId}
              checkMsg={checkIdMsg}
              blurEvent={idChk}
            />
            <MsgSuccess text="😃 사용가능한 아이디입니다." />
            <InputWrap
              label="패스워드"
              id="memberPw"
              type="password"
              data={memberPw}
              setData={setMemberPw}
              checkMsg={checkIdMsg}
              blurEvent={idChk}
            />
            <MsgFail text="😂 필수 입력 정보입니다." />
          </div>
        </div>
      </div>

      {/* 체크박스 */}
      <h3>Checkbox - 중복선택</h3>
      <div className="ref_wrap">
        <div className="ref">
          <div className="ref_checkbox">
            <h4>체크박스 그룹</h4>
            <Checkbox checked={service} onChange={setService}>
              (필수) 서비스 이용약관
            </Checkbox>
            <Checkbox checked={marketing} onChange={setMarketing}>
              (선택) 마케팅 수신
            </Checkbox>
            {/* <p>{JSON.stringify({service, marketing})}</p> */}
            <div>
              <button disabled={!service}>회원가입</button>
            </div>
            <h4>색깔</h4>
            <CheckboxGroup
              label="좋아하는 색깔은?"
              values={colors}
              onChange={setColors}
            >
              <Checkbox value="red">빨강</Checkbox>
              <Checkbox value="yellow">노랑</Checkbox>
              <Checkbox value="green">초록</Checkbox>
              <Checkbox value="blue">파랑</Checkbox>
              <Checkbox value="violet" disabled>
                보라
              </Checkbox>
            </CheckboxGroup>
            <p>{JSON.stringify({ colors })}</p>
          </div>
        </div>
      </div>

      {/* Select */}
      <h3>Select</h3>
      <div className="ref_wrap">
        <div className="ref">
          <div className="ref_select">
            <h4>기본</h4>
            <Select changeEvent={handleBasicSelectChange} options={options} />

            <h4>버튼 있을 시</h4>
            <div className="select_item">
              <Select
                changeEvent={handleButtonSelectChange}
                options={options}
              />
              <Button text="전송" />
            </div>
          </div>
        </div>
      </div>

      {/* Radio */}
      <h3>Radio - 단일 선택</h3>
      <div className="ref_wrap">
        <div className="ref">
          <Radio
            name="gender"
            val="M"
            selectValue={gender}
            setSelectValue={setGender}
          />

          <Radio
            name="gender"
            val="F"
            selectValue={gender}
            setSelectValue={setGender}
          />
        </div>
      </div>
    </div>
  );
};

export default Ref;
