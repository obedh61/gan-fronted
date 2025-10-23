import { Button, TextField } from '@mui/material'
import React, { useContext } from 'react'
import { multiStepContext } from '../StepContext'
import { useFormik } from 'formik'
import * as yup from 'yup'

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

const validationSchema = yup.object({
    childsname: yup
      .string('Enter your name')
      .required('Name is required'),
    bank: yup
      .string('Enter your bank')
      .required('bank is required'),
    numBank: yup
        .number('must be a number').required('bank number is required').positive('bank number is required').integer('bank number is required'),
  })

export default function SecondStep() {
    
    const {setStep, userData, setUserData} = useContext(multiStepContext)

    const formik = useFormik({
        initialValues: {
          childsname: userData['childsname'],
          bank: userData['bank'],
          numBank: userData['numBank'],
          branch: userData['branch'],
          age: userData['age'],
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
          // alert(JSON.stringify(values, null, 2))
          setUserData({...userData, "childsname": values.childsname, "bank": values.bank, "numBank": values.numBank, "branch": values.branch, "age": values.age})
          setStep(3)
        },
    })
    
  return (
    <div style={{padding:"3px"}}>
        <form onSubmit={formik.handleSubmit}>
            <div>
                <TextField 
                    label="Child's name"
                    id='childsname'
                    name='childsname' 
                    value={formik.values.childsname || ''} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.childsname && Boolean(formik.errors.childsname)}
                    helperText={formik.touched.childsname && formik.errors.childsname} 
                    margin='normal' 
                    variant='outlined' 
                    color='secondary'
                />
            </div>
            <div>
                <TextField 
                    label="Bank"
                    id='bank'
                    name='bank' 
                    value={formik.values.bank || ''} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.bank && Boolean(formik.errors.bank)}
                    helperText={formik.touched.bank && formik.errors.bank}
                    margin='normal' 
                    variant='outlined' 
                    color='secondary'
                />
            </div>
            <div>
                <TextField 
                    label="Bank account"
                    id='numBank'
                    name='numBank' 
                    value={formik.values.numBank || ''} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.numBank && Boolean(formik.errors.numBank)}
                    helperText={formik.touched.numBank && formik.errors.numBank} 
                    margin='normal' 
                    variant='outlined' 
                    color='secondary'
                />
            </div>
            <div>
              <FormControl fullWidth required>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Age
                </InputLabel>
                <NativeSelect
                  onChange={formik.handleChange}
                  required
                  inputProps={{
                    name: 'age',
                    id: 'uncontrolled-native',
                  }}
                >
                  <option value={formik.values.age || ''} />
                  <option value="less than one year">less than one year</option>
                  <option value="more than one year">more than one year</option>
                </NativeSelect>
              </FormControl>
            </div>
            <br/>
            <div>
              <FormControl fullWidth required>
                <InputLabel onChange={formik.handleChange} variant="standard" htmlFor="uncontrolled-native">
                  Branch
                </InputLabel>
                <NativeSelect
                  onChange={formik.handleChange}
                  required
                  inputProps={{
                    name: 'branch',
                    id: 'uncontrolled-native',
                  }}
                >
                  <option value={formik.values.branch || ''} />
                  <option value="German Colony">German Colony</option>
                  <option value="City Center">City Center</option>
                </NativeSelect>
              </FormControl>
            </div>
            <br/>
            <div style={{margin:3}}>
                <Button variant='contained' onClick={()=>setStep(1)} color='secondary'>Back</Button><span> </span>
                <Button type="submit" variant='contained' color='primary'>Next</Button>
            </div>
        </form>
    </div>
  )
}
