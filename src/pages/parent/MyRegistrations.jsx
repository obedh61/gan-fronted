import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import { getCookie, formatDate } from '../helpers'
import DrawerAppBar from '../../components/Bar'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTranslation } from 'react-i18next'
import {
    Box, Container, Typography, Button, Grid,
    Card, CardContent, CardActions,
    Chip, Divider, CircularProgress, Alert,
    Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, Select, MenuItem, Pagination
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ReplayIcon from '@mui/icons-material/Replay'
import ChildCareIcon from '@mui/icons-material/ChildCare'
import DescriptionIcon from '@mui/icons-material/Description'
import { useNavigate } from 'react-router-dom'

const STATUS_COLORS = { pending: 'warning', approved: 'success', rejected: 'error' }

const MyRegistrations = () => {
    const { t, i18n } = useTranslation()

    const BRANCH_LABELS = useMemo(() => ({
        cityCenter: t('parent.myRegistrations.cityCenter'),
        germanColony: t('parent.myRegistrations.germanColony'),
        rachelImenu: t('parent.myRegistrations.rachelImenu')
    }), [t])
    const AGE_LABELS = useMemo(() => ({
        under1: t('parent.myRegistrations.under1'),
        over1: t('parent.myRegistrations.over1')
    }), [t])
    const STATUS_FILTERS = useMemo(() => ['all', 'pending', 'approved', 'rejected'], [])

    const [registrations, setRegistrations] = useState([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('all')
    const [schoolYearFilter, setSchoolYearFilter] = useState('all')
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [selected, setSelected] = useState(null)
    const [page, setPage] = useState(1)
    const [limit] = useState(9)
    const [pages, setPages] = useState(0)

    const navigate = useNavigate()
    const token = getCookie('token')
    const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token])
    const API = process.env.REACT_APP_API

    // ============================================
    // API FUNCTIONS
    // ============================================

    const fetchMyRegistrations = useCallback((currentPage = page) => {
        setLoading(true)
        axios.get(`${API}/registration/my-registrations`, {
            headers,
            params: { page: currentPage, limit }
        })
            .then(response => {
                setRegistrations(response.data.data || [])
                const pagination = response.data.pagination || {}
                setPages(pagination.pages || 0)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching registrations:', error)
                toast.error(error.response?.data?.error || t('parent.myRegistrations.loadError'))
                setLoading(false)
            })
    }, [API, headers, limit, page, t])

    useEffect(() => {
        fetchMyRegistrations()
    }, [fetchMyRegistrations])

    // ============================================
    // FILTERING & SORTING
    // ============================================

    const schoolYears = [...new Map(
        registrations
            .filter(r => r.schoolYear)
            .map(r => [r.schoolYear._id || r.schoolYear, r.schoolYear])
    ).values()]

    const filtered = registrations
        .filter(reg => {
            if (statusFilter !== 'all' && reg.status !== statusFilter) return false
            if (schoolYearFilter !== 'all') {
                const syId = reg.schoolYear?._id || reg.schoolYear
                if (syId !== schoolYearFilter) return false
            }
            return true
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // ============================================
    // HANDLERS
    // ============================================

    const viewDetails = (registration) => {
        setSelected(registration)
        setDetailsOpen(true)
    }

    const registerAgain = () => {
        localStorage.removeItem('childRegistrationForm')
        navigate('/register-child')
    }

    const viewPDF = (url) => {
        window.open(url, '_blank')
    }

    const handlePageChange = (event, value) => {
        setPage(value)
        fetchMyRegistrations(value)
    }

    const formatDateLocal = (dateStr) => formatDate(dateStr, i18n.language)

    // ============================================
    // RENDER
    // ============================================

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box sx={{ flexGrow: 1 }}>
                <DrawerAppBar />
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    {/* Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h4" color="#4A7B59">
                            {t('parent.myRegistrations.title')}
                        </Typography>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/register-child')}
                        >
                            {t('parent.myRegistrations.registerNew')}
                        </Button>
                    </Box>

                    {/* Filters */}
                    <Box display="flex" gap={2} mb={3} flexWrap="wrap" alignItems="center">
                        {/* Status filter chips */}
                        <Box display="flex" gap={1}>
                            {STATUS_FILTERS.map(s => (
                                <Chip
                                    key={s}
                                    label={s === 'all'
                                        ? `${t('common.all')} (${registrations.length})`
                                        : `${t(`common.${s}`)} (${registrations.filter(r => r.status === s).length})`
                                    }
                                    color={statusFilter === s ? (STATUS_COLORS[s] || 'default') : 'default'}
                                    variant={statusFilter === s ? 'filled' : 'outlined'}
                                    onClick={() => setStatusFilter(s)}
                                    sx={{ cursor: 'pointer', textTransform: 'capitalize' }}
                                />
                            ))}
                        </Box>

                        {/* School year dropdown filter */}
                        {schoolYears.length > 1 && (
                            <FormControl size="small" sx={{ minWidth: 200 }}>
                                <InputLabel>{t('parent.myRegistrations.schoolYearFilter')}</InputLabel>
                                <Select
                                    value={schoolYearFilter}
                                    label={t('parent.myRegistrations.schoolYearFilter')}
                                    onChange={e => setSchoolYearFilter(e.target.value)}
                                >
                                    <MenuItem value="all">{t('parent.myRegistrations.allSchoolYears')}</MenuItem>
                                    {schoolYears.map(sy => (
                                        <MenuItem key={sy._id} value={sy._id}>{sy.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Box>

                    {/* Content */}
                    {loading ? (
                        <Box display="flex" justifyContent="center" py={8}>
                            <CircularProgress color="success" />
                        </Box>
                    ) : registrations.length === 0 ? (
                        /* Empty State */
                        <Card sx={{ textAlign: 'center', py: 6 }}>
                            <CardContent>
                                <ChildCareIcon sx={{ fontSize: 80, color: '#bdbdbd', mb: 2 }} />
                                <Typography variant="h5" color="text.secondary" gutterBottom>
                                    {t('parent.myRegistrations.emptyTitle')}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" mb={3}>
                                    {t('parent.myRegistrations.emptyText')}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="large"
                                    startIcon={<AddIcon />}
                                    onClick={() => navigate('/register-child')}
                                >
                                    {t('parent.myRegistrations.registerFirst')}
                                </Button>
                            </CardContent>
                        </Card>
                    ) : filtered.length === 0 ? (
                        <Card>
                            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                <Typography color="text.secondary">
                                    {t('parent.myRegistrations.filteredEmpty')}
                                </Typography>
                            </CardContent>
                        </Card>
                    ) : (
                        /* Registrations Grid */
                        <Grid container spacing={3}>
                            {filtered.map(reg => (
                                <Grid item xs={12} sm={6} md={4} key={reg._id}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            borderLeft: `4px solid ${
                                                reg.status === 'approved' ? '#4caf50' :
                                                reg.status === 'rejected' ? '#f44336' : '#ff9800'
                                            }`,
                                            '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                                        }}
                                    >
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                {reg.childName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                {reg.schoolYear?.name || t('parent.myRegistrations.schoolYear')}
                                            </Typography>
                                            <Box display="flex" gap={1} mb={1.5} flexWrap="wrap">
                                                <Chip
                                                    label={t(`common.${reg.status}`)}
                                                    color={STATUS_COLORS[reg.status] || 'default'}
                                                    size="small"
                                                    sx={{ textTransform: 'capitalize' }}
                                                />
                                            </Box>
                                            <Divider sx={{ my: 1 }} />
                                            <Box display="flex" flexDirection="column" gap={0.5}>
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>{t('parent.myRegistrations.date')}</strong> {formatDateLocal(reg.createdAt)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>{t('parent.myRegistrations.branch')}</strong> {BRANCH_LABELS[reg.branch] || reg.branch}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>{t('parent.myRegistrations.ageGroup')}</strong> {AGE_LABELS[reg.ageGroup] || reg.ageGroup}
                                                </Typography>
                                            </Box>

                                            {reg.status === 'rejected' && reg.rejectionReason && (
                                                <Alert severity="error" sx={{ mt: 1.5, py: 0 }} variant="outlined">
                                                    <Typography variant="caption">{reg.rejectionReason}</Typography>
                                                </Alert>
                                            )}
                                        </CardContent>
                                        <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                                            <Button
                                                size="small"
                                                startIcon={<VisibilityIcon />}
                                                onClick={() => viewDetails(reg)}
                                                sx={{ color: '#4A7B59' }}
                                            >
                                                {t('parent.myRegistrations.viewDetails')}
                                            </Button>
                                            {reg.status === 'rejected' && (
                                                <Button
                                                    size="small"
                                                    startIcon={<ReplayIcon />}
                                                    color="primary"
                                                    onClick={registerAgain}
                                                >
                                                    {t('parent.myRegistrations.registerAgain')}
                                                </Button>
                                            )}
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {pages > 1 && (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Pagination
                                count={pages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                shape="rounded"
                            />
                        </Box>
                    )}

                    {/* ============================================ */}
                    {/* DETAILS DIALOG */}
                    {/* ============================================ */}
                    <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>
                            {t('parent.myRegistrations.detailsTitle')}
                            {selected && (
                                <Chip
                                    label={t(`common.${selected.status}`)}
                                    color={STATUS_COLORS[selected.status]}
                                    size="small"
                                    sx={{ ml: 2, textTransform: 'capitalize' }}
                                />
                            )}
                        </DialogTitle>
                        {selected && (
                            <DialogContent>
                                {/* Parent 1 */}
                                <Typography variant="subtitle2" color="#4A7B59" mt={1}>{t('parent.myRegistrations.parent1Info')}</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box display="flex" gap={4} mb={2} flexWrap="wrap">
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('parent.myRegistrations.firstName')}</Typography>
                                        <Typography>{selected.parent1FirstName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('parent.myRegistrations.lastName')}</Typography>
                                        <Typography>{selected.parent1LastName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('parent.myRegistrations.idNumber')}</Typography>
                                        <Typography>{selected.parent1IdNumber}</Typography>
                                    </Box>
                                </Box>

                                {/* Parent 2 */}
                                <Typography variant="subtitle2" color="#4A7B59">{t('parent.myRegistrations.parent2Info')}</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box display="flex" gap={4} mb={2} flexWrap="wrap">
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('parent.myRegistrations.firstName')}</Typography>
                                        <Typography>{selected.parent2FirstName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('parent.myRegistrations.lastName')}</Typography>
                                        <Typography>{selected.parent2LastName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('parent.myRegistrations.idNumber')}</Typography>
                                        <Typography>{selected.parent2IdNumber}</Typography>
                                    </Box>
                                </Box>

                                {/* Child Info */}
                                <Typography variant="subtitle2" color="#4A7B59">{t('parent.myRegistrations.childInfo')}</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box display="flex" gap={4} mb={2} flexWrap="wrap">
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('parent.myRegistrations.childName')}</Typography>
                                        <Typography>{selected.childName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('parent.myRegistrations.branchLabel')}</Typography>
                                        <Typography>{BRANCH_LABELS[selected.branch]}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('parent.myRegistrations.ageGroupLabel')}</Typography>
                                        <Typography>{AGE_LABELS[selected.ageGroup]}</Typography>
                                    </Box>
                                </Box>

                                {/* Banking */}
                                <Typography variant="subtitle2" color="#4A7B59">{t('parent.myRegistrations.bankingInfo')}</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box display="flex" gap={4} mb={2} flexWrap="wrap">
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('parent.myRegistrations.phone')}</Typography>
                                        <Typography>{selected.phoneNumber}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('parent.myRegistrations.bank')}</Typography>
                                        <Typography>{selected.bankName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('parent.myRegistrations.account')}</Typography>
                                        <Typography>{selected.bankAccountNumber}</Typography>
                                    </Box>
                                </Box>

                                {/* Status & Dates */}
                                <Typography variant="subtitle2" color="#4A7B59">{t('parent.myRegistrations.status')}</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box display="flex" gap={4} mb={2} flexWrap="wrap">
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('parent.myRegistrations.schoolYear')}</Typography>
                                        <Typography>{selected.schoolYear?.name || '-'}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('parent.myRegistrations.submitted')}</Typography>
                                        <Typography>{formatDateLocal(selected.createdAt)}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('parent.myRegistrations.status')}</Typography>
                                        <Typography sx={{ textTransform: 'capitalize' }}>{t(`common.${selected.status}`)}</Typography>
                                    </Box>
                                </Box>

                                {/* Rejection reason */}
                                {selected.status === 'rejected' && selected.rejectionReason && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>{t('parent.myRegistrations.rejectionReason')}</Typography>
                                        <Typography variant="body2">{selected.rejectionReason}</Typography>
                                        {selected.reviewedAt && (
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                                {t('parent.myRegistrations.reviewedOn', { date: formatDateLocal(selected.reviewedAt) })}
                                            </Typography>
                                        )}
                                    </Alert>
                                )}

                                {/* Approved info */}
                                {selected.status === 'approved' && selected.reviewedAt && (
                                    <Alert severity="success" sx={{ mb: 2 }}>
                                        <Typography variant="body2">
                                            {t('parent.myRegistrations.approvedOn', { date: formatDateLocal(selected.reviewedAt) })}
                                        </Typography>
                                    </Alert>
                                )}

                                {/* Contracts */}
                                <Typography variant="subtitle2" color="#4A7B59">{t('parent.myRegistrations.contracts')}</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box display="flex" gap={2} flexWrap="wrap">
                                    {selected.assignedContractUrl ? (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<DescriptionIcon />}
                                            onClick={() => viewPDF(selected.assignedContractUrl)}
                                        >
                                            {t('parent.myRegistrations.viewAssignedContract')}
                                        </Button>
                                    ) : (
                                        <Chip label={t('parent.myRegistrations.noAssignedContract')} size="small" variant="outlined" />
                                    )}
                                    {selected.uploadedContractUrl ? (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="success"
                                            startIcon={<DescriptionIcon />}
                                            onClick={() => viewPDF(selected.uploadedContractUrl)}
                                        >
                                            {t('parent.myRegistrations.viewUploadedContract')}
                                        </Button>
                                    ) : (
                                        <Chip label={t('parent.myRegistrations.noSignedContract')} size="small" variant="outlined" color="warning" />
                                    )}
                                </Box>
                            </DialogContent>
                        )}
                        <DialogActions>
                            {selected?.status === 'rejected' && (
                                <Button
                                    onClick={registerAgain}
                                    color="primary"
                                    startIcon={<ReplayIcon />}
                                >
                                    {t('parent.myRegistrations.registerAgain')}
                                </Button>
                            )}
                            <Button onClick={() => setDetailsOpen(false)}>{t('common.close')}</Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box><ToastContainer />
        </Box>
    )
}

export default MyRegistrations
