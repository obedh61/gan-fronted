import React, { useState } from "react";
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../components/Footer';
import DrawerAppBar from '../components/Bar';
import Map from '../components/Map'; // Importar el componente Map para mostrar ubicaciones
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import { useNavigate } from "react-router-dom";

const PrivateSession = () => {
  const [idNumber, setIdNumber] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [sessions, setSessions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null); // Para manejar la ubicación seleccionada

  const navigate = useNavigate()

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/sessions/private/${idNumber}/${year}/${month}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      } else {
        toast.error('Failed to fetch sessions for the given month and year.');
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      toast.error('Error fetching sessions.');
    }
  };

  const calculateTotalTime = (timeIn, timeOut) => {
    if (!timeOut) return "Ongoing";

    const start = new Date(timeIn);
    const end = new Date(timeOut);
    const durationMs = end - start;

    if (durationMs <= 0) return "Invalid time";

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.ceil((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const calculateTotalHours = () => {
    let totalHours = 0;
    let totalMinutes = 0;

    sessions.forEach((session) => {
      const totalTime = calculateTotalTime(
        new Date(`${session.year}-${String(session.month).padStart(2, '0')}-${String(session.day).padStart(2, '0')}T${session.timeIn}`),
        session.timeOut ? new Date(`${session.year}-${String(session.month).padStart(2, '0')}-${String(session.day).padStart(2, '0')}T${session.timeOut}`) : null
      );

      const match = totalTime.match(/(\d+)h (\d+)m/);
      if (match) {
        totalHours += parseInt(match[1], 10);
        totalMinutes += parseInt(match[2], 10);
      }
    });

    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    return `${totalHours}h ${totalMinutes}m`;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flexGrow: 1 }}>
        <DrawerAppBar />
        <Box sx={{ padding: 4 }}>
          <Typography variant="h4" align="center" gutterBottom color="#4A7B59">
            Work Sessions Report
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center">
            <TextField label="ID Number" variant="outlined" margin="normal" onChange={(e) => setIdNumber(e.target.value)} value={idNumber} />
            <TextField label="Year" variant="outlined" margin="normal" type="number" onChange={(e) => setYear(e.target.value)} value={year} />
            <TextField label="Month" variant="outlined" margin="normal" type="number" onChange={(e) => setMonth(e.target.value)} value={month} />
            <Button variant="contained" color="success" sx={{ marginTop: 2 }} onClick={fetchSessions}>
              Get Sessions
            </Button>
            <Button
              key="sign out"
              sx={{ color: '#fff', margin: 2 }}
              component={Button}
              color="secondary"
              variant="contained"
              endIcon={<DashboardCustomizeIcon />}
              onClick={() => {
                navigate('/admin');
              }}
            >
              {"Dasboard"}
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ marginTop: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Day</TableCell>
                  <TableCell>Month</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Time In</TableCell>
                  <TableCell>Time Out</TableCell>
                  <TableCell>Total Hours</TableCell>
                  <TableCell>Start Location</TableCell>
                  <TableCell>End Location</TableCell>
                  <TableCell>User Agent</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.map((session, index) => {
                  const timeIn = new Date(
                    `${session.year}-${String(session.month).padStart(2, '0')}-${String(session.day).padStart(2, '0')}T${session.timeIn}`
                  );
                  const timeOut = session.timeOut
                    ? new Date(
                        `${session.year}-${String(session.month).padStart(2, '0')}-${String(session.day).padStart(2, '0')}T${session.timeOut}`
                      )
                    : null;

                  const totalTime = calculateTotalTime(timeIn, timeOut);

                  return (
                    <TableRow key={index}>
                      <TableCell>{session.day}</TableCell>
                      <TableCell>{session.month}</TableCell>
                      <TableCell>{session.year}</TableCell>
                      <TableCell>{session.timeIn}</TableCell>
                      <TableCell>{session.timeOut || "Ongoing"}</TableCell>
                      <TableCell>{totalTime}</TableCell>
                      <TableCell>
                        {session.locationStart ? (
                          <Button variant="contained" size="small" onClick={() => setSelectedLocation(session.locationStart)}>
                            View Map
                          </Button>
                        ) : "N/A"}
                      </TableCell>
                      <TableCell>
                        {session.locationEnd ? (
                          <Button variant="contained" size="small" color="secondary" onClick={() => setSelectedLocation(session.locationEnd)}>
                            View Map
                          </Button>
                        ) : "N/A"}
                      </TableCell>
                      <TableCell>{session.userAgent || "N/A"}</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell colSpan={5} align="right"><strong>Total Hours:</strong></TableCell>
                  <TableCell>{calculateTotalHours()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {selectedLocation && (
            <Box marginTop={4}>
              <Typography variant="h5" align="center">Location Map</Typography>
              <Map latitude={selectedLocation.latitude} longitude={selectedLocation.longitude} />
              <Button variant="outlined" color="error" onClick={() => setSelectedLocation(null)}>
                Close Map
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <Footer />
      <ToastContainer />
    </Box>
  );
};

export default PrivateSession;
