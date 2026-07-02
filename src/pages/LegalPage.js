import React from 'react';
import { Container, Typography, Box, Button, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function LegalPage({ type }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const title = t(`legal.${type}.title`);
  const lastUpdated = t(`legal.${type}.lastUpdated`);
  const content = t(`legal.${type}.content`, { returnObjects: true });

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        {t('common.back')}
      </Button>
      <Typography variant="h3" component="h1" gutterBottom>
        {title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {lastUpdated}
      </Typography>
      <Divider sx={{ my: 3 }} />
      <Box>
        {Array.isArray(content) && content.map((paragraph, index) => (
          <Typography key={index} variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
            {paragraph}
          </Typography>
        ))}
      </Box>
    </Container>
  );
}

export default LegalPage;
