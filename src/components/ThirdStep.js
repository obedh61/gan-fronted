import { Button, TextField } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import React, { useContext, useEffect, useState } from 'react';
import { multiStepContext } from '../StepContext';
import { useFormik } from 'formik';
import * as yup from 'yup';
import cityCenter from '../assets/Carpetas Padres Kids 1-2CENTRO.pdf';
import german from '../assets/Carpetas Padres Kids 1-2 copia-2_240108_104709_1-2g.pdf';
import germanBaby from '../assets/THE MONTESSORI.pdf';
import PdfViewer from './PdfViewer';

const FormSchema = yup.object({
    termsAndConditions: yup
      .bool()
      .oneOf([true], 'You need to accept the terms and conditions')
      .required('You need to accept the terms and conditions'),
});

export default function ThirdStep() {
    const { setStep, submitData, userData, setUserData } = useContext(multiStepContext);
    const formik = useFormik({
        initialValues: {
            termsAndConditions: userData['termsAndConditions'],
        },
        validationSchema: FormSchema,
        validateOnChange: false,
        onSubmit: (values) => {
            setUserData({ ...userData, termsAndConditions: values.termsAndConditions });
            setStep(4);
        },
    });

    const [contractKids, setContractKids] = useState(null);

    useEffect(() => {
        let contract;
        if (userData['branch'] === 'City Center') {
            contract = cityCenter;
        } else if (userData['branch'] === 'German Colony' && userData['age'] === 'less than one year') {
            contract = germanBaby;
        } else if (userData['branch'] === 'German Colony' && userData['age'] === 'more than one year') {
            contract = german;
        }
        setContractKids(contract);
    }, [userData]);

    return (
        <div style={{ padding: "4px" }}>
            {/* Contenedor del visor de PDF */}
            <div style={{ width: '100%', height: '30vh', border: '1px solid gray', marginBottom: '20px' }}>
                    {contractKids && <PdfViewer pdfUrl={contractKids} scale={0.2}/>}
                </div>

                {/* Enlace de descarga */}
                {contractKids && <a href={contractKids} target="_blank" rel="noopener noreferrer">Download Pdf</a>}

                {/* Checkbox de términos y condiciones */}
                <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>

                    {/* Términos y condiciones */}
                    <div style={{ marginBottom: '13px' }}>
                        <FormControl>
                            <FormLabel error={formik.touched.termsAndConditions && Boolean(formik.errors.termsAndConditions)}>
                                {formik.touched.termsAndConditions && formik.errors.termsAndConditions}
                            </FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    name="termsAndConditions"
                                    id="termsAndConditions"
                                    onChange={formik.handleChange}
                                    value={formik.values.termsAndConditions || false}
                                    control={<Checkbox required />}
                                    label="I agree"
                                />
                            </FormGroup>
                        </FormControl>
                    </div>

                    {/* Botones de navegación */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button variant="contained" onClick={() => setStep(2)} color="secondary">
                            Back
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                            Next
                        </Button>
                    </div>
                </form>
        </div>
    );
}
