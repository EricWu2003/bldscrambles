import React from 'react';
import {  Typography, Box } from '@mui/material';
import Cube from 'cubejs';

const CubeInfoDisplay = ({currentScramble}) => {
  const cube = new Cube();
  cube.move(currentScramble);

  const cubeJSON = cube.toJSON()
  console.log(cubeJSON);

  console.log(calculateEdgeCycles({
    ep: cubeJSON.ep, 
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


const calculateEdgeCycles = ({ep, buffer}) => {
  debugger;
  let currentBufferLocation = ep.findIndex(x => x === buffer);

  let hasTouched = ep.map((elem, index) => elem === index);
  hasTouched[buffer] = true;
  
  let cycles = [];


  let currIndex;
  if (ep[buffer] !== buffer) {
    // If the buffer position is not occupied by the buffer piece
    currIndex = ep[buffer];
  } else {
    // If the buffer position is occupied by the buffer piece
    currIndex = hasTouched.findIndex(elem => elem === false);
  }
  cycles.push(currIndex);
  hasTouched[currIndex] = true;

  while (true) {
    if (currIndex === currentBufferLocation) {
      // begin new cycle. First we find the first location that is not solved
      let breakInPoint = hasTouched.findIndex(elem => elem === false);
      if (breakInPoint === -1) {
        return cycles;
      } else {
        currentBufferLocation = breakInPoint;
        cycles.push(breakInPoint);
        hasTouched[breakInPoint] = true;
        currIndex = ep[breakInPoint];
        cycles.push(currIndex);
        hasTouched[currIndex] = true;
      }


    } else {
      // follow next edge in cycle
      let next = ep[currIndex];
      cycles.push(next);
      hasTouched[next] = true;
      currIndex = next;
    }
  }
}

export default CubeInfoDisplay;