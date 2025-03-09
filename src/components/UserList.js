import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteUser } from "../redux/userSlice";
import { useState } from "react";

const UserList = () => {
  const users = useSelector((state) => state.users.users);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg w-full">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Email Address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full sm:w-2/3 md:w-1/2"
        />
        <Link to="/add" className="bg-gray-300 text-black font-bold tracking-wide px-6 py-2 rounded-md ">CREATE</Link>
      </div>
      <div className="hidden md:block">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Phone</th>
              <th className="border border-gray-300 p-2" colSpan="2">Actions</th>
            </tr>
            <tr className="bg-gray-100">          
             
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="text-center">
                <td className="border border-gray-300 p-2">{user.name}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.phone}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => dispatch(deleteUser(user.id))}
                  >
                    DELETE
                  </button>
                </td>
                <td className="border border-gray-300 p-2">
                  <Link to={`/user/${user.id}`} className="text-blue-500 hover:underline">DETAILS</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <div className="md:hidden space-y-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="border border-gray-300 p-4 rounded-md shadow">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <div className="flex justify-between mt-2">
              <button className="text-red-500 hover:underline"
                onClick={() => dispatch(deleteUser(user.id))}>DELETE</button>
              <Link to={`/user/${user.id}`} className="text-blue-500 hover:underline">DETAILS</Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default UserList;
