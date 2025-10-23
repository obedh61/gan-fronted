import axios from 'axios';
import React, {useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { decodeToken } from "react-jwt";
import { Box, Button,  Typography } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DrawerAppBar from '../components/Bar'
import { useNavigate } from 'react-router-dom';

function Activate() {
    let { tokenId } = useParams();
    const myDecodedToken = decodeToken(tokenId)

    const [values, setValues] = useState({
        name: '',
        token: '',
        show: true,
    }) 

    useEffect(() => {
        let token = tokenId
        let {name} = myDecodedToken
        console.log(myDecodedToken, tokenId)
        if (token) {
            setValues({...values, name, token})
        }
    }, [])
    
    const { name, token, show } = values
    const navigate = useNavigate()

    const clickSubmit = event => {
        event.preventDefault()

        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/account-activation`,
            data: { token }
        })
        .then(response => {
            console.log('ACCOUNT ACTIVATION', response)
            setValues({
                ...values,
                show: false
            })
            toast.success(response.data.message)
            navigate('/access')
        })
        .catch(error => {
            console.log('ACCOUNT ACTIVATION ERROR', error.response.data.error);
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
        <Typography variant='p' component="h1" padding={3} textAlign={"center"}>
            Hey {name}, Ready to activate your account?
        </Typography>
            
        <Button onClick={clickSubmit} endIcon={<LoginIcon/>} sx={{marginTop: 3, borderRadius: 3}} variant='contained' color='success'>Activate account</Button>
        
      </Box>
    
  </div>
  )
}

export default Activate