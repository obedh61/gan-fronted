import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import { getCookie } from '../helpers'
import DrawerAppBar from '../../components/Bar'
import Footer from '../../components/Footer'
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

const BRANCH_LABELS = { cityCenter: 'City Center', germanColony: 'German Colony' }
const AGE_LABELS = { under1: 'Under 1 Year', over1: 'Over 1 Year' }
const STATUS_COLORS = { pending: 'warning', approved: 'success', rejected: 'error' }
const TAB_STATUS = [null, 'pending', 'approved', 'rejected']

const PendingRegistrations = () => {
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
                toast.error(error.response?.data?.error || 'Error fetching registrations')
                setLoading(false)
            })
    }, [API, headers, limit, statusFilter, searchQuery, page])

    const approveRegistration = (id) => {
        setActionLoading(true)
        axios.patch(`${API}/registration/${id}/approve`, {}, { headers })
            .then(response => {
                toast.success('Registration approved successfully')
                setDetailsOpen(false)
                setSelected(null)
                fetchRegistrations()
            })
            .catch(error => {
                console.error('Error approving registration:', error)
                toast.error(error.response?.data?.error || 'Error approving registration')
            })
            .finally(() => setActionLoading(false))
    }

    const rejectRegistration = () => {
        if (!rejectionReason.trim()) {
            toast.error('Please provide a rejection reason')
            return
        }
        setActionLoading(true)
        axios.patch(`${API}/registration/${rejectTarget._id}/reject`, {
            rejectionReason: rejectionReason.trim()
        }, { headers })
            .then(response => {
                toast.success('Registration rejected')
                setRejectOpen(false)
                setRejectTarget(null)
                setRejectionReason('')
                setDetailsOpen(false)
                setSelected(null)
                fetchRegistrations()
            })
            .catch(error => {
                console.error('Error rejecting registration:', error)
                toast.error(error.response?.data?.error || 'Error rejecting registration')
            })
            .finally(() => setActionLoading(false))
    }

    const deleteRegistration = () => {
        if (!deleteTarget) return
        setActionLoading(true)
        axios.delete(`${API}/registration/${deleteTarget._id}`, { headers })
            .then(() => {
                toast.success('Registration deleted successfully')
                setDeleteOpen(false)
                setDeleteTarget(null)
                setDetailsOpen(false)
                setSelected(null)
                fetchRegistrations()
            })
            .catch(error => {
                console.error('Error deleting registration:', error)
                toast.error(error.response?.data?.error || 'Error deleting registration')
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

    const formatDate = (dateStr) => {
        if (!dateStr) return '-'
        const d = new Date(dateStr)
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
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
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} gap={1}>
                        <Typography variant="h4" color="#4A7B59" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                            Child Registrations
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => navigate('/admin')}
                            sx={{ minWidth: 'auto', px: { xs: 1, sm: 2 } }}
                        >
                            {isMobile ? <DashboardCustomizeIcon /> : <>Dashboard <DashboardCustomizeIcon sx={{ ml: 1 }} /></>}
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
                            <Tab label="All" />
                            <Tab label="Pending" />
                            <Tab label="Approved" />
                            <Tab label="Rejected" />
                        </Tabs>
                        <TextField
                            size="small"
                            placeholder="Search by child or parent name..."
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
                            Showing {registrations.length} of {total} registration{total !== 1 ? 's' : ''}
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
                                    No registrations found.
                                </Typography>
                            </CardContent>
                        </Card>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableCell><strong>Child Name</strong></TableCell>
                                        <TableCell><strong>Parent 1</strong></TableCell>
                                        <TableCell><strong>Parent 2</strong></TableCell>
                                        <TableCell><strong>School Year</strong></TableCell>
                                        <TableCell><strong>Branch</strong></TableCell>
                                        <TableCell><strong>Age Group</strong></TableCell>
                                        <TableCell><strong>Date</strong></TableCell>
                                        <TableCell align="center"><strong>Status</strong></TableCell>
                                        <TableCell align="center"><strong>Actions</strong></TableCell>
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
                                            <TableCell>{formatDate(reg.createdAt)}</TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={reg.status}
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
                                                        Details
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        startIcon={<DeleteIcon />}
                                                        onClick={() => openDeleteDialog(reg)}
                                                    >
                                                        Delete
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
                            Registration Details
                            {selected && (
                                <Chip
                                    label={selected.status}
                                    color={STATUS_COLORS[selected.status]}
                                    size="small"
                                    sx={{ textTransform: 'capitalize' }}
                                />
                            )}
                        </DialogTitle>
                        {selected && (
                            <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
                                {/* Parent 1 */}
                                <Typography variant="subtitle2" color="#4A7B59" mt={1}>Parent 1 Information</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box
                                    display="grid"
                                    gridTemplateColumns={{ xs: '1fr 1fr', sm: '1fr 1fr 1fr' }}
                                    gap={{ xs: 1.5, sm: 4 }}
                                    mb={2}
                                >
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">First Name</Typography>
                                        <Typography variant="body2">{selected.parent1FirstName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Last Name</Typography>
                                        <Typography variant="body2">{selected.parent1LastName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">ID Number</Typography>
                                        <Typography variant="body2">{selected.parent1IdNumber}</Typography>
                                    </Box>
                                </Box>

                                {/* Parent 2 */}
                                <Typography variant="subtitle2" color="#4A7B59">Parent 2 Information</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box
                                    display="grid"
                                    gridTemplateColumns={{ xs: '1fr 1fr', sm: '1fr 1fr 1fr' }}
                                    gap={{ xs: 1.5, sm: 4 }}
                                    mb={2}
                                >
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">First Name</Typography>
                                        <Typography variant="body2">{selected.parent2FirstName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Last Name</Typography>
                                        <Typography variant="body2">{selected.parent2LastName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">ID Number</Typography>
                                        <Typography variant="body2">{selected.parent2IdNumber}</Typography>
                                    </Box>
                                </Box>

                                {/* Child Info */}
                                <Typography variant="subtitle2" color="#4A7B59">Child Information</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box
                                    display="grid"
                                    gridTemplateColumns={{ xs: '1fr 1fr', sm: '1fr 1fr 1fr' }}
                                    gap={{ xs: 1.5, sm: 4 }}
                                    mb={2}
                                >
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Child Name</Typography>
                                        <Typography variant="body2">{selected.childName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Branch</Typography>
                                        <Typography variant="body2">{BRANCH_LABELS[selected.branch]}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Age Group</Typography>
                                        <Typography variant="body2">{AGE_LABELS[selected.ageGroup]}</Typography>
                                    </Box>
                                </Box>

                                {/* Banking */}
                                <Typography variant="subtitle2" color="#4A7B59">Banking Information</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box
                                    display="grid"
                                    gridTemplateColumns={{ xs: '1fr 1fr', sm: '1fr 1fr 1fr' }}
                                    gap={{ xs: 1.5, sm: 4 }}
                                    mb={2}
                                >
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Phone</Typography>
                                        <Typography variant="body2">{selected.phoneNumber}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Bank</Typography>
                                        <Typography variant="body2">{selected.bankName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Account</Typography>
                                        <Typography variant="body2">{selected.bankAccountNumber}</Typography>
                                    </Box>
                                </Box>

                                {/* Contracts */}
                                <Typography variant="subtitle2" color="#4A7B59">Contracts</Typography>
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
                                            View Assigned Contract
                                        </Button>
                                    ) : (
                                        <Chip label="No assigned contract" size="small" variant="outlined" />
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
                                            View Signed Contract
                                        </Button>
                                    ) : (
                                        <Chip label="No signed contract uploaded" size="small" variant="outlined" color="warning" />
                                    )}
                                </Box>

                                {/* Registration meta */}
                                <Typography variant="subtitle2" color="#4A7B59">Registration Info</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box
                                    display="grid"
                                    gridTemplateColumns={{ xs: '1fr 1fr', sm: '1fr 1fr 1fr' }}
                                    gap={{ xs: 1.5, sm: 4 }}
                                    mb={2}
                                >
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">School Year</Typography>
                                        <Typography variant="body2">{selected.schoolYear?.name || '-'}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Registered</Typography>
                                        <Typography variant="body2">{formatDate(selected.createdAt)}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">By</Typography>
                                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                            {selected.registeredBy?.name || selected.registeredBy?.email || '-'}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Rejection reason */}
                                {selected.status === 'rejected' && selected.rejectionReason && (
                                    <Box mb={2}>
                                        <Typography variant="subtitle2" color="error.main">Rejection Reason</Typography>
                                        <Divider sx={{ mb: 1 }} />
                                        <Typography variant="body2">{selected.rejectionReason}</Typography>
                                        {selected.reviewedBy && (
                                            <Typography variant="caption" color="text.secondary">
                                                Reviewed by {selected.reviewedBy.name} on {formatDate(selected.reviewedAt)}
                                            </Typography>
                                        )}
                                    </Box>
                                )}

                                {/* Approved info */}
                                {selected.status === 'approved' && selected.reviewedBy && (
                                    <Box mb={2}>
                                        <Typography variant="caption" color="text.secondary">
                                            Approved by {selected.reviewedBy.name} on {formatDate(selected.reviewedAt)}
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
                                Delete
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
                                        Reject
                                    </Button>
                                    <Button
                                        onClick={() => approveRegistration(selected._id)}
                                        color="success"
                                        variant="contained"
                                        startIcon={<CheckCircleIcon />}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? <CircularProgress size={20} /> : 'Approve'}
                                    </Button>
                                </>
                            )}
                            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
                        </DialogActions>
                    </Dialog>

                    {/* ============================================ */}
                    {/* REJECT DIALOG */}
                    {/* ============================================ */}
                    <Dialog open={rejectOpen} onClose={() => setRejectOpen(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>Reject Registration</DialogTitle>
                        <DialogContent>
                            <Typography variant="body2" color="text.secondary" mb={2} mt={1}>
                                Rejecting registration for <strong>{rejectTarget?.childName}</strong>.
                                Please provide a reason.
                            </Typography>
                            <TextField
                                label="Rejection Reason"
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
                                Cancel
                            </Button>
                            <Button
                                onClick={rejectRegistration}
                                variant="contained"
                                color="error"
                                disabled={actionLoading || !rejectionReason.trim()}
                            >
                                {actionLoading ? <CircularProgress size={20} /> : 'Confirm Reject'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* ============================================ */}
                    {/* DELETE CONFIRMATION DIALOG */}
                    {/* ============================================ */}
                    <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
                        <DialogTitle>Delete Registration</DialogTitle>
                        <DialogContent>
                            <Typography mt={1}>
                                Are you sure you want to permanently delete the registration for <strong>{deleteTarget?.childName}</strong>?
                            </Typography>
                            <Typography variant="body2" color="error.main" mt={1}>
                                This action cannot be undone.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDeleteOpen(false)} disabled={actionLoading}>
                                Cancel
                            </Button>
                            <Button
                                onClick={deleteRegistration}
                                variant="contained"
                                color="error"
                                startIcon={actionLoading ? <CircularProgress size={18} color="inherit" /> : <DeleteIcon />}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Deleting...' : 'Delete'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
            <Footer />
            <ToastContainer />
        </Box>
    )
}

export default PendingRegistrations
