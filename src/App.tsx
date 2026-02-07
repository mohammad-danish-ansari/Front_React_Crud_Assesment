import React, { Suspense } from "react";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const UserForm = React.lazy(() => import("./components/UserForm"));
const UserList = React.lazy(() => import("./components/UserList"));

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/usersList" replace />} />
          <Route path="/usersList" element={<UserList />} />
          <Route path="/usersForm" element={<UserForm />} />
          <Route path="*" element={<Navigate to="/usersList" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
