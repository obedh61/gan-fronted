import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import logo from '../assets/logo.svg';
import { useTranslation } from 'react-i18next';

const ScheduleComponent = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';

  const schedules = [
    {
      season: t('home.summerSchedule'),
      icon: <WbSunnyIcon sx={{ color: '#fff', fontSize: 32 }} />,
      headerBg: 'linear-gradient(135deg, #f9a825 0%, #f57f17 100%)',
      rows: [
        { label: t('home.sundayToThursday'), time: t('home.summerSundayThursday') },
        { label: t('home.friday'), time: t('home.summerFriday') },
      ],
    },
    {
      season: t('home.winterSchedule'),
      icon: <AcUnitIcon sx={{ color: '#fff', fontSize: 32 }} />,
      headerBg: 'linear-gradient(135deg, #4A7B59 0%, #2e4a35 100%)',
      rows: [
        { label: t('home.sundayToThursday'), time: t('home.winterSundayThursday') },
        { label: t('home.friday'), time: t('home.winterFriday') },
      ],
    },
  ];

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: 4 },
        borderRadius: { xs: 0, md: 4 },
        background: isDark
          ? 'linear-gradient(135deg, #1d2a20 0%, #15211a 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f4f8f5 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Decorative watermark logo */}
      <Box
        component="img"
        src={logo}
        alt={t('accessibility.logoAlt')}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: 200, md: 320 },
          opacity: 0.06,
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <Box textAlign="center" mb={{ xs: 4, md: 5 }} position="relative" zIndex={1}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: isDark ? 'rgba(102,187,106,0.15)' : 'rgba(74,123,89,0.1)',
            color: isDark ? '#66bb6a' : '#4A7B59',
            borderRadius: '50%',
            width: 56,
            height: 56,
            mb: 2,
          }}
        >
          <CalendarTodayIcon fontSize="large" />
        </Box>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: 700,
            color: isDark ? '#e8f0e9' : '#2e4a35',
            fontSize: { xs: '1.75rem', md: '2.5rem' },
          }}
        >
          {t('home.scheduleTitle')}
        </Typography>
        <Box
          sx={{
            width: 80,
            height: 4,
            backgroundColor: '#4A7B59',
            borderRadius: 2,
            mx: 'auto',
            mt: 2,
          }}
        />
      </Box>

      {/* Schedule cards */}
      <Grid container spacing={4} justifyContent="center" position="relative" zIndex={1}>
        {schedules.map((schedule) => (
          <Grid item xs={12} md={6} key={schedule.season}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.55)' : '0 16px 40px rgba(0,0,0,0.12)',
                },
              }}
            >
              {/* Card header */}
              <Box
                sx={{
                  background: schedule.headerBg,
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                {schedule.icon}
                <Typography variant="h5" component="h3" sx={{ color: '#fff', fontWeight: 700 }}>
                  {schedule.season}
                </Typography>
              </Box>

              <CardContent sx={{ p: 0 }}>
                {schedule.rows.map((row, index) => (
                  <Paper
                    key={row.label + index}
                    elevation={0}
                    sx={{
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: isMobile ? 1 : 2,
                      p: 3,
                      borderBottom: index < schedule.rows.length - 1
                        ? (isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)')
                        : 'none',
                      borderRadius: 0,
                      bgcolor: index % 2 === 0
                        ? (isDark ? 'rgba(102,187,106,0.08)' : 'rgba(74,123,89,0.03)')
                        : (isDark ? '#223324' : '#fff'),
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="p"
                      sx={{
                        fontWeight: 600,
                        color: isDark ? '#e8f0e9' : '#2e4a35',
                        textAlign: isMobile ? 'center' : 'left',
                      }}
                    >
                      {row.label}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        bgcolor: isDark ? 'rgba(102,187,106,0.15)' : 'rgba(74,123,89,0.1)',
                        color: isDark ? '#e8f0e9' : '#2e4a35',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                      }}
                    >
                      <AccessTimeIcon fontSize="small" />
                      <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
                        {row.time}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Closing note */}
      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 4, color: 'text.secondary', position: 'relative', zIndex: 1 }}
      >
        {t('home.scheduleNote')}
      </Typography>
    </Box>
  );
};

export default ScheduleComponent;
