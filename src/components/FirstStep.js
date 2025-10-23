import { Button, TextField } from '@mui/material'
import React, { useContext } from 'react'
import { multiStepContext } from '../StepContext'
import { useFormik } from 'formik'
import * as yup from 'yup'

const validationSchema = yup.object({
    firstname: yup
      .string('Enter your Name')
      .required('Name is required'),
    lastname: yup
      .string('Enter your lastname')
      .required('Lastname is required'),
    contact: yup
        .number()
        .min(10, 'Number should be of minimum 8 characters length')
        .required()
        .positive()
        .integer()
        ,
    teudatZeut: yup
    .number()
    .min(10, 'Number should be of minimum 8 characters length')
    .required()
    .positive()
    .integer()
    ,
  })

export default function FirstStep() {
    const {setStep, userData, setUserData} = useContext(multiStepContext)

    const formik = useFormik({
        initialValues: {
          firstname: userData['firstname'],
          lastname: userData['lastname'],
          contact: userData['contact'],
          teudatZeut: userData['teudatZeut']
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
          // alert(JSON.stringify(values, null, 2))
          setUserData({...userData, "firstname": values.firstname, "lastname": values.lastname, "contact": values.contact, "teudatZeut": values.teudatZeut})
          setStep(2)
        },
    })

  return (
    <div>
        <form onSubmit={formik.handleSubmit} style={{padding:"5px"}}>
            <div>
                <TextField 
                    label="First name"
                    id='firstname'
                    name='firstname' 
                    value={formik.values.firstname || ''} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.firstname && Boolean(formik.errors.firstname)}
                    helperText={formik.touched.firstname && formik.errors.firstname} 
                    margin='normal' 
                    variant='outlined' 
                    color='secondary'
                />
            </div>
            <div>
                <TextField 
                    label="Last name"
                    id='lastname'
                    name='lastname' 
                    value={formik.values.lastname || ''} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.lastname && Boolean(formik.errors.lastname)}
                    helperText={formik.touched.lastname && formik.errors.lastname}
                    margin='normal' 
                    variant='outlined' 
                    color='secondary'
                />
            </div>
            <div>
                <TextField 
                    label="Phone Number"
                    id='contact'
                    name='contact' 
                    value={formik.values.contact || ''} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.contact && Boolean(formik.errors.contact)}
                    helperText={formik.touched.contact && formik.errors.contact} 
                    margin='normal' 
                    variant='outlined' 
                    color='secondary'
                />
            </div>
            <div>
                <TextField 
                    label="Teudat Zeut"
                    id='teudatZeut'
                    name='teudatZeut' 
                    value={formik.values.teudatZeut || ''} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.teudatZeut && Boolean(formik.errors.teudatZeut)}
                    helperText={formik.touched.teudatZeut && formik.errors.teudatZeut} 
                    margin='normal' 
                    variant='outlined' 
                    color='secondary'
                />
            </div>
            <div>
                <Button type="submit" variant='contained' color='primary'>Next</Button>
            </div>
        </form>
    </div>
  )
}
