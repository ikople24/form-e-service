import { useEffect, useState } from "react";

const RequestList = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3002/api/requests")
            .then(res => res.json())
            .then(data => setRequests(data));
    }, []);
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">รายการคำร้อง</h2>
            <ul className="space-y-2">
                {requests.map(req => (
                    <li key={req._id} className="p-4 border rounded shadow">
                        {req.type} - {req.fullname} - {req.phone}
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default RequestList