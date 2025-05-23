import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [usersPerPage, setUsersPerPage] = useState(25);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [voiceChats, setVoiceChats] = useState([]);
  const [loadingVoiceChat, setLoadingVoiceChat] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chats, setChats] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [searchType, setSearchType] = useState('id');

  useEffect(() => {
    fetchUsers();
  }, [currentPage, usersPerPage, searchQuery]);

  useEffect(() => {
    if (selectedUser && showVoiceChat) {
      fetchVoiceChats();
    }
  }, [selectedUser, showVoiceChat]);

  useEffect(() => {
    if (selectedUser && showChat) {
      fetchChats();
    }
  }, [selectedUser, showChat]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        per_page: usersPerPage,
        ...(searchQuery && { 
          search_type: searchType,
          search: searchQuery 
        })
      });
      
      const url = `${process.env.REACT_APP_BASE_URL}/database_view?${params}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("data", data);
      
      if (!data.users) {
        throw new Error('Invalid response format');
      }

      setUsers(data.users);
      setTotalPages(data.total_pages);
      setTotalUsers(data.total_users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setTotalPages(0);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchVoiceChats = async () => {
    if (!selectedUser) return;
    
    try {
      setLoadingVoiceChat(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/voice-record/${selectedUser.id}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Voice chat data:", data.data.voice_chat);
      setVoiceChats(data.data.voice_chat || []);
    } catch (error) {
      console.error('Error fetching voice chats:', error);
      setVoiceChats([]);
    } finally {
      setLoadingVoiceChat(false);
    }
  };

  const fetchChats = async () => {
    if (!selectedUser) return;
    
    try {
      setLoadingChat(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/chat-record/${selectedUser.id}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Chat data:", data);
      setChats(data.data.chat_history || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setChats([]);
    } finally {
      setLoadingChat(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleUsersPerPageChange = (event) => {
    setUsersPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchUsers();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchUsers();
  };

  return (
    <div className="users-container">
      {selectedUser ? (
        <>
          <div className="users-header">
            <h1>User Details</h1>
            <button onClick={handleBackToList} className="back-button">
              <i className="fas fa-arrow-left"></i> Back to Users List
            </button>
          </div>
          <div className="user-details-card">
            <h2>User Information</h2>
            <div className="details-grid">
              <div className="detail-item">
                <div className="detail-label">User ID</div>
                <div className="detail-value">{selectedUser.id}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Name</div>
                <div className="detail-value">{selectedUser.name || 'N/A'}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Email</div>
                <div className="detail-value">{selectedUser.email || 'N/A'}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Address</div>
                <div className="detail-value">{selectedUser.address || 'N/A'}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Monthly Bill</div>
                <div className="detail-value">{selectedUser.monthly_bill || 'N/A'}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Freshsales Contact ID</div>
                <div className="detail-value">{selectedUser.freshsales_contact_id || 'N/A'}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Freshsales Account ID</div>
                <div className="detail-value">{selectedUser.freshsales_account_id || 'N/A'}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Freshsales Deal ID</div>
                <div className="detail-value">{selectedUser.freshsales_deal_id || 'N/A'}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Created At</div>
                <div className="detail-value">{selectedUser.created_at || 'N/A'}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Proposal Status</div>
                <div className="detail-value">{selectedUser.status || 'N/A'}</div>
              </div>
            </div>
          </div>
          <div className="voice-chat-section">
            <div className="accordion">
              <div className="accordion-header" onClick={() => setShowVoiceChat(!showVoiceChat)}>
                <h2>Voice Chat History</h2>
                <span className={`accordion-icon ${showVoiceChat ? 'expanded' : ''}`}>
                  {showVoiceChat ? (
                    <i className="fas fa-chevron-up"></i>
                  ) : (
                    <i className="fas fa-chevron-down"></i>
                  )}
                </span>
              </div>
              {showVoiceChat && (
                <div className="accordion-content">
                  {loadingVoiceChat ? (
                    <div>Loading voice chat history...</div>
                  ) : voiceChats.length > 0 ? (
                    <div className="voice-chat-list">
                      {voiceChats.map((chat, index) => (
                        <div key={index} className={`voice-chat-item ${chat.assistant ? 'assistant-message' : 'user-message'}`}>
                          <div className="chat-header">
                            <span className="chat-role">
                              {chat.assistant ? 'Assistant' : 'User'}
                            </span>
                          </div>
                          <div className="chat-message">
                            {chat.assistant || chat.user}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-chats">No voice chat history available</div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="chat-section">
            <div className="accordion">
              <div className="accordion-header" onClick={() => setShowChat(!showChat)}>
                <h2>Chat History</h2>
                <span className={`accordion-icon ${showChat ? 'expanded' : ''}`}>
                  {showChat ? (
                    <i className="fas fa-chevron-up"></i>
                  ) : (
                    <i className="fas fa-chevron-down"></i>
                  )}
                </span>
              </div>
              {showChat && (
                <div className="accordion-content">
                  {loadingChat ? (
                    <div>Loading Chat history...</div>
                  ) : chats.length > 0 ? (
                    <div className="voice-chat-list">
                      {chats.map((chat, index) => (
                        <div key={index} className={`voice-chat-item ${chat.role === 'assistant' ? 'assistant-message' : 'user-message'}`}>
                          <div className="chat-header">
                            <span className="chat-role">
                              {chat.role === 'assistant' ? 'Assistant' : 'User'}
                            </span>
                          </div>
                          <div className="chat-message">
                            {chat.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-chats">No chat history available</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="users-header">
            <h1>Database</h1>
            <div className="users-controls">
              <div className="controls-left">
                <form onSubmit={handleSearch} className="search-form">
                  <select 
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="search-type-select"
                  >
                    <option value="id">ID</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                  </select>
                  <input
                    type="text"
                    placeholder={`Search by ${searchType}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="search-button">Find</button>
                  {searchQuery && (
                    <button 
                      type="button" 
                      className="clear-button"
                      onClick={handleClearSearch}
                    >
                      Clear
                    </button>
                  )}
                </form>
                <span className="total-users">Total Users: {totalUsers}</span>
              </div>
              <div className="controls-right">
                <div className="pagination">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                  >
                    Previous
                  </button>
                  <span className="page-info">Page {currentPage} of {totalPages}</span>
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                  >
                    Next
                  </button>
                </div>
                <div className="users-per-page">
                  <label>Users per page: </label>
                  <select 
                    value={usersPerPage} 
                    onChange={handleUsersPerPageChange}
                    className="users-select"
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>ADDRESS</th>
                    <th>MONTHLY BILL</th>
                    <th>FRESHSALES CONTACT ID</th>
                    <th>CREATED AT</th>
                    <th>PROPOSAL STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>
                        <span 
                          className="clickable-id" 
                          onClick={() => handleUserClick(user)}
                          style={{ cursor: 'pointer', color: 'blue' }}
                        >
                          {user.id}
                        </span>
                      </td>
                      <td>{user.name || 'N/A'}</td>
                      <td>{user.email || 'N/A'}</td>
                      <td>{user.address}</td>
                      <td>{user.monthly_bill}</td>
                      <td>{user.freshsales_contact_id || 'N/A'}</td>
                      <td>{user.created_at || 'N/A'}</td>
                      <td>{user.status || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination navigate">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Users;
