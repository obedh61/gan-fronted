import axios from 'axios';
import React, {useState} from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SendIcon from '@mui/icons-material/Send';

import { Box, Button, TextField, Typography} from '@mui/material'
import DrawerAppBar from '../components/Bar'
import { ToastContainer} from 'react-toastify';

function Forgot() {
    const { t } = useTranslation()
    const [values, setValues] = useState({
        email: '',
        buttonText: t('auth.requestReset')
    }) 
    
    const { email, buttonText } = values
    
    const handleChange = (name) => (event) => {
        console.log(event.target.value);
        setValues({ ...values, [name]: event.target.value})
    }

    const clickSubmit = event => {
        event.preventDefault()
        setValues({...values, buttonText: t('auth.submitting')})
        axios({
            method: 'PUT',
            url: `${process.env.REACT_APP_API}/forgot-password`,
            data: { email }
        })
        .then(response => {
            console.log('FORGOT PASSWORD SUCCESS', response)
            toast.success(response.data.message)
            setValues({...values, email: '', buttonText: t('auth.submitted')})
        })
        .catch(error => {
            console.log('FORGOT PASSWORD ERROR', error.response.data);
            setValues({
                ...values,
                email: '',
                buttonText: t('auth.requestReset')
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
                        {t('auth.forgotTitle')}
                    </Typography>
                    
                    <TextField onChange={handleChange('email')} value={email} margin='normal' type='email' variant='outlined' placeholder={t('auth.emailPlaceholder')}/>
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