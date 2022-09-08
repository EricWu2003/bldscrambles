import React from 'react';
import {  Typography, Box } from '@mui/material';
import Cube from 'cubejs';

const CubeInfoDisplay = ({currentScramble}) => {
  const cube = new Cube();
  cube.move(currentScramble);

  const cubeJSON = cube.toJSON()

  const edgeCycles = calculateEdgeCycles({
    cubeJSON, 
    buffer: 5,
  });

  return (
    <Box>
      <Typography>
        {edgeCycles}
      </Typography>
    </Box>
  );
}


const EDGE_LOCATIONS = [
  ["UR", "RU"],
  ["UF", "FU"],
  ["UL", "LU"],
  ["UB", "BU"],
  ["DR", "RD"],
  ["DF", "FD"],
  ["DL", "LD"],
  ["DB", "BD"],
  ["FR", "RF"],
  ["FL", "LF"],
  ["BL", "LB"],
  ["BR", "RB"],
]

const SPIFFS = {
  EDGES: {
    "UR": 'B',
    "RU": 'M',
    "UF": 'C',
    "FU": 'I',
    "UL": 'D',
    "LU": 'E',
    "UB": 'A',
    "BU": 'Q',
    "DR": 'V',
    "RD": 'O',
    "DF": 'U',
    "FD": 'K',
    "DL": 'X',
    "LD": 'G',
    "DB": 'W',
    "BD": 'S',
    "FR": 'J',
    "RF": 'P',
    "FL": 'L',
    "LF": 'F',
    "BR": 'T',
    "RB": 'N',
    "BL": 'R',
    "LB": 'H',
  },
}


const calculateEdgeCycles = ({cubeJSON, buffer}) => {
  debugger;
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
    cycles.push([currIndex, currOrientation]);
    hasTouched[currIndex] = true;
  } else {
    // If the buffer position is occupied by the buffer piece
    currIndex = hasTouched.findIndex(elem => elem === false);
    currOrientation = 0;
    currentBufferLocation = currIndex;
    cycles.push([currIndex, currOrientation]);
    hasTouched[currIndex] = true;

    currOrientation = eo[currIndex];
    currIndex = ep[currIndex];
    cycles.push([currIndex, currOrientation]);
    hasTouched[currIndex] = true;
  }

  while (true) {
    if (currIndex === currentBufferLocation) {
      // begin new cycle. First we find the first location that is not solved
      let breakInPoint = hasTouched.findIndex(elem => elem === false);
      if (breakInPoint === -1) {
        break;
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

  return cycles.map(arr => {
    
    const [location, orientation] = arr;
    const code = EDGE_LOCATIONS[location][orientation];
    return SPIFFS.EDGES[code];
  })
}

export default CubeInfoDisplay;