import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !email || !phone || !address) return;

        dispatch(addUser({ id: Date.now(), name, email, phone, address }));
        navigate("/");
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4">Add User</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    className="w-full p-2 border rounded-md"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className="w-full p-2 border rounded-md"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="w-full p-2 border rounded-md"
                    type="number"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <input
                    className="w-full p-2 border rounded-md"
                    type="text"
                    placeholder="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <button className="w-full bg-gray-500 text-white p-2 rounded-md">Add User</button>
            </form>
        </div>
    );
};

export default AddUser;
