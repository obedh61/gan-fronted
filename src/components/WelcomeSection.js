import React from 'react';
import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import FlagIcon from '@mui/icons-material/Flag';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SpaIcon from '@mui/icons-material/Spa';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTranslation } from 'react-i18next';
import leaf from '../assets/leaf.svg';

const VALUE_ICONS = [
  VolunteerActivismIcon,
  EmojiPeopleIcon,
  LightbulbIcon,
  SpaIcon,
  FamilyRestroomIcon,
  EmojiEmotionsIcon,
];

const WelcomeSection = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const values = t('home.welcome.values', { returnObjects: true });
  const areas = t('home.welcome.approachAreas', { returnObjects: true });

  const headingColor = isDark ? '#e8f0e9' : '#2e4a35';
  const bodyColor = isDark ? '#c9d8cc' : '#3a4a3e';
  const accent = isDark ? '#66bb6a' : '#4A7B59';
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)';
  const cardBorder = isDark ? '1px solid rgba(102,187,106,0.25)' : '1px solid rgba(74,123,89,0.15)';
  const cardShadow = isDark ? '0 8px 32px rgba(0,0,0,0.45)' : '0 8px 32px rgba(74,123,89,0.10)';

  const iconCircleSx = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: isDark ? 'rgba(102,187,106,0.15)' : 'rgba(74,123,89,0.1)',
    color: accent,
    borderRadius: '50%',
    width: 48,
    height: 48,
  };

  const paragraphKeys = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'];

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        py: { xs: 5, md: 7 },
        px: { xs: 2, md: 4 },
        borderRadius: { xs: 0, md: 4 },
        background: isDark
          ? 'linear-gradient(135deg, #1d2a20 0%, #15211a 100%)'
          : 'linear-gradient(135deg, #fdf8ef 0%, #eef6f0 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Decorative leaf */}
      <Box
        component="img"
        src={leaf}
        alt=""
        aria-hidden="true"
        sx={{
          position: 'absolute',
          bottom: { xs: -20, md: -30 },
          left: { xs: -20, md: -40 },
          width: { xs: 120, md: 180 },
          opacity: 0.12,
          transform: 'rotate(15deg)',
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ maxWidth: 1000, mx: 'auto', position: 'relative', zIndex: 1 }}>
        <Stack spacing={{ xs: 5, md: 6 }}>
          {/* ==================== Welcome letter ==================== */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              backgroundColor: cardBg,
              border: cardBorder,
              boxShadow: cardShadow,
            }}
          >
          <Stack alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Box sx={iconCircleSx}>
              <MailOutlineIcon fontSize="medium" />
            </Box>
            <Typography variant="overline" sx={{ color: accent, letterSpacing: 2, fontWeight: 600 }}>
              {t('home.welcome.greeting')}
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              align="center"
              sx={{ fontWeight: 800, color: headingColor, fontSize: { xs: '1.4rem', md: '2rem' } }}
            >
              {t('home.welcome.title')}
            </Typography>
            <Box sx={{ width: 80, height: 4, backgroundColor: accent, borderRadius: 2 }} />
          </Stack>

          {paragraphKeys.map((key) => (
            <Typography
              key={key}
              variant="body1"
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' }, lineHeight: 1.9, color: bodyColor }}
            >
              {t(`home.welcome.${key}`)}
            </Typography>
          ))}

          <Divider sx={{ my: 3, borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }} />

          <Box sx={{ textAlign: 'end' }}>
            <Typography variant="body2" sx={{ color: bodyColor, fontStyle: 'italic' }}>
              {t('home.welcome.signatureGreeting')}
            </Typography>
            <Typography variant="h6" sx={{ color: headingColor, fontWeight: 700 }}>
              {t('home.welcome.signatureName')}
            </Typography>
            <Typography variant="body2" sx={{ color: accent, fontWeight: 600 }}>
              {t('home.welcome.signatureRole')}
            </Typography>
          </Box>
        </Paper>

        {/* ==================== Mission & Vision ==================== */}
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 3, md: 4 },
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          }}
        >
          {[
            { icon: <FlagIcon />, title: t('home.welcome.missionTitle'), texts: [t('home.welcome.missionText')] },
            { icon: <VisibilityIcon />, title: t('home.welcome.visionTitle'), texts: [t('home.welcome.visionP1'), t('home.welcome.visionP2')] },
          ].map((card) => (
            <Paper
              key={card.title}
              elevation={0}
              sx={{
                height: '100%',
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                backgroundColor: cardBg,
                border: cardBorder,
                boxShadow: cardShadow,
              }}
            >
              <Box sx={{ ...iconCircleSx, mb: 2 }}>{card.icon}</Box>
              <Typography variant="h5" component="h3" sx={{ fontWeight: 700, color: headingColor, mb: 2 }}>
                {card.title}
              </Typography>
              {card.texts.map((text, i) => (
                <Typography key={i} variant="body1" paragraph={i < card.texts.length - 1} sx={{ lineHeight: 1.8, color: bodyColor }}>
                  {text}
                </Typography>
              ))}
            </Paper>
          ))}
        </Box>

        {/* ==================== Core values ==================== */}
        <Box>
          <Typography
            variant="h4"
            component="h3"
            align="center"
            sx={{ fontWeight: 800, color: headingColor, mb: 1, fontSize: { xs: '1.4rem', md: '1.9rem' } }}
          >
            {t('home.welcome.valuesTitle')}
          </Typography>
          <Box sx={{ width: 80, height: 4, backgroundColor: accent, borderRadius: 2, mx: 'auto', mb: 4 }} />
          <Box
            sx={{
              display: 'grid',
              gap: { xs: 2, md: 3 },
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            }}
          >
            {Array.isArray(values) && values.map((value, index) => {
              const ValueIcon = VALUE_ICONS[index % VALUE_ICONS.length];
              return (
                <Paper
                  key={value.name}
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: { xs: 2.5, md: 3 },
                    borderRadius: 3,
                    textAlign: 'center',
                    backgroundColor: cardBg,
                    border: cardBorder,
                    transition: 'transform 0.2s ease',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <Box sx={{ ...iconCircleSx, width: 44, height: 44, mb: 1.5 }}>
                    <ValueIcon fontSize="small" />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: headingColor, mb: 0.5 }}>
                    {value.name}
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.7, color: bodyColor }}>
                    {value.desc}
                  </Typography>
                </Paper>
              );
            })}
          </Box>
        </Box>

        {/* ==================== Montessori approach ==================== */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            backgroundColor: cardBg,
            border: cardBorder,
            boxShadow: cardShadow,
          }}
        >
          <Typography
            variant="h4"
            component="h3"
            align="center"
            sx={{ fontWeight: 800, color: headingColor, mb: 1, fontSize: { xs: '1.4rem', md: '1.9rem' } }}
          >
            {t('home.welcome.approachTitle')}
          </Typography>
          <Box sx={{ width: 80, height: 4, backgroundColor: accent, borderRadius: 2, mx: 'auto', mb: 3 }} />

          <Typography variant="body1" paragraph sx={{ lineHeight: 1.9, color: bodyColor }}>
            {t('home.welcome.approachP1')}
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.9, color: bodyColor }}>
            {t('home.welcome.approachP2')}
          </Typography>

          <Typography variant="subtitle1" align="center" sx={{ fontWeight: 700, color: headingColor, mb: 2 }}>
            {t('home.welcome.approachListTitle')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mb: 3 }}>
            {Array.isArray(areas) && areas.map((area) => (
              <Chip
                key={area}
                icon={<CheckCircleOutlineIcon />}
                label={area}
                variant="outlined"
                sx={{
                  borderColor: accent,
                  color: headingColor,
                  '& .MuiChip-icon': { color: accent },
                  fontWeight: 600,
                }}
              />
            ))}
          </Box>

          <Typography variant="body1" align="center" sx={{ lineHeight: 1.9, color: bodyColor, fontStyle: 'italic' }}>
            {t('home.welcome.approachClosing')}
          </Typography>
        </Paper>
        </Stack>
      </Box>
    </Box>
  );
};

export default WelcomeSection;
