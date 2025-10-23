import { Button, TextField } from '@mui/material'
import React, { useContext, useRef, useState } from 'react'
import { multiStepContext } from '../StepContext'
import SignatureCanvas from 'react-signature-canvas'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer} from 'react-toastify';

export default function FourthStep() {
    const {setStep, submitData, userData, setUserData} = useContext(multiStepContext)
    const [sing, setSing] = useState()
    const [url, setUrl] = useState()
    const sigRef = useRef()

    const handleSignatureEnd = () => {
        setUserData({...userData, "signature": sigRef.current.toDataURL(), })
      }

    const handleGenerate = () => {
        if(sigRef.current.isEmpty()) {
            toast.error('You need to sign')
            return
        }
        // setUrl(sing.getTrimmedCanvas().toDataURL('img/png'))
        submitData()
        
    }
    console.log(sigRef);
  return (
    <div style={{margin:"3px", padding:"5px"}}>
        <ToastContainer />
        <div style={{margin:"5px", border:"1px solid gray", width:"200px", height:"200px"}}>
            <SignatureCanvas 
                ref={sigRef} 
                canvasProps={{ width:"200px", height:"200px"}}
                onEnd={handleSignatureEnd} 
            />
        </div>
        <p style={{textAlign:"center"}}>signature</p>
        <div style={{margin:"3px", padding:"15px"}}>
            <Button variant='contained' onClick={()=>setStep(3)} color='secondary'>Back</Button><span> </span>
            <Button variant='contained' onClick={handleGenerate} color='primary'>Submit</Button>
        </div>
    </div>
  )
}