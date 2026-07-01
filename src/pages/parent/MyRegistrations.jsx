import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import { getCookie } from '../helpers'
import DrawerAppBar from '../../components/Bar'
import Footer from '../../components/Footer'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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

const BRANCH_LABELS = { cityCenter: 'City Center', germanColony: 'German Colony' }
const AGE_LABELS = { under1: 'Under 1 Year', over1: 'Over 1 Year' }
const STATUS_COLORS = { pending: 'warning', approved: 'success', rejected: 'error' }
const STATUS_FILTERS = ['all', 'pending', 'approved', 'rejected']

const MyRegistrations = () => {
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
                toast.error(error.response?.data?.error || 'Error loading registrations')
                setLoading(false)
            })
    }, [API, headers, limit, page])

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
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    {/* Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h4" color="#4A7B59">
                            My Child Registrations
                        </Typography>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/register-child')}
                        >
                            Register New Child
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
                                        ? `All (${registrations.length})`
                                        : `${s.charAt(0).toUpperCase() + s.slice(1)} (${registrations.filter(r => r.status === s).length})`
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
                                <InputLabel>School Year</InputLabel>
                                <Select
                                    value={schoolYearFilter}
                                    label="School Year"
                                    onChange={e => setSchoolYearFilter(e.target.value)}
                                >
                                    <MenuItem value="all">All School Years</MenuItem>
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
                                    No registrations yet
                                </Typography>
                                <Typography variant="body1" color="text.secondary" mb={3}>
                                    You haven't registered any children. Start by registering your first child for a school year.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="large"
                                    startIcon={<AddIcon />}
                                    onClick={() => navigate('/register-child')}
                                >
                                    Register Your First Child
                                </Button>
                            </CardContent>
                        </Card>
                    ) : filtered.length === 0 ? (
                        <Card>
                            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                <Typography color="text.secondary">
                                    No registrations match the selected filters.
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
                                                {reg.schoolYear?.name || 'School Year'}
                                            </Typography>
                                            <Box display="flex" gap={1} mb={1.5} flexWrap="wrap">
                                                <Chip
                                                    label={reg.status}
                                                    color={STATUS_COLORS[reg.status] || 'default'}
                                                    size="small"
                                                    sx={{ textTransform: 'capitalize' }}
                                                />
                                            </Box>
                                            <Divider sx={{ my: 1 }} />
                                            <Box display="flex" flexDirection="column" gap={0.5}>
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>Date:</strong> {formatDate(reg.createdAt)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>Branch:</strong> {BRANCH_LABELS[reg.branch] || reg.branch}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>Age Group:</strong> {AGE_LABELS[reg.ageGroup] || reg.ageGroup}
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
                                                View Details
                                            </Button>
                                            {reg.status === 'rejected' && (
                                                <Button
                                                    size="small"
                                                    startIcon={<ReplayIcon />}
                                                    color="primary"
                                                    onClick={registerAgain}
                                                >
                                                    Register Again
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
                                <Box display="flex" gap={4} mb={2} flexWrap="wrap">
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
                                <Box display="flex" gap={4} mb={2} flexWrap="wrap">
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
                                <Box display="flex" gap={4} mb={2} flexWrap="wrap">
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
                                <Box display="flex" gap={4} mb={2} flexWrap="wrap">
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

                                {/* Status & Dates */}
                                <Typography variant="subtitle2" color="#4A7B59">Status</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box display="flex" gap={4} mb={2} flexWrap="wrap">
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">School Year</Typography>
                                        <Typography>{selected.schoolYear?.name || '-'}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Submitted</Typography>
                                        <Typography>{formatDate(selected.createdAt)}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Status</Typography>
                                        <Typography sx={{ textTransform: 'capitalize' }}>{selected.status}</Typography>
                                    </Box>
                                </Box>

                                {/* Rejection reason */}
                                {selected.status === 'rejected' && selected.rejectionReason && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>Rejection Reason</Typography>
                                        <Typography variant="body2">{selected.rejectionReason}</Typography>
                                        {selected.reviewedAt && (
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                                Reviewed on {formatDate(selected.reviewedAt)}
                                            </Typography>
                                        )}
                                    </Alert>
                                )}

                                {/* Approved info */}
                                {selected.status === 'approved' && selected.reviewedAt && (
                                    <Alert severity="success" sx={{ mb: 2 }}>
                                        <Typography variant="body2">
                                            Approved on {formatDate(selected.reviewedAt)}
                                        </Typography>
                                    </Alert>
                                )}

                                {/* Contracts */}
                                <Typography variant="subtitle2" color="#4A7B59">Contracts</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box display="flex" gap={2} flexWrap="wrap">
                                    {selected.assignedContractUrl ? (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<DescriptionIcon />}
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
                                            startIcon={<DescriptionIcon />}
                                            onClick={() => viewPDF(selected.uploadedContractUrl)}
                                        >
                                            View Uploaded Contract
                                        </Button>
                                    ) : (
                                        <Chip label="No signed contract uploaded" size="small" variant="outlined" color="warning" />
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
                                    Register Again
                                </Button>
                            )}
                            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
            <Footer />
            <ToastContainer />
        </Box>
    )
}

export default MyRegistrations
