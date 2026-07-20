import React, { useState } from "react";
import { useTranslation } from 'react-i18next'
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import apiFetch from '../utils/apiFetch';
import { toast } from 'react-toastify';
import AppToastContainer from '../components/AppToastContainer';
import 'react-toastify/dist/ReactToastify.css';
import DrawerAppBar from '../components/Bar';

const WorkSessionsTable = () => {
  const { t } = useTranslation()
  const [idNumber, setIdNumber] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [sessions, setSessions] = useState([]);

  const monthNames = t('months', { returnObjects: true })
  const MONTHS = Array.isArray(monthNames)
    ? monthNames.map((label, index) => ({ value: (index + 1).toString(), label }))
    : [
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
      ]

  // Function to fetch the session data based on the year, month, and idNumber
  const fetchSessions = async () => {
    try {
      const response = await apiFetch(`${process.env.REACT_APP_API}/sessions/${idNumber}/${year}/${month}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setSessions(data);
      } else {
        toast.error(t('worker.sessions.fetchError'));
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      toast.error(t('worker.sessions.genericError'));
    }
  };

  // Download sessions as CSV
  const exportSessions = async () => {
    try {
      const response = await apiFetch(`${process.env.REACT_APP_API}/sessions/export/${idNumber}/${year}/${month}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || t('worker.sessions.csvError'));
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sessions_${idNumber}_${year}_${month}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting sessions:', err);
      toast.error(t('worker.sessions.csvGenericError'));
    }
  };

  // Download sessions as PDF
  const exportSessionsPDF = async () => {
    try {
      const response = await apiFetch(`${process.env.REACT_APP_API}/sessions/export/${idNumber}/${year}/${month}/pdf`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || t('worker.sessions.pdfError'));
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sessions_${idNumber}_${year}_${month}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      toast.error(t('worker.sessions.pdfGenericError'));
    }
  };

  // Helper function to calculate duration as an object; display is localized separately
  const calculateDuration = (timeIn, timeOut) => {
    if (!timeOut) return { type: 'ongoing' };

    // Convertimos timeIn y timeOut a objetos Date en la zona horaria Asia/Jerusalem
    const startDate = new Date(timeIn).toLocaleString("en-US", { timeZone: "Asia/Jerusalem" });
    const endDate = new Date(timeOut).toLocaleString("en-US", { timeZone: "Asia/Jerusalem" });

    // Convertir las fechas de nuevo a Date (para hacer cálculos de diferencia)
    const start = new Date(startDate);
    const end = new Date(endDate);

    const durationMs = end - start; // in milliseconds

    if (durationMs <= 0) return { type: 'invalid' };

    const hours = Math.floor(durationMs / (1000 * 60 * 60)); // Calculate exact hours (no rounding)
    const minutes = Math.ceil((durationMs % (1000 * 60 * 60)) / (1000 * 60)); // Round up minutes

    return { type: 'duration', hours, minutes };
  };

  const formatDuration = (result) => {
    if (result.type === 'ongoing') return t('worker.sessions.ongoing');
    if (result.type === 'invalid') return t('worker.sessions.invalidTime');
    return t('worker.sessions.duration', { hours: result.hours, minutes: result.minutes });
  };

  // Function to calculate the total hours and minutes
  const calculateTotalHours = () => {
    let totalHours = 0;
    let totalMinutes = 0;

    sessions.forEach((session) => {
      const result = calculateDuration(
        new Date(`${session.year}-${String(session.month).padStart(2, '0')}-${String(session.day).padStart(2, '0')}T${session.timeIn}`),
        session.timeOut ? new Date(`${session.year}-${String(session.month).padStart(2, '0')}-${String(session.day).padStart(2, '0')}T${session.timeOut}`) : null
      );

      if (result.type === 'duration') {
        totalHours += result.hours;
        totalMinutes += result.minutes;
      }
    });

    // Convert extra minutes into hours
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    return t('worker.sessions.duration', { hours: totalHours, minutes: totalMinutes });
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
            {t('worker.sessions.title')}
          </Typography>

          {/* Input Fields for ID, Year, and Month */}
          <Box display="flex" flexDirection="column" alignItems="center">
            <TextField
              label={t('worker.sessions.idNumber')}
              variant="outlined"
              margin="normal"
              onChange={(e) => setIdNumber(e.target.value)}
              value={idNumber}
            />
            <FormControl fullWidth margin="normal" sx={{ maxWidth: 300 }}>
              <InputLabel>{t('worker.sessions.year')}</InputLabel>
              <Select value={year} onChange={(e) => setYear(e.target.value)} label={t('worker.sessions.year')}>
                {Array.from({ length: 4 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <MenuItem key={y} value={y.toString()}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" sx={{ maxWidth: 300 }}>
              <InputLabel>{t('worker.sessions.month')}</InputLabel>
              <Select value={month} onChange={(e) => setMonth(e.target.value)} label={t('worker.sessions.month')}>
                {MONTHS.map((m) => (
                  <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="success"
              sx={{ marginTop: 2 }}
              onClick={fetchSessions}
            >
              {t('worker.sessions.getSessions')}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              sx={{ marginTop: 2, marginLeft: 2 }}
              startIcon={<DownloadIcon />}
              onClick={exportSessions}
              disabled={!idNumber || sessions.length === 0}
            >
              {t('worker.sessions.exportCsv')}
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{ marginTop: 2, marginLeft: 2 }}
              startIcon={<PictureAsPdfIcon />}
              onClick={exportSessionsPDF}
              disabled={!idNumber || sessions.length === 0}
            >
              {t('worker.sessions.exportPdf')}
            </Button>

          </Box>

          {/* Display Sessions Table */}
          <TableContainer component={Paper} sx={{ marginTop: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('worker.sessions.day')}</TableCell>
                  <TableCell>{t('worker.sessions.month')}</TableCell>
                  <TableCell>{t('worker.sessions.year')}</TableCell>
                  <TableCell>{t('worker.sessions.timeIn')}</TableCell>
                  <TableCell>{t('worker.sessions.timeOut')}</TableCell>
                  <TableCell>{t('worker.sessions.totalHours')}</TableCell>
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

                  const durationResult = calculateDuration(timeIn, timeOut);
                  const totalTime = formatDuration(durationResult);

                  return (
                    <TableRow key={index}>
                      <TableCell>{session.day}</TableCell>
                      <TableCell>{session.month}</TableCell>
                      <TableCell>{session.year}</TableCell>
                      <TableCell>{session.timeIn}</TableCell>
                      <TableCell>{session.timeOut || t('worker.sessions.ongoing')}</TableCell>
                      <TableCell>{totalTime}</TableCell>
                    </TableRow>
                  );
                })}
                {/* Row to display the total hours */}
                <TableRow>
                  <TableCell colSpan={5} align="right"><strong>{t('worker.sessions.total')}</strong></TableCell>
                  <TableCell>{calculateTotalHours()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Toast notifications */}
          <AppToastContainer />
        </Box>
      </Box></Box>
  );
};

export default WorkSessionsTable;
