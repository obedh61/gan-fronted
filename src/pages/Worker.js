// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Timer from './Timer';

const App = () => {
  const { t } = useTranslation()
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
      alert(t('worker.simpleTracker.idRequired'));
      return;
    }
    axios
      .post('http://localhost:5000/sessions', { idNumber })
      .then(() => setAuthenticated(true))
      .catch((error) => {
        console.error('Error authenticating user:', error);
        alert(t('worker.simpleTracker.userNotFound'));
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
      <h1>{t('worker.simpleTracker.title')}</h1>
      {!authenticated ? (
        <div>
          <input
            type="text"
            placeholder={t('worker.simpleTracker.idPlaceholder')}
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
          />
          <button onClick={authenticateUser}>{t('worker.simpleTracker.logIn')}</button>
        </div>
      ) : (
        <>
          <Timer onSave={addSession} />
          <h2>{t('worker.simpleTracker.sessionsTitle')}</h2>
          <ul>
            {sessions.map((session) => (
              <li key={session._id}>
                {t('worker.simpleTracker.sessionRange', {
                  start: new Date(session.startTime).toLocaleString(),
                  end: new Date(session.endTime).toLocaleString()
                })}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default App;
