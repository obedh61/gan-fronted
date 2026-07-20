import { Box, Button } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DrawerAppBar from '../components/Bar'
import Signup from '../components/Signup';
import Signin from '../components/Signin';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LoginIcon from '@mui/icons-material/Login';
import AppToastContainer from '../components/AppToastContainer';
import 'react-toastify/dist/ReactToastify.css';

function Access() {
  const { t } = useTranslation()
  const [isSignup, setIsSignup] = useState(false)
  console.log(isSignup);
  return (
    <div style={{margin:10}}>
      <DrawerAppBar />
      <AppToastContainer />
      
        <Box 
          display="flex"
          flexDirection={"column"}
          maxWidth={400}
          alignItems={"center"}
          justifyContent={"center"}
          margin={"auto"}
          
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
          {isSignup ? <Signup /> : <Signin /> }
          
          <Button endIcon={isSignup ? <LoginIcon/> : <HowToRegIcon/> } onClick={() => setIsSignup(!isSignup)} sx={{marginTop: 3, borderRadius: 3}} >{isSignup ? t('auth.changeToSignIn') : t('auth.changeToSignUp')}</Button>
        </Box>
      
    </div>
  )
}

export default Access