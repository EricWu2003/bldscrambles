import React from 'react';
import {  Typography, Box } from '@mui/material';
import Cube from 'cubejs';

const CubeInfoDisplay = ({currentScramble}) => {
  const cube = new Cube();
  cube.move(currentScramble);

  const cubeJSON = cube.toJSON()
  console.log(cubeJSON);

  console.log(calculateEdgeCycles({
    cubeJSON, 
    buffer: 5,
  }));

  return (
    <Box>
      <Typography>
        {currentScramble}
      </Typography>
    </Box>
  );
}


const calculateEdgeCycles = ({cubeJSON, buffer}) => {
  const {ep, eo} = cubeJSON;

  let currentBufferLocation = ep.findIndex(x => x === buffer);

  let hasTouched = ep.map((elem, index) => elem === index);
  hasTouched[buffer] = true;
  
  let cycles = [];


  let currIndex, currOrientation;
  if (ep[buffer] !== buffer) {
    // If the buffer position is not occupied by the buffer piece
    currIndex = ep[buffer];
    currOrientation = eo[buffer];
  } else {
    // If the buffer position is occupied by the buffer piece
    currIndex = hasTouched.findIndex(elem => elem === false);
    currOrientation = 0;
  }
  cycles.push([currIndex, currOrientation]);
  hasTouched[currIndex] = true;

  while (true) {
    if (currIndex === currentBufferLocation) {
      // begin new cycle. First we find the first location that is not solved
      let breakInPoint = hasTouched.findIndex(elem => elem === false);
      if (breakInPoint === -1) {
        return cycles;
      } else {
        currentBufferLocation = breakInPoint;
        cycles.push([breakInPoint, 0]);
        hasTouched[breakInPoint] = true;

        currOrientation = eo[breakInPoint];
        currIndex = ep[breakInPoint];
        cycles.push([currIndex, currOrientation]);
        hasTouched[currIndex] = true;
      }

    } else {
      // follow next edge in cycle
      currOrientation = (currOrientation + eo[currIndex]) % 2;
      currIndex = ep[currIndex];
      cycles.push([currIndex, currOrientation]);
      hasTouched[currIndex] = true;
    }
  }
}

export default CubeInfoDisplay;