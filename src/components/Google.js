import axios from 'axios';
import React from 'react'
import { GoogleLogin } from '@react-oauth/google'


const Google = ({ informParent = f => f}) => {
    const responseGoogle = credentialResponse => {
        console.log(credentialResponse.credential)
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/google-login`,
            data: {idToken: credentialResponse.credential}
        })
         .then(response => {
            console.log('GOOGLE SUCCESS', response)
            informParent(response)
         })
         .catch(e => {
            console.log('GOOGLE ERROR', e.response);
         })
    }

    return (
        <GoogleLogin
            onSuccess={responseGoogle}
            onError={() => {
                console.log('Login Failed');
            }}
        />
    )
}

export default Google