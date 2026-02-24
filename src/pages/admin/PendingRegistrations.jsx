import React, { useState, useEffect } from 'react'
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
    Card, CardContent, CircularProgress, InputAdornment
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

    const navigate = useNavigate()
    const token = getCookie('token')
    const headers = { Authorization: `Bearer ${token}` }
    const API = process.env.REACT_APP_API

    // ============================================
    // API FUNCTIONS
    // ============================================

    const fetchRegistrations = () => {
        setLoading(true)
        // Fetch all school years, then all registrations for each
        axios.get(`${API}/schoolyear/list`, { headers })
            .then(syResponse => {
                const schoolYears = syResponse.data.data || []
                if (schoolYears.length === 0) {
                    setRegistrations([])
                    setLoading(false)
                    return
                }
                const promises = schoolYears.map(sy =>
                    axios.get(`${API}/registration/by-school-year/${sy._id}`, { headers })
                        .then(res => res.data.data || [])
                        .catch(() => [])
                )
                return Promise.all(promises)
            })
            .then(results => {
                if (results) {
                    setRegistrations(results.flat())
                }
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching registrations:', error)
                toast.error(error.response?.data?.error || 'Error fetching registrations')
                setLoading(false)
            })
    }

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
    }, [])

    // ============================================
    // FILTERING & SORTING
    // ============================================

    const filtered = registrations
        .filter(reg => {
            // Tab filter
            const statusFilter = TAB_STATUS[tabValue]
            if (statusFilter && reg.status !== statusFilter) return false
            // Search filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase()
                const childMatch = reg.childName?.toLowerCase().includes(q)
                const p1Match = `${reg.parent1FirstName} ${reg.parent1LastName}`.toLowerCase().includes(q)
                const p2Match = `${reg.parent2FirstName} ${reg.parent2LastName}`.toLowerCase().includes(q)
                if (!childMatch && !p1Match && !p2Match) return false
            }
            return true
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // ============================================
    // HANDLERS
    // ============================================

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
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h4" color="#4A7B59">
                            Child Registrations
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            endIcon={<DashboardCustomizeIcon />}
                            onClick={() => navigate('/admin')}
                        >
                            Dashboard
                        </Button>
                    </Box>

                    {/* Tabs + Search */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
                        <Tabs
                            value={tabValue}
                            onChange={(e, v) => setTabValue(v)}
                            textColor="inherit"
                            sx={{ '& .Mui-selected': { color: '#4A7B59' }, '& .MuiTabs-indicator': { backgroundColor: '#4A7B59' } }}
                        >
                            <Tab label={`All (${registrations.length})`} />
                            <Tab label={`Pending (${registrations.filter(r => r.status === 'pending').length})`} />
                            <Tab label={`Approved (${registrations.filter(r => r.status === 'approved').length})`} />
                            <Tab label={`Rejected (${registrations.filter(r => r.status === 'rejected').length})`} />
                        </Tabs>
                        <TextField
                            size="small"
                            placeholder="Search by child or parent name..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
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
                    {loading ? (
                        <Box display="flex" justifyContent="center" py={6}>
                            <CircularProgress color="success" />
                        </Box>
                    ) : filtered.length === 0 ? (
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
                                    {filtered.map(reg => (
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

                    {/* ============================================ */}
                    {/* DETAILS DIALOG */}
                    {/* ============================================ */}
                    <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>
                            Registration Details
                            {selected && (
                                <Chip
                                    label={selected.status}
                                    color={STATUS_COLORS[selected.status]}
                                    size="small"
                                    sx={{ ml: 2, textTransform: 'capitalize' }}
                                />
                            )}
                        </DialogTitle>
                        {selected && (
                            <DialogContent>
                                {/* Parent 1 */}
                                <Typography variant="subtitle2" color="#4A7B59" mt={1}>Parent 1 Information</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box display="flex" gap={4} mb={2}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">First Name</Typography>
                                        <Typography>{selected.parent1FirstName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Last Name</Typography>
                                        <Typography>{selected.parent1LastName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">ID Number</Typography>
                                        <Typography>{selected.parent1IdNumber}</Typography>
                                    </Box>
                                </Box>

                                {/* Parent 2 */}
                                <Typography variant="subtitle2" color="#4A7B59">Parent 2 Information</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box display="flex" gap={4} mb={2}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">First Name</Typography>
                                        <Typography>{selected.parent2FirstName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Last Name</Typography>
                                        <Typography>{selected.parent2LastName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">ID Number</Typography>
                                        <Typography>{selected.parent2IdNumber}</Typography>
                                    </Box>
                                </Box>

                                {/* Child Info */}
                                <Typography variant="subtitle2" color="#4A7B59">Child Information</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box display="flex" gap={4} mb={2}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Child Name</Typography>
                                        <Typography>{selected.childName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Branch</Typography>
                                        <Typography>{BRANCH_LABELS[selected.branch]}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Age Group</Typography>
                                        <Typography>{AGE_LABELS[selected.ageGroup]}</Typography>
                                    </Box>
                                </Box>

                                {/* Banking */}
                                <Typography variant="subtitle2" color="#4A7B59">Banking Information</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box display="flex" gap={4} mb={2}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Phone</Typography>
                                        <Typography>{selected.phoneNumber}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Bank</Typography>
                                        <Typography>{selected.bankName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Account</Typography>
                                        <Typography>{selected.bankAccountNumber}</Typography>
                                    </Box>
                                </Box>

                                {/* Contracts */}
                                <Typography variant="subtitle2" color="#4A7B59">Contracts</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box display="flex" gap={2} mb={2} flexWrap="wrap">
                                    {selected.assignedContractUrl ? (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<VisibilityIcon />}
                                            onClick={() => viewPDF(selected.assignedContractUrl)}
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
                                <Box display="flex" gap={4} mb={2}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">School Year</Typography>
                                        <Typography>{selected.schoolYear?.name || '-'}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Registered</Typography>
                                        <Typography>{formatDate(selected.createdAt)}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">By</Typography>
                                        <Typography>{selected.registeredBy?.name || selected.registeredBy?.email || '-'}</Typography>
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
                        <DialogActions>
                            <Button
                                onClick={() => openDeleteDialog(selected)}
                                color="error"
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                                disabled={actionLoading}
                                sx={{ mr: 'auto' }}
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
