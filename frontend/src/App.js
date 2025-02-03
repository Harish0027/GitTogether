import "./App.css";
import Store from "./utils/AppStore";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile/Profile";
import Home from "./pages/Home/Home";
import EditProfile from "./pages/EditProfile/EditProfile";
import ChatPage from "./pages/ChatPage/ChatPage";
import { Provider } from "react-redux";
import Feed from "./pages/Feed/Feed";
import GroupDetailsPopUp from "./components/GroupDetails/GroupDetailsPopUp";

function App() { 
  const [isLogin, setIsLogin] = useState(false);

  // Debugging information to check rendering and state changes
  useEffect(() => {
    console.log("App component mounted");
  }, []);

  return (
    <Provider store={Store}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Home setIsLogin={setIsLogin} isLogin={isLogin} />}
          />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/edit" element={<EditProfile />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:chatId" element={<ChatPage />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/group" element={<GroupDetailsPopUp/>} />
        </Routes>
        {/* Corrected the image URL */}
      </BrowserRouter>
    </Provider>
  );
}

export default App;
