import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from 'react-i18next'
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DrawerAppBar from '../components/Bar';
import Map from '../components/Map'; // Importar el componente Map para mostrar ubicaciones
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import apiFetch from '../utils/apiFetch';
import { useNavigate } from "react-router-dom";
import { getCookie } from "../pages/helpers";

const PrivateSession = () => {
  const { t } = useTranslation()
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
  const token = getCookie('token');
  const authHeaders = useMemo(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }), [token]);

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

  const fetchWorkers = useCallback(async () => {
    try {
      const response = await apiFetch(`${process.env.REACT_APP_API}/workers`, {
        headers: authHeaders
      });
      if (response.ok) {
        const data = await response.json();
        setWorkers(data);
      }
    } catch (err) {
      console.error('Error fetching workers:', err);
    }
  }, [authHeaders]);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const fetchSessions = useCallback(async () => {
    try {
      const response = await apiFetch(`${process.env.REACT_APP_API}/sessions/private/${idNumber}/${year}/${month}`, {
        method: 'GET',
        headers: authHeaders,
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      } else {
        toast.error(t('worker.sessions.fetchError'));
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      toast.error(t('worker.sessions.genericError'));
    }
  }, [idNumber, year, month, authHeaders, t]);

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

  const calculateDuration = (timeIn, timeOut) => {
    if (!timeOut) return { type: 'ongoing' };

     // Convertimos timeIn y timeOut a objetos Date en la zona horaria Asia/Jerusalem
    const startDate = new Date(timeIn).toLocaleString("en-US", { timeZone: "Asia/Jerusalem" });
    const endDate = new Date(timeOut).toLocaleString("en-US", { timeZone: "Asia/Jerusalem" });

    // Convertir las fechas de nuevo a Date (para hacer cálculos de diferencia)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationMs = end - start;

    if (durationMs <= 0) return { type: 'invalid' };

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.ceil((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    return { type: 'duration', hours, minutes };
  };

  const formatDuration = (result) => {
    if (result.type === 'ongoing') return t('worker.sessions.ongoing');
    if (result.type === 'invalid') return t('worker.sessions.invalidTime');
    return t('worker.sessions.duration', { hours: result.hours, minutes: result.minutes });
  };

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

    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    return t('worker.sessions.duration', { hours: totalHours, minutes: totalMinutes });
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
      toast.error(t('worker.privateSessions.fillBothTimes'));
      return;
    }

    if (!editingSession._id) {
      toast.error(t('worker.privateSessions.sessionIdMissing'));
      return;
    }

    try {
      const response = await apiFetch(`${process.env.REACT_APP_API}/sessions/${editingSession._id}`, {
        method: 'PUT',
        headers: authHeaders,
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
        toast.success(t('worker.privateSessions.updateSuccess'));
        handleEditClose();
        fetchSessions();
      } else {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          toast.error(data.message || t('worker.privateSessions.updateFailed'));
        } catch {
          toast.error(t('worker.privateSessions.updateFailed'));
        }
      }
    } catch (err) {
      console.error('Error updating session:', err);
      toast.error(t('worker.privateSessions.updateError'));
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flexGrow: 1 }}>
        <DrawerAppBar />
        <Box sx={{ padding: 4 }}>
          <Typography variant="h4" align="center" gutterBottom color="#4A7B59">
            {t('worker.privateSessions.title')}
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center">
            <FormControl fullWidth margin="normal" sx={{ maxWidth: 300 }}>
              <InputLabel>{t('worker.privateSessions.worker')}</InputLabel>
              <Select value={idNumber} onChange={(e) => setIdNumber(e.target.value)} label={t('worker.privateSessions.worker')}>
                {workers.map((w) => (
                  <MenuItem key={w.idNumber} value={w.idNumber}>{w.username}</MenuItem>
                ))}
              </Select>
            </FormControl>
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
            <Button variant="contained" color="success" sx={{ marginTop: 2 }} onClick={fetchSessions}>
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
              {t('worker.privateSessions.dashboard')}
            </Button>
          </Box>
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
                  <TableCell>{t('worker.privateSessions.startLocation')}</TableCell>
                  <TableCell>{t('worker.privateSessions.endLocation')}</TableCell>
                  <TableCell>{t('worker.privateSessions.userAgent')}</TableCell>
                  <TableCell>{t('common.actions')}</TableCell>
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
                      <TableCell>
                        {session.locationStart ? (
                          <Button variant="contained" size="small" onClick={() => setSelectedLocation(session.locationStart)}>
                            {t('worker.privateSessions.viewMap')}
                          </Button>
                        ) : t('common.na')}
                      </TableCell>
                      <TableCell>
                        {session.locationEnd ? (
                          <Button variant="contained" size="small" color="secondary" onClick={() => setSelectedLocation(session.locationEnd)}>
                            {t('worker.privateSessions.viewMap')}
                          </Button>
                        ) : t('common.na')}
                      </TableCell>
                      <TableCell>{session.userAgent || t('common.na')}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleEditClick(session)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell colSpan={5} align="right"><strong>{t('worker.sessions.total')}</strong></TableCell>

                  <TableCell>{calculateTotalHours()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {selectedLocation && (
            <Box marginTop={4}>
              <Typography variant="h5" align="center">{t('worker.privateSessions.locationMap')}</Typography>
              <Map latitude={selectedLocation.latitude} longitude={selectedLocation.longitude} />
              <Button variant="outlined" color="error" onClick={() => setSelectedLocation(null)}>
                {t('worker.privateSessions.closeMap')}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <DialogTitle>{t('worker.privateSessions.editTitle')}</DialogTitle>
        <DialogContent>
          {editingSession && (
            <Typography variant="body2" sx={{ mb: 2, mt: 1 }}>
              {t('worker.privateSessions.editDate', {
                day: editingSession.day,
                month: editingSession.month,
                year: editingSession.year
              })}
            </Typography>
          )}
          <TextField
            label={t('worker.privateSessions.timeIn')}
            type="time"
            value={editTimeIn}
            onChange={(e) => setEditTimeIn(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 60 }}
          />
          <TextField
            label={t('worker.privateSessions.timeOut')}
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
          <Button onClick={handleEditClose}>{t('common.cancel')}</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="success">{t('common.save')}</Button>
        </DialogActions>
      </Dialog><ToastContainer />
    </Box>
  );
};

export default PrivateSession;
