// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Timer from './Timer';

const App = () => {
  const [sessions, setSessions] = useState([]);
  const [idNumber, setIdNumber] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  // Fetch sessions after authentication
  useEffect(() => {
    if (authenticated) {
      axios
        .get('http://localhost:5000/sessions', {
          headers: { 'Content-Type': 'application/json' },
          data: { idNumber },
        })
        .then((response) => setSessions(response.data))
        .catch((error) => console.error('Error fetching sessions:', error));
    }
  }, [authenticated, idNumber]);

  const authenticateUser = () => {
    if (!idNumber) {
      alert('Please enter your ID number');
      return;
    }
    axios
      .post('http://localhost:5000/sessions', { idNumber })
      .then(() => setAuthenticated(true))
      .catch((error) => {
        console.error('Error authenticating user:', error);
        alert('Authentication failed: User not found');
      });
  };

  const addSession = (startTime, endTime) => {
    axios
      .post('http://localhost:5000/sessions', { idNumber, startTime, endTime })
      .then((response) => setSessions([...sessions, response.data]))
      .catch((error) => console.error('Error adding session:', error));
  };

  return (
    <div className="App">
      <h1>Work Hours Tracker</h1>
      {!authenticated ? (
        <div>
          <input
            type="text"
            placeholder="Enter your ID number"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
          />
          <button onClick={authenticateUser}>Log In</button>
        </div>
      ) : (
        <>
          <Timer onSave={addSession} />
          <h2>Work Sessions</h2>
          <ul>
            {sessions.map((session) => (
              <li key={session._id}>
                Start: {new Date(session.startTime).toLocaleString()} - End: {new Date(session.endTime).toLocaleString()}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default App;
