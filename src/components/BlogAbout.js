import React from 'react';
import { Container, Typography, Grid, Box, Paper, useMediaQuery, useTheme } from '@mui/material';
import Img1 from '../assets/Prepared-Environment-2.jpg'; // Importación de la imagen SVG local

const BlogAbut = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container sx={{ padding: 2 }}>
      {/* Header with Image */}
      <Box
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${Img1})`, // Usa la imagen importada como background
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
        {/* <Typography
          variant="h4" 
          sx={{  fontWeight: 'bold', textAlign: 'center' }}
        >
          The Montessori Method: Education for the Future
        </Typography> */}
      </Box>

      {/* Blog Body */}
      <Paper sx={{ marginTop: 3, padding: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
          About Montessori Method
        </Typography>
        <Typography paragraph>
            All parents hope to find the best educational program for their children. And they recognize the lasting impact that early learning experiences have on a child’s development and future learning. What is it about the Montessori philosophy and practice that is so appealing to parents?

            For more than a century, Montessori has been thriving around the globe, and contemporary research validates the effectiveness of the Montessori Method.  Several key elements of the approach meet the educational goals today’s parents have for their children, including growing into capable people who will be have a strong sense of self, the ability to connect with others, and the potential to be productive throughout their lives. With Montessori, that growth starts early. The early years (birth through age 6) are a critical time to set a strong foundation for who a child will become and the role she or he will play in the future.

            A Montessori education develops students who are capable, accountable, knowledgeable people who have the strong sense of self they will need to thrive in the real world.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 3, marginBottom: 2 }}>
            Accountable
        </Typography>
        <Typography paragraph>
            In a child-centered classroom where learning activities are presented individually to children, students progress at their own pace. They are given opportunities to practice, review, or move forward based on their own interests and capabilities. They take charge of their own learning and become accountable for their own knowledge.

            In a Montessori classroom, teachers assess students on a daily basis, using their observations of each child’s interactions in the environment and with peers.  They use their knowledge of child development and academic outcomes to prepare an environment that is simultaneously stimulating and academically, physically, socially, and emotionally accessible. They develop an individualized learning plan for each child, based on his or her unique interests and abilities. The teachers provide environments where students have the freedom and the tools to pursue answers to their own questions and learn how to seek out new knowledge themselves.

            Self-correction and self-assessment are an integral part of the Montessori classroom approach. As they mature, students learn to look critically at their work, and become adept at recognizing, correcting, and learning from their errors.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 3, marginBottom: 2 }}>
            Sense of Self
        </Typography>
        <Typography paragraph>
            A Montessori class is composed of students whose ages typically span 3 years. Ideally, students stay with the class, and teacher, for the entire cycle, forging a stable community and meaningful bonds.

            It is common to see students of different ages working together. Older students enjoy mentoring their younger classmates—sometimes the best teacher is someone who has recently mastered the task at hand. Younger students look up to their big “brothers” and “sisters,” and get a preview of the alluring work to come.

            As children mature in the Montessori classroom over the 3-year period, they understand that they are a part of a community where everyone has their own individual needs, but also contributes to the community. Children exercise independence, but are also given opportunities to work with their peers and to support others when they are in need.

            Developing independence and pursuing one’s own interests in the context of a caring community fosters a strong sense of self in each student, and encourages pride in one’s own a unique individuality. 

            Dr. Maria Montessori, the Italian pediatrician and visionary educator who founded the Method, believed that when children are given the freedom to choose their own learning activities a self-confident, inquisitive, creative child emerges. As it turns out, this approach, which is over 100 years old, is exactly what parents are looking for today.
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

export default BlogAbut;
