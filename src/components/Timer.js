// Timer.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DrawerAppBar from './Bar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Button, TextField, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PanToolIcon from '@mui/icons-material/PanTool';
import CircularProgress from '@mui/material/CircularProgress';
import Map from './Map';

const Timer = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [idNumber, setIdNumber] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      // fetchSessions();
      checkActiveSession(); // Check for any active session on load
    }
  }, [loggedIn]);

  const checkActiveSession = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/sessions/active/${idNumber}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        console.log(response);
        
        const activeSession = await response.json();
        console.log('',activeSession);
        
        if (activeSession) {
          setStartTime(new Date(activeSession.startTime));
          setEndTime(activeSession.endTime ? new Date(activeSession.endTime) : null);
        }
      }
    } catch (err) {
      console.error('Error fetching active session:', err);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/addhours`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNumber }),
        credentials: 'include',
      });

      if (response.ok) {
        setLoggedIn(true);
        toast.success("Login successful");
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (err) {
      console.error('Error logging in:', err);
    }
  };

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  };
  

  const handleStart = async () => {
    setLoading(true); // Bloquea el botón
    const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Jerusalem" });

    try {
      const userAgent = navigator.userAgent;
      console.log(userAgent);
      
      const location = await getUserLocation()
      const response = await fetch(`${process.env.REACT_APP_API}/sessions/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNumber, startTime: now, location, userAgent }),
        credentials: 'include',
      });

      if (response.ok) {
        setStartTime(now);
        toast.success('Session started successfully');
        setLocation(location)

      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (err) {
      console.error('Error starting session:', err);
      toast.error('Failed to get location or start session.');
    } finally {
      setLoading(false); // Desbloquea el botón
    }
  };

  const handleEnd = async () => {
    setLoading(true); // Bloquea el botón
    const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Jerusalem" });
    console.log(now);
    
    try {
      const location = await getUserLocation()
      const response = await fetch(`${process.env.REACT_APP_API}/sessions/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNumber, endTime: now, location }),
        credentials: 'include',
      });

      if (response.ok) {
        setEndTime(now);
        toast.success('Session ended successfully');
        // fetchSessions(); // Refresh sessions
        setLocation(location)
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (err) {
      console.error('Error ending session:', err);
      toast.error('Failed to get location or end session.');
    } finally {
      setLoading(false); // Desbloquea el botón
    }
  };

  // const fetchSessions = async () => {
  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_API}/sessions`, {
  //       credentials: 'include',
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setSessions(data);
  //     } else {
  //       toast.error('Failed to fetch sessions');
  //     }
  //   } catch (err) {
  //     console.error('Error fetching sessions:', err);
  //   }
  // };

  // const location = {
  //   latitude: 32.0853,
  //   longitude: 34.7818,
  // }
  return (
    <div>
      <DrawerAppBar />
      <Box
        display="flex"
        flexDirection={"column"}
        maxWidth={400}
        alignItems={"center"}
        justifyContent={"center"}
        margin={"auto"}
        marginTop={13}
        padding={3}
        borderRadius={5}
        boxShadow={"5px 5px 10px #ccc"}
        sx={{
          ":hover": {
            boxShadow: "10px 10px 20px #ccc"
          }
        }}
      >
        {!loggedIn ? (
          <Box display="flex" flexDirection={"column"}>
            <Typography variant="h2" padding={3} textAlign={"center"}>
              Login
            </Typography>
            <TextField
              onChange={(e) => setIdNumber(e.target.value)}
              value={idNumber}
              margin="normal"
              type="text"
              variant="outlined"
              placeholder="Enter your ID number"
            />
            <Button
              onClick={handleLogin}
              endIcon={<LoginIcon />}
              sx={{ marginTop: 3, borderRadius: 3 }}
              variant="contained"
              color="success"
            >
              Login
            </Button>
          </Box>
        ) : (
          <Box display="flex" flexDirection={"column"}>
            <Typography variant="h2" padding={3} textAlign={"center"}>
              Work Timer
            </Typography>
            {!startTime ? (
              <Button
                onClick={handleStart}
                endIcon={!loading && <AccessTimeIcon />}
                sx={{ marginTop: 3, borderRadius: 3 }}
                variant="contained"
                color="success"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Start Work'
                )}
              </Button>
            ) : !endTime ? (
              <Button
                onClick={handleEnd}
                endIcon={!loading && <PanToolIcon />}
                sx={{ marginTop: 3, borderRadius: 3 }}
                variant="contained"
                color="error"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'End Work'
                )}
              </Button>
            ) : (
              <Typography variant="subtitle1" padding={3} textAlign={"center"}>
                Session completed!
              </Typography>
            )}

            {/* <Typography variant="h6" padding={3} textAlign={"center"}>
              Your Work Sessions
            </Typography> */}
            <Button sx={{ marginTop: 3, borderRadius: 3 }} variant="outlined" color='success' component={Link} to={'/worksession'}> Your Work Sessions</Button>
            <ul>
              {sessions.map((session) => (
                <li key={session._id}>
                  {new Date(session.startTime).toLocaleString()} - {session.endTime ? new Date(session.endTime).toLocaleString() : "Ongoing"}
                </li>
              ))}
            </ul>
            {
              location ? (
                <Box
                  display="flex"
                  flexDirection={"column"}
                  maxWidth={400}
                  alignItems={"center"}
                  justifyContent={"center"}
                  margin={"auto"}
                >
                  <Typography variant="h3" padding={3} textAlign={"center"}>
                    Location Map
                  </Typography>
                  {/* <h1>Mapa de Ubicación</h1> */}
                  <Map latitude={location.latitude} longitude={location.longitude} />
                </Box>
              ) : (
                <p></p>
              )
            }

          </Box>
        )}
      </Box>
      <ToastContainer />
    </div>
  );
};

export default Timer;