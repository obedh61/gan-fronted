import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { Grid } from '@mui/material';

export default function ImgMediaCard({ title,image,description,link}) {

    return (
    <Grid item md={4} xs={12} >
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                component="img"
                alt="green iguana"
                height="160"
                image={image}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                {/* <Button size="small">Share</Button> */}
                <Button color='success' size="small" component={Link} to={`/${link}`}>Learn More</Button>
            </CardActions>
        </Card>
    </Grid>
    
  );
}
