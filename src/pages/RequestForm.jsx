import { useState } from 'react';

export default function RequestForm() {
  const [formData, setFormData] = useState({
    type: '',
    fullname: '',
    address: '',
    phone: '',
    signature: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      if (result.success) {
        alert('ส่งคำร้องสำเร็จ!');
        setFormData({ type: '', fullname: '', address: '', phone: '', signature: '' });
      } else {
        alert('เกิดข้อผิดพลาด');
      }
    } catch (err) {
      console.error(err);
      alert('เชื่อมต่อ server ไม่สำเร็จ');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-lg mx-auto p-6 bg-white rounded shadow-lg"
    >
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">ฟอร์มคำร้อง</h2>

      <div>
        <label className="block text-sm font-medium mb-1">ประเภทคำร้อง</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">เลือกประเภทคำร้อง</option>
          <option value="คัดสำเนา">คัดสำเนา</option>
          <option value="ขอขุดดิน">ขอขุดดิน</option>
          <option value="ขอถมดิน">ขอถมดิน</option>
          <option value="ขออนุญาตก่อสร้าง">ขออนุญาตก่อสร้าง</option>
          <option value="ขอใช้กำลังอปพร">ขอใช้กำลังอปพร</option>
          <option value="ขอใช้เสียง">ขอใช้เสียง</option>
          <option value="ขออนุญาตตัดต้นไม้">ขออนุญาตตัดต้นไม้</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">ชื่อ-นามสกุล</label>
        <input
          type="text"
          name="fullname"
          placeholder="ชื่อ-นามสกุล"
          value={formData.fullname}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">ที่อยู่</label>
        <textarea
          name="address"
          placeholder="ที่อยู่"
          value={formData.address}
          onChange={handleChange}
          required
          rows="3"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">เบอร์โทร</label>
        <input
          type="tel"
          name="phone"
          placeholder="เบอร์โทร"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">ลงชื่อ</label>
        <input
          type="text"
          name="signature"
          placeholder="ลงชื่อ"
          value={formData.signature}
          onChange={handleChange}
          required
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
  );
}
