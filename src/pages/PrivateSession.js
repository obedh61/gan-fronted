import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../components/Footer';
import DrawerAppBar from '../components/Bar';
import Map from '../components/Map'; // Importar el componente Map para mostrar ubicaciones
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import { useNavigate } from "react-router-dom";

const PrivateSession = () => {
  const [idNumber, setIdNumber] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [workers, setWorkers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null); // Para manejar la ubicación seleccionada
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [editTimeIn, setEditTimeIn] = useState('');
  const [editTimeOut, setEditTimeOut] = useState('');

  const navigate = useNavigate()

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API}/workers`);
        if (response.ok) {
          const data = await response.json();
          setWorkers(data);
        }
      } catch (err) {
        console.error('Error fetching workers:', err);
      }
    };
    fetchWorkers();
  }, []);

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

     // Convertimos timeIn y timeOut a objetos Date en la zona horaria Asia/Jerusalem
    const startDate = new Date(timeIn).toLocaleString("en-US", { timeZone: "Asia/Jerusalem" });
    const endDate = new Date(timeOut).toLocaleString("en-US", { timeZone: "Asia/Jerusalem" });

    // Convertir las fechas de nuevo a Date (para hacer cálculos de diferencia)
    const start = new Date(startDate);
    const end = new Date(endDate);
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

  const handleEditClick = (session) => {
    setEditingSession(session);
    setEditTimeIn(session.timeIn);
    setEditTimeOut(session.timeOut || '');
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditingSession(null);
    setEditTimeIn('');
    setEditTimeOut('');
  };

  const handleEditSubmit = async () => {
    if (!editTimeIn || !editTimeOut) {
      toast.error('Please fill in both Time In and Time Out.');
      return;
    }

    if (!editingSession._id) {
      toast.error('Session ID missing. Please re-fetch sessions and try again.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API}/sessions/${editingSession._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          timeIn: editTimeIn,
          timeOut: editTimeOut,
          day: editingSession.day,
          month: editingSession.month,
          year: editingSession.year,
        }),
      });

      if (response.ok) {
        toast.success('Session updated successfully.');
        handleEditClose();
        fetchSessions();
      } else {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          toast.error(data.message || 'Failed to update session.');
        } catch {
          toast.error('Failed to update session.');
        }
      }
    } catch (err) {
      console.error('Error updating session:', err);
      toast.error('Error updating session.');
    }
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
            <FormControl fullWidth margin="normal" sx={{ maxWidth: 300 }}>
              <InputLabel>Worker</InputLabel>
              <Select value={idNumber} onChange={(e) => setIdNumber(e.target.value)} label="Worker">
                {workers.map((w) => (
                  <MenuItem key={w.idNumber} value={w.idNumber}>{w.username}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" sx={{ maxWidth: 300 }}>
              <InputLabel>Year</InputLabel>
              <Select value={year} onChange={(e) => setYear(e.target.value)} label="Year">
                {Array.from({ length: 4 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <MenuItem key={y} value={y.toString()}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" sx={{ maxWidth: 300 }}>
              <InputLabel>Month</InputLabel>
              <Select value={month} onChange={(e) => setMonth(e.target.value)} label="Month">
                {[
                  { value: '1', label: 'January' },
                  { value: '2', label: 'February' },
                  { value: '3', label: 'March' },
                  { value: '4', label: 'April' },
                  { value: '5', label: 'May' },
                  { value: '6', label: 'June' },
                  { value: '7', label: 'July' },
                  { value: '8', label: 'August' },
                  { value: '9', label: 'September' },
                  { value: '10', label: 'October' },
                  { value: '11', label: 'November' },
                  { value: '12', label: 'December' },
                ].map((m) => (
                  <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
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
                  <TableCell>Actions</TableCell>
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
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleEditClick(session)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
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
      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Session</DialogTitle>
        <DialogContent>
          {editingSession && (
            <Typography variant="body2" sx={{ mb: 2, mt: 1 }}>
              Date: {editingSession.day}/{editingSession.month}/{editingSession.year}
            </Typography>
          )}
          <TextField
            label="Time In"
            type="time"
            value={editTimeIn}
            onChange={(e) => setEditTimeIn(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 60 }}
          />
          <TextField
            label="Time Out"
            type="time"
            value={editTimeOut}
            onChange={(e) => setEditTimeOut(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 60 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="success">Save</Button>
        </DialogActions>
      </Dialog>

      <Footer />
      <ToastContainer />
    </Box>
  );
};

export default PrivateSession;
