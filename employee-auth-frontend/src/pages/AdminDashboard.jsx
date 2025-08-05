import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({});

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch users');

      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');

      setMessage('✅ User deleted');
      fetchUsers();
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setEditData({ username: user.username, email: user.email, role: user.role });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      setMessage('✅ User updated');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditData({});
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  return (
    <div>
      <Navbar /> {/* ✅ Display the navbar */}
      <h2>Admin Dashboard</h2>
      {message && <p>{message}</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                {editingUser === user.id ? (
                  <>
                    <td><input name="username" value={editData.username} onChange={handleEditChange} /></td>
                    <td><input name="email" value={editData.email} onChange={handleEditChange} /></td>
                    <td>
                      <select name="role" value={editData.role} onChange={handleEditChange}>
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => handleEditSubmit(user.id)}>Save</button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button onClick={() => handleEditClick(user)}>Edit</button>
                      <button onClick={() => handleDelete(user.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr><td colSpan="5">No users found</td></tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: '10px' }}>
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
        <span style={{ margin: '0 10px' }}>Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}

export default AdminDashboard;

