import React from "react";
import { Route, Routes } from "react-router-dom";
import { TodoRoute } from "./routes/TodoRoute.jsx";
import Todo from "./pages/Todo.jsx";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Todo />} />
      <Route path="/Todo/*" element={<TodoRoute />} />
    </Routes>
  );
};

export default App;
