import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UserDetails = () => {
    const { id } = useParams();
    const user = useSelector((state) =>
        state.users.users.find((u) => u.id === Number(id))
    );

    if (!user)
        return (<div className="text-center text-red-500 font-semibold text-lg">User not found</div>);

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg w-full max-w-lg mx-auto mt-10">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">{user.name}</h2>

            <div className="space-y-3">
                <div className="text-gray-700">
                    <span className="font-semibold text-gray-600">Name:</span> {user.name}
                </div>
                <div className="text-gray-700">
                    <span className="font-semibold text-gray-600">Email:</span> {user.email}
                </div>
                <div className="text-gray-700">
                    <span className="font-semibold text-gray-600">Phone:</span> {user.phone}
                </div>
                <div className="text-gray-700">
                    <span className="font-semibold text-gray-600">Address:</span> {user.address}
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
