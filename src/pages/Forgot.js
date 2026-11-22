import axios from 'axios';
import React, {useState} from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SendIcon from '@mui/icons-material/Send';

import { Box, Button, TextField, Typography} from '@mui/material'
import DrawerAppBar from '../components/Bar'
import AppToastContainer from '../components/AppToastContainer';

function Forgot() {
    const { t } = useTranslation()
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('idle')

    const buttonText = status === 'submitting'
        ? t('auth.submitting')
        : status === 'submitted'
            ? t('auth.submitted')
            : t('auth.requestReset')

    const handleChange = (event) => {
        console.log(event.target.value);
        setEmail(event.target.value)
    }

    const clickSubmit = event => {
        event.preventDefault()
        setStatus('submitting')
        axios({
            method: 'PUT',
            url: `${process.env.REACT_APP_API}/forgot-password`,
            data: { email }
        })
        .then(response => {
            console.log('FORGOT PASSWORD SUCCESS', response)
            toast.success(response.data.message)
            setEmail('')
            setStatus('submitted')
        })
        .catch(error => {
            console.log('FORGOT PASSWORD ERROR', error.response.data);
            setEmail('')
            setStatus('idle')
            toast.error(error.response.data.error)
        })
    }  
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
          marginTop={13}
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
            <form>
                <Box 
                    display="flex"
                    flexDirection={"column"}
                >
                    <Typography variant='h4' padding={3} textAlign={"center"}>
                        {t('auth.forgotTitle')}
                    </Typography>
                    
                    <TextField onChange={handleChange} value={email} margin='normal' type='email' variant='outlined' placeholder={t('auth.emailPlaceholder')}/>
                    <Button 
                        onClick={clickSubmit} 
                        endIcon={<SendIcon />} 
                        sx={{marginTop: 3, borderRadius: 3}} 
                        variant='contained' 
                        color='success'
                    >
                            {buttonText}
                    </Button>
                </Box>
            </form>
          
        </Box>
      
    </div>
  )
}

export default Forgot