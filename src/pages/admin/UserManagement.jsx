import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { getCookie, isAuth, formatDate } from '../helpers'
import DrawerAppBar from '../../components/Bar'
import { toast } from 'react-toastify'
import AppToastContainer from '../../components/AppToastContainer'
import 'react-toastify/dist/ReactToastify.css'
import {
    Box, Container, Typography, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Chip, Card, CardContent, CircularProgress, Tooltip,
    useMediaQuery, useTheme
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PersonIcon from '@mui/icons-material/Person'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize'
import { useNavigate } from 'react-router-dom'

const UserManagement = () => {
    const { t, i18n } = useTranslation()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState(null)

    const navigate = useNavigate()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const token = getCookie('token')
    const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token])
    const API = process.env.REACT_APP_API
    const currentUserId = isAuth()?._id

    // ============================================
    // API FUNCTIONS
    // ============================================

    const fetchUsers = useCallback(() => {
        setLoading(true)
        axios.get(`${API}/admin/users`, { headers })
            .then(response => {
                setUsers(response.data.data || [])
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching users:', error)
                toast.error(error.response?.data?.error || t('admin.users.fetchError'))
                setLoading(false)
            })
    }, [API, headers, t])

    const toggleRole = (user) => {
        const newRole = user.role === 'admin' ? 'subscriber' : 'admin'
        setActionLoading(true)
        axios.put(`${API}/admin/users/${user._id}/role`, { role: newRole }, { headers })
            .then(response => {
                toast.success(t('admin.users.roleUpdateSuccess'))
                setUsers(prev => prev.map(u => u._id === user._id ? response.data : u))
            })
            .catch(error => {
                console.error('Error updating role:', error)
                toast.error(error.response?.data?.error || t('admin.users.roleUpdateError'))
            })
            .finally(() => setActionLoading(false))
    }

    const toggleBlocked = (user) => {
        const newBlocked = !user.isBlocked
        setActionLoading(true)
        axios.put(`${API}/admin/users/${user._id}/blocked`, { isBlocked: newBlocked }, { headers })
            .then(response => {
                toast.success(newBlocked ? t('admin.users.blockSuccess') : t('admin.users.unblockSuccess'))
                setUsers(prev => prev.map(u => u._id === user._id ? response.data : u))
            })
            .catch(error => {
                console.error('Error updating blocked status:', error)
                toast.error(error.response?.data?.error || t('admin.users.blockUpdateError'))
            })
            .finally(() => setActionLoading(false))
    }

    const deleteUser = () => {
        if (!deleteTarget) return
        setActionLoading(true)
        axios.delete(`${API}/admin/users/${deleteTarget._id}`, { headers })
            .then(() => {
                toast.success(t('admin.users.deleteSuccess'))
                setUsers(prev => prev.filter(u => u._id !== deleteTarget._id))
                setDeleteOpen(false)
                setDeleteTarget(null)
            })
            .catch(error => {
                console.error('Error deleting user:', error)
                toast.error(error.response?.data?.error || t('admin.users.deleteError'))
            })
            .finally(() => setActionLoading(false))
    }

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    // ============================================
    // HANDLERS
    // ============================================

    const openDeleteDialog = (user) => {
        setDeleteTarget(user)
        setDeleteOpen(true)
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
                            {t('admin.users.title')}
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

                    {/* Table */}
                    {loading ? (
                        <Box display="flex" justifyContent="center" py={6}>
                            <CircularProgress color="success" />
                        </Box>
                    ) : users.length === 0 ? (
                        <Card>
                            <CardContent>
                                <Typography align="center" color="text.secondary">
                                    {t('admin.users.empty')}
                                </Typography>
                            </CardContent>
                        </Card>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'action.hover' }}>
                                        <TableCell><strong>{t('admin.users.name')}</strong></TableCell>
                                        <TableCell><strong>{t('admin.users.email')}</strong></TableCell>
                                        <TableCell align="center"><strong>{t('admin.users.role')}</strong></TableCell>
                                        <TableCell align="center"><strong>{t('admin.users.registrationStatus')}</strong></TableCell>
                                        <TableCell><strong>{t('admin.users.registeredAt')}</strong></TableCell>
                                        <TableCell align="center"><strong>{t('common.actions')}</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map(user => {
                                        const isSelf = user._id === currentUserId
                                        return (
                                            <TableRow key={user._id} hover>
                                                <TableCell>
                                                    {user.name}
                                                    {isSelf && (
                                                        <Chip
                                                            label={t('admin.users.you')}
                                                            size="small"
                                                            color="success"
                                                            variant="outlined"
                                                            sx={{ ml: 1 }}
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell sx={{ wordBreak: 'break-word' }}>{user.email}</TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={t(`admin.users.roles.${user.role || 'subscriber'}`)}
                                                        color={user.role === 'admin' ? 'primary' : 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={user.isBlocked ? t('admin.users.blocked') : t('admin.users.active')}
                                                        color={user.isBlocked ? 'error' : 'success'}
                                                        size="small"
                                                        variant={user.isBlocked ? 'filled' : 'outlined'}
                                                    />
                                                </TableCell>
                                                <TableCell>{formatDateLocal(user.createdAt)}</TableCell>
                                                <TableCell align="center">
                                                    <Box display="flex" justifyContent="center" gap={0.5} flexWrap="wrap">
                                                        <Tooltip title={isSelf ? t('admin.users.cannotModifySelf') : ''}>
                                                            <span>
                                                                <Button
                                                                    size="small"
                                                                    startIcon={user.role === 'admin' ? <PersonIcon /> : <AdminPanelSettingsIcon />}
                                                                    onClick={() => toggleRole(user)}
                                                                    disabled={isSelf || actionLoading}
                                                                >
                                                                    {user.role === 'admin' ? t('admin.users.makeSubscriber') : t('admin.users.makeAdmin')}
                                                                </Button>
                                                            </span>
                                                        </Tooltip>
                                                        <Tooltip title={isSelf ? t('admin.users.cannotModifySelf') : ''}>
                                                            <span>
                                                                <Button
                                                                    size="small"
                                                                    color={user.isBlocked ? 'success' : 'warning'}
                                                                    startIcon={user.isBlocked ? <CheckCircleOutlineIcon /> : <BlockIcon />}
                                                                    onClick={() => toggleBlocked(user)}
                                                                    disabled={isSelf || actionLoading}
                                                                >
                                                                    {user.isBlocked ? t('admin.users.unblock') : t('admin.users.block')}
                                                                </Button>
                                                            </span>
                                                        </Tooltip>
                                                        <Tooltip title={isSelf ? t('admin.users.cannotModifySelf') : ''}>
                                                            <span>
                                                                <Button
                                                                    size="small"
                                                                    color="error"
                                                                    startIcon={<DeleteIcon />}
                                                                    onClick={() => openDeleteDialog(user)}
                                                                    disabled={isSelf || actionLoading}
                                                                >
                                                                    {t('common.delete')}
                                                                </Button>
                                                            </span>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* ============================================ */}
                    {/* DELETE CONFIRMATION DIALOG */}
                    {/* ============================================ */}
                    <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
                        <DialogTitle>{t('admin.users.deleteTitle')}</DialogTitle>
                        <DialogContent>
                            <Typography mt={1}>
                                {t('admin.users.deleteText', { name: deleteTarget?.name, email: deleteTarget?.email })}
                            </Typography>
                            <Typography variant="body2" color="error.main" mt={1}>
                                {t('admin.users.deleteWarning')}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDeleteOpen(false)} disabled={actionLoading}>
                                {t('common.cancel')}
                            </Button>
                            <Button
                                onClick={deleteUser}
                                variant="contained"
                                color="error"
                                startIcon={actionLoading ? <CircularProgress size={18} color="inherit" /> : <DeleteIcon />}
                                disabled={actionLoading}
                            >
                                {actionLoading ? t('admin.users.deleting') : t('common.delete')}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box><AppToastContainer />
        </Box>
    )
}

export default UserManagement
