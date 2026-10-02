import { useEffect, useState } from "react";
import api from "../api/axios.js";
function Todo() {
  const [todos, setTodos] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await api.get("/getTodos");

        console.log("Fetched Todos:", response.data);

        setTodos(response.data.todos);
      } catch (error) {
        console.log("Error fetching todos:", error.message);
      }
    };

    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      if (editingId) {
        const response = await api.put(`/updateTodo/${editingId}`, {
          title,
          description,
        });

        setTodos(
          todos.map((todo) =>
            todo._id === editingId ? response.data.todo : todo,
          ),
        );

        setEditingId(null);
      } else {
        const response = await api.post("/createTodo", {
          title,
          description,
        });
        console.log("Created Todo:", response.data);
        setTodos([response.data.todo, ...todos]);
      }

      setTitle("");
      setDescription("");
    } catch (error) {
      console.log("error", error.message);
    }
  };
  const handleEdit = (todo) => {
    setEditingId(todo._id);
    setTitle(todo.title);
    setDescription(todo.description);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/deleteTodo/${id}`);

      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log("error", error.message);
    }
  };
  const handleDeleteAll = async () => {
    try {
      await api.delete("/deleteAllTodos");

      setTodos([]);
    } catch (error) {
      console.log("error", error.message);
      alert("Failed to delete all todos!");
    }
  };

  const filteredTodos = todos.filter((todo) =>
    (todo.title || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your daily tasks easily
            </p>
          </div>

          <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
            {todos.length} Tasks
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Create / Update Todo */}
          <section className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold">
                {editingId ? "Update Task" : "Create Task"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editingId
                  ? "Update your task details"
                  : "Add a new task to your list"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Task title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Learn React"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add some details..."
                  rows="4"
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
              >
                {editingId ? "Update Task" : "+ Add Task"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setTitle("");
                    setDescription("");
                  }}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </form>
          </section>

          {/* Todo List */}
          <section className="lg:col-span-2">
            {/* List Header */}
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold">Your Tasks</h2>

                <p className="mt-1 text-sm text-slate-500">
                  Stay organized and get things done
                </p>
              </div>

              {todos.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  className="rounded-xl cursor-pointer border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  Delete All
                </button>
              )}
            </div>

            {/* Search */}
            <div className="mb-5">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* Todos */}
            <div className="space-y-3">
              {filteredTodos.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                    ✓
                  </div>

                  <h3 className="text-lg font-semibold">No tasks found</h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Create a new task to get started.
                  </p>
                </div>
              ) : (
                filteredTodos.map((todo) => (
                  <div
                    key={todo._id}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex gap-4">
                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-800">
                          {todo.title}
                        </h3>

                        {todo.description && (
                          <p className="mt-1 text-sm text-slate-500">
                            {todo.description}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 items-start gap-2">
                        <button
                          onClick={() => handleEdit(todo)}
                          className="rounded-lg cursor-pointer px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(todo._id)}
                          className="rounded-lg cursor-pointer px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Todo;
