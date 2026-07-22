// Timer.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import DrawerAppBar from './Bar';
import { toast } from 'react-toastify';
import AppToastContainer from './AppToastContainer';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Button, Card, CardContent, LinearProgress, TextField, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PanToolIcon from '@mui/icons-material/PanTool';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TableViewIcon from '@mui/icons-material/TableView';
import CircularProgress from '@mui/material/CircularProgress';
import confetti from 'canvas-confetti';
import Map from './Map';
import People from '../assets/bg4-1.svg'
import logo from '../assets/logo.svg'
import { apiFetch } from '../utils/apiFetch'

// Shift length used as the 100% reference for the time bar (Fridays are shorter)
const getShiftHours = () => (nowInJerusalem().getDay() === 5 ? 4 : 8.5);

const formatElapsed = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':');
};

// Current date/time in Asia/Jerusalem as a local Date
const nowInJerusalem = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }));

const Timer = () => {
  const { t } = useTranslation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [workerName, setWorkerName] = useState('');
  const [idNumber, setIdNumber] = useState(() => localStorage.getItem('timerIdNumber') || '');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [stats, setStats] = useState({ week: { hours: 0, minutes: 0 }, month: { hours: 0, minutes: 0 } });
  const [statsLoading, setStatsLoading] = useState(false);

  const checkActiveSession = React.useCallback(async () => {
    try {
      const response = await apiFetch(`${process.env.REACT_APP_API}/sessions/active/${idNumber}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        const activeSession = await response.json();

        if (activeSession) {
          setStartTime(new Date(activeSession.startTime));
          setEndTime(activeSession.endTime ? new Date(activeSession.endTime) : null);
        }
      }
    } catch (err) {
      console.error('Error fetching active session:', err);
    }
  }, [idNumber]);

  const fetchStats = React.useCallback(async (silent = false) => {
    if (!silent) setStatsLoading(true);
    try {
      const now = nowInJerusalem();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      // Week starts on Sunday (Israeli work week)
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const fetchMonth = async (y, m) => {
        const response = await apiFetch(`${process.env.REACT_APP_API}/sessions/${idNumber}/${y}/${m}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        return response.ok ? await response.json() : [];
      };

      // Same duration math as the /worksession table: floor hours, ceil minutes
      const sessionMinutes = (session) => {
        const day = `${session.year}-${String(session.month).padStart(2, '0')}-${String(session.day).padStart(2, '0')}`;
        const start = new Date(`${day}T${session.timeIn}`);
        const end = session.timeOut ? new Date(`${day}T${session.timeOut}`) : null;
        if (!end) return 0;
        const durationMs = end - start;
        if (durationMs <= 0) return 0;
        return Math.floor(durationMs / (1000 * 60 * 60)) * 60
          + Math.ceil((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      };

      const sumSessions = (list) => list.reduce((acc, s) => acc + sessionMinutes(s), 0);

      const inCurrentWeek = (session) => {
        const sessionDate = new Date(session.year, session.month - 1, session.day);
        return sessionDate >= weekStart && sessionDate <= now;
      };

      // "This Month": exactly the same rows the /worksession table shows for the current month
      const monthSessions = await fetchMonth(year, month);
      const monthTotal = sumSessions(monthSessions);

      // "This Week": current-month rows in range, plus previous month if the week spans into it
      let weekTotal = sumSessions(monthSessions.filter(inCurrentWeek));
      if (weekStart.getMonth() + 1 !== month || weekStart.getFullYear() !== year) {
        const prevSessions = await fetchMonth(weekStart.getFullYear(), weekStart.getMonth() + 1);
        weekTotal += sumSessions(prevSessions.filter(inCurrentWeek));
      }

      setStats({
        week: { hours: Math.floor(weekTotal / 60), minutes: weekTotal % 60 },
        month: { hours: Math.floor(monthTotal / 60), minutes: monthTotal % 60 },
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      if (!silent) setStatsLoading(false);
    }
  }, [idNumber]);

  useEffect(() => {
    if (loggedIn) {
      checkActiveSession();
      fetchStats();
    }
  }, [loggedIn, checkActiveSession, fetchStats]);

  // Keep the stats fresh while logged in (an ongoing session keeps accumulating time)
  useEffect(() => {
    if (!loggedIn) return;
    const interval = setInterval(() => fetchStats(true), 60 * 1000);
    return () => clearInterval(interval);
  }, [loggedIn, fetchStats]);

  // Live ticking time bar while a session is running
  useEffect(() => {
    if (!startTime || endTime) return;

    const start = new Date(startTime);
    setElapsedMs(Date.now() - start.getTime());
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - start.getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  const handleLogin = async () => {
    if (!idNumber || idNumber.trim() === '') {
      toast.error(t('worker.timer.idRequired'));
      return;
    }

    const trimmedId = idNumber.trim();

    // Look up the worker's name to greet them (and catch typos in the ID)
    try {
      const response = await apiFetch(`${process.env.REACT_APP_API}/worker/${trimmedId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.status === 404) {
        toast.error(t('worker.timer.idNotFound'));
        return;
      }

      if (response.ok) {
        const worker = await response.json();
        setWorkerName(worker.username);
        const hour = nowInJerusalem().getHours();
        const greetingKey = hour >= 5 && hour < 12
          ? 'greetingMorning'
          : hour < 18
            ? 'greetingAfternoon'
            : 'greetingEvening';
        toast.success(`${t(`worker.timer.${greetingKey}`)}, ${worker.username}!`);
      } else {
        toast.success(t('worker.timer.loginSuccess'));
      }
    } catch (err) {
      console.error('Error fetching worker:', err);
      toast.success(t('worker.timer.loginSuccess'));
    }

    localStorage.setItem('timerIdNumber', trimmedId);
    setLoggedIn(true);
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
        reject(new Error(t('worker.timer.geolocationNotSupported')));
      }
    });
  };

  const handleStart = async () => {
    setLoading(true); // Bloquea el botón
    const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Jerusalem" });

    try {
      const userAgent = navigator.userAgent;
      const location = await getUserLocation()
      const response = await apiFetch(`${process.env.REACT_APP_API}/sessions/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNumber, startTime: now, location, userAgent }),
        credentials: 'include',
      });

      if (response.ok) {
        setStartTime(now);
        setEndTime(null);
        toast.success(t('worker.timer.sessionStarted'));
        setLocation(location)

      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (err) {
      console.error('Error starting session:', err);
      toast.error(t('worker.timer.startLocationError'));
    } finally {
      setLoading(false); // Desbloquea el botón
    }
  };

  const launchConfetti = () => {
    const defaults = { origin: { y: 0.7 }, zIndex: 2000 };
    confetti({ ...defaults, particleCount: 120, spread: 80 });
    confetti({ ...defaults, particleCount: 60, spread: 120, decay: 0.92, scalar: 1.2 });
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 80, spread: 100, origin: { y: 0.6, x: 0.3 } });
      confetti({ ...defaults, particleCount: 80, spread: 100, origin: { y: 0.6, x: 0.7 } });
    }, 250);
  };

  const handleEnd = async () => {
    setLoading(true); // Bloquea el botón
    const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Jerusalem" });

    try {
      const location = await getUserLocation()
      const response = await apiFetch(`${process.env.REACT_APP_API}/sessions/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNumber, endTime: now, location }),
        credentials: 'include',
      });

      if (response.ok) {
        setEndTime(now);
        toast.success(t('worker.timer.sessionEnded'));
        setLocation(location)
        launchConfetti();
        fetchStats();
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (err) {
      console.error('Error ending session:', err);
      toast.error(t('worker.timer.endLocationError'));
    } finally {
      setLoading(false); // Desbloquea el botón
    }
  };

  const shiftHours = getShiftHours();
  const shiftProgress = Math.min(100, (elapsedMs / (shiftHours * 60 * 60 * 1000)) * 100);

  const StatCard = ({ icon, title, value, loading: cardLoading }) => (
    <Card
      elevation={3}
      sx={(theme) => ({
        flex: 1,
        minWidth: 150,
        borderRadius: 3,
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1e3a2a 0%, #16241b 100%)'
          : 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
      })}
    >
      <CardContent sx={{ textAlign: 'center', padding: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="center" gap={1} color="success.main">
          {icon}
          <Typography variant="subtitle2" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        {cardLoading ? (
          <CircularProgress size={24} color="success" sx={{ marginTop: 1 }} />
        ) : (
          <Typography variant="h5" fontWeight="bold" sx={{ marginTop: 1, fontVariantNumeric: 'tabular-nums' }}>
            {value}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div>
      <DrawerAppBar />
      <Box
        position="relative"
        display="flex"
        flexDirection={"column"}
        maxWidth={400}
        alignItems={"center"}
        justifyContent={"center"}
        margin={"auto"}
        marginTop={13}
        padding={3}
        borderRadius={5}
        sx={(theme) => ({
          backgroundColor: 'background.paper',
          boxShadow: theme.palette.mode === 'dark'
            ? '5px 5px 14px rgba(0,0,0,0.6)'
            : '5px 5px 10px #ccc',
          ":hover": {
            boxShadow: theme.palette.mode === 'dark'
              ? '10px 10px 24px rgba(0,0,0,0.7)'
              : '10px 10px 20px #ccc'
          }
        })}
      >
        {!loggedIn ? (
          <Box display="flex" flexDirection={"column"}>
            <Box
              position="relative"
              textAlign="center"
              padding={3}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {/* Texto encima */}
              <Typography
                variant="h4"
                sx={{ position: "relative", zIndex: 2 }}
              >
                {t('worker.timer.loginTitle')}
              </Typography>

              {/* Imagen detrás */}
              <Box
                component="img"
                src={logo}
                alt={t('worker.timer.loginIconAlt')}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 120,
                  opacity: 0.2, // hace que se vea como fondo
                  zIndex: 1,
                }}
              />
            </Box>
            <TextField
              onChange={(e) => setIdNumber(e.target.value)}
              value={idNumber}
              margin="normal"
              type="text"
              variant="outlined"
              placeholder={t('worker.timer.idPlaceholder')}
            />
            <Button
              onClick={handleLogin}
              endIcon={<LoginIcon />}
              sx={{ marginTop: 3, borderRadius: 3 }}
              variant="contained"
              color="success"
            >
              {t('worker.timer.login')}
            </Button>

          </Box>
        ) : (
          <Box display="flex" flexDirection={"column"} width="100%">
            <Typography
              variant="h5"
              textAlign="center"
              sx={(theme) => ({
                padding: 2,
                fontWeight: 800,
                letterSpacing: 3,
                textTransform: 'uppercase',
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(90deg, #81c784, #c8e6c9)'
                  : 'linear-gradient(90deg, #2e7d32, #66bb6a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              })}
            >
              {t('worker.timer.workTimerTitle')}
            </Typography>
            {workerName && (
              <Typography variant="subtitle1" textAlign="center" sx={{ marginTop: -1, marginBottom: 1, opacity: 0.8 }}>
                {t('worker.timer.hiName', { name: workerName })}
              </Typography>
            )}

            {/* Live time bar */}
            <Box width="100%" sx={{ marginBottom: 2 }}>
              <Typography
                variant="h4"
                textAlign="center"
                sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 'bold', letterSpacing: 2 }}
              >
                {formatElapsed(startTime && !endTime ? elapsedMs : 0)}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={startTime && !endTime ? shiftProgress : 0}
                color={shiftProgress >= 100 ? 'error' : 'success'}
                sx={{ height: 12, borderRadius: 6, marginTop: 1 }}
              />
              <Typography variant="caption" display="block" textAlign="center" sx={{ marginTop: 0.5, opacity: 0.7 }}>
                {startTime && !endTime
                  ? t('worker.timer.shiftProgress', { percent: Math.floor(shiftProgress), hours: shiftHours })
                  : t('worker.timer.pressStart')}
              </Typography>
            </Box>

            {!startTime ? (
              <Button
                onClick={handleStart}
                endIcon={!loading && <AccessTimeIcon sx={{ fontSize: 32 }} />}
                fullWidth
                sx={(theme) => ({
                  marginTop: 1,
                  borderRadius: 4,
                  paddingY: 2.5,
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  background: 'linear-gradient(90deg, #2e7d32 0%, #66bb6a 100%)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 6px 18px rgba(102,187,106,0.4)'
                    : '0 6px 18px rgba(46,125,50,0.4)',
                  transition: 'all 0.2s ease-in-out',
                  ':hover': {
                    background: 'linear-gradient(90deg, #1b5e20 0%, #43a047 100%)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 8px 24px rgba(102,187,106,0.55)'
                      : '0 8px 24px rgba(46,125,50,0.55)',
                    transform: 'translateY(-2px)',
                  },
                  // MUI caps button icon sizes; override so the clock matches the large button
                  '& .MuiButton-endIcon > *:nth-of-type(1)': {
                    fontSize: 32,
                  },
                })}
                variant="contained"
                color="success"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={32} color="inherit" />
                ) : (
                  t('worker.timer.startWork')
                )}
              </Button>
            ) : !endTime ? (
              <Button
                onClick={handleEnd}
                endIcon={!loading && <PanToolIcon sx={{ fontSize: 32 }} />}
                fullWidth
                sx={(theme) => ({
                  marginTop: 1,
                  borderRadius: 4,
                  paddingY: 2.5,
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  background: 'linear-gradient(90deg, #c62828 0%, #ef5350 100%)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 6px 18px rgba(239,83,80,0.4)'
                    : '0 6px 18px rgba(198,40,40,0.4)',
                  transition: 'all 0.2s ease-in-out',
                  ':hover': {
                    background: 'linear-gradient(90deg, #8e0000 0%, #d32f2f 100%)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 8px 24px rgba(239,83,80,0.55)'
                      : '0 8px 24px rgba(198,40,40,0.55)',
                    transform: 'translateY(-2px)',
                  },
                  // MUI caps button icon sizes; override so the icon matches the large button
                  '& .MuiButton-endIcon > *:nth-of-type(1)': {
                    fontSize: 32,
                  },
                })}
                variant="contained"
                color="error"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={32} color="inherit" />
                ) : (
                  t('worker.timer.endWork')
                )}
              </Button>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={(theme) => ({
                  marginTop: 2,
                  padding: 2,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.success.main}`,
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(46,125,50,0.25) 0%, rgba(27,94,32,0.15) 100%)'
                    : 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                })}
              >
                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 48 }} />
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  textAlign="center"
                  sx={(theme) => ({
                    marginTop: 1,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(90deg, #81c784, #a5d6a7)'
                      : 'linear-gradient(90deg, #2e7d32, #66bb6a)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  })}
                >
                  {t('worker.timer.greatJob')}
                </Typography>
                <Typography variant="body2" textAlign="center" sx={{ opacity: 0.75 }}>
                  {t('worker.timer.sessionSaved')}
                </Typography>
              </Box>
            )}

            {/* Weekly / Monthly stats */}
            <Box display="flex" gap={2} width="100%" sx={{ marginTop: 3 }}>
              <StatCard
                icon={<DateRangeIcon />}
                title={t('worker.timer.thisWeek')}
                value={`${stats.week.hours}h ${stats.week.minutes}m`}
                loading={statsLoading}
              />
              <StatCard
                icon={<CalendarMonthIcon />}
                title={t('worker.timer.thisMonth')}
                value={`${stats.month.hours}h ${stats.month.minutes}m`}
                loading={statsLoading}
              />
            </Box>

            <Button
              component={Link}
              to={'/worksession'}
              variant="contained"
              startIcon={<TableViewIcon />}
              sx={(theme) => ({
                marginTop: 3,
                borderRadius: 3,
                paddingY: 1.4,
                fontWeight: 'bold',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                background: 'linear-gradient(90deg, #2e7d32 0%, #66bb6a 100%)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 4px 14px rgba(102,187,106,0.35)'
                  : '0 4px 14px rgba(46,125,50,0.35)',
                transition: 'all 0.2s ease-in-out',
                ':hover': {
                  background: 'linear-gradient(90deg, #1b5e20 0%, #43a047 100%)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 6px 20px rgba(102,187,106,0.5)'
                    : '0 6px 20px rgba(46,125,50,0.5)',
                  transform: 'translateY(-2px)',
                },
              })}
            >
              {t('worker.timer.yourSessions')}
            </Button>
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
                    {t('worker.timer.locationMap')}
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
      <Box
          sx={{
            position: 'absolute',
            top: 70,
            right: 16,
            width: 150, // Ajusta el tamaño del SVG
            height: 'auto',
            zIndex: -1, // Coloca el SVG detrás del texto
          }}
        >
          <img
            src={People} // Ruta del SVG
            alt={t('worker.timer.decorativePeopleAlt')}
            style={{ width: '100%', height: 'auto', opacity: 0.5 }}
          />
        </Box>
      <AppToastContainer />
    </div>
  );
};

export default Timer;
