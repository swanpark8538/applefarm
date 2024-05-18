import { Link, useNavigate } from "react-router-dom";
import { Button1, Button2, Button3, Button4 } from "../../component/FormFrm";
import "./member.css";
import { useEffect, useRef, useState } from "react";
import { DelModal } from "./Modal";
import axios from "axios";

const MemberWish = () => {
  const [likeList, setLikeList] = useState([]);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [status, setStatus] = useState(false);
  useEffect(() => {
    axios
      .get(backServer + "/member/like")
      .then((res) => {
        //console.log(res.data);
        if (res.data.message === "success") {
          setLikeList(res.data.data);
        }
      })
      .catch((res) => {
        console.log(res.data);
      });
  }, [status]);
  return (
    <div className="mypage-current-wrap">
      <h3 className="mypage-current-title">
        {/**<span className="material-icons like-icon">favorite</span>  */}
        좋아요
      </h3>
      <div className="member-like-tbl-box">
        {likeList.length === 0 ? (
          <div className="no-like-list">
            <span className="material-icons wish-icon">heart_broken</span>
            <div>추가하신 내역이 없습니다.</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>LIKE</th>
                <th colSpan={2}>ITEM</th>
                <th>PRICE</th>
                <th>SELLER</th>
                <th>PURCHASE</th>
              </tr>
            </thead>
            <tbody>
              {likeList.map((like, index) => {
                return (
                  <LikeItem
                    key={"like" + index}
                    like={like}
                    likeList={likeList}
                    setLikeList={setLikeList}
                    setStatus={setStatus}
                    status={status}
                  />
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
const LikeItem = (props) => {
  const like = props.like;
  const setStatus = props.setStatus;
  const status = props.status;
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;

  //구매 페이지 이동
  const purchase = () => {
    const productNo = like.productNo;
    navigate("/purchase/" + productNo + "/" + "n");
  };

  //모달
  const likeList = props.likeList;
  const setLikeList = props.setLikeList;
  const [modalOpen, setModalOpen] = useState(false);

  // 모달창 노출
  const showModal = () => {
    setModalOpen(true);
  };
  //console.log(like.likeNo);
  //좋아요 삭제
  const likeDelFun = () => {
    // 삭제 동작 처리 로직 작성 예정 -> 데이터 생성시 구현 예정
    axios
      .delete(backServer + "/member/like/" + like.likeNo)
      .then((res) => {
        console.log(res.data);
        if (res.data.message === "success") {
          setStatus(!status);
        }
      })
      .catch((res) => {
        console.log(res.data);
      });
    console.log(like);
    const newLikeList = likeList.filter((item) => {
      return item !== like;
    });
    setLikeList(newLikeList);
    setModalOpen(false);
  };

  return (
    <tr>
      <td>
        <span className="material-icons like-cancel-icon" onClick={showModal}>
          favorite
        </span>
      </td>
      <td>
        <Link to={"/product/" + like.productNo}>
          <div
            className={
              like.trade === 0
                ? "member-like-img-box"
                : "member-like-img-box  sold-out-img-box"
            }
          >
            <div>
              <img
                src={backServer + "/product/img/" + like.productThumbnail}
                className={like.trade === 0 ? "like-img" : "sold-out-first-img"}
              />
            </div>
            {like.trade === 0 ? (
              ""
            ) : (
              <div>
                <img src="/image/soldout.png" className="sold-out-img"></img>
              </div>
            )}
          </div>
        </Link>
      </td>
      <td className="likeName-td">
        <div className="purchase-product-summary">{like.productSummary}</div>
        <Link to={"/product/" + like.productNo}>
          <div>{like.productTitle}</div>
        </Link>
      </td>
      <td>{like.productPrice.toLocaleString()}원</td>
      <td>{like.memberNickName}</td>
      {like.trade === 0 ? (
        <td className="purchase-go-btn-box">
          <Button3 text="구매하기" clickEvent={purchase} />
        </td>
      ) : (
        <td className="sold-out-btn-box">
          <Button3 text="구매불가" />
        </td>
      )}
      <td>
        {modalOpen && (
          <DelModal
            setModalOpen={setModalOpen}
            clickEvent={likeDelFun}
            text="Are you sure you want to delete this item?"
            icon="heart_broken"
          />
        )}
      </td>
    </tr>
  );
};
export default MemberWish;
