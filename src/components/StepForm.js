import React, { useContext } from 'react'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'
import FourthStep from './FourthStep'
import { Step, StepLabel, Stepper } from '@mui/material'
import { multiStepContext } from '../StepContext'

export default function StepForm() {
  const {currentStep, finalData} = useContext(multiStepContext)
  function showStep(step) {
    switch(step) {
      case 1:
        return <FirstStep />
      case 2:
        return <SecondStep />
      case 3:
        return <ThirdStep />
      case 4:
        return <FourthStep />
    }
  }
  return (
    <div>
        <Stepper style={{width: '18%'}} activeStep={currentStep - 1} orientation='horizontal'>
          <Step>
            <StepLabel></StepLabel>
          </Step>
          <Step>
            <StepLabel></StepLabel>
          </Step>
          <Step>
            <StepLabel></StepLabel>
          </Step>
          <Step>
            <StepLabel></StepLabel>
          </Step>
        </Stepper>
        {showStep(currentStep)}
    </div>
  )
}
