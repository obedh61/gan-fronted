import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import { getCookie } from '../helpers'
import useIsBlocked from '../../hooks/useIsBlocked'
import { useFormik } from 'formik'
import { createRegistrationSchema, validatePDFFile } from '../../validation/registrationSchema'
import DrawerAppBar from '../../components/Bar'
import { toast } from 'react-toastify'
import AppToastContainer from '../../components/AppToastContainer'
import 'react-toastify/dist/ReactToastify.css'
import { useTranslation } from 'react-i18next'
import {
    Box, Container, Typography, Button, Grid,
    TextField, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel,
    Stepper, Step, StepLabel, InputAdornment, MobileStepper,
    Card, CardContent, Chip, Checkbox, Divider,
    CircularProgress, Alert, useMediaQuery, useTheme,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DescriptionIcon from '@mui/icons-material/Description'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { useNavigate } from 'react-router-dom'

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
    const { t, i18n, ready } = useTranslation()

    // Translations load async (useSuspense: false); on hard reload t() may
    // return the raw key string until resources arrive — guard against that
    const STEPS = useMemo(() => {
        if (!ready) return []
        const steps = t('parent.registration.steps', { returnObjects: true })
        return Array.isArray(steps) ? steps : []
    }, [t, ready])
    const BRANCH_LABELS = useMemo(() => {
        if (!ready) return {}
        return {
            cityCenter: t('parent.registration.cityCenter'),
            germanColony: t('parent.registration.germanColony'),
            rachelImenu: t('parent.registration.rachelImenu')
        }
    }, [t, ready])
    const AGE_LABELS = useMemo(() => {
        if (!ready) return {}
        return {
            under1: t('parent.registration.under1'),
            over1: t('parent.registration.over1')
        }
    }, [t, ready])

    const [activeStep, setActiveStep] = useState(0)
    const isBlocked = useIsBlocked()
    const [schoolYears, setSchoolYears] = useState([])
    const [selectedSchoolYearId, setSelectedSchoolYearId] = useState('')
    const [contractUrl, setContractUrl] = useState('')
    const [contractDownloaded, setContractDownloaded] = useState(false)
    const [signedFile, setSignedFile] = useState(null)
    const [fileError, setFileError] = useState('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [contractModalOpen, setContractModalOpen] = useState(false)
    const [contractModalAcknowledged, setContractModalAcknowledged] = useState(false)
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
    const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token])
    const API = process.env.REACT_APP_API
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const isDark = theme.palette.mode === 'dark'

    // ============================================
    // FORMIK (Step 2)
    // ============================================

    const formik = useFormik({
        initialValues: formValues,
        enableReinitialize: true,
        validationSchema: createRegistrationSchema(t),
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

    const fetchSchoolYears = useCallback(() => {
        setLoading(true)
        axios.get(`${API}/schoolyear/active`, { headers })
            .then(response => {
                setSchoolYears(response.data.data || [])
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching school years:', error)
                toast.error(error.response?.data?.error || t('parent.registration.loadYearsError'))
                setLoading(false)
            })
    }, [API, headers, t])

    const fetchContractUrl = useCallback((schoolYearId, branch, ageGroup) => {
        // Clear any stale URL so the download button never points to
        // a contract in the wrong language while refetching
        setContractUrl('')
        axios.get(`${API}/schoolyear/${schoolYearId}/contract`, {
            headers,
            params: { branch, ageGroup, lang: i18n.language }
        })
            .then(response => {
                setContractUrl(response.data.data?.contractUrl || '')
            })
            .catch(error => {
                console.error('Error fetching contract:', error)
                setContractUrl('')
            })
    }, [API, headers, i18n.language])

    const submitRegistration = () => {
        if (!signedFile) {
            toast.error(t('parent.registration.uploadRequired'))
            return
        }

        setSubmitting(true)
        axios.post(`${API}/registration/create`, {
            schoolYearId: selectedSchoolYearId,
            ...formValues
        }, { headers })
            .then(response => {
                const reg = response.data.data
                return uploadSignedContract(reg._id)
            })
            .catch(error => {
                console.error('Error creating registration:', error)
                toast.error(error.response?.data?.error || t('parent.registration.submitError'))
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
                toast.error(error.response?.data?.error || t('parent.registration.uploadFailed'))
                setSubmitting(false)
                setUploading(false)
            })
    }

    useEffect(() => {
        fetchSchoolYears()
    }, [fetchSchoolYears])

    useEffect(() => {
        if (activeStep === 2 && selectedSchoolYearId && formValues.branch && formValues.ageGroup) {
            fetchContractUrl(selectedSchoolYearId, formValues.branch, formValues.ageGroup)
            setContractDownloaded(false)
        }
    }, [activeStep, selectedSchoolYearId, formValues.branch, formValues.ageGroup, fetchContractUrl])

    useEffect(() => {
        if (activeStep === 3 && !contractModalAcknowledged) {
            setContractModalOpen(true)
        }
    }, [activeStep, contractModalAcknowledged])

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
        setFormValues(initialFormValues)
        formik.resetForm({ values: initialFormValues })
        localStorage.removeItem(STORAGE_KEY)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const { valid, error } = validatePDFFile(file, t)
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
                    {t('parent.registration.selectYearTitle')}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    {t('parent.registration.selectYearText')}
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress color="success" />
                    </Box>
                ) : schoolYears.length === 0 ? (
                    <Alert severity="info">
                        {t('parent.registration.noSchoolYears')}
                    </Alert>
                ) : (
                    <Grid container spacing={2}>
                        {schoolYears.map(sy => (
                            <Grid item xs={12} sm={6} key={sy._id}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        cursor: 'pointer',
                                        border: selectedSchoolYearId === sy._id ? '2px solid #4A7B59' : `1px solid ${isDark ? 'rgba(255,255,255,0.23)' : '#e0e0e0'}`,
                                        backgroundColor: selectedSchoolYearId === sy._id ? (isDark ? 'rgba(102,187,106,0.15)' : '#e8f5e9') : 'transparent',
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
                        {t('common.next')}
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
                            {t('parent.registration.infoTitle')}
                        </Typography>
                        <Chip
                            label={t('parent.registration.progress', { filled: filledFields, total: totalFields })}
                            size="small"
                            color={filledFields === totalFields ? 'success' : 'default'}
                            variant="outlined"
                        />
                    </Box>

                    {/* Progress bar */}
                    <Box sx={{ width: '100%', height: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : '#e0e0e0', borderRadius: 2, mb: 2 }}>
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
                        <Typography variant="subtitle2" color="#4A7B59" mt={1}>{t('parent.registration.parent1')}</Typography>
                        <Divider sx={{ mb: 0.5 }} />
                        <Grid container spacing={isMobile ? 1 : 2}>
                            <Grid item xs={12} sm={4}>
                                <TextField {...textFieldProps('parent1FirstName', t('parent.registration.firstName'))} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField {...textFieldProps('parent1LastName', t('parent.registration.lastName'))} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField {...textFieldProps('parent1IdNumber', t('parent.registration.idNumber'))} />
                            </Grid>
                        </Grid>

                        {/* Parent 2 */}
                        <Typography variant="subtitle2" color="#4A7B59" mt={2}>{t('parent.registration.parent2')}</Typography>
                        <Divider sx={{ mb: 0.5 }} />
                        <Grid container spacing={isMobile ? 1 : 2}>
                            <Grid item xs={12} sm={4}>
                                <TextField {...textFieldProps('parent2FirstName', t('parent.registration.firstName'))} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField {...textFieldProps('parent2LastName', t('parent.registration.lastName'))} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField {...textFieldProps('parent2IdNumber', t('parent.registration.idNumber'))} />
                            </Grid>
                        </Grid>

                        {/* Child */}
                        <Typography variant="subtitle2" color="#4A7B59" mt={2}>{t('parent.registration.child')}</Typography>
                        <Divider sx={{ mb: 0.5 }} />
                        <Grid container spacing={isMobile ? 1 : 2}>
                            <Grid item xs={12} sm={6}>
                                <TextField {...textFieldProps('childName', t('parent.registration.childName'))} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField {...textFieldProps('phoneNumber', t('parent.registration.phoneNumber'))} placeholder={t('parent.registration.phonePlaceholder')} />
                            </Grid>
                        </Grid>

                        {/* Banking */}
                        <Typography variant="subtitle2" color="#4A7B59" mt={2}>{t('parent.registration.bankingInfo')}</Typography>
                        <Divider sx={{ mb: 0.5 }} />
                        <Grid container spacing={isMobile ? 1 : 2}>
                            <Grid item xs={12} sm={6}>
                                <TextField {...textFieldProps('bankName', t('parent.registration.bankName'))} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField {...textFieldProps('bankAccountNumber', t('parent.registration.accountNumber'))} />
                            </Grid>
                        </Grid>

                        {/* Age Group & Branch */}
                        <Grid container spacing={isMobile ? 2 : 4} mt={0.5}>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    error={formik.touched.ageGroup && Boolean(formik.errors.ageGroup)}
                                >
                                    <FormLabel color="success" sx={{ fontWeight: 'bold', color: '#4A7B59', fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                                        {t('parent.registration.ageGroup')} {t('parent.registration.required')}
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
                                        <FormControlLabel value="under1" control={<Radio color="success" size="small" />} label={<Typography variant="body2">{AGE_LABELS.under1}</Typography>} />
                                        <FormControlLabel value="over1" control={<Radio color="success" size="small" />} label={<Typography variant="body2">{AGE_LABELS.over1}</Typography>} />
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
                                        {t('parent.registration.branch')} {t('parent.registration.required')}
                                        {formik.values.branch && !formik.errors.branch && (
                                            <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 16, ml: 0.5, verticalAlign: 'middle' }} />
                                        )}
                                    </FormLabel>
                                    <RadioGroup
                                        name="branch"
                                        value={formik.values.branch}
                                        onChange={formik.handleChange}
                                    >
                                        <FormControlLabel value="cityCenter" control={<Radio color="success" size="small" />} label={<Typography variant="body2">{BRANCH_LABELS.cityCenter}</Typography>} />
                                        <FormControlLabel value="germanColony" control={<Radio color="success" size="small" />} label={<Typography variant="body2">{BRANCH_LABELS.germanColony}</Typography>} />
                                        <FormControlLabel value="rachelImenu" control={<Radio color="success" size="small" />} label={<Typography variant="body2">{BRANCH_LABELS.rachelImenu}</Typography>} />
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
                                {t('parent.registration.fixErrors')}
                            </Alert>
                        )}

                        {/* Buttons */}
                        <Box display="flex" justifyContent="space-between" mt={3} gap={2}>
                            <Button variant="outlined" color="secondary" onClick={() => setActiveStep(0)} sx={{ minWidth: { xs: 80, sm: 100 } }}>
                                {t('common.back')}
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="success"
                                disabled={formik.submitCount > 0 && hasErrors}
                                sx={{ flex: isMobile ? 1 : 'unset' }}
                            >
                                {t('common.next')}
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
                    {t('parent.registration.contractTitle')}
                </Typography>

                <Box sx={{ textAlign: 'center', py: { xs: 2, sm: 3 } }}>
                    <DescriptionIcon sx={{ fontSize: { xs: 40, sm: 60 }, color: '#4A7B59', mb: 1 }} />
                    <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight="bold" gutterBottom>
                        {t('parent.registration.contractReady')}
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
                            {t('parent.registration.downloadPdf')}
                        </Button>
                    ) : (
                        <Alert severity="warning" sx={{ mb: 2, textAlign: 'left' }}>
                            {t('parent.registration.noContractWarning')}
                        </Alert>
                    )}

                    <Box sx={{ backgroundColor: 'action.hover', borderRadius: 2, p: 2, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            {t('parent.registration.contractInstructions')}
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
                        label={<Typography variant="body2">{t('parent.registration.contractCheckbox')}</Typography>}
                    />
                </Box>

                <Box display="flex" justifyContent="space-between" mt={2} gap={2}>
                    <Button variant="outlined" color="secondary" onClick={() => setActiveStep(1)} sx={{ minWidth: { xs: 80, sm: 100 } }}>
                        {t('common.back')}
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        disabled={!contractDownloaded}
                        onClick={() => setActiveStep(3)}
                        sx={{ flex: isMobile ? 1 : 'unset' }}
                    >
                        {t('common.next')}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    )

    const renderStep3 = () => (
        <Card>
            <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                <Typography variant={isMobile ? 'subtitle1' : 'h6'} color="#4A7B59" fontWeight="bold" gutterBottom>
                    {t('parent.registration.uploadTitle')}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    {t('parent.registration.uploadDescription')}
                </Typography>

                <Dialog
                    open={contractModalOpen}
                    onClose={() => {}}
                    disableEscapeKeyDown
                    maxWidth="sm"
                    fullWidth
                    fullScreen={isMobile}
                >
                    <DialogTitle sx={{ color: '#4A7B59', fontWeight: 'bold' }}>
                        {t('parent.registration.modalTitle')}
                    </DialogTitle>
                    <DialogContent>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            <Typography variant="body2" fontWeight="bold">
                                {t('parent.registration.modalWarning')}
                            </Typography>
                        </Alert>
                        <Typography variant="body1" gutterBottom>
                            {t('parent.registration.modalBody1')}
                        </Typography>
                        <Typography variant="body1">
                            {t('parent.registration.modalBody2')}
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                        <Button
                            variant="contained"
                            color="success"
                            fullWidth={isMobile}
                            onClick={() => {
                                setContractModalAcknowledged(true)
                                setContractModalOpen(false)
                            }}
                        >
                            {t('parent.registration.modalUnderstand')}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Box sx={{ textAlign: 'center', py: { xs: 1, sm: 3 } }}>
                    <Box
                        sx={{
                            border: fileError ? '2px dashed #f44336' : signedFile ? '2px dashed #4caf50' : '2px dashed #bdbdbd',
                            borderRadius: 2,
                            p: { xs: 2, sm: 4 },
                            mb: 2,
                            backgroundColor: fileError
                                ? (isDark ? 'rgba(244,67,54,0.12)' : '#fff5f5')
                                : signedFile
                                    ? (isDark ? 'rgba(102,187,106,0.15)' : '#e8f5e9')
                                    : (isDark ? 'rgba(255,255,255,0.04)' : '#fafafa'),
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
                                    {t('parent.registration.fileSize', { size: (signedFile.size / 1024 / 1024).toFixed(2) })}
                                </Typography>
                                <Chip label={t('parent.registration.pdf')} size="small" color="success" variant="outlined" sx={{ ml: 0.5 }} />
                                <Box mt={1}>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => { setSignedFile(null); setFileError('') }}
                                    >
                                        {t('common.remove')}
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Box>
                                <CloudUploadIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: fileError ? '#f44336' : '#bdbdbd', mb: 1 }} />
                                <Typography variant="body2" color={fileError ? 'error' : 'text.secondary'} mb={1} sx={{ px: 1 }}>
                                    {fileError || t('parent.registration.selectPdf')}
                                </Typography>
                                <Button variant="outlined" component="label" color={fileError ? 'error' : 'success'} size={isMobile ? 'small' : 'medium'}>
                                    {t('parent.registration.chooseFile')}
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
                        <Typography variant="caption" color="text.secondary">{t('parent.registration.pdfOnly')}</Typography>
                        <Typography variant="caption" color="text.secondary">{t('parent.registration.maxFileSize')}</Typography>
                    </Box>

                    <Alert severity="info" sx={{ textAlign: 'left' }}>
                        <Typography variant="body2">
                            {t('parent.registration.signAllPages')}
                        </Typography>
                    </Alert>
                </Box>

                <Box display="flex" justifyContent="space-between" mt={3} gap={2}>
                    <Button variant="outlined" color="secondary" onClick={() => setActiveStep(2)} sx={{ minWidth: { xs: 80, sm: 100 } }}>
                        {t('common.back')}
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={submitRegistration}
                        disabled={submitting || uploading || !!fileError || !signedFile}
                        startIcon={(submitting || uploading) ? <CircularProgress size={18} /> : null}
                        sx={{ flex: isMobile ? 1 : 'unset' }}
                    >
                        {submitting ? t('parent.registration.submitting') : t('common.submit')}
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
                    {t('parent.registration.successTitle')}
                </Typography>
                <Chip label={t('parent.registration.pendingApproval')} color="warning" size="small" sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary" mb={2}>
                    {t('parent.registration.successText')}
                </Typography>

                <Card variant="outlined" sx={{ mb: 3, textAlign: 'left' }}>
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                        <Typography variant="subtitle2" color="#4A7B59">{t('common.details')}</Typography>
                        <Divider sx={{ my: 0.5 }} />
                        <Box display="flex" flexDirection="column" gap={0.3}>
                            <Typography variant="body2"><strong>{t('parent.registration.summaryYear')}</strong> {selectedSchoolYear?.name}</Typography>
                            <Typography variant="body2"><strong>{t('parent.registration.summaryChild')}</strong> {formValues.childName}</Typography>
                            <Typography variant="body2"><strong>{t('parent.registration.summaryParent1')}</strong> {formValues.parent1FirstName} {formValues.parent1LastName}</Typography>
                            <Typography variant="body2"><strong>{t('parent.registration.summaryParent2')}</strong> {formValues.parent2FirstName} {formValues.parent2LastName}</Typography>
                            <Typography variant="body2"><strong>{t('parent.registration.summaryBranch')}</strong> {BRANCH_LABELS[formValues.branch]}</Typography>
                            <Typography variant="body2"><strong>{t('parent.registration.summaryAge')}</strong> {AGE_LABELS[formValues.ageGroup]}</Typography>
                            <Typography variant="body2"><strong>{t('parent.registration.summaryContract')}</strong> {t('parent.registration.summaryUploaded')}</Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="center" gap={1.5}>
                    <Button variant="outlined" color="success" onClick={handleReset} fullWidth={isMobile}>
                        {t('parent.registration.registerAnother')}
                    </Button>
                    <Button variant="contained" color="success" onClick={() => navigate('/my-registrations')} fullWidth={isMobile}>
                        {t('parent.registration.myRegistrations')}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    )

    const stepContent = [renderStep0, renderStep1, renderStep2, renderStep3, renderStep4]

    // ============================================
    // RENDER
    // ============================================

    // Blocked users cannot register new children
    if (isBlocked) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Box sx={{ flexGrow: 1 }}>
                    <DrawerAppBar />
                    <Container maxWidth="md" sx={{ py: 4 }}>
                        <Alert severity="warning">
                            {t('parent.registration.blocked')}
                        </Alert>
                    </Container>
                </Box><AppToastContainer />
            </Box>
        )
    }

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
                        {t('parent.registration.title')}
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
                                {t('parent.registration.mobileStep', { step: activeStep + 1, label: STEPS[activeStep] })}
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
            </Box><AppToastContainer />
        </Box>
    )
}

export default ChildRegistration
