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

    // เช็คว่าข้อมูลครบไหม + focus ช่องแรกที่เว้นว่าง
    if (!formData.fullname) {
      await Swal.fire({
        icon: "warning",
        title: "ท่านยังกรอกข้อมูลไม่ครบ (ชื่อ-นามสกุล)",
        confirmButtonColor: "#f59e0b",
      });
      document.querySelector('input[name="fullname"]').focus();
      return;
    }

    if (!formData.address) {
      await Swal.fire({
        icon: "warning",
        title: "ท่านยังกรอกข้อมูลไม่ครบ (ที่อยู่)",
        confirmButtonColor: "#f59e0b",
      });
      document.querySelector('textarea[name="address"]').focus();
      return;
    }

    if (!formData.phone) {
      await Swal.fire({
        icon: "warning",
        title: "ท่านยังกรอกข้อมูลไม่ครบ (เบอร์โทร)",
        confirmButtonColor: "#f59e0b",
      });
      document.querySelector('input[name="phone"]').focus();
      return;
    }

    if (!formData.signature) {
      await Swal.fire({
        icon: "warning",
        title: "ท่านยังกรอกข้อมูลไม่ครบ (รายละเอียด)",
        confirmButtonColor: "#f59e0b",
      });
      document.querySelector('textarea[name="signature"]').focus();
      return;
    }

    // ✅ ถ้าข้อมูลครบ → ส่งข้อมูลตามปกติ
    try {
      const res = await fetch("http://localhost:3002/api/request", {
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
            รายละเอียด: ${formData.signature}
              `;
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
        generatePDF(formData); // 📝 เรียกฟังก์ชันตรงนี้
        setFormData({
          type: "",
          fullname: "",
          address: "",
          phone: "",
          signature: "",
        });
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
    const TOKEN = "7842874628:AAFncDibUG7Y6FBg_s3AEJrRBcYriKTyR_8"; // ใส่ TOKEN ที่ได้จาก BotFather
    const CHAT_ID = "-1002529162161"; // ใส่ chat id

    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });
  };

  // เพิ่ม array types สำหรับปุ่มแต่ละประเภท
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
    <>
      <div className="max-w-lg mx-auto p-6 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          เลือกประเภทคำร้อง
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {types.map(({ type, icon }) => (
            <button
              key={type}
              onClick={() => handleTypeSelect(type)}
              className="flex items-center justify-start gap-2 p-3 rounded-lg bg-white bg-opacity-30 backdrop-blur hover:bg-opacity-70 hover:scale-110 hover:text-purple-600 hover:bg-purple-100 md:hover:bg-purple-200 md:hover:text-purple-700 transition transform duration-300 shadow-md text-gray-800 w-full"
            >
              {icon}
              <span className="font-medium">{type}</span>
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-center text-blue-600 mb-4">
              ฟอร์มคำร้อง ({selectedType})
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  ชื่อ-นามสกุล
                </label>
                <input
                  type="text"
                  name="fullname"
                  placeholder="ชื่อ-นามสกุล"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  ที่อยู่
                </label>
                <textarea
                  name="address"
                  placeholder="ที่อยู่"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  เบอร์โทร
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="เบอร์โทร"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  ระบุรายละเอียด
                </label>
                <textarea
                  name="signature"
                  placeholder="ระบุรายละเอียด"
                  value={formData.signature}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                ส่งคำร้อง
              </button>
            </form>
          </div>
        </div>
      )}
      <footer className="text-center text-gray-500 text-sm py-4">
        © 2024 Takhli Smart City. All rights reserved.
      </footer>
      <div id="pdfTemplate" className="hidden p-6">
        <h1 className="text-xl font-bold text-center mb-4">
          ใบคำร้อง ({formData.type})
        </h1>
        <p>
          <strong>ชื่อ-นามสกุล:</strong> {formData.fullname}
        </p>
        <p>
          <strong>ที่อยู่:</strong> {formData.address}
        </p>
        <p>
          <strong>เบอร์โทร:</strong> {formData.phone}
        </p>
        <p>
          <strong>รายละเอียด:</strong> {formData.signature}
        </p>
        <p className="mt-4 text-right">ลงชื่อ: ____________________</p>
      </div>
    </>
  );
}
