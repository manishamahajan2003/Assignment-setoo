import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000/api/items";

export default function App() {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchItems = async () => {
    const res = await axios.get(API);
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await axios.post(API, { title });
    setTitle("");
    fetchItems();
  };

  const updateItem = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await axios.put(`${API}/${editId}`, { title });
    setEditId(null);
    setTitle("");
    fetchItems();
  };

  const deleteItem = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchItems();
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setTitle(item.title);
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2>CRUD App Assignment</h2>

        <form
          className="form"
          onSubmit={editId ? updateItem : addItem}
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter item name"
          />

          <button type="submit">
            {editId ? "Update" : "Add"}
          </button>

          {editId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditId(null);
                setTitle("");
              }}
            >
              Cancel
            </button>
          )}
        </form>

        <ul className="list">
          {items.length === 0 && (
            <p className="empty">No items found</p>
          )}

          {items.map((item) => (
            <li key={item._id} className="list-item">
              <span>{item.title}</span>
              <div className="actions">
                <button
                  className="edit-btn"
                  onClick={() => startEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteItem(item._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
