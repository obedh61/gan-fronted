import React from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import PasswordField from './PasswordField'
import LoginIcon from '@mui/icons-material/Login';
import axios from 'axios';
import { useState} from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authenticate, isAuth } from '../pages/helpers';
import { useNavigate } from 'react-router-dom';
import Google from './Google';
import { Link } from 'react-router-dom';


function Signin() {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [values, setValues] = useState({
      email: '',
      password: ''
  }) 

  const { email, password } = values

  const handleChange = (name) => (event) => {
      console.log(event.target.value);
      setValues({ ...values, [name]: event.target.value})
  }

  const navigate = useNavigate()

  const informParent = response => {
      authenticate(response, () => {
          // toast.success(`Hey ${response.data.user.name}, Welcome back!`)
          isAuth() && isAuth().role === 'admin' ? navigate('/admin') : navigate('/my-registrations')
      })
  }

  const clickSubmit = event => {
      event.preventDefault()
      setIsSubmitting(true)
      axios({
          method: 'POST',
          url: `${process.env.REACT_APP_API}/signin`,
          data: { email, password}
      })
      .then(response => {
          
          console.log('SIGNIN SUCCESS', response)
          //save rhw response (user, token) localstorage/cookie
          authenticate(response, () => {
              setValues({
                  email: '',
                  password: ''
              })
              // toast.success(`Hey ${response.data.user.name}, Welcome back!`)
              isAuth() && isAuth().role === 'admin' ? navigate('/admin') : navigate('/my-registrations')

          })

      })
      .catch(error => {
          console.log('SIGNIN ERROR', error.response.data);
          setIsSubmitting(false)
          toast.error(error.response.data.error)
      })
  }  

  return (
    <form>
        <Box 
            display="flex"
            flexDirection={"column"}
        >
            <Typography variant='h2' padding={3} textAlign={"center"}>
                {t('auth.signInTitle')}
            </Typography>
            
            <TextField onChange={handleChange('email')} value={email} margin='normal' type='email' variant='outlined' placeholder={t('auth.emailPlaceholder')}/>
            <PasswordField onChange={handleChange('password')} value={password} margin='normal' variant='outlined' placeholder={t('auth.passwordPlaceholder')}/>
            <Button 
                onClick={clickSubmit} 
                endIcon={<LoginIcon/>} 
                sx={{marginTop: 3, borderRadius: 3}} 
                variant='contained' 
                color='success'
                disabled={isSubmitting}
            >
                    {isSubmitting ? t('auth.submitting') : t('common.signIn')}
            </Button>
            <Button color='error' variant='contained' sx={{marginTop: 3, borderRadius: 3}} component={Link} to={"/auth/password/forgot"}>
                {t('auth.forgotLink')}
            </Button>
            <Typography variant='h5' sx={{marginTop: 3}}  textAlign={"center"}>
                {t('auth.orSignInWith')}
            </Typography>
            <Button  
                endIcon={<LoginIcon/>} 
                sx={{marginTop: 1, borderRadius: 3}} 
                 
                color='success'
            >
                    <Google informParent={informParent} />
            </Button>
            
        </Box>
    </form>
  )
}

export default Signin