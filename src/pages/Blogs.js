import DrawerAppBar from '../components/Bar';
import ImgMediaCard from '../components/Card';
import { Box, Container, Grid } from '@mui/material';
import useInfos from '../components/data'
function Blogs() {
  const infos = useInfos();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Asegura que el contenedor ocupe al menos el 100% de la altura de la ventana
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Box>
          <DrawerAppBar />
        </Box>
        
          
        
        <Container >
          
          <Grid container spacing={2} marginTop={3}>
            
            {
              infos.map((info) => (
                
                  <ImgMediaCard key={info.link} title={info.title} image={info.image} description={info.description} link={info.link} />
                
              ))
            }
          </Grid>

        </Container>
      </Box></Box>
    
  );
}

export default Blogs;
