import axios from 'axios';
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { decodeToken } from "react-jwt";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';

import { Box, Button, Typography} from '@mui/material'
import PasswordField from '../components/PasswordField'
import DrawerAppBar from '../components/Bar'
import { ToastContainer} from 'react-toastify';

function Reset() {
    const { t } = useTranslation()
    const [values, setValues] = useState({
        token: '',
        newPassword: '',
        buttonText: t('auth.resetPassword')
    })

    let {tokend} = useParams()

    useEffect(() =>{
        if (!tokend) return
        const decoded = decodeToken(tokend)
        if (decoded && tokend) {
            setValues(v => ({ ...v, token: tokend }))
        }
    }, [tokend])

    const { buttonText, token, newPassword } = values

    const handleChange = (event) => {
        console.log(event.target.value);
        setValues({ ...values, newPassword: event.target.value})
    }

    const clickSubmit = event => {
        event.preventDefault()
        setValues({...values, buttonText: t('auth.submitting')})
        axios({
            method: 'PUT',
            url: `${process.env.REACT_APP_API}/reset-password`,
            data: { newPassword, resetPasswordLink: token }
        })
        .then(response => {
            console.log('RESET PASSWORD SUCCESS', response)
            toast.success(response.data.message)
            setValues({...values, buttonText: t('auth.submitted')})
        })
        .catch(error => {
            console.log('RESET PASSWORD ERROR', error.response.data);
            setValues({
                ...values,
                buttonText: t('auth.resetPassword')
            })
            toast.error(error.response.data.error)
        })
    }  
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
          marginTop={13}
          padding={3}
          borderRadius={5}
          boxShadow={"5px 5px 10px #ccc"}
          sx={{
            ":hover": {
              boxShadow: "10px 10px 20px #ccc"
            }
          }}
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