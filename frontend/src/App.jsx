import { useState, useEffect } from 'react';
import UserList from './components/UserList';
import UserModal from './components/UserModal';
import ConfirmationModal from './components/ConfirmationModal';
import { getUsers, addUser, deleteUser } from './api';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    getUsers().then(data => setUsers(data));
  }, []);

  const handleAddUser = (user) => {
    addUser(user).then(newUser => setUsers([...users, newUser]));
    setShowUserModal(false);
  };

  const handleDeleteUser = (id) => {
    deleteUser(id).then(() => setUsers(users.filter(user => user.id !== id)));
    setShowConfirmModal(false);
  };

  return (
    <div className="container">
      <h1>To-Do App</h1>
      <button className="btn btn-primary" onClick={() => setShowUserModal(true)}>
        Add User
      </button>
      
      <UserList 
        users={users} 
        setSelectedUser={setSelectedUser} 
        setShowConfirmModal={setShowConfirmModal}
      />
      
      <UserModal 
        show={showUserModal} 
        handleClose={() => setShowUserModal(false)} 
        handleAddUser={handleAddUser} 
      />
      
      <ConfirmationModal 
        show={showConfirmModal} 
        handleClose={() => setShowConfirmModal(false)} 
        handleConfirm={() => handleDeleteUser(selectedUser.id)}
        user={selectedUser}
      />
    </div>
  );
}

export default App;