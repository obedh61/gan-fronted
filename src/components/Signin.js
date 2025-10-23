import React from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login';
import axios from 'axios';
import { useState} from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authenticate, isAuth } from '../pages/helpers';
import { useNavigate } from 'react-router-dom';
import Google from './Google';
import { Link } from 'react-router-dom';


function Signin() {
  const [values, setValues] = useState({
      email: '',
      password: '',
      buttonText: 'sign in'
  }) 

  const { email, password, buttonText } = values

  const handleChange = (name) => (event) => {
      console.log(event.target.value);
      setValues({ ...values, [name]: event.target.value})
  }

  const navigate = useNavigate()

  const informParent = response => {
      authenticate(response, () => {
          // toast.success(`Hey ${response.data.user.name}, Welcome back!`)
          isAuth() && isAuth().role == 'admin' ? navigate('/admin') : navigate('/private')
      })
  }

  const clickSubmit = event => {
      event.preventDefault()
      setValues({...values, buttonText: 'Submitting'})
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
                  ...values,
                  email: '',
                  password: '',
                  buttonText: 'submited'
              })
              // toast.success(`Hey ${response.data.user.name}, Welcome back!`)
              isAuth() && isAuth().role == 'admin' ? navigate('/admin') : navigate('/private')
              
          })

      })
      .catch(error => {
          console.log('SIGNIN ERROR', error.response.data);
          setValues({
              ...values,
              buttonText: 'submit'
          })
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
                Sign in
            </Typography>
            
            <TextField onChange={handleChange('email')} value={email} margin='normal' type='email' variant='outlined' placeholder='Email'/>
            <TextField onChange={handleChange('password')} value={password} margin='normal' type='password' variant='outlined' placeholder='Password'/>
            <Button 
                onClick={clickSubmit} 
                endIcon={<LoginIcon/>} 
                sx={{marginTop: 3, borderRadius: 3}} 
                variant='contained' 
                color='success'
            >
                    {buttonText}
            </Button>
            <Button color='error' variant='contained' sx={{marginTop: 3, borderRadius: 3}} component={Link} to={"/auth/password/forgot"}>
                Forgot password
            </Button>
            <Typography variant='h5' sx={{marginTop: 3}}  textAlign={"center"}>
                Or Sign in with:
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