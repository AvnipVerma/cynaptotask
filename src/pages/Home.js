import UserList from "../components/UserList";
import AddUser from "../components/AddUser"

const Home = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-4 p-4">
      <UserList />
      <AddUser />
    </div>
  );
};

export default Home;
