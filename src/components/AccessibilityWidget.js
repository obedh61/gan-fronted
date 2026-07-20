import React, { useEffect, useState } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Divider,
  Stack,
  IconButton,
} from '@mui/material';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import CloseIcon from '@mui/icons-material/Close';
import ContrastIcon from '@mui/icons-material/Contrast';
import FormatColorResetIcon from '@mui/icons-material/FormatColorReset';
import LinkIcon from '@mui/icons-material/Link';
import FormatLineSpacingIcon from '@mui/icons-material/FormatLineSpacing';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useTranslation } from 'react-i18next';

const FONT_CLASSES = ['', 'a11y-font-large', 'a11y-font-larger'];

function AccessibilityWidget() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [fontIndex, setFontIndex] = useState(0);
  const [highContrast, setHighContrast] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [lineSpacing, setLineSpacing] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('a11y-settings') || '{}');
      if (typeof saved.fontIndex === 'number') setFontIndex(saved.fontIndex);
      if (typeof saved.highContrast === 'boolean') setHighContrast(saved.highContrast);
      if (typeof saved.grayscale === 'boolean') setGrayscale(saved.grayscale);
      if (typeof saved.highlightLinks === 'boolean') setHighlightLinks(saved.highlightLinks);
      if (typeof saved.lineSpacing === 'boolean') setLineSpacing(saved.lineSpacing);
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    // Font size
    FONT_CLASSES.forEach((cls) => {
      if (cls) root.classList.remove(cls);
    });
    const fontClass = FONT_CLASSES[fontIndex];
    if (fontClass) root.classList.add(fontClass);

    // Other modes
    root.classList.toggle('a11y-high-contrast', highContrast);
    root.classList.toggle('a11y-grayscale', grayscale);
    root.classList.toggle('a11y-highlight-links', highlightLinks);
    root.classList.toggle('a11y-line-spacing', lineSpacing);

    try {
      localStorage.setItem(
        'a11y-settings',
        JSON.stringify({ fontIndex, highContrast, grayscale, highlightLinks, lineSpacing })
      );
    } catch {
      // ignore
    }
  }, [fontIndex, highContrast, grayscale, highlightLinks, lineSpacing]);

  const reset = () => {
    setFontIndex(0);
    setHighContrast(false);
    setGrayscale(false);
    setHighlightLinks(false);
    setLineSpacing(false);
  };

  const toggleButtonSx = (active) => ({
    justifyContent: 'flex-start',
    textTransform: 'none',
    color: active ? '#fff' : 'text.primary',
    backgroundColor: active ? '#4A7B59' : 'transparent',
    border: '1px solid',
    borderColor: active ? '#4A7B59' : 'divider',
    '&:hover': {
      backgroundColor: active ? '#3d664a' : 'rgba(74,123,89,0.08)',
    },
  });

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        zIndex: 1300,
      }}
    >
      {open && (
        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            bottom: 72,
            left: 0,
            width: 280,
            p: 2,
            borderRadius: 2,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" component="h2">
              {t('accessibility.widget.title')}
            </Typography>
            <IconButton size="small" onClick={() => setOpen(false)} aria-label={t('common.close')}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>
            {/* Font size */}
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('accessibility.widget.fontSize')}
              </Typography>
              <ToggleButtonGroup
                value={fontIndex}
                exclusive
                fullWidth
                onChange={(e, value) => value !== null && setFontIndex(value)}
                aria-label={t('accessibility.widget.fontSize')}
              >
                <ToggleButton value={0} aria-label={t('accessibility.widget.fontSizeSmall')}>
                  {t('accessibility.widget.fontSizeSmall')}
                </ToggleButton>
                <ToggleButton value={1} aria-label={t('accessibility.widget.fontSizeMedium')}>
                  {t('accessibility.widget.fontSizeMedium')}
                </ToggleButton>
                <ToggleButton value={2} aria-label={t('accessibility.widget.fontSizeLarge')}>
                  {t('accessibility.widget.fontSizeLarge')}
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Toggles */}
            <Button
              fullWidth
              startIcon={<ContrastIcon />}
              onClick={() => setHighContrast((v) => !v)}
              sx={toggleButtonSx(highContrast)}
              aria-pressed={highContrast}
            >
              {t('accessibility.widget.highContrast')}
            </Button>

            <Button
              fullWidth
              startIcon={<FormatColorResetIcon />}
              onClick={() => setGrayscale((v) => !v)}
              sx={toggleButtonSx(grayscale)}
              aria-pressed={grayscale}
            >
              {t('accessibility.widget.grayscale')}
            </Button>

            <Button
              fullWidth
              startIcon={<LinkIcon />}
              onClick={() => setHighlightLinks((v) => !v)}
              sx={toggleButtonSx(highlightLinks)}
              aria-pressed={highlightLinks}
            >
              {t('accessibility.widget.highlightLinks')}
            </Button>

            <Button
              fullWidth
              startIcon={<FormatLineSpacingIcon />}
              onClick={() => setLineSpacing((v) => !v)}
              sx={toggleButtonSx(lineSpacing)}
              aria-pressed={lineSpacing}
            >
              {t('accessibility.widget.lineSpacing')}
            </Button>

            <Divider />

            <Button
              fullWidth
              startIcon={<RestartAltIcon />}
              onClick={reset}
              color="error"
              variant="outlined"
            >
              {t('accessibility.widget.reset')}
            </Button>
          </Stack>
        </Paper>
      )}

      <Fab
        color="success"
        aria-label={t('accessibility.widget.title')}
        onClick={() => setOpen((v) => !v)}
        size="medium"
      >
        <AccessibilityNewIcon />
      </Fab>
    </Box>
  );
}

export default AccessibilityWidget;
