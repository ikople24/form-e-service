import { useEffect, useState } from "react";

const RequestList = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/requests`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            })
            .then(data => setRequests(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">รายการคำร้อง</h2>

            {loading && <p>⏳ กำลังโหลดข้อมูล...</p>}
            {error && <p className="text-red-600">เกิดข้อผิดพลาด: {error}</p>}

            {!loading && !error && requests.length === 0 && (
                <p>ยังไม่มีคำร้องในระบบ</p>
            )}

            <ul className="space-y-2">
                {requests.map(req => (
                    <li key={req._id} className="p-4 border rounded shadow">
                        <strong>{req.type}</strong> - {req.fullname} - {req.phone}
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default RequestList;