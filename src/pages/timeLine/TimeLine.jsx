import React, {useState, useMemo, useCallback, useContext, useEffect} from "react";
import {useHistory} from "react-router-dom";
import http from "../../unit/httpUnit";
import timeLineStyle from "./timeLineStyle.scss";
import Toast from "../../modules/Toast/controller";
import Context from "../../store/Context";
const TimeLine = () => {
    const {state} = useContext(Context);
    const [data, setData] = useState([]);
    const history = useHistory();
    useMemo(()=>{
        http.request({
            url: 'timeline',
            method: "POST"
        }).then(response => {
            if (response.status === 200){
                setData(response.data.result);
            }else{
                Toast.danger(response.data.message,1000,true);
            }
        });
    },[]);
    useEffect(()=>{
        document.title = "时间轴";
    },[]);
    const handleClick = useCallback(line => {
        history.push({
            pathname: `detail/${line.id}`
        });
        document.body.scrollTop = 0;
    },[]);
    return (<main className='timeline-container'>
        <article>
            <div className={timeLineStyle.timeline_box}>
                <div className={`${timeLineStyle.wrapper} ${timeLineStyle.clear_fix_time}`}>
                    <div className={timeLineStyle.tit}>
                        <h6 className={timeLineStyle.f12}>时间轴</h6>
                        <h5 className={timeLineStyle.f24}>{ state.userInfo ? state.userInfo.username : "MONAKO"}</h5>
                    </div>
                    <ul className={timeLineStyle.clear_fix_time}>
                        {
                            data.map((line, i) => {
                                let time = new Date(line.create_time),
                                    year = time.getFullYear() + "年",
                                    month = time.getMonth() + 1 + "月",
                                    date = time.getDate() + "日";
                                return <li key={i} onClick={() => handleClick(line)}>
                                    <div>
                                        <h4 className={timeLineStyle.f30}>{year}</h4>
                                        <span className={timeLineStyle.span}>{month+date}</span>
                                        <p className={timeLineStyle.f14}>{line.title}</p>
                                    </div>
                                </li>
                            })
                        }
                    </ul>
                    <div className={timeLineStyle.future}>自此</div>
                </div>
            </div>
        </article>
    </main>);
};
export default TimeLine;
