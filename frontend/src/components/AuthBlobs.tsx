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
      <Grid item md={7} height="25%">
        <Card style={{ height: '100%', alignContent: 'center', borderRadius: '2vh' }}>
          <CardContent style={{ height: '100%' }}>
            <Grid container direction="column" justifyContent="space-around" height="80%">
              <Grid item>
                <Typography variant="h5" color="primary.main" textAlign="center">
                  Re-discover your
                  <br />
                  business with AI.
                </Typography>
              </Grid>
              <Grid item>
                <Typography color="primary.main" variant="body2" textAlign="center">
                  The most advanced solutions to give your business the insights it needs in order to succeed!
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AuthBlobs;
