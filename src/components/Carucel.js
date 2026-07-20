import React from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import Tulip from '../assets/Tulip.svg';
import Env from '../assets/env.jpg';
import Expl from '../assets/expl.jpg';
import Mate from '../assets/mate.jpg';
import leaf from "../assets/leaf.svg";
import { useTranslation } from 'react-i18next';

const MontessoriComponent = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';

  const images = [
    { src: Env, caption: t('home.carouselCaption1') },
    { src: Mate, caption: t('home.carouselCaption2') },
    { src: Expl, caption: t('home.carouselCaption3') },
  ];

  const carouselItems = images.map((image, index) => (
    <Box
      key={index}
      sx={{
        position: 'relative',
        height: { xs: 280, sm: 360, md: 420 },
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.55)' : '0 12px 40px rgba(0,0,0,0.15)',
      }}
    >
      <CardMedia
        component="img"
        src={image.src}
        alt={image.caption}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.7s ease',
          '&:hover': { transform: 'scale(1.05)' },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 3,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
        }}
      >
        <Typography
          variant="h6"
          align="center"
          sx={{ color: '#fff', fontWeight: 500, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
        >
          {image.caption}
        </Typography>
      </Box>
    </Box>
  ));

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        py: { xs: 6, md: 8 },
        px: { xs: 2, md: 4 },
        borderRadius: { xs: 0, md: 4 },
        background: isDark
          ? 'linear-gradient(135deg, #1d2a20 0%, #15211a 100%)'
          : 'linear-gradient(135deg, #f8faf8 0%, #eef4ee 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Decorative leaf */}
      <Box
        component="img"
        src={leaf}
        alt={t('accessibility.decorativeLeaf')}
        sx={{
          position: 'absolute',
          top: { xs: -20, md: -30 },
          right: { xs: -20, md: -40 },
          width: { xs: 120, md: 180 },
          opacity: 0.12,
          transform: 'rotate(-15deg)',
          pointerEvents: 'none',
        }}
      />

      {/* Section header */}
      <Box textAlign="center" mb={{ xs: 4, md: 6 }} position="relative" zIndex={1}>
        <Typography
          variant="overline"
          display="block"
          noWrap
          sx={{ color: isDark ? '#66bb6a' : '#4A7B59', letterSpacing: 2, fontWeight: 600, mb: 1, fontSize: { xs: '0.65rem', md: '0.75rem' } }}
        >
          {t('home.menuTitle')}
        </Typography>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: 700,
            color: isDark ? '#e8f0e9' : '#2e4a35',
            fontSize: { xs: '1.75rem', md: '2.5rem' },
          }}
        >
          {t('home.montessoriTitle')}
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

      <Grid container spacing={{ xs: 4, md: 6 }} alignItems="stretch">
        {/* Text card */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              height: '100%',
              position: 'relative',
              borderRadius: 4,
              backgroundColor: isDark ? 'rgba(29,42,32,0.85)' : 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(4px)',
              p: { xs: 2, md: 3 },
              boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(74,123,89,0.10)',
              border: isDark ? '1px solid rgba(102,187,106,0.25)' : '1px solid rgba(74,123,89,0.12)',
            }}
          >
            <CardContent sx={{ position: 'relative', zIndex: 2 }}>
              <Typography
                variant="body1"
                paragraph
                sx={{ fontSize: '1.05rem', lineHeight: 1.8, color: isDark ? '#c9d8cc' : '#3a4a3e' }}
              >
                {t('home.montessoriBody1')}
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ fontSize: '1.05rem', lineHeight: 1.8, color: isDark ? '#c9d8cc' : '#3a4a3e' }}
              >
                {t('home.montessoriBody2')}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: '1.05rem', lineHeight: 1.8, color: isDark ? '#c9d8cc' : '#3a4a3e' }}
              >
                {t('home.montessoriBody3')}
              </Typography>
            </CardContent>

            <Box
              sx={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                width: 110,
                height: 'auto',
                zIndex: 1,
                opacity: 0.25,
              }}
            >
              <img
                src={Tulip}
                alt={t('accessibility.decorativeTulip')}
                style={{ width: '100%', height: 'auto' }}
              />
            </Box>
          </Card>
        </Grid>

        {/* Carousel */}
        <Grid item xs={12} md={6}>
          <Carousel
            animation="fade"
            duration={700}
            navButtonsAlwaysVisible={!isMobile}
            indicators
            indicatorContainerProps={{
              style: {
                marginTop: '16px',
                zIndex: 2,
                position: 'relative',
              },
            }}
            indicatorIconButtonProps={{
              style: {
                color: isDark ? 'rgba(102,187,106,0.4)' : 'rgba(74,123,89,0.4)',
                padding: '4px',
              },
            }}
            activeIndicatorIconButtonProps={{
              style: { color: isDark ? '#66bb6a' : '#4A7B59' },
            }}
            navButtonsProps={{
              style: {
                backgroundColor: isDark ? 'rgba(29,42,32,0.85)' : 'rgba(255,255,255,0.85)',
                color: isDark ? '#66bb6a' : '#4A7B59',
                borderRadius: '50%',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              },
            }}
          >
            {carouselItems}
          </Carousel>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MontessoriComponent;
