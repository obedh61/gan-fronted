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

function MenuApp() {
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
                      <AppRegistrationIcon />
                    </IconButton>
                  </Box>
                  <Button variant="outlined" color='success' component={Link} to={'/access'}>
                    Register
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={6} alignItems="center" style={{zIndex: 2}}>
                <Paper elevation={1} style={{textAlign:'center', margin:8, padding:5}} >
                  <Box>
                    <IconButton>
                      <AccessTimeIcon />
                    </IconButton>
                  </Box>
                  <Button variant="outlined" color='success' component={Link} to={'/timer'}>Start day</Button>
                </Paper>
              </Grid>

              <Grid item xs={6} alignItems="center" style={{zIndex: 2}}>
                <Paper elevation={1} style={{textAlign:'center', margin:8, padding:5}} >
                  <Box>
                    <IconButton>
                      <WhatsAppIcon />
                    </IconButton>
                  </Box>
                  <Button href='https://wa.me/9720527082519' variant="outlined" color='success'>Contact</Button>
                </Paper>
              </Grid>

              <Grid item xs={6} alignItems="center" style={{zIndex: 2}}>
                <Paper elevation={1} style={{textAlign:'center', margin:8, padding:5}} >
                  <Box>
                    <IconButton>
                      <WebIcon />
                    </IconButton>
                  </Box>
                  <Button variant="outlined" color='success' component={Link} to={'/blogs'}>Blog</Button>
                </Paper>
              </Grid>

            </Grid>
            
            
        </Box>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 1,
            width: '100%',
            height: 'auto',
          }}
        >
          <path
            fill="#00cba9"
            fillOpacity="1"
            d="M0,192L60,197.3C120,203,240,213,360,197.3C480,181,600,139,720,128C840,117,960,139,1080,154.7C1200,171,1320,181,1380,186.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            style={{
              animation: 'waveMovement 6s linear infinite',
            }}
          />
        </svg>

        <style>
          {`
            @keyframes waveMovement {
              0% {
                d: path('M0,192L60,197.3C120,203,240,213,360,197.3C480,181,600,139,720,128C840,117,960,139,1080,154.7C1200,171,1320,181,1380,186.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z'),
              }
              100% {
                d: path('M0,192L60,187.3C120,183,240,173,360,187.3C480,201,600,243,720,254C840,265,960,243,1080,228.7C1200,212,1320,202,1380,196.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z');
              }
            }
          `}
        </style>
        
      </Paper>
    </Grid>
  )
}

export default MenuApp