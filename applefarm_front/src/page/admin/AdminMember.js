import { useEffect, useRef, useState } from "react";

import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Pagination from "../../component/Pagination";

const AdminMember = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [memberList, setMemberList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [reqPage, setReqPage] = useState(1);

  useEffect(() => {
    axios
      .get(backServer + "/admin/member/" + reqPage)
      .then((res) => {
        console.log("최초결과", res.data.data);
        setMemberList(res.data.data.memberList);
        setPageInfo(res.data.data.pi);
      })
      .catch((res) => {
        console.log(res.data.data);
      });
  }, [reqPage]);

  return (
    <div className="mypage-current-wrap">
      <div className="mypage-current-title">
        <p className="admin-current-p">회원관리</p>
      </div>
      <div className="member-like-tbl-box" id="member-like-tbl-box">
        <table className="admin-tbl">
          <thead>
            <tr>
              <th>회원번호</th>
              <th>회원아이디</th>
              <th>전화번호</th>
              <th>판매점수</th>
              <th>판매자등급</th>
              <th>가입일</th>
              <th>회원등급</th>
            </tr>
          </thead>
          <tbody>
            {memberList.map((member, index) => {
              return (
                <MemberItem
                  key={"memberList" + index}
                  member={member}
                  memberList={memberList}
                  setLMemberList={setMemberList}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="admin-page-wrap">
        <Pagination
          pageInfo={pageInfo}
          reqPage={reqPage}
          setReqPage={setReqPage}
        />
      </div>
    </div>
  );
};

const MemberItem = (props) => {
  const member = props.member;
  const [memberGrade, setMemberGrade] = useState(member.memberGrade);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const changeGrade = (e) => {
    const m = { memberNo: member.memberNo, memberGrade: e.target.value };
    axios
      .patch(backServer + "/admin/memberGrade", m)
      .then((res) => {
        console.log(res.data);
        if (res.data.message === "success") {
          setMemberGrade(m.memberGrade);
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };
  useEffect(() => {
    //reqpage별 등급 노출 관리위한 필수 세팅
    setMemberGrade(member.memberGrade);
  }, [member]);
  return (
    <tr>
      <td>{member.memberNo}</td>
      <td>{member.memberId}</td>
      <td>{member.memberPhone}</td>
      <td>{member.sellerScore}</td>
      <td>{member.sellerGrade}</td>
      <td>{member.enrollDate}</td>
      <td className="member-td">
        <FormControl sx={{ m: 1 }}>
          <Select value={memberGrade} onChange={changeGrade}>
            <MenuItem value={1}>사용자</MenuItem>
            <MenuItem value={2}>관리자</MenuItem>
            <MenuItem value={3}>블랙</MenuItem>
          </Select>
        </FormControl>
      </td>
    </tr>
  );
};

export default AdminMember;
