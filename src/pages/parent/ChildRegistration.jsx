import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { getCookie } from '../helpers'
import { useFormik } from 'formik'
import { registrationSchema, validatePDFFile } from '../../validation/registrationSchema'
import DrawerAppBar from '../../components/Bar'
import Footer from '../../components/Footer'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
    Box, Container, Typography, Button, Grid,
    TextField, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel,
    Stepper, Step, StepLabel, InputAdornment, MobileStepper,
    Card, CardContent, Chip, Checkbox, Divider,
    CircularProgress, Alert, useMediaQuery, useTheme
} from '@mui/material'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DescriptionIcon from '@mui/icons-material/Description'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { useNavigate } from 'react-router-dom'

const STEPS = ['School Year', 'Information', 'Contract', 'Upload', 'Done']

const BRANCH_LABELS = { cityCenter: 'City Center', germanColony: 'German Colony' }
const AGE_LABELS = { under1: 'Under 1 Year', over1: 'Over 1 Year' }

const STORAGE_KEY = 'childRegistrationForm'

const initialFormValues = {
    parent1FirstName: '', parent1LastName: '', parent1IdNumber: '',
    parent2FirstName: '', parent2LastName: '', parent2IdNumber: '',
    childName: '', phoneNumber: '', bankName: '', bankAccountNumber: '',
    ageGroup: '', branch: ''
}

// Helper: show green checkmark when field is valid and touched
const fieldEndAdornment = (touched, error, value) => {
    if (!touched || !value) return null
    return (
        <InputAdornment position="end">
            {error
                ? <ErrorOutlineIcon sx={{ color: '#f44336', fontSize: 20 }} />
                : <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
            }
        </InputAdornment>
    )
}

const ChildRegistration = () => {
    const [activeStep, setActiveStep] = useState(0)
    const [schoolYears, setSchoolYears] = useState([])
    const [selectedSchoolYearId, setSelectedSchoolYearId] = useState('')
    const [contractUrl, setContractUrl] = useState('')
    const [contractDownloaded, setContractDownloaded] = useState(false)
    const [signedFile, setSignedFile] = useState(null)
    const [fileError, setFileError] = useState('')
    const [registrationId, setRegistrationId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [formValues, setFormValues] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            return saved ? JSON.parse(saved) : initialFormValues
        } catch {
            return initialFormValues
        }
    })

    const navigate = useNavigate()
    const token = getCookie('token')
    const headers = { Authorization: `Bearer ${token}` }
    const API = process.env.REACT_APP_API
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    // ============================================
    // FORMIK (Step 2)
    // ============================================

    const formik = useFormik({
        initialValues: formValues,
        enableReinitialize: true,
        validationSchema: registrationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: (values) => {
            setFormValues(values)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
            setActiveStep(2)
        }
    })

    // ============================================
    // API FUNCTIONS
    // ============================================

    const fetchSchoolYears = () => {
        setLoading(true)
        axios.get(`${API}/schoolyear/active`, { headers })
            .then(response => {
                setSchoolYears(response.data.data || [])
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching school years:', error)
                toast.error(error.response?.data?.error || 'Error loading school years')
                setLoading(false)
            })
    }

    const fetchContractUrl = (schoolYearId, branch, ageGroup) => {
        axios.get(`${API}/schoolyear/${schoolYearId}/contract`, {
            headers,
            params: { branch, ageGroup }
        })
            .then(response => {
                setContractUrl(response.data.data?.contractUrl || '')
            })
            .catch(error => {
                console.error('Error fetching contract:', error)
                setContractUrl('')
            })
    }

    const submitRegistration = () => {
        setSubmitting(true)
        axios.post(`${API}/registration/create`, {
            schoolYearId: selectedSchoolYearId,
            ...formValues
        }, { headers })
            .then(response => {
                const reg = response.data.data
                setRegistrationId(reg._id)

                if (signedFile) {
                    return uploadSignedContract(reg._id)
                }
                setActiveStep(4)
                setSubmitting(false)
            })
            .catch(error => {
                console.error('Error creating registration:', error)
                toast.error(error.response?.data?.error || 'Error submitting registration')
                setSubmitting(false)
            })
    }

    const uploadSignedContract = (regId) => {
        setUploading(true)
        const formData = new FormData()
        formData.append('signedContract', signedFile)

        return axios.post(`${API}/registration/${regId}/upload-contract`, formData, {
            headers: { ...headers, 'Content-Type': 'multipart/form-data' }
        })
            .then(() => {
                setActiveStep(4)
                setSubmitting(false)
                setUploading(false)
            })
            .catch(error => {
                console.error('Error uploading contract:', error)
                toast.error(error.response?.data?.error || 'Registration created but contract upload failed. You can upload later.')
                setActiveStep(4)
                setSubmitting(false)
                setUploading(false)
            })
    }

    useEffect(() => {
        fetchSchoolYears()
    }, [])

    useEffect(() => {
        if (activeStep === 2 && selectedSchoolYearId && formValues.branch && formValues.ageGroup) {
            fetchContractUrl(selectedSchoolYearId, formValues.branch, formValues.ageGroup)
            setContractDownloaded(false)
        }
    }, [activeStep])

    // ============================================
    // HANDLERS
    // ============================================

    const handleReset = () => {
        setActiveStep(0)
        setSelectedSchoolYearId('')
        setContractUrl('')
        setContractDownloaded(false)
        setSignedFile(null)
        setFileError('')
        setRegistrationId(null)
        setFormValues(initialFormValues)
        formik.resetForm({ values: initialFormValues })
        localStorage.removeItem(STORAGE_KEY)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const { valid, error } = validatePDFFile(file)
        if (!valid) {
            setFileError(error)
            setSignedFile(null)
            toast.error(error)
            e.target.value = ''
            return
        }

        setFileError('')
        setSignedFile(file)
    }

    const selectedSchoolYear = schoolYears.find(sy => sy._id === selectedSchoolYearId)

    // Helper to build validated TextField props
    const textFieldProps = (name, label) => ({
        label,
        name,
        value: formik.values[name],
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        error: formik.touched[name] && Boolean(formik.errors[name]),
        helperText: formik.touched[name] && formik.errors[name],
        fullWidth: true,
        margin: 'normal',
        variant: 'outlined',
        color: 'success',
        size: isMobile ? 'small' : 'medium',
        InputProps: {
            endAdornment: fieldEndAdornment(
                formik.touched[name],
                formik.errors[name],
                formik.values[name]
            )
        }
    })

    // ============================================
    // STEP RENDERERS
    // ============================================

    const renderStep0 = () => (
        <Card>
            <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                <Typography variant={isMobile ? 'subtitle1' : 'h6'} color="#4A7B59" fontWeight="bold" gutterBottom>
                    Select School Year
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    Choose the school year you would like to register your child for.
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress color="success" />
                    </Box>
                ) : schoolYears.length === 0 ? (
                    <Alert severity="info">
                        No school years are currently accepting registrations. Please check back later.
                    </Alert>
                ) : (
                    <Grid container spacing={2}>
                        {schoolYears.map(sy => (
                            <Grid item xs={12} sm={6} key={sy._id}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        cursor: 'pointer',
                                        border: selectedSchoolYearId === sy._id ? '2px solid #4A7B59' : '1px solid #e0e0e0',
                                        backgroundColor: selectedSchoolYearId === sy._id ? '#e8f5e9' : 'transparent',
                                        '&:hover': { borderColor: '#4A7B59' }
                                    }}
                                    onClick={() => setSelectedSchoolYearId(sy._id)}
                                >
                                    <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                                        <Typography variant="subtitle1" fontWeight="bold">{sy.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {sy.startMonth} {sy.startYear} — {sy.endMonth} {sy.endYear}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button
                        variant="contained"
                        color="success"
                        disabled={!selectedSchoolYearId}
                        onClick={() => setActiveStep(1)}
                        fullWidth={isMobile}
                    >
                        Next
                    </Button>
                </Box>
            </CardContent>
        </Card>
    )

    const renderStep1 = () => {
        const hasErrors = Object.keys(formik.errors).length > 0
        const filledFields = Object.values(formik.values).filter(v => v && v.trim && v.trim() !== '').length
        const totalFields = Object.keys(initialFormValues).length
        const progress = Math.round((filledFields / totalFields) * 100)

        return (
            <Card>
                <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} flexWrap="wrap" gap={1}>
                        <Typography variant={isMobile ? 'subtitle1' : 'h6'} color="#4A7B59" fontWeight="bold">
                            Child & Parent Information
                        </Typography>
                        <Chip
                            label={`${filledFields}/${totalFields}`}
                            size="small"
                            color={filledFields === totalFields ? 'success' : 'default'}
                            variant="outlined"
                        />
                    </Box>

                    {/* Progress bar */}
                    <Box sx={{ width: '100%', height: 4, backgroundColor: '#e0e0e0', borderRadius: 2, mb: 2 }}>
                        <Box sx={{
                            width: `${progress}%`,
                            height: '100%',
                            backgroundColor: progress === 100 ? '#4caf50' : '#4A7B59',
                            borderRadius: 2,
                            transition: 'width 0.3s ease'
                        }} />
                    </Box>

                    <form onSubmit={formik.handleSubmit}>
                        {/* Parent 1 */}
                        <Typography variant="subtitle2" color="#4A7B59" mt={1}>Parent 1</Typography>
                        <Divider sx={{ mb: 0.5 }} />
                        <Grid container spacing={isMobile ? 1 : 2}>
                            <Grid item xs={12} sm={4}>
                                <TextField {...textFieldProps('parent1FirstName', 'First Name')} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField {...textFieldProps('parent1LastName', 'Last Name')} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField {...textFieldProps('parent1IdNumber', 'ID Number')} />
                            </Grid>
                        </Grid>

                        {/* Parent 2 */}
                        <Typography variant="subtitle2" color="#4A7B59" mt={2}>Parent 2</Typography>
                        <Divider sx={{ mb: 0.5 }} />
                        <Grid container spacing={isMobile ? 1 : 2}>
                            <Grid item xs={12} sm={4}>
                                <TextField {...textFieldProps('parent2FirstName', 'First Name')} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField {...textFieldProps('parent2LastName', 'Last Name')} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField {...textFieldProps('parent2IdNumber', 'ID Number')} />
                            </Grid>
                        </Grid>

                        {/* Child */}
                        <Typography variant="subtitle2" color="#4A7B59" mt={2}>Child</Typography>
                        <Divider sx={{ mb: 0.5 }} />
                        <Grid container spacing={isMobile ? 1 : 2}>
                            <Grid item xs={12} sm={6}>
                                <TextField {...textFieldProps('childName', "Child's Name")} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField {...textFieldProps('phoneNumber', 'Phone Number')} placeholder="e.g. 050-1234567" />
                            </Grid>
                        </Grid>

                        {/* Banking */}
                        <Typography variant="subtitle2" color="#4A7B59" mt={2}>Banking Information</Typography>
                        <Divider sx={{ mb: 0.5 }} />
                        <Grid container spacing={isMobile ? 1 : 2}>
                            <Grid item xs={12} sm={6}>
                                <TextField {...textFieldProps('bankName', 'Bank Name')} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField {...textFieldProps('bankAccountNumber', 'Account Number')} />
                            </Grid>
                        </Grid>

                        {/* Age Group & Branch */}
                        <Grid container spacing={isMobile ? 2 : 4} mt={0.5}>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    error={formik.touched.ageGroup && Boolean(formik.errors.ageGroup)}
                                >
                                    <FormLabel color="success" sx={{ fontWeight: 'bold', color: '#4A7B59', fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                                        Age Group *
                                        {formik.values.ageGroup && !formik.errors.ageGroup && (
                                            <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 16, ml: 0.5, verticalAlign: 'middle' }} />
                                        )}
                                    </FormLabel>
                                    <RadioGroup
                                        name="ageGroup"
                                        value={formik.values.ageGroup}
                                        onChange={formik.handleChange}
                                        row={isMobile}
                                    >
                                        <FormControlLabel value="under1" control={<Radio color="success" size="small" />} label={<Typography variant="body2">Under 1</Typography>} />
                                        <FormControlLabel value="over1" control={<Radio color="success" size="small" />} label={<Typography variant="body2">Over 1</Typography>} />
                                    </RadioGroup>
                                    {formik.touched.ageGroup && formik.errors.ageGroup && (
                                        <Typography variant="caption" color="error">{formik.errors.ageGroup}</Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    error={formik.touched.branch && Boolean(formik.errors.branch)}
                                >
                                    <FormLabel color="success" sx={{ fontWeight: 'bold', color: '#4A7B59', fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                                        Branch *
                                        {formik.values.branch && !formik.errors.branch && (
                                            <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 16, ml: 0.5, verticalAlign: 'middle' }} />
                                        )}
                                    </FormLabel>
                                    <RadioGroup
                                        name="branch"
                                        value={formik.values.branch}
                                        onChange={formik.handleChange}
                                    >
                                        <FormControlLabel value="cityCenter" control={<Radio color="success" size="small" />} label={<Typography variant="body2">City Center</Typography>} />
                                        <FormControlLabel value="germanColony" control={<Radio color="success" size="small" />} label={<Typography variant="body2">German Colony</Typography>} />
                                    </RadioGroup>
                                    {formik.touched.branch && formik.errors.branch && (
                                        <Typography variant="caption" color="error">{formik.errors.branch}</Typography>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>

                        {/* Form-level error summary */}
                        {formik.submitCount > 0 && hasErrors && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                Please fix the errors above before continuing.
                            </Alert>
                        )}

                        {/* Buttons */}
                        <Box display="flex" justifyContent="space-between" mt={3} gap={2}>
                            <Button variant="outlined" color="secondary" onClick={() => setActiveStep(0)} sx={{ minWidth: { xs: 80, sm: 100 } }}>
                                Back
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="success"
                                disabled={formik.submitCount > 0 && hasErrors}
                                sx={{ flex: isMobile ? 1 : 'unset' }}
                            >
                                Next
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        )
    }

    const renderStep2 = () => (
        <Card>
            <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                <Typography variant={isMobile ? 'subtitle1' : 'h6'} color="#4A7B59" fontWeight="bold" gutterBottom>
                    Download Your Contract
                </Typography>

                <Box sx={{ textAlign: 'center', py: { xs: 2, sm: 3 } }}>
                    <DescriptionIcon sx={{ fontSize: { xs: 40, sm: 60 }, color: '#4A7B59', mb: 1 }} />
                    <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight="bold" gutterBottom>
                        Your contract is ready
                    </Typography>
                    <Box display="flex" justifyContent="center" gap={1} mb={2} flexWrap="wrap">
                        <Chip label={BRANCH_LABELS[formValues.branch]} color="success" variant="outlined" size="small" />
                        <Chip label={AGE_LABELS[formValues.ageGroup]} color="success" variant="outlined" size="small" />
                        <Chip label={selectedSchoolYear?.name} variant="outlined" size="small" />
                    </Box>

                    {contractUrl ? (
                        <Button
                            variant="contained"
                            color="success"
                            size={isMobile ? 'medium' : 'large'}
                            startIcon={<CloudDownloadIcon />}
                            onClick={() => {
                                window.open(contractUrl, '_blank')
                                setContractDownloaded(true)
                            }}
                            sx={{ mb: 2 }}
                            fullWidth={isMobile}
                        >
                            Download PDF
                        </Button>
                    ) : (
                        <Alert severity="warning" sx={{ mb: 2, textAlign: 'left' }}>
                            No contract available for this branch and age group. Please contact the administration.
                        </Alert>
                    )}

                    <Box sx={{ backgroundColor: '#f5f5f5', borderRadius: 2, p: 2, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Download, print, sign, and scan the contract. Upload the signed copy in the next step.
                        </Typography>
                    </Box>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={contractDownloaded}
                                onChange={e => setContractDownloaded(e.target.checked)}
                                color="success"
                            />
                        }
                        label={<Typography variant="body2">I have downloaded and read the contract</Typography>}
                    />
                </Box>

                <Box display="flex" justifyContent="space-between" mt={2} gap={2}>
                    <Button variant="outlined" color="secondary" onClick={() => setActiveStep(1)} sx={{ minWidth: { xs: 80, sm: 100 } }}>
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        disabled={!contractDownloaded}
                        onClick={() => setActiveStep(3)}
                        sx={{ flex: isMobile ? 1 : 'unset' }}
                    >
                        Next
                    </Button>
                </Box>
            </CardContent>
        </Card>
    )

    const renderStep3 = () => (
        <Card>
            <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                <Typography variant={isMobile ? 'subtitle1' : 'h6'} color="#4A7B59" fontWeight="bold" gutterBottom>
                    Upload Signed Contract
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    Upload the signed contract as a PDF (max 10MB).
                </Typography>

                <Box sx={{ textAlign: 'center', py: { xs: 1, sm: 3 } }}>
                    <Box
                        sx={{
                            border: fileError ? '2px dashed #f44336' : signedFile ? '2px dashed #4caf50' : '2px dashed #bdbdbd',
                            borderRadius: 2,
                            p: { xs: 2, sm: 4 },
                            mb: 2,
                            backgroundColor: fileError ? '#fff5f5' : signedFile ? '#e8f5e9' : '#fafafa',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {signedFile ? (
                            <Box>
                                <CheckCircleIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: '#4caf50', mb: 1 }} />
                                <Typography
                                    variant="body2"
                                    fontWeight="bold"
                                    sx={{ wordBreak: 'break-all', px: 1 }}
                                >
                                    {signedFile.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {(signedFile.size / 1024 / 1024).toFixed(2)} MB
                                </Typography>
                                <Chip label="PDF" size="small" color="success" variant="outlined" sx={{ ml: 0.5 }} />
                                <Box mt={1}>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => { setSignedFile(null); setFileError('') }}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Box>
                                <CloudUploadIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: fileError ? '#f44336' : '#bdbdbd', mb: 1 }} />
                                <Typography variant="body2" color={fileError ? 'error' : 'text.secondary'} mb={1} sx={{ px: 1 }}>
                                    {fileError || 'Select a PDF file to upload'}
                                </Typography>
                                <Button variant="outlined" component="label" color={fileError ? 'error' : 'success'} size={isMobile ? 'small' : 'medium'}>
                                    Choose File
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        hidden
                                        onChange={handleFileChange}
                                    />
                                </Button>
                            </Box>
                        )}
                    </Box>

                    <Box display="flex" gap={2} justifyContent="center" mb={2}>
                        <Typography variant="caption" color="text.secondary">PDF only</Typography>
                        <Typography variant="caption" color="text.secondary">Max 10MB</Typography>
                    </Box>

                    <Alert severity="info" sx={{ textAlign: 'left' }}>
                        <Typography variant="body2">
                            The signed contract is optional. You can upload it later from your registrations page.
                        </Typography>
                    </Alert>
                </Box>

                <Box display="flex" justifyContent="space-between" mt={3} gap={2}>
                    <Button variant="outlined" color="secondary" onClick={() => setActiveStep(2)} sx={{ minWidth: { xs: 80, sm: 100 } }}>
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={submitRegistration}
                        disabled={submitting || uploading || !!fileError}
                        startIcon={(submitting || uploading) ? <CircularProgress size={18} /> : null}
                        sx={{ flex: isMobile ? 1 : 'unset' }}
                    >
                        {submitting ? 'Submitting...' : 'Submit'}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    )

    const renderStep4 = () => (
        <Card>
            <CardContent sx={{ p: { xs: 2, sm: 4 }, textAlign: 'center' }}>
                <CheckCircleOutlineIcon sx={{ fontSize: { xs: 56, sm: 80 }, color: '#4A7B59', mb: 1 }} />
                <Typography variant={isMobile ? 'h6' : 'h5'} color="#4A7B59" gutterBottom>
                    Registration Submitted!
                </Typography>
                <Chip label="Pending Approval" color="warning" size="small" sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary" mb={2}>
                    Your registration is pending approval. You will be notified once it is reviewed.
                </Typography>

                <Card variant="outlined" sx={{ mb: 3, textAlign: 'left' }}>
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                        <Typography variant="subtitle2" color="#4A7B59">Summary</Typography>
                        <Divider sx={{ my: 0.5 }} />
                        <Box display="flex" flexDirection="column" gap={0.3}>
                            <Typography variant="body2"><strong>Year:</strong> {selectedSchoolYear?.name}</Typography>
                            <Typography variant="body2"><strong>Child:</strong> {formValues.childName}</Typography>
                            <Typography variant="body2"><strong>Parent 1:</strong> {formValues.parent1FirstName} {formValues.parent1LastName}</Typography>
                            <Typography variant="body2"><strong>Parent 2:</strong> {formValues.parent2FirstName} {formValues.parent2LastName}</Typography>
                            <Typography variant="body2"><strong>Branch:</strong> {BRANCH_LABELS[formValues.branch]}</Typography>
                            <Typography variant="body2"><strong>Age:</strong> {AGE_LABELS[formValues.ageGroup]}</Typography>
                            <Typography variant="body2"><strong>Contract:</strong> {signedFile ? 'Uploaded' : 'Not uploaded'}</Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="center" gap={1.5}>
                    <Button variant="outlined" color="success" onClick={handleReset} fullWidth={isMobile}>
                        Register Another
                    </Button>
                    <Button variant="contained" color="success" onClick={() => navigate('/my-registrations')} fullWidth={isMobile}>
                        My Registrations
                    </Button>
                </Box>
            </CardContent>
        </Card>
    )

    const stepContent = [renderStep0, renderStep1, renderStep2, renderStep3, renderStep4]

    // ============================================
    // RENDER
    // ============================================

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box sx={{ flexGrow: 1 }}>
                <DrawerAppBar />
                <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1.5, sm: 3 } }}>
                    <Typography
                        variant={isMobile ? 'h5' : 'h4'}
                        color="#4A7B59"
                        align="center"
                        gutterBottom
                        fontWeight="bold"
                    >
                        Child Registration
                    </Typography>

                    {/* Stepper — desktop: full labels, mobile: compact dots */}
                    {isMobile ? (
                        <Box sx={{ mb: 2 }}>
                            <MobileStepper
                                variant="dots"
                                steps={STEPS.length}
                                position="static"
                                activeStep={activeStep}
                                sx={{
                                    backgroundColor: 'transparent',
                                    justifyContent: 'center',
                                    '& .MuiMobileStepper-dot': { mx: 0.5 },
                                    '& .MuiMobileStepper-dotActive': { backgroundColor: '#4A7B59' }
                                }}
                                backButton={null}
                                nextButton={null}
                            />
                            <Typography variant="body2" color="#4A7B59" textAlign="center" fontWeight="bold">
                                Step {activeStep + 1}: {STEPS[activeStep]}
                            </Typography>
                        </Box>
                    ) : (
                        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                            {STEPS.map(label => (
                                <Step key={label}>
                                    <StepLabel
                                        StepIconProps={{
                                            sx: {
                                                '&.Mui-active': { color: '#4A7B59' },
                                                '&.Mui-completed': { color: '#4A7B59' }
                                            }
                                        }}
                                    >
                                        {label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    )}

                    {/* Step Content */}
                    {stepContent[activeStep]()}
                </Container>
            </Box>
            <Footer />
            <ToastContainer />
        </Box>
    )
}

export default ChildRegistration
