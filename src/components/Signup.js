import React, {useState} from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import PasswordField from './PasswordField'
import HowToRegIcon from '@mui/icons-material/HowToReg';
import axios from 'axios';
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppToastContainer from './AppToastContainer';


function Signup() {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [values, setValues] = useState({
      name: '',
      email: '',
      password: ''
  }) 

  const { name, email, password } = values

  const handleChange = (name) => (event) => {
      console.log(event.target.value);
      setValues({ ...values, [name]: event.target.value})
  }

  const clickSubmit = event => {
      event.preventDefault()
      setIsSubmitting(true)
      axios({
          method: 'POST',
          url: `${process.env.REACT_APP_API}/signup`,
          data: {name, email, password}
      })
      .then(response => {
          console.log('SIGNUP SUCCESS', response)
          setValues({
              name: '',
              email: '',
              password: ''
          })
          setIsSubmitting(false)
          toast.success(response.data.message)
      })
      .catch(error => {
        //   console.log('SIGNUP ERROR', error.response.data);
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
                {t('auth.signUpTitle')}
            </Typography>
            <TextField value={name} onChange={handleChange('name')} margin='normal' type='text' variant='outlined' placeholder={t('auth.namePlaceholder')}/>
            <TextField value={email} onChange={handleChange('email')} margin='normal' type='email' variant='outlined' placeholder={t('auth.emailPlaceholder')}/>
            <PasswordField value={password} onChange={handleChange('password')} margin='normal' variant='outlined' placeholder={t('auth.passwordPlaceholder')}/>
            <Button onClick={clickSubmit} endIcon={<HowToRegIcon/>} sx={{marginTop: 3, borderRadius: 3}} variant='contained' color='success' disabled={isSubmitting}>
              {isSubmitting ? t('auth.submitting') : t('common.signUp')}
            </Button>
        </Box>
        <AppToastContainer />
    </form>
  )
}

export default Signup