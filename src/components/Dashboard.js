import React from 'react'
import { useTranslation } from 'react-i18next'
import {
    Box, Grid, Typography, Card, CardContent, CardActionArea
} from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import EngineeringIcon from '@mui/icons-material/Engineering'
import AssessmentIcon from '@mui/icons-material/Assessment'
import { useNavigate } from 'react-router-dom'

function DashboardAdmin() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const menuItems = [
        {
            title: t('admin.overviewCardTitle'),
            description: t('admin.overviewCardDesc'),
            icon: DashboardIcon,
            path: '/admin/dashboard',
            color: '#4A7B59'
        },
        {
            title: t('admin.registrationsCardTitle'),
            description: t('admin.registrationsCardDesc'),
            icon: PeopleIcon,
            path: '/admin/registrations',
            color: '#ff9800'
        },
        {
            title: t('admin.schoolYearsCardTitle'),
            description: t('admin.schoolYearsCardDesc'),
            icon: CalendarTodayIcon,
            path: '/admin/school-years',
            color: '#2196f3'
        },
        {
            title: t('admin.workersCardTitle'),
            description: t('admin.workersCardDesc'),
            icon: EngineeringIcon,
            path: '/workers',
            color: '#9c27b0'
        },
        {
            title: t('admin.workSessionsCardTitle'),
            description: t('admin.workSessionsCardDesc'),
            icon: AssessmentIcon,
            path: '/privatesession',
            color: '#00897b'
        }
    ]

    return (
        <Grid item xs={12}>
            <Box sx={{ py: 2 }}>
                <Typography variant="h4" color="#4A7B59" textAlign="center" gutterBottom>
                    {t('admin.panelTitle')}
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
                    {t('admin.panelSubtitle')}
                </Typography>

                <Grid container spacing={3} justifyContent="center">
                    {menuItems.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.title}>
                            <Card
                                variant="outlined"
                                sx={{
                                    height: '100%',
                                    borderLeft: `4px solid ${item.color}`,
                                    transition: 'box-shadow 0.2s, transform 0.2s',
                                    '&:hover': {
                                        boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                <CardActionArea
                                    onClick={() => navigate(item.path)}
                                    sx={{ height: '100%', p: 1 }}
                                >
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Box
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: '50%',
                                                backgroundColor: `${item.color}15`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 2
                                            }}
                                        >
                                            <item.icon sx={{ fontSize: 28, color: item.color }} />
                                        </Box>
                                        <Typography variant="h6" gutterBottom>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Grid>
    )
}

export default DashboardAdmin
