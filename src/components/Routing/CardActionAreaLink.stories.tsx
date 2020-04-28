import { Box, Card, CardContent, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CardActionAreaLink } from './CardActionAreaLink';

export default {
  title: 'Components/Routing',
};

export const CardActionArea = () => (
  <>
    <Grid container spacing={3}>
      <Grid item>
        <Card>
          <CardActionAreaLink to="a">
            <CardContent>
              <Typography variant="h2">Item A</Typography>
            </CardContent>
          </CardActionAreaLink>
        </Card>
      </Grid>
      <Grid item>
        <Card>
          <CardActionAreaLink to="b">
            <CardContent>
              <Typography variant="h2">Item B</Typography>
            </CardContent>
          </CardActionAreaLink>
        </Card>
      </Grid>
      <Grid item>
        <Card>
          <CardActionAreaLink external to="https://google.com" target="_blank">
            <CardContent>
              <Typography variant="h2">Google</Typography>
            </CardContent>
          </CardActionAreaLink>
        </Card>
      </Grid>
    </Grid>
    <Box mt={5}>
      <Routes>
        <Route path="a" element={<div>Route A</div>} />
        <Route path="b" element={<div>Route B</div>} />
      </Routes>
    </Box>
  </>
);
