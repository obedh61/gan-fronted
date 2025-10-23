import { Box, Button } from '@mui/material'
import React, { useState } from 'react'
import DrawerAppBar from '../components/Bar'
import Signup from '../components/Signup';
import Signin from '../components/Signin';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LoginIcon from '@mui/icons-material/Login';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Access() {
  const [isSignup, setIsSignup] = useState(false)
  console.log(isSignup);
  return (
    <div style={{margin:10}}>
      <DrawerAppBar />
      <ToastContainer />
      
        <Box 
          display="flex"
          flexDirection={"column"}
          maxWidth={400}
          alignItems={"center"}
          justifyContent={"center"}
          margin={"auto"}
          
          padding={3}
          borderRadius={5}
          boxShadow={"5px 5px 10px #ccc"}
          sx={{
            ":hover": {
              boxShadow: "10px 10px 20px #ccc"
            }
          }}
        >
          {isSignup ? <Signup /> : <Signin /> }
          
          <Button endIcon={isSignup ? <LoginIcon/> : <HowToRegIcon/> } onClick={() => setIsSignup(!isSignup)} sx={{marginTop: 3, borderRadius: 3}} >Change to {isSignup ? "Sign in" : "Sing up" }</Button>
        </Box>
      
    </div>
  )
}

export default Access