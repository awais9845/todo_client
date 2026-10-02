import React from "react";
import { Route, Routes } from "react-router-dom";
import Todo from "../pages/Todo.jsx";

export const TodoRoute = () => {
  return (
    <Routes>
      <Route path="Todo" element={<Todo />} />
    </Routes>
  );
};
