import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";
import UserDetails from "./components/UserDetails";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100 p-6">

          <Routes>
            <Route path="/" element={<UserList />} />
            <Route path="/add" element={<AddUser />} />
            <Route path="/user/:id" element={<UserDetails />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
