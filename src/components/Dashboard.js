import React from 'react'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import {
    Grid,
    IconButton,
    Typography,
  } from "@mui/material";
import Button from '@mui/material/Button';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WebIcon from '@mui/icons-material/Web';
import { Link } from 'react-router-dom';
import EngineeringIcon from '@mui/icons-material/Engineering';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import AssessmentIcon from '@mui/icons-material/Assessment';
import RecentActorsIcon from '@mui/icons-material/RecentActors';

function DashboardAdmin() {
  return (
    <Grid item xs={12}>
      
      <Paper elevation={3} style={{padding:5, position: "relative"}}>
        <Typography variant='h6' component='h2' style={{textAlign:'center', margin:5}}>
          Gan Montessori Second Home
        </Typography>
        <Box>
            <Grid container spacing={1}   >
              <Grid item xs={6} alignItems="center" style={{zIndex: 2}}>
                <Paper elevation={1} style={{textAlign:'center', margin:8, padding:5}} >
                  <Box>
                    <IconButton>
                      <EngineeringIcon />
                    </IconButton>
                  </Box>
                  <Button variant="outlined" color='success' component={Link} to={'/workers'}>
                    New worker
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={6} alignItems="center" style={{zIndex: 2}}>
                <Paper elevation={1} style={{textAlign:'center', margin:8, padding:5}} >
                  <Box>
                    <IconButton>
                      <FamilyRestroomIcon />
                    </IconButton>
                  </Box>
                  <Button variant="outlined" color='success' component={Link} to={'/privatechild'}>
                    New childs
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={6} alignItems="center" style={{zIndex: 2}}>
                <Paper elevation={1} style={{textAlign:'center', margin:8, padding:5}} >
                  <Box>
                    <IconButton>
                      <AssessmentIcon />
                    </IconButton>
                  </Box>
                  <Button variant="outlined" color='success' component={Link} to={'/privatesession'}>
                    Watch Sessions
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={6} alignItems="center" style={{zIndex: 2}}>
                <Paper elevation={1} style={{textAlign:'center', margin:8, padding:5}} >
                  <Box>
                    <IconButton>
                      <RecentActorsIcon />
                    </IconButton>
                  </Box>
                  <Button variant="outlined" color='success' component={Link} to={'/viewchildpage'}>
                    Wath childs list
                  </Button>
                </Paper>
              </Grid>

            </Grid>
            
            
        </Box>
          <svg style={{zIndex: 1, position: "absolute", bottom:0, right:0}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" >
            <path  fill="#00cba9" fillOpacity="1" d="M0,192L60,197.3C120,203,240,213,360,197.3C480,181,600,139,720,128C840,117,960,139,1080,154.7C1200,171,1320,181,1380,186.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        
      </Paper>
    </Grid>
  )
}

export default DashboardAdmin