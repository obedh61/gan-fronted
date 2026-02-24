import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { getCookie } from '../helpers'
import DrawerAppBar from '../../components/Bar'
import Footer from '../../components/Footer'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
    Box, Container, Typography, Button, Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    FormControl, InputLabel, Select, MenuItem,
    Card, CardContent, Chip, CircularProgress, Divider
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import ChildCareIcon from '@mui/icons-material/ChildCare'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize'
import { useNavigate } from 'react-router-dom'

const BRANCH_LABELS = { cityCenter: 'City Center', germanColony: 'German Colony' }
const AGE_LABELS = { under1: 'Under 1 Year', over1: 'Over 1 Year' }
const STATUS_COLORS = { pending: 'warning', approved: 'success', rejected: 'error' }

const StatCard = ({ title, count, icon, color, bgColor }) => (
    <Card sx={{ height: '100%', borderLeft: `4px solid ${color}` }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
                <Typography variant="body2" color="text.secondary">{title}</Typography>
                <Typography variant="h3" fontWeight="bold" color={color}>{count}</Typography>
            </Box>
            <Box sx={{
                backgroundColor: bgColor,
                borderRadius: '50%',
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icon}
            </Box>
        </CardContent>
    </Card>
)

const SchoolYearDashboard = () => {
    const [schoolYears, setSchoolYears] = useState([])
    const [selectedYearId, setSelectedYearId] = useState('')
    const [stats, setStats] = useState(null)
    const [registrations, setRegistrations] = useState([])
    const [loading, setLoading] = useState(true)
    const [dataLoading, setDataLoading] = useState(false)

    const navigate = useNavigate()
    const token = getCookie('token')
    const headers = { Authorization: `Bearer ${token}` }
    const API = process.env.REACT_APP_API

    // ============================================
    // API FUNCTIONS
    // ============================================

    const fetchSchoolYears = () => {
        setLoading(true)
        axios.get(`${API}/schoolyear/list`, { headers })
            .then(response => {
                const years = response.data.data || []
                setSchoolYears(years)
                // Auto-select the first active year, or the first year
                const active = years.find(y => y.isActive)
                if (active) {
                    setSelectedYearId(active._id)
                } else if (years.length > 0) {
                    setSelectedYearId(years[0]._id)
                }
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching school years:', error)
                toast.error(error.response?.data?.error || 'Error fetching school years')
                setLoading(false)
            })
    }

    const fetchDashboardData = (schoolYearId) => {
        if (!schoolYearId) return
        setDataLoading(true)
        Promise.all([
            axios.get(`${API}/registration/stats/${schoolYearId}`, { headers }),
            axios.get(`${API}/registration/by-school-year/${schoolYearId}`, { headers })
        ])
            .then(([statsRes, regsRes]) => {
                setStats(statsRes.data.data || null)
                setRegistrations(regsRes.data.data || [])
                setDataLoading(false)
            })
            .catch(error => {
                console.error('Error fetching dashboard data:', error)
                toast.error(error.response?.data?.error || 'Error fetching data')
                setDataLoading(false)
            })
    }

    useEffect(() => {
        fetchSchoolYears()
    }, [])

    useEffect(() => {
        if (selectedYearId) {
            fetchDashboardData(selectedYearId)
        }
    }, [selectedYearId])

    // ============================================
    // COMPUTED DATA
    // ============================================

    const branchBreakdown = () => {
        const branches = { cityCenter: { total: 0, pending: 0, approved: 0, rejected: 0 }, germanColony: { total: 0, pending: 0, approved: 0, rejected: 0 } }
        registrations.forEach(reg => {
            const b = reg.branch
            if (branches[b]) {
                branches[b].total++
                branches[b][reg.status]++
            }
        })
        return branches
    }

    const ageBreakdown = () => {
        const ages = { under1: { total: 0, pending: 0, approved: 0, rejected: 0 }, over1: { total: 0, pending: 0, approved: 0, rejected: 0 } }
        registrations.forEach(reg => {
            const a = reg.ageGroup
            if (ages[a]) {
                ages[a].total++
                ages[a][reg.status]++
            }
        })
        return ages
    }

    const recentRegistrations = [...registrations]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)

    const formatDate = (dateStr) => {
        if (!dateStr) return '-'
        return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    // ============================================
    // RENDER
    // ============================================

    const branches = branchBreakdown()
    const ages = ageBreakdown()

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box sx={{ flexGrow: 1 }}>
                <DrawerAppBar />
                <Container sx={{ py: 4 }}>
                    {/* Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h4" color="#4A7B59">
                            School Year Dashboard
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

                    {/* School Year Selector */}
                    {loading ? (
                        <Box display="flex" justifyContent="center" py={6}>
                            <CircularProgress color="success" />
                        </Box>
                    ) : schoolYears.length === 0 ? (
                        <Card>
                            <CardContent>
                                <Typography align="center" color="text.secondary">
                                    No school years found. Create one in School Year Management.
                                </Typography>
                                <Box display="flex" justifyContent="center" mt={2}>
                                    <Button variant="outlined" color="success" onClick={() => navigate('/admin/school-years')}>
                                        Go to School Year Management
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <FormControl sx={{ minWidth: 350, mb: 3 }}>
                                <InputLabel>School Year</InputLabel>
                                <Select
                                    value={selectedYearId}
                                    label="School Year"
                                    onChange={e => setSelectedYearId(e.target.value)}
                                >
                                    {schoolYears.map(sy => (
                                        <MenuItem key={sy._id} value={sy._id}>
                                            {sy.name} {sy.isActive ? '(Active)' : ''}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {dataLoading ? (
                                <Box display="flex" justifyContent="center" py={6}>
                                    <CircularProgress color="success" />
                                </Box>
                            ) : stats && (
                                <>
                                    {/* ============================================ */}
                                    {/* STATISTICS CARDS */}
                                    {/* ============================================ */}
                                    <Grid container spacing={3} mb={4}>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <StatCard
                                                title="Total Registrations"
                                                count={stats.total}
                                                icon={<PeopleIcon sx={{ color: '#1976d2', fontSize: 30 }} />}
                                                color="#1976d2"
                                                bgColor="#e3f2fd"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <StatCard
                                                title="Pending"
                                                count={stats.pending}
                                                icon={<HourglassEmptyIcon sx={{ color: '#ed6c02', fontSize: 30 }} />}
                                                color="#ed6c02"
                                                bgColor="#fff3e0"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <StatCard
                                                title="Approved"
                                                count={stats.approved}
                                                icon={<CheckCircleIcon sx={{ color: '#2e7d32', fontSize: 30 }} />}
                                                color="#2e7d32"
                                                bgColor="#e8f5e9"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <StatCard
                                                title="Rejected"
                                                count={stats.rejected}
                                                icon={<CancelIcon sx={{ color: '#d32f2f', fontSize: 30 }} />}
                                                color="#d32f2f"
                                                bgColor="#ffebee"
                                            />
                                        </Grid>
                                    </Grid>

                                    {/* ============================================ */}
                                    {/* BREAKDOWN TABLES */}
                                    {/* ============================================ */}
                                    <Grid container spacing={3} mb={4}>
                                        {/* By Branch */}
                                        <Grid item xs={12} md={6}>
                                            <Card>
                                                <CardContent>
                                                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                                                        <LocationCityIcon color="success" />
                                                        <Typography variant="h6" color="#4A7B59">By Branch</Typography>
                                                    </Box>
                                                    <TableContainer>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                                    <TableCell><strong>Branch</strong></TableCell>
                                                                    <TableCell align="center"><strong>Total</strong></TableCell>
                                                                    <TableCell align="center"><strong>Pending</strong></TableCell>
                                                                    <TableCell align="center"><strong>Approved</strong></TableCell>
                                                                    <TableCell align="center"><strong>Rejected</strong></TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {Object.entries(branches).map(([key, data]) => (
                                                                    <TableRow key={key}>
                                                                        <TableCell>{BRANCH_LABELS[key]}</TableCell>
                                                                        <TableCell align="center"><strong>{data.total}</strong></TableCell>
                                                                        <TableCell align="center">
                                                                            <Chip label={data.pending} size="small" color="warning" variant="outlined" />
                                                                        </TableCell>
                                                                        <TableCell align="center">
                                                                            <Chip label={data.approved} size="small" color="success" variant="outlined" />
                                                                        </TableCell>
                                                                        <TableCell align="center">
                                                                            <Chip label={data.rejected} size="small" color="error" variant="outlined" />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                        {/* By Age Group */}
                                        <Grid item xs={12} md={6}>
                                            <Card>
                                                <CardContent>
                                                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                                                        <ChildCareIcon color="success" />
                                                        <Typography variant="h6" color="#4A7B59">By Age Group</Typography>
                                                    </Box>
                                                    <TableContainer>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                                    <TableCell><strong>Age Group</strong></TableCell>
                                                                    <TableCell align="center"><strong>Total</strong></TableCell>
                                                                    <TableCell align="center"><strong>Pending</strong></TableCell>
                                                                    <TableCell align="center"><strong>Approved</strong></TableCell>
                                                                    <TableCell align="center"><strong>Rejected</strong></TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {Object.entries(ages).map(([key, data]) => (
                                                                    <TableRow key={key}>
                                                                        <TableCell>{AGE_LABELS[key]}</TableCell>
                                                                        <TableCell align="center"><strong>{data.total}</strong></TableCell>
                                                                        <TableCell align="center">
                                                                            <Chip label={data.pending} size="small" color="warning" variant="outlined" />
                                                                        </TableCell>
                                                                        <TableCell align="center">
                                                                            <Chip label={data.approved} size="small" color="success" variant="outlined" />
                                                                        </TableCell>
                                                                        <TableCell align="center">
                                                                            <Chip label={data.rejected} size="small" color="error" variant="outlined" />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>

                                    {/* ============================================ */}
                                    {/* RECENT REGISTRATIONS */}
                                    {/* ============================================ */}
                                    <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h6" color="#4A7B59">
                                            Recent Registrations
                                        </Typography>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="success"
                                            onClick={() => navigate('/admin/registrations')}
                                        >
                                            View All Registrations
                                        </Button>
                                    </Box>

                                    {recentRegistrations.length === 0 ? (
                                        <Card>
                                            <CardContent>
                                                <Typography align="center" color="text.secondary">
                                                    No registrations yet for this school year.
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
                                                        <TableCell><strong>Branch</strong></TableCell>
                                                        <TableCell align="center"><strong>Status</strong></TableCell>
                                                        <TableCell><strong>Date</strong></TableCell>
                                                        <TableCell align="center"><strong>Actions</strong></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {recentRegistrations.map(reg => (
                                                        <TableRow key={reg._id} hover>
                                                            <TableCell>{reg.childName}</TableCell>
                                                            <TableCell>{reg.parent1FirstName} {reg.parent1LastName}</TableCell>
                                                            <TableCell>{reg.parent2FirstName} {reg.parent2LastName}</TableCell>
                                                            <TableCell>{BRANCH_LABELS[reg.branch] || reg.branch}</TableCell>
                                                            <TableCell align="center">
                                                                <Chip
                                                                    label={reg.status}
                                                                    color={STATUS_COLORS[reg.status] || 'default'}
                                                                    size="small"
                                                                    sx={{ textTransform: 'capitalize' }}
                                                                />
                                                            </TableCell>
                                                            <TableCell>{formatDate(reg.createdAt)}</TableCell>
                                                            <TableCell align="center">
                                                                <Button
                                                                    size="small"
                                                                    startIcon={<VisibilityIcon />}
                                                                    onClick={() => navigate('/admin/registrations')}
                                                                >
                                                                    Details
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </Container>
            </Box>
            <Footer />
            <ToastContainer />
        </Box>
    )
}

export default SchoolYearDashboard
