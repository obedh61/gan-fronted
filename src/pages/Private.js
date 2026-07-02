import React from 'react'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import DrawerAppBar from '../components/Bar'
import StepForm from '../components/StepForm'

export const Private = () => {
  const { t } = useTranslation()

  return (
    <div>
        <DrawerAppBar/>
        
        {/* <StepperClient/> */}
        <Box 
          display="flex"
          flexDirection={"column"}
          maxWidth={400}
          alignItems={"center"}
          justifyContent={"center"}
          margin={"auto"}
          // marginTop={13}
          padding={3}
          borderRadius={5}
          boxShadow={"5px 5px 10px #ccc"}
          sx={{
            ":hover": {
              boxShadow: "10px 10px 20px #ccc"
            }
          }}
        >
          <h1 style={{margin:10}}>{t('legacy.privateTitle')}</h1>
          <StepForm/>
        </Box>
        
    </div>
  )
}
