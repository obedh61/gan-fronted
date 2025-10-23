import React from "react"; 
import { Typography, Box, Grid, Card, CardMedia, CardContent } from "@mui/material";
import Carousel from "react-material-ui-carousel"; // Using Material UI Carousel
import Tulip from '../assets/Tulip.svg';
import Env from '../assets/env.jpg';
import Expl from '../assets/expl.jpg';
import Mate from '../assets/mate.jpg';

const MontessoriComponent = () => {
  const images = [
    {
      src: Env,
      caption: "Carefully prepared environments",
    },
    {
      src: Mate,
      caption: "Materials that stimulate learning",
    },
    {
      src: Expl,
      caption: "Children exploring freely",
    },
  ];

  return (
    <Box sx={{ padding: 4, fontFamily: 'Arial, sans-serif', position: 'relative' }}>
      <Typography 
        variant="h4" 
        align="center" 
        gutterBottom color='#4A7B59'
        sx={{ position: 'relative', zIndex: 2 }}
      >
        Montessori: An Innovative Approach
      </Typography>
      <Grid container spacing={4} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', position: 'relative' }}>
            <CardContent>
              <Typography variant="body1" paragraph>
                The Montessori method is an educational approach that fosters independence, exploration, and self-directed learning. This system emphasizes respecting each child’s individual pace and providing a carefully prepared environment that stimulates their holistic development.
              </Typography>
              <Typography variant="body1" paragraph sx={{ position: 'relative', zIndex: 2 }}>
                Developed by Dr. Maria Montessori in the early 20th century, this methodology revolutionized education by focusing on the natural curiosity and capabilities of children. The Montessori classroom is designed to encourage active engagement, hands-on learning, and collaborative activities that build both cognitive and social skills.
              </Typography>
            </CardContent>
            {/* Tulip SVG en la esquina inferior derecha */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                width: 120, // Ajusta el tamaño del SVG
                height: 'auto',
                zIndex: 1, // Coloca el SVG detrás del texto
              }}
            >
              <img
                src={Tulip} // Ruta del SVG
                alt="Decorative Tulip"
                style={{ width: '100%', height: 'auto', opacity: 0.3 }}
              />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Carousel>
            {images.map((image, index) => (
              <Card sx={{ height: '100%' }} key={index}>
                <CardMedia
                  component="img"
                  src={image.src}
                  alt={`Slide ${index + 1}`}
                  sx={{
                    width: '100%',  // Asegura que la imagen tenga el ancho completo del contenedor
                    height: '400px',  // Ajusta la altura de todas las imágenes de manera uniforme
                    objectFit: 'contain',  // Mantiene la relación de aspecto sin deformar la imagen
                  }}
                />
                <CardContent>
                  <Typography align="center">{image.caption}</Typography>
                </CardContent>
              </Card>
            ))}
          </Carousel>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MontessoriComponent;
