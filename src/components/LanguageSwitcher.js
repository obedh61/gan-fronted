import React from 'react';
import { useTranslation } from 'react-i18next';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

function LanguageSwitcher({ variant = 'dark', fullWidth = false }) {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language?.startsWith('he') ? 'he' : 'en';

  const isDark = variant === 'dark';
  const textColor = isDark ? '#fff' : 'rgba(0, 0, 0, 0.87)';
  const selectedBg = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.15)';
  const groupBg = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)';

  const handleChange = (event, newLang) => {
    if (newLang && newLang !== currentLang) {
      i18n.changeLanguage(newLang);
    }
  };

  const buttonSx = {
    color: textColor,
    flex: fullWidth ? 1 : undefined,
    '&.Mui-selected': {
      bgcolor: selectedBg,
      color: textColor,
    },
  };

  return (
    <ToggleButtonGroup
      value={currentLang}
      exclusive
      fullWidth={fullWidth}
      onChange={handleChange}
      aria-label={t('language')}
      size="small"
      sx={{
        bgcolor: groupBg,
        borderRadius: 1,
        ml: { xs: fullWidth ? 0 : 0, sm: 1 },
        mr: { xs: fullWidth ? 0 : 0, sm: 1 },
      }}
    >
      <ToggleButton value="he" aria-label={t('accessibility.hebrew')} sx={buttonSx}>
        {t('languageSwitcher.he')}
      </ToggleButton>
      <ToggleButton value="en" aria-label={t('accessibility.english')} sx={buttonSx}>
        {t('languageSwitcher.en')}
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default LanguageSwitcher;
