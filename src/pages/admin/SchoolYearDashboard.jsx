import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { getCookie, formatDate } from '../helpers'
import DrawerAppBar from '../../components/Bar'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
    Box, Container, Typography, Button, Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    FormControl, InputLabel, Select, MenuItem,
    Card, CardContent, Chip, CircularProgress, Pagination,
    useMediaQuery, useTheme
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

const STATUS_COLORS = { pending: 'warning', approved: 'success', rejected: 'error' }

const StatCard = ({ title, count, icon, color, bgColor }) => (
    <Card sx={{ height: '100%', borderLeft: `4px solid ${color}` }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 1.5, sm: 2 } }}>
            <Box>
                <Typography variant="body2" color="text.secondary">{title}</Typography>
                <Typography variant="h3" fontWeight="bold" color={color} sx={{ fontSize: { xs: '2rem', sm: '3rem' } }}>{count}</Typography>
            </Box>
            <Box sx={{
                backgroundColor: bgColor,
                borderRadius: '50%',
                width: { xs: 44, sm: 56 },
                height: { xs: 44, sm: 56 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}>
                {icon}
            </Box>
        </CardContent>
    </Card>
)

const SchoolYearDashboard = () => {
    const { t, i18n } = useTranslation()
    const [schoolYears, setSchoolYears] = useState([])
    const [selectedYearId, setSelectedYearId] = useState('')
    const [stats, setStats] = useState(null)
    const [registrations, setRegistrations] = useState([])
    const [loading, setLoading] = useState(true)
    const [dataLoading, setDataLoading] = useState(false)
    const [breakdowns, setBreakdowns] = useState({ branches: {}, ages: {} })
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

    const fetchSchoolYears = useCallback(() => {
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
                toast.error(error.response?.data?.error || t('admin.dashboard.schoolYearsError'))
                setLoading(false)
            })
    }, [API, headers, t])

    const fetchDashboardData = useCallback((schoolYearId, currentPage = page) => {
        if (!schoolYearId) return
        setDataLoading(true)
        Promise.all([
            axios.get(`${API}/registration/stats/${schoolYearId}`, { headers }),
            axios.get(`${API}/registration/by-school-year/${schoolYearId}`, {
                headers,
                params: { page: currentPage, limit }
            })
        ])
            .then(([statsRes, regsRes]) => {
                setStats(statsRes.data.data || null)
                setRegistrations(regsRes.data.data || [])
                const pagination = regsRes.data.pagination || {}
                setTotal(pagination.total || 0)
                setPages(pagination.pages || 0)
                setDataLoading(false)
            })
            .catch(error => {
                console.error('Error fetching dashboard data:', error)
                toast.error(error.response?.data?.error || t('admin.dashboard.fetchError'))
                setDataLoading(false)
            })
    }, [API, headers, limit, page, t])

    const fetchBreakdowns = useCallback((schoolYearId) => {
        if (!schoolYearId) return
        axios.get(`${API}/registration/by-school-year/${schoolYearId}/breakdown`, { headers })
            .then(response => {
                setBreakdowns(response.data.data || { branches: {}, ages: {} })
            })
            .catch(error => {
                console.error('Error fetching breakdowns:', error)
            })
    }, [API, headers])

    useEffect(() => {
        fetchSchoolYears()
    }, [fetchSchoolYears])

    useEffect(() => {
        if (selectedYearId) {
            fetchDashboardData(selectedYearId)
            fetchBreakdowns(selectedYearId)
        }
    }, [selectedYearId, fetchDashboardData, fetchBreakdowns])

    // ============================================
    // COMPUTED DATA
    // ============================================

    const branchBreakdown = () => breakdowns.branches || {}
    const ageBreakdown = () => breakdowns.ages || {}

    const formatDateLocal = (dateStr) => formatDate(dateStr, i18n.language)

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
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} gap={1}>
                        <Typography variant="h4" color="#4A7B59" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                            {t('admin.dashboard.title')}
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

                    {/* School Year Selector */}
                    {loading ? (
                        <Box display="flex" justifyContent="center" py={6}>
                            <CircularProgress color="success" />
                        </Box>
                    ) : schoolYears.length === 0 ? (
                        <Card>
                            <CardContent>
                                <Typography align="center" color="text.secondary">
                                    {t('admin.dashboard.noSchoolYears')}
                                </Typography>
                                <Box display="flex" justifyContent="center" mt={2}>
                                    <Button variant="outlined" color="success" onClick={() => navigate('/admin/school-years')}>
                                        {t('admin.dashboard.goToManagement')}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <FormControl sx={{ minWidth: { xs: '100%', sm: 350 }, mb: 3 }}>
                                <InputLabel>{t('admin.dashboard.selectSchoolYear')}</InputLabel>
                                <Select
                                    value={selectedYearId}
                                    label={t('admin.dashboard.selectSchoolYear')}
                                    onChange={e => {
                                        setSelectedYearId(e.target.value)
                                        setPage(1)
                                    }}
                                >
                                    {schoolYears.map(sy => (
                                        <MenuItem key={sy._id} value={sy._id}>
                                            {sy.name} {sy.isActive ? t('admin.dashboard.activeSuffix') : ''}
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
                                    <Grid container spacing={{ xs: 1.5, sm: 3 }} mb={4}>
                                        <Grid item xs={6} sm={6} md={3}>
                                            <StatCard
                                                title={t('admin.dashboard.totalRegistrations')}
                                                count={stats.total}
                                                icon={<PeopleIcon sx={{ color: '#1976d2', fontSize: { xs: 24, sm: 30 } }} />}
                                                color="#1976d2"
                                                bgColor="#e3f2fd"
                                            />
                                        </Grid>
                                        <Grid item xs={6} sm={6} md={3}>
                                            <StatCard
                                                title={t('common.pending')}
                                                count={stats.pending}
                                                icon={<HourglassEmptyIcon sx={{ color: '#ed6c02', fontSize: { xs: 24, sm: 30 } }} />}
                                                color="#ed6c02"
                                                bgColor="#fff3e0"
                                            />
                                        </Grid>
                                        <Grid item xs={6} sm={6} md={3}>
                                            <StatCard
                                                title={t('common.approved')}
                                                count={stats.approved}
                                                icon={<CheckCircleIcon sx={{ color: '#2e7d32', fontSize: { xs: 24, sm: 30 } }} />}
                                                color="#2e7d32"
                                                bgColor="#e8f5e9"
                                            />
                                        </Grid>
                                        <Grid item xs={6} sm={6} md={3}>
                                            <StatCard
                                                title={t('common.rejected')}
                                                count={stats.rejected}
                                                icon={<CancelIcon sx={{ color: '#d32f2f', fontSize: { xs: 24, sm: 30 } }} />}
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
                                                        <Typography variant="h6" color="#4A7B59">{t('admin.dashboard.byBranch')}</Typography>
                                                    </Box>
                                                    <TableContainer>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                                    <TableCell><strong>{t('admin.dashboard.branch')}</strong></TableCell>
                                                                    <TableCell align="center"><strong>{t('common.total')}</strong></TableCell>
                                                                    <TableCell align="center"><strong>{t('common.pending')}</strong></TableCell>
                                                                    <TableCell align="center"><strong>{t('common.approved')}</strong></TableCell>
                                                                    <TableCell align="center"><strong>{t('common.rejected')}</strong></TableCell>
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
                                                        <Typography variant="h6" color="#4A7B59">{t('admin.dashboard.byAgeGroup')}</Typography>
                                                    </Box>
                                                    <TableContainer>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                                    <TableCell><strong>{t('admin.dashboard.ageGroup')}</strong></TableCell>
                                                                    <TableCell align="center"><strong>{t('common.total')}</strong></TableCell>
                                                                    <TableCell align="center"><strong>{t('common.pending')}</strong></TableCell>
                                                                    <TableCell align="center"><strong>{t('common.approved')}</strong></TableCell>
                                                                    <TableCell align="center"><strong>{t('common.rejected')}</strong></TableCell>
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
                                    <Box mb={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                                        <Typography variant="h6" color="#4A7B59">
                                            {t('admin.dashboard.recentRegistrations', { total })}
                                        </Typography>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="success"
                                            onClick={() => navigate('/admin/registrations')}
                                        >
                                            {t('admin.dashboard.viewAll')}
                                        </Button>
                                    </Box>

                                    {registrations.length === 0 ? (
                                        <Card>
                                            <CardContent>
                                                <Typography align="center" color="text.secondary">
                                                    {t('admin.dashboard.noRegistrations')}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <TableContainer component={Paper}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                        <TableCell><strong>{t('admin.dashboard.childName')}</strong></TableCell>
                                                        <TableCell><strong>{t('admin.dashboard.parent1')}</strong></TableCell>
                                                        <TableCell><strong>{t('admin.dashboard.parent2')}</strong></TableCell>
                                                        <TableCell><strong>{t('admin.dashboard.branch')}</strong></TableCell>
                                                        <TableCell align="center"><strong>{t('common.status')}</strong></TableCell>
                                                        <TableCell><strong>{t('admin.dashboard.date')}</strong></TableCell>
                                                        <TableCell align="center"><strong>{t('common.actions')}</strong></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {registrations.map(reg => (
                                                        <TableRow key={reg._id} hover>
                                                            <TableCell>{reg.childName}</TableCell>
                                                            <TableCell>{reg.parent1FirstName} {reg.parent1LastName}</TableCell>
                                                            <TableCell>{reg.parent2FirstName} {reg.parent2LastName}</TableCell>
                                                            <TableCell>{BRANCH_LABELS[reg.branch] || reg.branch}</TableCell>
                                                            <TableCell align="center">
                                                                <Chip
                                                                    label={t(`common.${reg.status}`)}
                                                                    color={STATUS_COLORS[reg.status] || 'default'}
                                                                    size="small"
                                                                    sx={{ textTransform: 'capitalize' }}
                                                                />
                                                            </TableCell>
                                                            <TableCell>{formatDateLocal(reg.createdAt)}</TableCell>
                                                            <TableCell align="center">
                                                                <Button
                                                                    size="small"
                                                                    startIcon={<VisibilityIcon />}
                                                                    onClick={() => navigate('/admin/registrations')}
                                                                >
                                                                    {t('common.details')}
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
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
                                                    fetchDashboardData(selectedYearId, value)
                                                }}
                                                color="success"
                                                showFirstButton
                                                showLastButton
                                            />
                                        </Box>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </Container>
            </Box><ToastContainer />
        </Box>
    )
}

export default SchoolYearDashboard
