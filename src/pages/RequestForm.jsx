import { useState } from "react";
import Swal from "sweetalert2";
import {
  Copy,
  Construction,
  TreePine,
  Speaker,
  Users,
  FilePlus,
  Shovel,
} from "lucide-react";

import html2pdf from "html2pdf.js";

export default function RequestForm() {
  const [formData, setFormData] = useState({
    type: "",
    fullname: "",
    address: "",
    phone: "",
    signature: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setFormData((prev) => ({ ...prev, type }));
    setShowForm(true);
  };

  const generatePDF = (data) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const template = `
      <div style="padding: 40px; font-family: Arial; font-size: 14px;">
        <h1 style="color: purple; margin-bottom: 4px;">เทศบาลเมืองตาคลี</h1>
        <h2 style="text-align: center; margin-bottom: 4px;">${data.type}</h2>
        <p style="text-align: right; margin-bottom: 4px;">วันที่: ${formattedDate}</p>
        <p style="margin-bottom: 4px;">เรื่อง: ${data.type}</p>
        <p style="margin-bottom: 4px;">เรียน: นายกเทศมนตรีเมืองตาคลี</p>
        <p style="margin-bottom: 6px;">ข้าพเจ้า: ${data.fullname}</p>
        <p style="margin-bottom: 4px;">ที่อยู่: ${data.address}</p>
        <p style="margin-bottom: 4px;">รายละเอียด: ${data.signature}</p>
        <p style="margin-bottom: 4px;">เบอร์โทร: ${data.phone}</p>
        <br/><br/>
        <p style="text-align: right; margin-bottom: 4px;">ลงชื่อ ______________________</p>
      </div>
    `;

    html2pdf()
      .from(template)
      .set({
        margin: 1,
        filename: "คำร้อง.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait" },
      })
      .save();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fields = ["fullname", "address", "phone", "signature"];
    for (const field of fields) {
      if (!formData[field]) {
        const fieldLabels = {
          fullname: "ชื่อ-นามสกุล",
          address: "ที่อยู่",
          phone: "เบอร์โทร",
          signature: "รายละเอียด",
        };
        await Swal.fire({
          icon: "warning",
          title: `ท่านยังกรอกข้อมูลไม่ครบ (${fieldLabels[field]})`,
          confirmButtonColor: "#f59e0b",
        });
        document.querySelector(`[name="${field}"]`).focus();
        return;
      }
    }

    try {
      const res = await fetch("https://form-e-service-production.up.railway.app/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        const message = `
📢 <b>มีคำร้องใหม่</b>
ประเภท: ${formData.type}
ชื่อ: ${formData.fullname}
ที่อยู่: ${formData.address}
เบอร์โทร: ${formData.phone}
รายละเอียด: ${formData.signature}`;
        await sendTelegram(message);

        await Swal.fire({
          icon: "success",
          title: "ส่งข้อมูลคำร้องสำเร็จ",
          confirmButtonText: "ตกลง",
          customClass: {
            confirmButton:
              "bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded",
          },
        });
        generatePDF(formData);
        setFormData({ type: "", fullname: "", address: "", phone: "", signature: "" });
        setShowForm(false);
        setSelectedType("");
      } else {
        await Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: result.error || "โปรดลองใหม่อีกครั้ง",
          confirmButtonColor: "#d33",
        });
      }
    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: "error",
        title: "เชื่อมต่อ server ไม่สำเร็จ",
        text: err.message,
        confirmButtonColor: "#d33",
      });
    }
  };

  const sendTelegram = async (message) => {
    const TOKEN = "7842874628:AAFncDibUG7Y6FBg_s3AEJrRBcYriKTyR_8";
    const CHAT_ID = "-1002529162161";
    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: "HTML" }),
    });
  };

  const types = [
    { type: "คัดสำเนา", icon: <Copy className="w-8 h-8" /> },
    { type: "ขอขุดดิน", icon: <Shovel className="w-8 h-8" /> },
    { type: "ขอถมดิน", icon: <FilePlus className="w-8 h-8" /> },
    { type: "ขออนุญาตก่อสร้าง", icon: <Construction className="w-8 h-8" /> },
    { type: "ขอใช้กำลังอปพร", icon: <Users className="w-8 h-8" /> },
    { type: "ขอใช้เสียง", icon: <Speaker className="w-8 h-8" /> },
    { type: "ขออนุญาตตัดต้นไม้", icon: <TreePine className="w-8 h-8" /> },
  ];

  return (
    <div> {/* UI rendering omitted for brevity */} </div>
  );
}
