import React, { useState } from 'react'
import StepForm from './components/StepForm'
import App from './App'
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

// const PDFDocument = require('pdfkit');
// const blobStream = require('blob-stream');

export const multiStepContext = React.createContext()
const StepContext = () => {
    const [currentStep, setStep] = useState(1)
    const [userData, setUserData] = useState([{
        signature: '',
        firstname: '',
        lastname: '',
        contact: '',
        childsname: '',
        bank: '',
        numBank: '',
        termsAndConditions: false,
        teudatZeut: '',
        branch: '',
        age: '',
    }])
    const [finalData, setFinalData] = useState([{}])

    // function submitData() {
    //     setFinalData(finalData => [...finalData, userData])
    //     alert(JSON.stringify(finalData))
    //     console.log(finalData, "hello");
        
    //     // setUserData([])
    //     setStep(1)
    // }

    const { age,branch, firstname, lastname, signature, contact, childsname, bank, numBank, teudatZeut} = userData
    const navigate = useNavigate()

    const submitData = () => {

        // event.preventDefault()
        // setValues({...values, buttonText: 'Submitting'})
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/register`,
            data: { age, branch, firstname, lastname, signature, contact, childsname, bank, numBank, teudatZeut}
        })
        .then(response => {
            console.log('REGISTER SUCCESS', response)
            
            setUserData({
                signature: '',
                firstname: '',
                lastname: '',
                contact: '',
                childsname: '',
                bank: '',
                numBank: '',
                teudatZeut: '',
                age: '',
                branch: '',
            })

            setStep(1)
            // toast.success(response.data.message)
            toast.success(response.data)
            navigate('/home')
            
        })
        .catch(error => {
            console.log(error);
            
            // console.log('SIGNUP ERROR', error.response.data);
            // // setValues({
            // //     ...values,
            // //     buttonText: 'Sign up'
            // // })
            // toast.error(error.response.data.error)
        })
    }
    console.log(userData);

  return (
    <div>
        <multiStepContext.Provider
         value={
                {
                    currentStep,
                    setStep,
                    userData,
                    setUserData,
                    finalData,
                    setFinalData,
                    submitData
                }
            }
        >
            <App />
        </multiStepContext.Provider>
    </div>
  )
}

export default StepContext;
