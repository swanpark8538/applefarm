import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../component/Pagination";
import { Select } from "../../component/FormFrm";

const AdminReport = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [reportList, setReportList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [reqPage, setReqPage] = useState(1);

  const options = [
    { value: 3, label: "전체" },
    { value: 0, label: "진행중" },
    { value: 1, label: "반려" },
    { value: 2, label: "승인" },
  ];
  const [selectedValue, setSelectedValue] = useState(3);

  const selectChange = (event) => {
    setSelectedValue(event.target.value);
    console.log("신고구분:", event.target.value);
  };

  //ReqPage가 변경될 때마다, axios
  useEffect(() => {
    axios
      .get(backServer + "/admin/memberReport/" + reqPage + "/" + selectedValue)
      .then((res) => {
        console.log(res.data.data);
        setReportList(res.data.data.reportList);
        setPageInfo(res.data.data.pi);
      })
      .catch((res) => {
        console.log(res.data);
      });
  }, [reqPage, selectedValue]);
  console.log("reportList : " + reportList);

  return (
    <div className="mypage-current-wrap">
      <div className="mypage-current-title">
        <p className="admin-current-p">신고 관리</p>
      </div>
      <div className="member-like-tbl-box" id="member-like-tbl-box">
        <table>
          <thead>
            <tr>
              <th width="10%">신고번호</th>
              <th width="10%">신고유형</th>
              <th width="25%">신고내용</th>
              <th width="15%">신고자</th>
              <th width="15%">피신고자</th>
              <th width="15%">신고날짜</th>
              <th width="10%">
                <Select
                  options={options}
                  addId="admin-product-select"
                  changeEvent={selectChange}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {reportList.map((report, index) => {
              return (
                <ReportItem
                  key={"report" + index}
                  report={report}
                  reportList={reportList}
                  setReportList={setReportList}
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
const ReportItem = (props) => {
  const report = props.report;
  const [reportStatus, setReportStatus] = useState(report.reportStatus);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const changeStatus = (e) => {
    const r = {
      reportNo: report.reportNo,
      reportTarget: report.reportTarget,
      reportedMember: report.reportedMember,
      reportStatus: e.target.value,
      reportType: report.reportType,
    };
    axios
      .patch(backServer + "/admin/reportStatus", r)
      .then((res) => {
        if (res.data.message === "success") {
          setReportStatus(r.reportStatus);
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };

  return (
    <tr>
      <td>{report.reportNo}</td>
      <td>
        {report.reportType === 1
          ? "상품판매"
          : report.reportType === 2
          ? "상품후기"
          : report.reportType === 3
          ? "자유게시판"
          : report.reportType === 4
          ? "뽐내기게시판"
          : "댓글"}
      </td>
      <td>{report.reportContent}</td>
      <td>{report.reportingMemberName}</td>
      <td>{report.reportedMemberName}</td>
      <td>{report.reportDate}</td>
      <td className="member-td">
        <select value={reportStatus} onChange={changeStatus}>
          <option value={0}>진행중</option>
          <option value={1}>반려</option>
          <option value={2}>승인</option>
        </select>
      </td>
    </tr>
  );
};
export default AdminReport;
