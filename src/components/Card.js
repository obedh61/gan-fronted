import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { Grid } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';

export default function ImgMediaCard({ title, image, description, link }) {
  const { t } = useTranslation();

  return (
    <Grid item md={4} sm={6} xs={12}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 14px 40px rgba(74,123,89,0.18)',
          },
        }}
      >
        <CardMedia
          component="img"
          alt={t('accessibility.cardImageAlt')}
          image={image}
          sx={{
            height: 200,
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
            '&:hover': { transform: 'scale(1.05)' },
          }}
        />
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography
            gutterBottom
            variant="h5"
            component="h3"
            sx={{ fontWeight: 600, color: '#2e4a35' }}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {description}
          </Typography>
        </CardContent>
        <CardActions sx={{ px: 3, pb: 2 }}>
          <Button
            color="success"
            size="small"
            endIcon={<ArrowForwardIcon />}
            component={Link}
            to={`/${link}`}
            sx={{ fontWeight: 600, textTransform: 'none' }}
          >
            {t('common.learnMore')}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
