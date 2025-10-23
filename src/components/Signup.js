import React, {useState} from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer} from 'react-toastify';


function Signup() {
  const [values, setValues] = useState({
      name: '',
      email: '',
      password: '',
      buttonText: 'Sign up'
  }) 

  const { name, email, password, buttonText } = values

  const handleChange = (name) => (event) => {
      console.log(event.target.value);
      setValues({ ...values, [name]: event.target.value})
  }

  const clickSubmit = event => {
      event.preventDefault()
      setValues({...values, buttonText: 'Submitting'})
      axios({
          method: 'POST',
          url: `${process.env.REACT_APP_API}/signup`,
          data: {name, email, password}
      })
      .then(response => {
          console.log('SIGNUP SUCCESS', response)
          setValues({
              ...values,
              name: '',
              email: '',
              password: '',
              buttonText: 'submited'
          })
          toast.success(response.data.message)
      })
      .catch(error => {
        //   console.log('SIGNUP ERROR', error.response.data);
          setValues({
              ...values,
              buttonText: 'Sign up'
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
                Sign up
            </Typography>
            <TextField value={name} onChange={handleChange('name')} margin='normal' type='text' variant='outlined' placeholder='Name'/>
            <TextField value={email} onChange={handleChange('email')} margin='normal' type='email' variant='outlined' placeholder='Email'/>
            <TextField value={password} onChange={handleChange('password')} margin='normal' type='password' variant='outlined' placeholder='Password'/>
            <Button onClick={clickSubmit} endIcon={<HowToRegIcon/>} sx={{marginTop: 3, borderRadius: 3}} variant='contained' color='success'>
              {buttonText}
            </Button>
        </Box>
        <ToastContainer/>
    </form>
  )
}

export default Signup