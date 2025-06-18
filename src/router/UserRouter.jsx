import React from "react";
import { Routes, Route } from "react-router-dom";
import Bienvenida from "../pages/Users/Bienvenida";

const UserRouter = () => (
  <Routes>
    <Route path="/bienvenida" element={<Bienvenida />} />
  </Routes>
);

export default UserRouter;
