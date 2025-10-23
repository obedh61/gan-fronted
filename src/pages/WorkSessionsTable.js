import React, { useState } from "react";
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../components/Footer';
import DrawerAppBar from '../components/Bar';

const WorkSessionsTable = () => {
  const [idNumber, setIdNumber] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [sessions, setSessions] = useState([]);

  // Function to fetch the session data based on the year, month, and idNumber
  const fetchSessions = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/sessions/${idNumber}/${year}/${month}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setSessions(data);
      } else {
        toast.error('Failed to fetch sessions for the given month and year.');
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      toast.error('Error fetching sessions.');
    }
  };

  // Helper function to calculate total time in a readable format (hours:minutes), excluding seconds and rounding up minutes
  const calculateTotalTime = (timeIn, timeOut) => {
    if (!timeOut) return "Ongoing";

    // Convertimos timeIn y timeOut a objetos Date en la zona horaria Asia/Jerusalem
    const startDate = new Date(timeIn).toLocaleString("en-US", { timeZone: "Asia/Jerusalem" });
    const endDate = new Date(timeOut).toLocaleString("en-US", { timeZone: "Asia/Jerusalem" });

    // Convertir las fechas de nuevo a Date (para hacer cálculos de diferencia)
    const start = new Date(startDate);
    const end = new Date(endDate);

    const durationMs = end - start; // in milliseconds

    if (durationMs <= 0) return "Invalid time";

    const hours = Math.floor(durationMs / (1000 * 60 * 60)); // Calculate exact hours (no rounding)
    const minutes = Math.ceil((durationMs % (1000 * 60 * 60)) / (1000 * 60)); // Round up minutes

    return `${hours}h ${minutes}m`;
  };

  // Function to calculate the total hours and minutes
  const calculateTotalHours = () => {
    let totalHours = 0;
    let totalMinutes = 0;

    sessions.forEach((session) => {
      const totalTime = calculateTotalTime(
        new Date(`${session.year}-${String(session.month).padStart(2, '0')}-${String(session.day).padStart(2, '0')}T${session.timeIn}`),
        session.timeOut ? new Date(`${session.year}-${String(session.month).padStart(2, '0')}-${String(session.day).padStart(2, '0')}T${session.timeOut}`) : null
      );

      // Extract hours and minutes if valid
      const match = totalTime.match(/(\d+)h (\d+)m/);
      if (match) {
        totalHours += parseInt(match[1], 10);
        totalMinutes += parseInt(match[2], 10);
      }
    });

    // Convert extra minutes into hours
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    return `${totalHours}h ${totalMinutes}m`;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <DrawerAppBar />
        <Box sx={{ padding: 4, fontFamily: 'Arial, sans-serif', position: 'relative' }}>
          <Typography variant="h4" align="center" gutterBottom color="#4A7B59">
            Work Sessions Report
          </Typography>

          {/* Input Fields for ID, Year, and Month */}
          <Box display="flex" flexDirection="column" alignItems="center">
            <TextField
              label="ID Number"
              variant="outlined"
              margin="normal"
              onChange={(e) => setIdNumber(e.target.value)}
              value={idNumber}
            />
            <TextField
              label="Year"
              variant="outlined"
              margin="normal"
              type="number"
              onChange={(e) => setYear(e.target.value)}
              value={year}
            />
            <TextField
              label="Month"
              variant="outlined"
              margin="normal"
              type="number"
              onChange={(e) => setMonth(e.target.value)}
              value={month}
            />
            <Button
              variant="contained"
              color="success"
              sx={{ marginTop: 2 }}
              onClick={fetchSessions}
            >
              Get Sessions
            </Button>

          </Box>

          {/* Display Sessions Table */}
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
                    </TableRow>
                  );
                })}
                {/* Row to display the total hours */}
                <TableRow>
                  <TableCell colSpan={5} align="right"><strong>Total Hours:</strong></TableCell>
                  <TableCell>{calculateTotalHours()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Toast notifications */}
          <ToastContainer />
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default WorkSessionsTable;
