import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { getCookie, formatDate } from '../helpers'
import DrawerAppBar from '../../components/Bar'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
    Box, Container, Typography, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Chip, Tabs, Tab, Divider,
    Card, CardContent, CircularProgress, InputAdornment, Pagination,
    useMediaQuery, useTheme
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteIcon from '@mui/icons-material/Delete'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize'
import { useNavigate } from 'react-router-dom'

const STATUS_COLORS = { pending: 'warning', approved: 'success', rejected: 'error' }
const TAB_STATUS = [null, 'pending', 'approved', 'rejected']

const PendingRegistrations = () => {
    const { t, i18n } = useTranslation()
    const [registrations, setRegistrations] = useState([])
    const [loading, setLoading] = useState(true)
    const [tabValue, setTabValue] = useState(0)
    const [searchQuery, setSearchQuery] = useState('')
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [selected, setSelected] = useState(null)
    const [rejectOpen, setRejectOpen] = useState(false)
    const [rejectTarget, setRejectTarget] = useState(null)
    const [rejectionReason, setRejectionReason] = useState('')
    const [actionLoading, setActionLoading] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [total, setTotal] = useState(0)
    const [pages, setPages] = useState(0)

    const navigate = useNavigate()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const token = getCookie('token')
    const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token])
    const API = process.env.REACT_APP_API

    const BRANCH_LABELS = useMemo(() => t('common.branchLabels', { returnObjects: true }), [t])
    const AGE_LABELS = useMemo(() => t('common.ageLabels', { returnObjects: true }), [t])

    // ============================================
    // API FUNCTIONS
    // ============================================

    const statusFilter = TAB_STATUS[tabValue]

    const fetchRegistrations = useCallback((currentPage = page) => {
        setLoading(true)
        const params = {
            page: currentPage,
            limit
        }
        if (statusFilter) {
            params.status = statusFilter
        }
        if (searchQuery.trim()) {
            params.search = searchQuery.trim()
        }

        axios.get(`${API}/registration/all`, { headers, params })
            .then(response => {
                setRegistrations(response.data.data || [])
                const pagination = response.data.pagination || {}
                setTotal(pagination.total || 0)
                setPages(pagination.pages || 0)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching registrations:', error)
                toast.error(error.response?.data?.error || t('admin.registrations.fetchError'))
                setLoading(false)
            })
    }, [API, headers, limit, statusFilter, searchQuery, page, t])

    const approveRegistration = (id) => {
        setActionLoading(true)
        axios.patch(`${API}/registration/${id}/approve`, {}, { headers })
            .then(response => {
                toast.success(t('admin.registrations.approveSuccess'))
                setDetailsOpen(false)
                setSelected(null)
                fetchRegistrations()
            })
            .catch(error => {
                console.error('Error approving registration:', error)
                toast.error(error.response?.data?.error || t('admin.registrations.approveError'))
            })
            .finally(() => setActionLoading(false))
    }

    const rejectRegistration = () => {
        if (!rejectionReason.trim()) {
            toast.error(t('admin.registrations.rejectReasonRequired'))
            return
        }
        setActionLoading(true)
        axios.patch(`${API}/registration/${rejectTarget._id}/reject`, {
            rejectionReason: rejectionReason.trim()
        }, { headers })
            .then(response => {
                toast.success(t('admin.registrations.rejectSuccess'))
                setRejectOpen(false)
                setRejectTarget(null)
                setRejectionReason('')
                setDetailsOpen(false)
                setSelected(null)
                fetchRegistrations()
            })
            .catch(error => {
                console.error('Error rejecting registration:', error)
                toast.error(error.response?.data?.error || t('admin.registrations.rejectError'))
            })
            .finally(() => setActionLoading(false))
    }

    const deleteRegistration = () => {
        if (!deleteTarget) return
        setActionLoading(true)
        axios.delete(`${API}/registration/${deleteTarget._id}`, { headers })
            .then(() => {
                toast.success(t('admin.registrations.deleteSuccess'))
                setDeleteOpen(false)
                setDeleteTarget(null)
                setDetailsOpen(false)
                setSelected(null)
                fetchRegistrations()
            })
            .catch(error => {
                console.error('Error deleting registration:', error)
                toast.error(error.response?.data?.error || t('admin.registrations.deleteError'))
            })
            .finally(() => setActionLoading(false))
    }

    const openDeleteDialog = (reg) => {
        setDeleteTarget(reg)
        setDeleteOpen(true)
    }

    const viewPDF = (url) => {
        window.open(url, '_blank')
    }

    useEffect(() => {
        fetchRegistrations()
    }, [fetchRegistrations])

    // ============================================
    // HANDLERS
    // ============================================

    const handleTabChange = (e, v) => {
        setTabValue(v)
        setPage(1)
    }

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
        setPage(1)
    }

    const handlePageChange = (e, value) => {
        setPage(value)
    }

    const openDetails = (reg) => {
        setSelected(reg)
        setDetailsOpen(true)
    }

    const openRejectDialog = (reg) => {
        setRejectTarget(reg)
        setRejectionReason('')
        setRejectOpen(true)
    }

    const formatDateLocal = (dateStr) => formatDate(dateStr, i18n.language)

    // ============================================
    // RENDER
    // ============================================

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box sx={{ flexGrow: 1 }}>
                <DrawerAppBar />
                <Container sx={{ py: 4 }}>
                    {/* Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} gap={1}>
                        <Typography variant="h4" color="#4A7B59" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                            {t('admin.registrations.title')}
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => navigate('/admin')}
                            sx={{ minWidth: 'auto', px: { xs: 1, sm: 2 } }}
                        >
                            {isMobile ? <DashboardCustomizeIcon /> : <>{t('common.dashboard')} <DashboardCustomizeIcon sx={{ ml: 1 }} /></>}
                        </Button>
                    </Box>

                    {/* Tabs + Search */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            textColor="inherit"
                            sx={{ '& .Mui-selected': { color: '#4A7B59' }, '& .MuiTabs-indicator': { backgroundColor: '#4A7B59' } }}
                        >
                            <Tab label={t('admin.registrations.tabs.all')} />
                            <Tab label={t('admin.registrations.tabs.pending')} />
                            <Tab label={t('admin.registrations.tabs.approved')} />
                            <Tab label={t('admin.registrations.tabs.rejected')} />
                        </Tabs>
                        <TextField
                            size="small"
                            placeholder={t('admin.registrations.searchPlaceholder')}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                            sx={{ minWidth: 280 }}
                        />
                    </Box>

                    {/* Table */}
                    {!loading && total > 0 && (
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            {t('admin.registrations.resultsText', {
                                shown: registrations.length,
                                total,
                                plural: total !== 1 ? 's' : ''
                            })}
                        </Typography>
                    )}
                    {loading ? (
                        <Box display="flex" justifyContent="center" py={6}>
                            <CircularProgress color="success" />
                        </Box>
                    ) : registrations.length === 0 ? (
                        <Card>
                            <CardContent>
                                <Typography align="center" color="text.secondary">
                                    {t('admin.registrations.empty')}
                                </Typography>
                            </CardContent>
                        </Card>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableCell><strong>{t('admin.registrations.childName')}</strong></TableCell>
                                        <TableCell><strong>{t('admin.registrations.parent1')}</strong></TableCell>
                                        <TableCell><strong>{t('admin.registrations.parent2')}</strong></TableCell>
                                        <TableCell><strong>{t('admin.registrations.schoolYear')}</strong></TableCell>
                                        <TableCell><strong>{t('admin.registrations.branch')}</strong></TableCell>
                                        <TableCell><strong>{t('admin.registrations.ageGroup')}</strong></TableCell>
                                        <TableCell><strong>{t('admin.registrations.date')}</strong></TableCell>
                                        <TableCell align="center"><strong>{t('common.status')}</strong></TableCell>
                                        <TableCell align="center"><strong>{t('common.actions')}</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {registrations.map(reg => (
                                        <TableRow key={reg._id} hover>
                                            <TableCell>{reg.childName}</TableCell>
                                            <TableCell>{reg.parent1FirstName} {reg.parent1LastName}</TableCell>
                                            <TableCell>{reg.parent2FirstName} {reg.parent2LastName}</TableCell>
                                            <TableCell>{reg.schoolYear?.name || '-'}</TableCell>
                                            <TableCell>{BRANCH_LABELS[reg.branch] || reg.branch}</TableCell>
                                            <TableCell>{AGE_LABELS[reg.ageGroup] || reg.ageGroup}</TableCell>
                                            <TableCell>{formatDateLocal(reg.createdAt)}</TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={t(`common.${reg.status}`)}
                                                    color={STATUS_COLORS[reg.status] || 'default'}
                                                    size="small"
                                                    sx={{ textTransform: 'capitalize' }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box display="flex" justifyContent="center" gap={0.5}>
                                                    <Button
                                                        size="small"
                                                        startIcon={<VisibilityIcon />}
                                                        onClick={() => openDetails(reg)}
                                                    >
                                                        {t('common.details')}
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        startIcon={<DeleteIcon />}
                                                        onClick={() => openDeleteDialog(reg)}
                                                    >
                                                        {t('common.delete')}
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* Pagination */}
                    {pages > 1 && (
                        <Box display="flex" justifyContent="center" mt={3}>
                            <Pagination
                                page={page}
                                count={pages}
                                onChange={handlePageChange}
                                color="success"
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    )}

                    {/* ============================================ */}
                    {/* DETAILS DIALOG */}
                    {/* ============================================ */}
                    <Dialog
                        open={detailsOpen}
                        onClose={() => setDetailsOpen(false)}
                        maxWidth="sm"
                        fullWidth
                        fullScreen={isMobile}
                    >
                        <DialogTitle sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                            {t('admin.registrations.detailsTitle')}
                            {selected && (
                                <Chip
                                    label={t(`common.${selected.status}`)}
                                    color={STATUS_COLORS[selected.status]}
                                    size="small"
                                    sx={{ textTransform: 'capitalize' }}
                                />
                            )}
                        </DialogTitle>
                        {selected && (
                            <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
                                {/* Parent 1 */}
                                <Typography variant="subtitle2" color="#4A7B59" mt={1}>{t('admin.registrations.parent1Info')}</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box
                                    display="grid"
                                    gridTemplateColumns={{ xs: '1fr 1fr', sm: '1fr 1fr 1fr' }}
                                    gap={{ xs: 1.5, sm: 4 }}
                                    mb={2}
                                >
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('admin.registrations.firstName')}</Typography>
                                        <Typography variant="body2">{selected.parent1FirstName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('admin.registrations.lastName')}</Typography>
                                        <Typography variant="body2">{selected.parent1LastName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('admin.registrations.idNumber')}</Typography>
                                        <Typography variant="body2">{selected.parent1IdNumber}</Typography>
                                    </Box>
                                </Box>

                                {/* Parent 2 */}
                                <Typography variant="subtitle2" color="#4A7B59">{t('admin.registrations.parent2Info')}</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box
                                    display="grid"
                                    gridTemplateColumns={{ xs: '1fr 1fr', sm: '1fr 1fr 1fr' }}
                                    gap={{ xs: 1.5, sm: 4 }}
                                    mb={2}
                                >
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('admin.registrations.firstName')}</Typography>
                                        <Typography variant="body2">{selected.parent2FirstName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('admin.registrations.lastName')}</Typography>
                                        <Typography variant="body2">{selected.parent2LastName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('admin.registrations.idNumber')}</Typography>
                                        <Typography variant="body2">{selected.parent2IdNumber}</Typography>
                                    </Box>
                                </Box>

                                {/* Child Info */}
                                <Typography variant="subtitle2" color="#4A7B59">{t('admin.registrations.childInfo')}</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box
                                    display="grid"
                                    gridTemplateColumns={{ xs: '1fr 1fr', sm: '1fr 1fr 1fr' }}
                                    gap={{ xs: 1.5, sm: 4 }}
                                    mb={2}
                                >
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('admin.registrations.childNameLabel')}</Typography>
                                        <Typography variant="body2">{selected.childName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('admin.registrations.branchLabel')}</Typography>
                                        <Typography variant="body2">{BRANCH_LABELS[selected.branch]}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('admin.registrations.ageGroupLabel')}</Typography>
                                        <Typography variant="body2">{AGE_LABELS[selected.ageGroup]}</Typography>
                                    </Box>
                                </Box>

                                {/* Banking */}
                                <Typography variant="subtitle2" color="#4A7B59">{t('admin.registrations.bankingInfo')}</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box
                                    display="grid"
                                    gridTemplateColumns={{ xs: '1fr 1fr', sm: '1fr 1fr 1fr' }}
                                    gap={{ xs: 1.5, sm: 4 }}
                                    mb={2}
                                >
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('admin.registrations.phone')}</Typography>
                                        <Typography variant="body2">{selected.phoneNumber}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('admin.registrations.bank')}</Typography>
                                        <Typography variant="body2">{selected.bankName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('admin.registrations.account')}</Typography>
                                        <Typography variant="body2">{selected.bankAccountNumber}</Typography>
                                    </Box>
                                </Box>

                                {/* Contracts */}
                                <Typography variant="subtitle2" color="#4A7B59">{t('admin.registrations.contracts')}</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={1} mb={2}>
                                    {selected.assignedContractUrl ? (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<VisibilityIcon />}
                                            onClick={() => viewPDF(selected.assignedContractUrl)}
                                            fullWidth={isMobile}
                                        >
                                            {t('admin.registrations.viewAssignedContract')}
                                        </Button>
                                    ) : (
                                        <Chip label={t('admin.registrations.noAssignedContract')} size="small" variant="outlined" />
                                    )}
                                    {selected.uploadedContractUrl ? (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="success"
                                            startIcon={<CheckCircleIcon />}
                                            onClick={() => viewPDF(selected.uploadedContractUrl)}
                                            fullWidth={isMobile}
                                        >
                                            {t('admin.registrations.viewSignedContract')}
                                        </Button>
                                    ) : (
                                        <Chip label={t('admin.registrations.noSignedContract')} size="small" variant="outlined" color="warning" />
                                    )}
                                </Box>

                                {/* Registration meta */}
                                <Typography variant="subtitle2" color="#4A7B59">{t('admin.registrations.registrationInfo')}</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box
                                    display="grid"
                                    gridTemplateColumns={{ xs: '1fr 1fr', sm: '1fr 1fr 1fr' }}
                                    gap={{ xs: 1.5, sm: 4 }}
                                    mb={2}
                                >
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('admin.registrations.schoolYearLabel')}</Typography>
                                        <Typography variant="body2">{selected.schoolYear?.name || '-'}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('admin.registrations.registered')}</Typography>
                                        <Typography variant="body2">{formatDateLocal(selected.createdAt)}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{t('admin.registrations.by')}</Typography>
                                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                            {selected.registeredBy?.name || selected.registeredBy?.email || '-'}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Rejection reason */}
                                {selected.status === 'rejected' && selected.rejectionReason && (
                                    <Box mb={2}>
                                        <Typography variant="subtitle2" color="error.main">{t('admin.registrations.rejectionReason')}</Typography>
                                        <Divider sx={{ mb: 1 }} />
                                        <Typography variant="body2">{selected.rejectionReason}</Typography>
                                        {selected.reviewedBy && (
                                            <Typography variant="caption" color="text.secondary">
                                                {t('admin.registrations.reviewedBy', {
                                                    name: selected.reviewedBy.name,
                                                    date: formatDateLocal(selected.reviewedAt)
                                                })}
                                            </Typography>
                                        )}
                                    </Box>
                                )}

                                {/* Approved info */}
                                {selected.status === 'approved' && selected.reviewedBy && (
                                    <Box mb={2}>
                                        <Typography variant="caption" color="text.secondary">
                                            {t('admin.registrations.approvedBy', {
                                                name: selected.reviewedBy.name,
                                                date: formatDateLocal(selected.reviewedAt)
                                            })}
                                        </Typography>
                                    </Box>
                                )}
                            </DialogContent>
                        )}
                        <DialogActions sx={{
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 1,
                            px: { xs: 2, sm: 3 },
                            pb: { xs: 2, sm: 1 },
                            '& > *': { xs: { width: '100%', m: '0 !important' } }
                        }}>
                            <Button
                                onClick={() => openDeleteDialog(selected)}
                                color="error"
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                                disabled={actionLoading}
                                sx={{ mr: { sm: 'auto' } }}
                            >
                                {t('common.delete')}
                            </Button>
                            {selected?.status === 'pending' && (
                                <>
                                    <Button
                                        onClick={() => openRejectDialog(selected)}
                                        color="error"
                                        variant="outlined"
                                        startIcon={<CancelIcon />}
                                        disabled={actionLoading}
                                    >
                                        {t('admin.registrations.reject')}
                                    </Button>
                                    <Button
                                        onClick={() => approveRegistration(selected._id)}
                                        color="success"
                                        variant="contained"
                                        startIcon={<CheckCircleIcon />}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? <CircularProgress size={20} /> : t('admin.registrations.approve')}
                                    </Button>
                                </>
                            )}
                            <Button onClick={() => setDetailsOpen(false)}>{t('common.close')}</Button>
                        </DialogActions>
                    </Dialog>

                    {/* ============================================ */}
                    {/* REJECT DIALOG */}
                    {/* ============================================ */}
                    <Dialog open={rejectOpen} onClose={() => setRejectOpen(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>{t('admin.registrations.rejectTitle')}</DialogTitle>
                        <DialogContent>
                            <Typography variant="body2" color="text.secondary" mb={2} mt={1}>
                                {t('admin.registrations.rejectText', { childName: rejectTarget?.childName })}
                            </Typography>
                            <TextField
                                label={t('admin.registrations.rejectReasonLabel')}
                                multiline
                                rows={3}
                                value={rejectionReason}
                                onChange={e => setRejectionReason(e.target.value)}
                                fullWidth
                                required
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setRejectOpen(false)} disabled={actionLoading}>
                                {t('common.cancel')}
                            </Button>
                            <Button
                                onClick={rejectRegistration}
                                variant="contained"
                                color="error"
                                disabled={actionLoading || !rejectionReason.trim()}
                            >
                                {actionLoading ? <CircularProgress size={20} /> : t('admin.registrations.confirmReject')}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* ============================================ */}
                    {/* DELETE CONFIRMATION DIALOG */}
                    {/* ============================================ */}
                    <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
                        <DialogTitle>{t('admin.registrations.deleteTitle')}</DialogTitle>
                        <DialogContent>
                            <Typography mt={1}>
                                {t('admin.registrations.deleteText', { childName: deleteTarget?.childName })}
                            </Typography>
                            <Typography variant="body2" color="error.main" mt={1}>
                                {t('admin.registrations.deleteWarning')}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDeleteOpen(false)} disabled={actionLoading}>
                                {t('common.cancel')}
                            </Button>
                            <Button
                                onClick={deleteRegistration}
                                variant="contained"
                                color="error"
                                startIcon={actionLoading ? <CircularProgress size={18} color="inherit" /> : <DeleteIcon />}
                                disabled={actionLoading}
                            >
                                {actionLoading ? t('admin.registrations.deleting') : t('common.delete')}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box><ToastContainer />
        </Box>
    )
}

export default PendingRegistrations
