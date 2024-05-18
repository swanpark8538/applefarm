import Swal from "sweetalert2";
import "./member.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const DeleteMember = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const logout = props.logout;

  const [member, setMember] = useState({});
  useEffect(() => {
    axios
      .get(backServer + "/member/info")
      .then((res) => {
        //console.log(res.data);
        setMember(res.data.data);
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);
  const navigate = useNavigate();

  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);
  const [isChecked4, setIsChecked4] = useState(false);

  const allChecked = isChecked1 && isChecked2 && isChecked3 && isChecked4;

  //1,2,3번째 체크박스 체크되면 나머지 4번 체크박스도 자동으로 체크
  useEffect(() => {
    if (isChecked1 && isChecked2 && isChecked3) {
      setIsChecked4(true);
    } else {
      setIsChecked4(false);
    }
  }, [isChecked1, isChecked2, isChecked3]);

  const isAllChecked = () => {
    const newCheckState = !isChecked4; // 현재 체크박스 상태의 반대로 설정
    setIsChecked4(newCheckState); // 네 번째 체크박스 상태 업데이트
    setIsChecked1(newCheckState); // 첫 번째 체크박스 상태 업데이트
    setIsChecked2(newCheckState); // 두 번째 체크박스 상태 업데이트
    setIsChecked3(newCheckState); // 세 번째 체크박스 상태 업데이트
  };

  const cancelBtn = () => {
    navigate("/mypage/loginInfo");
  };

  const deleteMember = () => {
    const memberNo = member.memberNo;

    if (!allChecked) {
      Swal.fire("모두 동의해야 탈퇴가능합니다.");
      return;
    }

    console.log(memberNo);

    axios
      .delete(backServer + "/member/deleteMember/" + memberNo)
      .then((res) => {
        if ((res.data.message = "success")) {
          Swal.fire("회원탈퇴가 완료되었습니다.").then(() => {
            logout();
          });
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };

  return (
    <>
      <div className="mypage-current-wrap">
        <h3 className="mypage-current-title">회원탈퇴</h3>
        <div className="content-wrap">
          <div>
            <div className="checkbox-box">
              <input
                type="checkbox"
                id="checkbox1"
                checked={isChecked1}
                onChange={() => setIsChecked1(!isChecked1)}
              />
              <label htmlFor="checkbox1" className="checkbox-title">
                AppleFarm을 탈퇴하면 가입하신 이메일과 아이디로 재가입이
                불가합니다.
              </label>
            </div>
            <div className="content">
              내 프로필, 거래내역(구매/판매), 관심상품, 보유상품, STYLE
              게시물(게시물/댓글), 미사용 보유 포인트 등 사용자의 모든 정보가
              사라지며 재가입 하더라도 복구가 불가능합니다. 탈퇴 14일 이내
              재가입할 수 없으며, 탈퇴 후 동일 이메일로 재가입할 수 없습니다.
            </div>
            <div className="checkbox-box">
              <input
                type="checkbox"
                id="checkbox2"
                checked={isChecked2}
                onChange={() => setIsChecked2(!isChecked2)}
              />
              <label htmlFor="checkbox2" className="checkbox-title">
                관련 법령 및 내부 기준에 따라 별도 보관하는 경우에는 일부 정보가
                보관될 수 있습니다.
              </label>
            </div>
            <div className="content">
              1. 전자상거래 등 소비자 보호에 관한 법률 계약 또는 청약철회 등에
              관한 기록: 5년 보관 대금결제 및 재화 등의 공급에 관한 기록: 5년
              보관 소비자의 불만 또는 분쟁처리에 관한 기록: 3년 보관 2.
              통신비밀보호법 접속 로그 기록: 3개월 보관 3. 내부 기준에 따라 별도
              보관 부정이용 방지를 위해 이름, 이메일(로그인ID), 휴대전화번호,
              CI/DI: 3년 보관
            </div>
            <div className="checkbox-box">
              <input
                type="checkbox"
                id="checkbox3"
                checked={isChecked3}
                onChange={() => setIsChecked3(!isChecked3)}
              />
              <label htmlFor="checkbox3" className="checkbox-title">
                AppleFarm 탈퇴가 제한된 경우에는 아래 내용을 참고하시기
                바랍니다.
              </label>
            </div>
            <div className="content">
              진행 중인 거래(판매/구매)가 있을 경우: 해당 거래 종료 후 탈퇴 가능
              진행 중인 입찰(판매/구매)가 있을 경우: 해당 입찰 삭제 후 탈퇴 가능
              미납 수수료(착불 발송비/페널티)가 있을 경우: 해당 결제 완료 후
              탈퇴 가능 이용 정지 상태인 경우: 이용 정지 해제 후 탈퇴 가능
            </div>
          </div>
        </div>
        <div className="checkbox-box all-checked-box">
          <input
            type="checkbox"
            id="checkbox4"
            checked={isChecked4}
            onChange={isAllChecked}
          />
          <label htmlFor="checkbox4" className="checkbox-title">
            회원탈퇴 안내를 모두 확인하셨으면 탈퇴에 동의합니다.
          </label>
        </div>

        <div className="delete-btn-wrap">
          <div className="delete-btn-box">
            <button className="delete-member-cancel-btn" onClick={cancelBtn}>
              취소하기
            </button>
          </div>
          <div className="delete-btn-box">
            <button className="delete-member-btn" onClick={deleteMember}>
              탈퇴하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteMember;
