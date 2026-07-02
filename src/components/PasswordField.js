import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTranslation } from 'react-i18next';

function PasswordField({ value, onChange, placeholder, label, ...props }) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <TextField
      {...props}
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      label={label}
      placeholder={placeholder}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={showPassword ? t('accessibility.hidePassword') : t('accessibility.showPassword')}
              onClick={handleClickShowPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

export default PasswordField;
