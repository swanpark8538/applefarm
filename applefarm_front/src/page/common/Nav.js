import "./default.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Nav = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [navIPhoneArr, setNavIPhoneArr] = useState([]);
  const [navMacBookArr, setNavMacBookArr] = useState([]);
  const [navIPadArr, setNavIPadArr] = useState([]);
  const [navWatchArr, setNavWatchArr] = useState([]);
  const [navAirPodsArr, setNavAirPodsArr] = useState([]);

  /*
  useEffect(() => {
    axios
      .get(backServer + "/common/nav")
      .then((res) => {
        console.log(res.data.data);
        setNavIPhoneArr([...res.data.data.iPhone]);
        setNavMacBookArr([...res.data.data.MacBook]);
        setNavIPadArr([...res.data.data.iPad]);
        setNavWatchArr([...res.data.data.Watch]);
        setNavAirPodsArr([...res.data.data.AirPods]);
      })
      .catch((res) => {
        console.log(res.data);
      });
  }, []);
  */

  const link = "/product/main";

  return (
    <nav className="nav">
      <ul>
        <li className="navMenu-li">
          <Link to="/product/main/iPhone/iPhone 15 Series">iPhone</Link>
          <ul className="dropdown-content drop-iPhone">
            <li>
              <Link to="/product/main/iPhone/iPhone 15 Series">
                iPhone 15 Series
              </Link>
              {/*productGen*/}
              <ul>
                <li>
                  <Link to="/product/main/iPhone/iPhone 15 Series">
                    iPhone 15 Pro Max
                  </Link>
                  {/*productModel*/}
                </li>
                <li>
                  <Link to="/product/main/iPhone/iPhone 15 Series">
                    iPhone 15 Pro
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPhone/iPhone 15 Series">
                    iPhone 15 Plus
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPhone/iPhone 15 Series">
                    iPhone 15
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/product/main/iPhone/iPhone 14 Series">
                iPhone 14 Series
              </Link>
              <ul>
                <li>
                  <Link to="/product/main/iPhone/iPhone 14 Series">
                    iPhone 14 Pro Max
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPhone/iPhone 14 Series">
                    iPhone 14 Pro
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPhone/iPhone 14 Series">
                    iPhone 14 Plus
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPhone/iPhone 14 Series">
                    iPhone 14
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/product/main/iPhone/iPhone 13 Series">
                iPhone 13 Series
              </Link>
              <ul>
                <li>
                  <Link to="/product/main/iPhone/iPhone 13 Series">
                    iPhone 13 Pro Max
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPhone/iPhone 13 Series">
                    iPhone 13 Pro
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPhone/iPhone 13 Series">
                    iPhone 13
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPhone/iPhone 13 Series">
                    iPhone 13 Mini
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/product/main/iPhone/iPhone 12 Series">
                iPhone 12 Series
              </Link>
              <ul>
                <li>
                  <Link to="/product/main/iPhone/iPhone 12 Series">
                    iPhone 12 Pro Max
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPhone/iPhone 12 Series">
                    iPhone 12 Pro
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPhone/iPhone 12 Series">
                    iPhone 12
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPhone/iPhone 12 Series">
                    iPhone 12 Mini
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/product/main/iPhone/iPhone 11 Series">
                iPhone 11 Series
              </Link>
              <ul>
                <li>
                  <Link to="/product/main/iPhone/iPhone 11 Series">
                    iPhone 11 Pro Max
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPhone/iPhone 11 Series">
                    iPhone 11 Pro
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPhone/iPhone 11 Series">
                    iPhone 11
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/product/main/iPhone/iPhone XS Series">
                iPhone XS Series
              </Link>
              <ul>
                <li>
                  <Link to="/product/main/iPhone/iPhone XS Series">
                    iPhone XS Max
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPhone/iPhone XS Series">
                    iPhone XS
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPhone/iPhone XS Series">
                    iPhone XR
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="navMenu-li">
          <Link to="/product/main/MacBook Pro/M3">MacBook</Link>
          <ul className="dropdown-content drop-MacBook">
            <li>
              <Link to="/product/main/MacBook Pro/M3">MacBook Pro</Link>
              <ul>
                <li>
                  <Link to="/product/main/MacBook Pro/M3">MacBook Pro M3</Link>
                </li>
                <li>
                  <Link to="/product/main/MacBook Pro/M2">MacBook Pro M2</Link>
                </li>
                <li>
                  <Link to="/product/main/MacBook Pro/M1">MacBook Pro M1</Link>
                </li>
                <li>
                  <Link to="/product/main/MacBook Pro/2020년">
                    MacBook Pro 2020년
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/MacBook Pro/2019년">
                    MacBook Pro 2019년
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/MacBook Pro/2018년">
                    MacBook Pro 2018년
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/product/main/MacBook Air/M3">MacBook Air</Link>
              <ul>
                <li>
                  <Link to="/product/main/MacBook Air/M3">MacBook Air M3</Link>
                </li>
                <li>
                  <Link to="/product/main/MacBook Air/M2">MacBook Air M2</Link>
                </li>
                <li>
                  <Link to="/product/main/MacBook Air/M1">MacBook Air M1</Link>
                </li>
                <li>
                  <Link to="/product/main/MacBook Air/2020년">
                    MacBook Air 2020년
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/MacBook Air/2019년">
                    MacBook Air 2019년
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/MacBook Air/2018년">
                    MacBook Air 2018년
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="navMenu-li">
          <Link to="/product/main/iPad Pro 12.9/6세대">iPad</Link>
          <ul className="dropdown-content drop-iPad">
            <li>
              <Link to="/product/main/iPad Pro 12.9/6세대">iPad Pro 12.9</Link>
              <ul>
                <li>
                  <Link to="/product/main/iPad Pro 12.9/6세대">
                    iPad Pro 12.9 6세대
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPad Pro 12.9/5세대">
                    iPad Pro 12.9 5세대
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPad Pro 12.9/4세대">
                    iPad Pro 12.9 4세대
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPad Pro 12.9/3세대">
                    iPad Pro 12.9 3세대
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPad Pro 12.9/2세대">
                    iPad Pro 12.9 2세대
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPad Pro 12.9/1세대">
                    iPad Pro 12.9 1세대
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/product/main/iPad Pro 11/4세대">iPad Pro 11</Link>
              <ul>
                <li>
                  <Link to="/product/main/iPad Pro 11/4세대">
                    iPad Pro 11 4세대
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPad Pro 11/3세대">
                    iPad Pro 11 3세대
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPad Pro 11/2세대">
                    iPad Pro 11 2세대
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPad Pro 11/1세대">
                    iPad Pro 11 1세대
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/product/main/iPad Air/5세대">iPad Air</Link>
              <ul>
                <li>
                  <Link to="/product/main/iPad Air/5세대">iPad Air 5세대</Link>
                </li>
                <li>
                  <Link to="/product/main/iPad Air/4세대">iPad Air 4세대</Link>
                </li>
                <li>
                  <Link to="/product/main/iPad Air/3세대">iPad Air 3세대</Link>
                </li>
                <li>
                  <Link to="/product/main/iPad Air/2세대">iPad Air 2세대</Link>
                </li>
                <li>
                  <Link to="/product/main/iPad Air/1세대">iPad Air 1세대</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/product/main/iPad Mini/6세대">iPad Mini</Link>
              <ul>
                <li>
                  <Link to="/product/main/iPad Mini/6세대">
                    iPad Mini 6세대
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPad Mini/5세대">
                    iPad Mini 5세대
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPad Mini/4세대">
                    iPad Mini 4세대
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPad Mini/3세대">
                    iPad Mini 3세대
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPad Mini/2세대">
                    iPad Mini 2세대
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/iPad Mini/1세대">
                    iPad Mini 1세대
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/product/main/iPad/10세대">iPad</Link>
              <ul>
                <li>
                  <Link to="/product/main/iPad/10세대">iPad 10세대</Link>
                </li>
                <li>
                  <Link to="/product/main/iPad/9세대">iPad 9세대</Link>
                </li>
                <li>
                  <Link to="/product/main/iPad/8세대">iPad 8세대</Link>
                </li>
                <li>
                  <Link to="/product/main/iPad/7세대">iPad 7세대</Link>
                </li>
                <li>
                  <Link to="/product/main/iPad/6세대">iPad 6세대</Link>
                </li>
                <li>
                  <Link to="/product/main/iPad/5세대">iPad 5세대</Link>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="navMenu-li">
          <Link to="/product/main/Apple Watch Ultra/2세대">Watch</Link>
          <ul className="dropdown-content drop-Watch">
            <li>
              <Link to="/product/main/Apple Watch Ultra/2세대">
                Apple Watch Ultra
              </Link>
              <ul>
                <li>
                  <Link to="/product/main/Apple Watch Ultra/2세대">
                    Apple Watch Ultra 2세대
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/Apple Watch Ultra/1세대">
                    Apple Watch Ultra 1세대
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/product/main/Apple Watch Series/9세대">
                Apple Watch Series
              </Link>
              <ul>
                <li>
                  <Link to="/product/main/Apple Watch Series/9세대">
                    Apple Watch Series 9세대
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/Apple Watch Series/8세대">
                    Apple Watch Series 8세대
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/Apple Watch Series/7세대">
                    Apple Watch Series 7세대
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/Apple Watch Series/6세대">
                    Apple Watch Series 6세대
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/Apple Watch Series/5세대">
                    Apple Watch Series 5세대
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/Apple Watch Series/4세대">
                    Apple Watch Series 4세대
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/product/main/Apple Watch SE/2세대">
                Apple Watch SE
              </Link>
              <ul>
                <li>
                  <Link to="/product/main/Apple Watch SE/2세대">
                    Apple Watch SE 2세대
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/Apple Watch SE/1세대">
                    Apple Watch SE 1세대
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="navMenu-li">
          <Link to="/product/main/AirPods Max/1세대">AirPods</Link>
          <ul className="dropdown-content drop-AirPods">
            <li>
              <Link to="/product/main/AirPods Max/1세대">AirPods Max</Link>
              <ul>
                <li>
                  <Link to="/product/main/AirPods Max/1세대">
                    AirPods Max 1세대
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/product/main/AirPods Pro/2세대">AirPods Pro</Link>
              <ul>
                <li>
                  <Link to="/product/main/AirPods Pro/2세대">
                    AirPods Pro 2세대
                  </Link>
                </li>
                <li>
                  <Link to="/product/main/AirPods Pro/1세대">
                    AirPods Pro 1세대
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/product/main/AirPods/3세대">AirPods</Link>
              <ul>
                <li>
                  <Link to="/product/main/AirPods/3세대">AirPods 3세대</Link>
                </li>
                <li>
                  <Link to="/product/main/AirPods/2세대">AirPods 2세대</Link>
                </li>
                <li>
                  <Link to="/product/main/AirPods/1세대">AirPods 1세대</Link>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="navMenu-li">
          <Link to="/board/list">Notice</Link>
          {/*
          <ul className="dropdown-content drop-Community">
            <li>
              <Link to="/board/list">공지사항</Link>
            </li>
            <li>
              <Link to="#">자유게시판</Link>
            </li>
            <li>
              <Link to="#">질문게시판</Link>
            </li>
            <li>
              <Link to="#">뽐내기게시판</Link>
            </li>
            <li>
              <Link to="#">매거진</Link>
            </li>
          </ul>
          */}
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
