import axios from 'axios';
import React, {useEffect, useState} from 'react'
import { decodeToken } from "react-jwt";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';

import { Box, Button, TextField, Typography} from '@mui/material'
import DrawerAppBar from '../components/Bar'
import { ToastContainer} from 'react-toastify';

function Reset() {
    const [values, setValues] = useState({
        name: '',
        token: '',
        newPassword: '',
        buttonText: 'Reset password'
    }) 

    let {tokend} = useParams()

    useEffect(() =>{
        let token = tokend
        const myDecodedToken = decodeToken(token)
        let {name} = myDecodedToken
        if(token) {
            setValues({...values, name, token})
        }
    }, [])
    
    const { buttonText, name, token, newPassword } = values
    
    const handleChange = (event) => {
        console.log(event.target.value);
        setValues({ ...values, newPassword: event.target.value})
    }

    const navigate = useNavigate()


    const clickSubmit = event => {
        event.preventDefault()
        setValues({...values, buttonText: 'Submitting'})
        axios({
            method: 'PUT',
            url: `${process.env.REACT_APP_API}/reset-password`,
            data: { newPassword, resetPasswordLink: token }
        })
        .then(response => {
            console.log('RESET PASSWORD SUCCESS', response)
            toast.success(response.data.message)
            setValues({...values, buttonText: 'Done'})
        })
        .catch(error => {
            console.log('RESET PASSWORD ERROR', error.response.data);
            setValues({
                ...values,
                buttonText: 'Reset password'
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
                        New password
                    </Typography>
                    
                    <TextField onChange={handleChange} value={newPassword} type='password' margin='normal'  variant='outlined' placeholder='New password' />
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