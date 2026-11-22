import axios from 'axios';
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { decodeToken } from "react-jwt";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';

import { Box, Button, Typography} from '@mui/material'
import PasswordField from '../components/PasswordField'
import DrawerAppBar from '../components/Bar'
import AppToastContainer from '../components/AppToastContainer';

function Reset() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [token, setToken] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [status, setStatus] = useState('idle')

    let {tokend} = useParams()

    useEffect(() =>{
        if (!tokend) return
        const decoded = decodeToken(tokend)
        if (decoded && tokend) {
            setToken(tokend)
        }
    }, [tokend])

    const buttonText = status === 'submitting'
        ? t('auth.submitting')
        : status === 'submitted'
            ? t('auth.submitted')
            : t('auth.resetPassword')

    const handleChange = (event) => {
        console.log(event.target.value);
        setNewPassword(event.target.value)
    }

    const clickSubmit = event => {
        event.preventDefault()
        setStatus('submitting')
        axios({
            method: 'PUT',
            url: `${process.env.REACT_APP_API}/reset-password`,
            data: { newPassword, resetPasswordLink: token }
        })
        .then(response => {
            console.log('RESET PASSWORD SUCCESS', response)
            toast.success(response.data.message)
            setStatus('submitted')
            setTimeout(() => navigate('/access'), 2000)
        })
        .catch(error => {
            console.log('RESET PASSWORD ERROR', error.response.data);
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
                        {t('auth.newPasswordPlaceholder')}
                    </Typography>
                    
                    <PasswordField onChange={handleChange} value={newPassword} margin='normal' variant='outlined' placeholder={t('auth.newPasswordPlaceholder')} />
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

export default Reset