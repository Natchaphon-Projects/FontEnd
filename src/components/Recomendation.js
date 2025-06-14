import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import React, { useState } from 'react';
import './Recomendation.css';
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import WeightChart from '../components/chart/WeightChart';
import HeightChart from '../components/chart/HeightChart';
import Sunglasscat from '../assets/cat-sunglass.jpg';
import { useLocation } from "react-router-dom";

function Recomendation() {
    const [topFeatures, setTopFeatures] = useState([]);
    const [globalAverages, setGlobalAverages] = useState({});
    const location = useLocation();
    const patient = location.state?.patient;
    const { id } = useParams();
    const [record, setRecord] = useState(null);
    const [showFullTable, setShowFullTable] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    useEffect(() => {
  if (id) {
     axios.get(`http://localhost:8000/shap/local/${id}`)
      .then(res => {
        console.log("SHAP Local:", res.data);
        if (Array.isArray(res.data.top_features)) {
          const sorted = res.data.top_features.sort((a, b) => b.shap - a.shap);
setTopFeatures(sorted);
        } else {
          setTopFeatures([]);
        }
      })
      .catch(() => {
        console.log("⚠️ ดึง SHAP local ไม่สำเร็จ");
        setTopFeatures([]);
      });
  }

  if (record?.status) {
    axios.get(`http://localhost:8000/shap/global/${record.status}`)
      .then(res => setGlobalAverages(res.data))
      .catch(() => console.log("⚠️ ดึง SHAP global ไม่สำเร็จ"));
  }
}, [id, record?.status]);


    const [selectedOption, setSelectedOption] = useState("ประวัติการตรวจครั้งอื่น");



    useEffect(() => {
  if (id) {
    axios.get(`http://localhost:5000/patients/${id}/records`)
      .then((res) => {
        console.log("📦 ข้อมูลล่าสุดที่ได้:", res.data); // ตรวจสอบข้อมูลจริง
        setRecord(res.data); // ✅ ไม่ต้อง .data[0] แล้ว เพราะ backend ส่ง object มาแล้ว
      })
      .catch((err) => console.error("โหลดประวัติไม่สำเร็จ", err));
  }
}, [id]);


if (!patient) {
  return (
    <div style={{ padding: 20 }}>
      <h2>ไม่พบข้อมูลผู้ป่วย</h2>
      <p>กรุณากลับไปหน้าเดิมแล้วเลือกผู้ป่วยอีกครั้ง</p>
    </div>
  );
}

    const handleSelect = (option) => {
        setSelectedOption(option);
        setIsDropdownOpen(false);
    };




    return (
        <div className="dashboard-container">
            <Header />
            <div className="recommendation-page">

                {/* Page Title */}
                <div className="recommendation-title">
                    ดูผลลัพธ์การประเมินของผู้ป่วย
                </div>

                {/* Patient Info + Graph */}
                <div className="recommendation-patient-wrapper">

                    {/* ซ้าย: Patient Section */}
                    <div className="recommendation-patient-section">


                        {/* ซ้าย: รูป + ชื่อ + ปุ่ม */}
                        <div className="patient-profile">
                            <div className="patient-health-badge">ข้อมูลสุขภาพ</div>
                            <div className="patient-date">
                                วันที่ {new Date().toLocaleDateString('th-TH')}


                            </div>
                            <img
                                src={Sunglasscat}
                                alt="Patient Avatar"
                                className="patient-icon-image"
                            />

                            <div className="patient-name-large">{patient.name || "ไม่ทราบชื่อ"}</div>



                        </div>

                        {/* ขวา: Grid 2 columns */}
                        <div className="patient-main-info">

                            <div className="patient-info-grid-two">
                                <div className="info-card">
  <div className="label">HN:</div>
  <div className="value">{record?.hn_number || "--"}</div>
</div>

                                <div className="info-card">
                                     <div className="label">เพศ:</div>
                                     <div className="value">{patient.gender || "--"}</div>
                                </div>
                                <div className="info-card">
                                    <div className="label">อายุ:</div>
                                    <div className="value">{patient.age || "--"}</div>
                                </div>
                             <div className="info-card">
                                <div className="label">น้ำหนัก:</div>
                                <div className="value">{record?.weight ? `${record.weight} กก.` : "--"}</div>
                            </div>

                              <div className="info-card">
                                <div className="label">ส่วนสูง:</div>
                                <div className="value">{record?.height ? `${record.height} ซม.` : "--"}</div>
                            </div>

                            <div className="info-card">
                                <div className="label">โรคประจำตัว:</div>
                                <div className="value">{record?.congenital_disease || "--"}</div>
                            </div>

                            </div>

                        </div>

                    </div>


                    {/* ขวา: Graph */}
                    <div className="patient-graph-section">
                        <WeightChart />
                    </div>
                    <div className="patient-graph-section">
                        <HeightChart />
                    </div>
                </div>

                {/* Action Buttons */}
                {/* ✅ Dropdown ด้านซ้าย */}

                <div className="recommendation-action-buttons">
                    <div className="dropdown-wrapper">
                        <select className="recommendation-dropdown">
                            <option value="">ประวัติการตรวจครั้งอื่น</option>
                            <option value="history">ประวัติ</option>
                            <option value="checkup">การตรวจสุขภาพ</option>
                            <option value="edit">แก้ไขข้อมูล</option>
                        </select>
                    </div>

                    <div className="action-buttons-wrapper">
                        <button className="recommendation-action-btn">ดูประวัติเพิ่มเติม</button>
                        <button className="recommendation-action-btn">ดูประวัติการตรวจย้อนหลัง</button>
                        <button className="recommendation-action-btn">แก้ไขข้อมูลการซักประวัติ</button>
                    </div>
                </div>

                {/* Assessment Status */}
                {record?.status && (
                <div className="recommendation-status">
                    <div className="status-text">
  อยู่ในเกณฑ์ : {record.status}
</div>

                    <div className="status-subtext">Assessment Status</div>
                </div>
                )}

                {/* ผลการตรวจ Section */}
                <div className="recommendation-result-section">

                    <div className="result-header-row">
                        <div className="result-title">ผลการตรวจ :</div>

                        <div className="info-card">
                            <div className="label">แพ้อาหาร:</div>
                            <div className="value">{record?.Food_allergy || "--"}</div>
                        </div>

                        <div className="info-card">
                            <div className="label">แพ้ยา:</div>
                            <div className="value">{record?.drug_allergy || "--"}</div>
                        </div>



                    </div>

                    {/* Wrapper → 2 ตาราง */}
                    <div className="result-table-wrapper">

                        {/* ตารางซ้าย (3/4) */}
                        <div className="result-table-block left">
                            <table className="result-table">
                                <thead>
                                    <tr>
                                        <th>ข้อมูล</th>
                                        <th>พฤติกรรมของผู้ป่วย</th>
                                        <th>ค่ามาตรฐาน</th>
                                        <th>คำแนะนำ</th>
                                    </tr>
                                </thead>
                                <tbody>
                            {topFeatures.slice(0, 5).map((item, index) => (
                                <tr key={index}>
                                    <td>{item.feature}</td>
                                    <td>
                                    <span className={item.value === 1 ? 'badge-red' : 'badge-green'}>
                                        {item.value === 1 ? 'เป็น' : 'ไม่เป็น'}
                                    </span>
                                    </td>
                                    <td>
                                    <span className="badge-green">
                                        {globalAverages[item.feature] !== undefined ? globalAverages[item.feature] : "--"}
                                    </span>
                                    </td>
                                    <td>ควรดูแลเพิ่มเติมตามคำแนะนำแพทย์</td>
                                </tr>
                                ))}


                                    {showFullTable && null}

                                </tbody>
                            </table>

                            {/* ปุ่ม toggle */}
                            <div style={{ margin: '16px 0', textAlign: 'center' }}>
                                <button
                                    className="recommendation-action-btn"
                                    onClick={() => setShowFullTable(!showFullTable)}
                                >
                                    {showFullTable ? 'ซ่อนเพิ่มเติม' : 'แสดงเพิ่มเติม'}
                                </button>
                                </div>
                        </div>

                        {/* ตารางขวา (1/4) */}
                        <div className="result-table-block right">
                            <table className="result-table">
                                <thead>
                                    <tr>
                                        <th>สาเหตุที่สนับสนุนให้เกิด</th>
                                    </tr>
                                </thead>
                              {Array.isArray(topFeatures) ? (
  (showFullTable ? topFeatures : topFeatures.slice(0, 5)).map((item, index) => (
    <tr key={index}>
      <td>
        <strong>{item.feature}</strong><br />
        ค่าผู้ป่วย: {item.value}<br />
        ค่ามาตรฐาน: {globalAverages[item.feature] || "--"}<br />
        shap: {item.shap.toFixed(3)}
      </td>
    </tr>
  ))
) : (
  <tr>
    <td>ไม่พบข้อมูล SHAP</td>
  </tr>
)}

                            </table>
                            <div className="recommendation-feedback-section">
                                <div className="feedback-title">ข้อเสนอแนะ / บันทึกเพิ่มเติม</div>
                                <textarea
                                    className="feedback-textarea"
                                    placeholder="พิมพ์ข้อเสนอแนะหรือบันทึกเพิ่มเติมที่นี่..."
                                    rows="5"
                                ></textarea>
                                <button className="feedback-submit-btn">บันทึกข้อเสนอแนะ</button>
                            </div>

                        </div>

                    </div> {/* end .result-table-wrapper */}

                </div> {/* end .recommendation-result-section */}

            </div> {/* end .recommendation-page */}
            <Footer />
        </div>
    );
}

export default Recomendation;
