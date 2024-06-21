import { Card, Grid, Typography, CardContent } from '@mui/material';
import React from 'react';
import blobsSvg from '@/assets/AuthBlobs.svg';

const AuthBlobs: React.FC = () => {
  return (
    <Grid
      item
      md={12}
      direction="row"
      container
      alignContent="center"
      justifyContent="center"
      style={{
        height: '100vh',
        width: '100%',
        backgroundImage: `url(${blobsSvg})`,
        backgroundSize: 'cover',
      }}
    >
      <Grid item md={7}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="primary.main" style={{ textAlign: 'center' }}>
              Re-discover your
              <br />
              business with AI.
            </Typography>
            <Typography color="primary.main" style={{ textAlign: 'center', fontSize: '1.5vh' }}>
              The most advanced solutions to give your business the insights it needs in order to succeed!
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AuthBlobs;
