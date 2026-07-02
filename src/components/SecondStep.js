import { Button, TextField } from '@mui/material'
import React, { useContext } from 'react'
import { multiStepContext } from '../StepContext'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

export default function SecondStep() {
    const { t } = useTranslation()
    const {setStep, userData, setUserData} = useContext(multiStepContext)

    const validationSchema = yup.object({
        childsname: yup
          .string(t('legacy.secondStep.enterName'))
          .required(t('legacy.secondStep.nameRequired')),
        bank: yup
          .string(t('legacy.secondStep.enterBank'))
          .required(t('legacy.secondStep.bankRequired')),
        numBank: yup
            .number(t('legacy.secondStep.mustBeNumber')).required(t('legacy.secondStep.bankNumberRequired')).positive(t('legacy.secondStep.positive')).integer(t('legacy.secondStep.integer')),
      })
    
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
                    label={t('legacy.secondStep.childName')}
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
                    label={t('legacy.secondStep.bank')}
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
                    label={t('legacy.secondStep.bankAccount')}
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
                  {t('legacy.secondStep.age')}
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
                  <option value="less than one year">{t('legacy.secondStep.lessThanOne')}</option>
                  <option value="more than one year">{t('legacy.secondStep.moreThanOne')}</option>
                </NativeSelect>
              </FormControl>
            </div>
            <br/>
            <div>
              <FormControl fullWidth required>
                <InputLabel onChange={formik.handleChange} variant="standard" htmlFor="uncontrolled-native">
                  {t('legacy.secondStep.branch')}
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
                  <option value="German Colony">{t('legacy.secondStep.germanColony')}</option>
                  <option value="City Center">{t('legacy.secondStep.cityCenter')}</option>
                </NativeSelect>
              </FormControl>
            </div>
            <br/>
            <div style={{margin:3}}>
                <Button variant='contained' onClick={()=>setStep(1)} color='secondary'>{t('legacy.secondStep.back')}</Button><span> </span>
                <Button type="submit" variant='contained' color='primary'>{t('legacy.secondStep.next')}</Button>
            </div>
        </form>
    </div>
  )
}
