import './App.css';
import React from 'react';
import {BrowserRouter, Routes,Route} from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage";
import UsersPage from "./Pages/UsersPage";
import UserPage from "./Pages/UserPage";
import ChatPage from "./Pages/ChatPage";
import ConversationsPage from "./Pages/ConversationsPage";
import Toolbar from "./Components/Toolbar";
import {useState} from "react";

export const NotificationContext = React.createContext();

function App() {
    const [notifications, setNotifications] = useState([]);
  return (
      <NotificationContext.Provider value={{ notifications, setNotifications }}>
          <div className="App">
            <BrowserRouter>
                <Toolbar/>
                <Routes>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/profile" element={<ProfilePage/>}/>
                    <Route path="/users" element={<UsersPage/>}/>
                    <Route path="/conversations" element={<ConversationsPage/>}/>
                    <Route path="/user/:username" element={<UserPage />} />
                    <Route path="/chat/:conversationId" element={<ChatPage />} />
            </Routes>
         </BrowserRouter>
        </div>
      </NotificationContext.Provider>
  );
}

export default App;
