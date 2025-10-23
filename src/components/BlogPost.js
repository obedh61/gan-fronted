import React from 'react';
import { Container, Typography, Grid, Box, Paper, useMediaQuery, useTheme } from '@mui/material';
import Img from '../assets/img.svg'; // Importación de la imagen SVG local

const BlogPost = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container sx={{ padding: 2 }}>
      {/* Header with Image */}
      <Box
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${Img})`, // Usa la imagen importada como background
          backgroundSize: 'contain', // La imagen se ajusta sin recortarse
          backgroundRepeat: 'no-repeat', // Evita que la imagen se repita
          backgroundPosition: 'center', // Centra la imagen
          height: isSmallScreen ? '250px' : '400px',
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          
        }}
      >
        <Typography
          variant="h4" 
          sx={{  fontWeight: 'bold', textAlign: 'center' }}
        >
          The Montessori Method: Education for the Future
        </Typography>
      </Box>

      {/* Blog Body */}
      <Paper sx={{ marginTop: 3, padding: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
          History of the Montessori Method
        </Typography>
        <Typography paragraph>
          The Montessori method was developed by Dr. Maria Montessori in the early 20th century.
          Her educational approach focuses on self-directed learning, respect for the child, and
          fostering independence from a young age. Montessori was the first Italian woman to become
          a doctor, and throughout her career, she observed how children could learn naturally if
          provided with the right environment. This educational approach spread quickly around the
          world and remains one of the most influential methodologies in modern education.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 3, marginBottom: 2 }}>
          Differences with Traditional Methods
        </Typography>
        <Typography paragraph>
          Unlike traditional methods, which are often teacher-centered and focused on rote learning,
          the Montessori method places the child at the center of the learning process. Children
          choose their own pace and activities, encouraging deeper and more personalized learning.
          In Montessori classrooms, the environment and materials are arranged to foster exploration
          and independent discovery.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 3, marginBottom: 2 }}>
          Advantages of the Montessori Method
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Promotes Autonomy
              </Typography>
              <Typography paragraph>
                Children learn to make decisions for themselves and take responsibility for their
                own learning, which fosters independence.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Respect for Individual Pace
              </Typography>
              <Typography paragraph>
                Each child progresses at their own pace, allowing for personalized learning without
                the pressure of comparing to others.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Development of Social Skills
              </Typography>
              <Typography paragraph>
                By working in groups and learning to collaborate, children develop social and
                emotional skills that prepare them for life.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default BlogPost;
