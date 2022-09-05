import React from 'react';
import {  Typography, Box } from '@mui/material';
import Cube from 'cubejs';

const CubeInfoDisplay = ({currentScramble}) => {
  const cube = new Cube();
  cube.move(currentScramble);

  const cubeJSON = cube.toJSON()
  console.log(cubeJSON);

  return (
    <Box>
      <Typography>
        {currentScramble}
      </Typography>
    </Box>
  );
}

export default CubeInfoDisplay;