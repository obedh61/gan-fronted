import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { getCookie } from '../helpers'
import DrawerAppBar from '../../components/Bar'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
    Box, Container, Typography, Button, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Switch, FormControl, InputLabel, Select, MenuItem,
    Card, CardContent, Chip, CircularProgress, Tooltip, Pagination,
    useMediaQuery, useTheme
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize'
import { useNavigate } from 'react-router-dom'

const MONTH_VALUES = [
    'September', 'October', 'November', 'December',
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August'
]

const SchoolYearManagement = () => {
    const { t } = useTranslation()
    const [schoolYears, setSchoolYears] = useState([])
    const [loading, setLoading] = useState(true)
    const [createOpen, setCreateOpen] = useState(false)
    const [contractOpen, setContractOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [selectedYear, setSelectedYear] = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [uploading, setUploading] = useState({})
    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [total, setTotal] = useState(0)
    const [pages, setPages] = useState(0)
    const [formData, setFormData] = useState({
        startMonth: 'September',
        startYear: new Date().getFullYear(),
        endMonth: 'August',
        endYear: new Date().getFullYear() + 1
    })

    const navigate = useNavigate()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const token = getCookie('token')
    const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token])

    const CONTRACT_TYPES = useMemo(() => [
        { key: 'cityCenterUnderOne', label: t('admin.schoolYear.contractCityCenterUnder1') },
        { key: 'cityCenterOverOne', label: t('admin.schoolYear.contractCityCenterOver1') },
        { key: 'germanColonyUnderOne', label: t('admin.schoolYear.contractGermanColonyUnder1') },
        { key: 'germanColonyOverOne', label: t('admin.schoolYear.contractGermanColonyOver1') }
    ], [t])

    const MONTHS = useMemo(() => {
        const labels = t('schoolYearMonths', { returnObjects: true })
        if (Array.isArray(labels) && labels.length === MONTH_VALUES.length) {
            return MONTH_VALUES.map((value, index) => ({ value, label: labels[index] }))
        }
        return MONTH_VALUES.map(value => ({ value, label: value }))
    }, [t])

    // ============================================
    // API FUNCTIONS
    // ============================================

    const fetchSchoolYears = useCallback((currentPage = page) => {
        setLoading(true)
        axios.get(`${process.env.REACT_APP_API}/schoolyear/list`, {
            headers,
            params: { page: currentPage, limit }
        })
            .then(response => {
                setSchoolYears(response.data.data || [])
                const pagination = response.data.pagination || {}
                setTotal(pagination.total || 0)
                setPages(pagination.pages || 0)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching school years:', error)
                toast.error(error.response?.data?.error || t('admin.schoolYear.fetchError'))
                setLoading(false)
            })
    }, [headers, limit, page, t])

    const createSchoolYear = () => {
        const { startMonth, startYear, endMonth, endYear } = formData
        const name = `${startMonth} ${startYear} - ${endMonth} ${endYear}`

        axios.post(`${process.env.REACT_APP_API}/schoolyear/create`, {
            name, startMonth, startYear, endMonth, endYear
        }, { headers })
            .then(response => {
                toast.success(t('admin.schoolYear.createSuccess'))
                setCreateOpen(false)
                setFormData({
                    startMonth: 'September',
                    startYear: new Date().getFullYear(),
                    endMonth: 'August',
                    endYear: new Date().getFullYear() + 1
                })
                fetchSchoolYears()
            })
            .catch(error => {
                console.error('Error creating school year:', error)
                toast.error(error.response?.data?.error || t('admin.schoolYear.createError'))
            })
    }

    const toggleActive = (id) => {
        axios.put(`${process.env.REACT_APP_API}/schoolyear/${id}/toggle-active`, {}, { headers })
            .then(response => {
                const updated = response.data.data
                setSchoolYears(prev => prev.map(sy =>
                    sy._id === id ? { ...sy, isActive: updated.isActive } : sy
                ))
                toast.success(response.data.message)
            })
            .catch(error => {
                console.error('Error toggling active status:', error)
                toast.error(error.response?.data?.error || t('admin.schoolYear.statusError'))
            })
    }

    const deleteSchoolYear = () => {
        if (!deleteTarget) return
        axios.delete(`${process.env.REACT_APP_API}/schoolyear/${deleteTarget._id}`, { headers })
            .then(() => {
                toast.success(t('admin.schoolYear.deleteSuccess'))
                setDeleteOpen(false)
                setDeleteTarget(null)
                fetchSchoolYears()
            })
            .catch(error => {
                console.error('Error deleting school year:', error)
                toast.error(error.response?.data?.error || t('admin.schoolYear.deleteError'))
                setDeleteOpen(false)
            })
    }

    const uploadContract = (schoolYearId, contractType, file) => {
        const formData = new FormData()
        formData.append('contract', file)
        formData.append('contractType', contractType)

        setUploading(prev => ({ ...prev, [contractType]: true }))

        axios.post(
            `${process.env.REACT_APP_API}/schoolyear/${schoolYearId}/upload-contract`,
            formData,
            { headers: { ...headers, 'Content-Type': 'multipart/form-data' } }
        )
            .then(response => {
                toast.success(t('admin.schoolYear.uploadSuccess'))
                const updated = response.data.data.schoolYear
                setSelectedYear(updated)
                setSchoolYears(prev => prev.map(sy =>
                    sy._id === updated._id ? updated : sy
                ))
                setUploading(prev => ({ ...prev, [contractType]: false }))
            })
            .catch(error => {
                console.error('Error uploading contract:', error)
                toast.error(error.response?.data?.error || t('admin.schoolYear.uploadError'))
                setUploading(prev => ({ ...prev, [contractType]: false }))
            })
    }

    const viewContract = (url) => {
        window.open(url, '_blank')
    }

    useEffect(() => {
        fetchSchoolYears()
    }, [fetchSchoolYears])

    // ============================================
    // HANDLERS
    // ============================================

    const handleFileChange = (contractType, e) => {
        const file = e.target.files[0]
        if (!file) return
        if (file.type !== 'application/pdf') {
            toast.error(t('admin.schoolYear.pdfOnly'))
            return
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error(t('admin.schoolYear.maxFileSize'))
            return
        }
        uploadContract(selectedYear._id, contractType, file)
        e.target.value = ''
    }

    const openContractDialog = (schoolYear) => {
        setSelectedYear(schoolYear)
        setContractOpen(true)
    }

    const openDeleteDialog = (schoolYear) => {
        setDeleteTarget(schoolYear)
        setDeleteOpen(true)
    }

    // ============================================
    // RENDER
    // ============================================

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box sx={{ flexGrow: 1 }}>
                <DrawerAppBar />
                <Container sx={{ py: 4 }}>
                    {/* Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} gap={1} flexWrap="wrap">
                        <Typography variant="h4" color="#4A7B59" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                            {t('admin.schoolYear.title')} {total > 0 && <Typography component="span" variant="body2" color="text.secondary">{t('admin.schoolYear.totalSuffix', { total })}</Typography>}
                        </Typography>
                        <Box display="flex" gap={1}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => setCreateOpen(true)}
                                sx={{ minWidth: 'auto', px: { xs: 1, sm: 2 } }}
                            >
                                {isMobile ? <AddIcon /> : <><AddIcon sx={{ mr: 0.5 }} /> {t('admin.schoolYear.createNew')}</>}
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate('/admin')}
                                sx={{ minWidth: 'auto', px: { xs: 1, sm: 2 } }}
                            >
                                {isMobile ? <DashboardCustomizeIcon /> : <>{t('common.dashboard')} <DashboardCustomizeIcon sx={{ ml: 1 }} /></>}
                            </Button>
                        </Box>
                    </Box>

                    {/* Table */}
                    {loading ? (
                        <Box display="flex" justifyContent="center" py={6}>
                            <CircularProgress color="success" />
                        </Box>
                    ) : schoolYears.length === 0 ? (
                        <Card>
                            <CardContent>
                                <Typography align="center" color="text.secondary">
                                    {t('admin.schoolYear.noSchoolYears')}
                                </Typography>
                            </CardContent>
                        </Card>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableCell><strong>{t('admin.schoolYear.name')}</strong></TableCell>
                                        <TableCell><strong>{t('admin.schoolYear.start')}</strong></TableCell>
                                        <TableCell><strong>{t('admin.schoolYear.end')}</strong></TableCell>
                                        <TableCell align="center"><strong>{t('admin.schoolYear.active')}</strong></TableCell>
                                        <TableCell align="center"><strong>{t('admin.schoolYear.contracts')}</strong></TableCell>
                                        <TableCell align="center"><strong>{t('common.actions')}</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {schoolYears.map(sy => {
                                        const contractCount = CONTRACT_TYPES.filter(
                                            ct => sy.contracts && sy.contracts[ct.key]
                                        ).length
                                        return (
                                            <TableRow key={sy._id} hover>
                                                <TableCell>{sy.name}</TableCell>
                                                <TableCell>{sy.startMonth} {sy.startYear}</TableCell>
                                                <TableCell>{sy.endMonth} {sy.endYear}</TableCell>
                                                <TableCell align="center">
                                                    <Switch
                                                        checked={sy.isActive}
                                                        onChange={() => toggleActive(sy._id)}
                                                        color="success"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title={t('admin.schoolYear.manageContracts')}>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            startIcon={<UploadFileIcon />}
                                                            onClick={() => openContractDialog(sy)}
                                                        >
                                                            {t('admin.schoolYear.contractCount', { count: contractCount })}
                                                        </Button>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title={t('common.delete')}>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => openDeleteDialog(sy)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {pages > 1 && (
                        <Box display="flex" justifyContent="center" mt={3}>
                            <Pagination
                                page={page}
                                count={pages}
                                onChange={(e, value) => {
                                    setPage(value)
                                    fetchSchoolYears(value)
                                }}
                                color="success"
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    )}

                    {/* ============================================ */}
                    {/* CREATE DIALOG */}
                    {/* ============================================ */}
                    <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth fullScreen={isMobile}>
                        <DialogTitle>{t('admin.schoolYear.createDialogTitle')}</DialogTitle>
                        <DialogContent>
                            <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary" mb={2}>
                                    {t('admin.schoolYear.generatedName', {
                                        startMonth: formData.startMonth,
                                        startYear: formData.startYear,
                                        endMonth: formData.endMonth,
                                        endYear: formData.endYear
                                    })}
                                </Typography>
                                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
                                    <FormControl fullWidth>
                                        <InputLabel>{t('admin.schoolYear.startMonth')}</InputLabel>
                                        <Select
                                            value={formData.startMonth}
                                            label={t('admin.schoolYear.startMonth')}
                                            onChange={e => setFormData({ ...formData, startMonth: e.target.value })}
                                        >
                                            {MONTHS.map(m => (
                                                <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        label={t('admin.schoolYear.startYear')}
                                        type="number"
                                        value={formData.startYear}
                                        onChange={e => setFormData({ ...formData, startYear: Number(e.target.value) })}
                                        fullWidth
                                    />
                                </Box>
                                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                                    <FormControl fullWidth>
                                        <InputLabel>{t('admin.schoolYear.endMonth')}</InputLabel>
                                        <Select
                                            value={formData.endMonth}
                                            label={t('admin.schoolYear.endMonth')}
                                            onChange={e => setFormData({ ...formData, endMonth: e.target.value })}
                                        >
                                            {MONTHS.map(m => (
                                                <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        label={t('admin.schoolYear.endYear')}
                                        type="number"
                                        value={formData.endYear}
                                        onChange={e => setFormData({ ...formData, endYear: Number(e.target.value) })}
                                        fullWidth
                                    />
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setCreateOpen(false)}>{t('common.cancel')}</Button>
                            <Button onClick={createSchoolYear} variant="contained" color="success">
                                {t('admin.schoolYear.create')}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* ============================================ */}
                    {/* CONTRACT UPLOAD DIALOG */}
                    {/* ============================================ */}
                    <Dialog open={contractOpen} onClose={() => setContractOpen(false)} maxWidth="sm" fullWidth fullScreen={isMobile}>
                        <DialogTitle sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                            {t('admin.schoolYear.contractsTitle', { name: selectedYear?.name })}
                        </DialogTitle>
                        <DialogContent sx={{ px: { xs: 1.5, sm: 3 } }}>
                            {CONTRACT_TYPES.map(ct => {
                                const url = selectedYear?.contracts?.[ct.key]
                                const isUploading = uploading[ct.key]
                                return (
                                    <Card key={ct.key} variant="outlined" sx={{ mb: 2, mt: 1 }}>
                                        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 }, px: { xs: 1.5, sm: 2 } }}>
                                            <Box display="flex" alignItems="center" gap={1} mb={{ xs: 1, sm: 0 }} flexWrap="wrap"
                                                sx={{ justifyContent: { sm: 'space-between' } }}
                                            >
                                                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                                    {url ? (
                                                        <CheckCircleIcon color="success" fontSize="small" />
                                                    ) : (
                                                        <CancelIcon color="error" fontSize="small" />
                                                    )}
                                                    <Typography variant="body2">
                                                        {ct.label}
                                                    </Typography>
                                                    {url && (
                                                        <Chip label={t('admin.schoolYear.uploaded')} size="small" color="success" variant="outlined" />
                                                    )}
                                                </Box>
                                                <Box display="flex" gap={1}>
                                                    {url && (
                                                        <Button
                                                            size="small"
                                                            startIcon={<VisibilityIcon />}
                                                            onClick={() => viewContract(url)}
                                                        >
                                                            {t('admin.schoolYear.view')}
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        component="label"
                                                        startIcon={isUploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
                                                        disabled={isUploading}
                                                    >
                                                        {url ? t('admin.schoolYear.replace') : t('admin.schoolYear.upload')}
                                                        <input
                                                            type="file"
                                                            accept="application/pdf"
                                                            hidden
                                                            onChange={(e) => handleFileChange(ct.key, e)}
                                                        />
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setContractOpen(false)} variant="contained">
                                {t('common.close')}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* ============================================ */}
                    {/* DELETE CONFIRMATION DIALOG */}
                    {/* ============================================ */}
                    <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                        <DialogTitle>{t('admin.schoolYear.confirmDeleteTitle')}</DialogTitle>
                        <DialogContent>
                            <Typography>
                                {t('admin.schoolYear.confirmDeleteText', { name: deleteTarget?.name })}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDeleteOpen(false)}>{t('common.cancel')}</Button>
                            <Button onClick={deleteSchoolYear} variant="contained" color="error">
                                {t('common.delete')}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box><ToastContainer />
        </Box>
    )
}

export default SchoolYearManagement
