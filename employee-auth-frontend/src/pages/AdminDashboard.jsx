import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

function AdminDashboard() {
  // ------------------- State Variables -------------------
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [search, setSearch] = useState('');
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const token = localStorage.getItem('token');

  // ------------------- Fetch Users -------------------
  const fetchUsers = async (searchValue = '') => {
    try {
      const query = `http://localhost:5000/api/admin/users?page=${page}&limit=${limit}${
        searchValue ? `&search=${encodeURIComponent(searchValue)}` : ''
      }`;

      const res = await fetch(query, {
        headers: {
          'Content-Type': 'application/json',
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

  // ------------------- Fetch Department/Designation Options -------------------
  const fetchOptions = async () => {
    try {
      const [deptRes, desigRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/departments', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/api/admin/designations', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const deptData = await deptRes.json();
      const desigData = await desigRes.json();

      setDepartments(deptData);
      setDesignations(desigData);
    } catch (err) {
      console.error('Failed to fetch options:', err);
    }
  };

  // ------------------- Delete User -------------------
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');

      setMessage('✅ User deleted');
      fetchUsers(search);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  // ------------------- Edit User -------------------
  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setEditData({
      username: user.username,
      email: user.email,
      role: user.role,
      department: user.department_id || '',
      designation: user.designation_id || '',
    });
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
      fetchUsers(search);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditData({});
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(search);
  };

  // ------------------- Lifecycle -------------------
  useEffect(() => {
    fetchUsers(search);
  }, [page]);

  useEffect(() => {
    fetchOptions();
  }, []);

  // ------------------- Render -------------------
  return (
    <div style={{ padding: '20px' }}>
      <Navbar />
      <h2>Admin Dashboard</h2>

      {/* Message Feedback */}
      {message && <p>{message}</p>}

      {/* Search Form */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
        {/* Search Bar */}
{/* Search Bar */}
<form
  onSubmit={handleSearchSubmit}
  style={{
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '10px',
  }}
>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <input
      type="text"
      placeholder="Search by username or email ..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        padding: '6px 10px',
        width: '250px',
        border: '1px solid #ccc',
        borderRight: 'none',
        borderTopLeftRadius: '4px',
        borderBottomLeftRadius: '4px',
        lineHeight: '1.5',
        verticalAlign: 'middle'

      }}
    />
    <button
      type="submit"
      style={{
        padding: '10px 12px',
        fontSize: '14px',
        border: '1px solid #ccc',
        borderLeft: 'none',
        borderTopRightRadius: '4px',
        borderBottomRightRadius: '4px',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        lineHeight: '1.5',
        verticalAlign: 'middle'
      }}
    >
      Search
    </button>
  </div>
</form>


      </div>

      {/* Users Table */}
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>

                {editingUser === user.id ? (
                  <>
                    <td>
                      <input
                        name="username"
                        value={editData.username}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        name="email"
                        value={editData.email}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <select name="role" value={editData.role} onChange={handleEditChange}>
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                        <option value="superadmin">superadmin</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={editData.department || ''}
                        onChange={(e) =>
                          setEditData({ ...editData, department: parseInt(e.target.value) })
                        }
                      >
                        <option value="">-- Select --</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={editData.designation || ''}
                        onChange={(e) =>
                          setEditData({ ...editData, designation: parseInt(e.target.value) })
                        }
                      >
                        <option value="">-- Select --</option>
                        {designations.map((des) => (
                          <option key={des.id} value={des.id}>
                            {des.name}
                          </option>
                        ))}
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
                    <td>{user.department || '-'}</td>
                    <td>{user.designation || '-'}</td>
                    <td>
                      <button onClick={() => handleEditClick(user)}>Edit</button>
                      <button onClick={() => handleDelete(user.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No users found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: '10px' }}>
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {page} of {totalPages}
        </span>
        <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;


