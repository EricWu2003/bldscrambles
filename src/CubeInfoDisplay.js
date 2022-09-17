import React from 'react';
import {  Typography, Box } from '@mui/material';
import Cube from 'cubejs';

const CubeInfoDisplay = ({currentScramble}) => {
  const cube = new Cube();
  cube.move(currentScramble);

  const cubeJSON = cube.toJSON()

  const cornerCycles = calculateCornerCycles({
    cubeJSON, 
    buffer: 2,
  });

  const hasParity = cornerCycles.length % 2 === 1;

  const edgeCycles = calculateEdgeCycles({
    cubeJSON, 
    buffer: 5,
    adjustForParity: hasParity,
  });

  const twistedCorners = findTwistedCorners({
    cubeJSON, 
    buffer: 2,
  });
  const twistedEdges = findTwistedEdges({
    cubeJSON, 
    buffer: 5,
  });



  return (
    <Box>
      <Typography>
        Has parity: {hasParity ?  "Yes": "No"}
      </Typography>
      <Typography>
        Edges: {displayAsPairs(edgeCycles)}
      </Typography>
      <Typography>
        Corners: {displayAsPairs(cornerCycles)}
      </Typography>
      <Typography>
        Twisted Edges: {twistedEdges.join(', ')}
      </Typography>
      <Typography>
        Twisted Corners: {twistedCorners.join(', ')}
      </Typography>
    </Box>
  );
}

export default CubeInfoDisplay;

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

const CORNER_LOCATIONS = [
  ["UFR", "RUF", "FUR"],
  ["UFL", "FUL", "LUF"],
  ["UBL", "LUB", "BUL"],
  ["UBR", "BUR", "RUB"],
  ["DFR", "FDR", "RDF"],
  ["DFL", "LDF", "FDL"],
  ["DBL", "BDL", "LDB"],
  ["DBR", "RDB", "BDR"],
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
  CORNERS: {
    "UBL": 'A',
    "UBR": 'B',
    "UFR": 'C',
    "UFL": 'D',
    "LUB": 'E',
    "LUF": 'F',
    "LDF": 'G',
    "LDB": 'H',
    "FUL": 'I',
    "FUR": 'J',
    "FDR": 'K',
    "FDL": 'L',
    "RUF": 'M',
    "RUB": 'N',
    "RDB": 'O',
    "RDF": 'P',
    "BUR": 'Q',
    "BUL": 'R',
    "BDL": 'S',
    "BDR": 'T',
    "DFL": 'U',
    "DFR": 'V',
    "DBR": 'W',
    "DBL": 'X',
  }

}


const calculateEdgeCycles = ({cubeJSON, buffer, adjustForParity}) => {
  let {ep, eo} = cubeJSON;

  if (adjustForParity) {
    // on cases with parity, we want to swap the locations of the UB and UR edges. These correspond to edges in position 2 and 3.
    ep = ep.map(num => {
      if (num === 2) {
        return 3
      } else if (num === 3) {
        return 2
      } else {
        return num;
      }
    })
  }

  let currentBufferLocation = ep.findIndex(x => x === buffer);

  let hasTouched = ep.map((elem, index) => elem === index);
  hasTouched[buffer] = true;

  const allEdgesAreSolved = !hasTouched.some(val => !val);
  if (allEdgesAreSolved) {
    return "";
  }

  
  let cycles = [];


  // TODO: right now the fact that U is the buffer (not K) is implicitly defined in the code. Make this explicit
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


const calculateCornerCycles = ({cubeJSON, buffer}) => {
  const {cp, co} = cubeJSON;

  let currentBufferLocation = cp.findIndex(x => x === buffer);

  let hasTouched = cp.map((elem, index) => elem === index);
  hasTouched[buffer] = true;

  const allEdgesAreSolved = !hasTouched.some(val => !val);
  if (allEdgesAreSolved) {
    return "";
  }

  
  let cycles = [];


  // TODO: right now the fact that A is the buffer (not E or R) is implicitly defined in the code. Make this explicit
  let currIndex, currOrientation;
  if (cp[buffer] !== buffer) {
    // If the buffer position is not occupied by the buffer piece
    currIndex = cp[buffer];
    currOrientation = co[buffer];
    cycles.push([currIndex, -currOrientation]);
    hasTouched[currIndex] = true;
  } else {
    // If the buffer position is occupied by the buffer piece
    currIndex = hasTouched.findIndex(elem => elem === false);
    currOrientation = 0;
    currentBufferLocation = currIndex;
    cycles.push([currIndex, -currOrientation]);
    hasTouched[currIndex] = true;

    currOrientation = co[currIndex];
    currIndex = cp[currIndex];
    cycles.push([currIndex, -currOrientation]);
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

        currOrientation = co[breakInPoint];
        currIndex = cp[breakInPoint];
        cycles.push([currIndex, -currOrientation]);
        hasTouched[currIndex] = true;
      }

    } else {
      // follow next edge in cycle
      currOrientation = (currOrientation + co[currIndex]) % 3;
      currIndex = cp[currIndex];
      cycles.push([currIndex, -currOrientation]);
      hasTouched[currIndex] = true;
    }
  }

  
  cycles = cycles.map(arr => {
    const [location, orientation] = arr;
    return [location, (3+orientation)%3];
  })

  return cycles.map(arr => {
    const [location, orientation] = arr;
    const code = CORNER_LOCATIONS[location][orientation];
    return SPIFFS.CORNERS[code];
  })
}

const displayAsPairs = letterArray => {
  let letterString = letterArray.join('');
  let pairs = [];
  while (letterString !== '') {
    pairs.push(letterString.slice(0,2));
    letterString = letterString.slice(2);
  }
  return pairs.join(' ');
}

const findTwistedEdges = ({cubeJSON, buffer}) => {
  const {ep, eo} = cubeJSON;

  let twistedEdges = [];

  for (let i = 0; i < ep.length; i ++) {
    if (ep[i] === i && i !== buffer) {
      if (eo[i] !== 0) {
        const position = ep[i];
        const orientation = eo[i];
        twistedEdges.push(EDGE_LOCATIONS[position][orientation]);
      }
    }
  }
  return twistedEdges;
}

const findTwistedCorners = ({cubeJSON, buffer}) => {
  const {cp, co} = cubeJSON;

  let twistedCorners = [];

  for (let i = 0; i < cp.length; i ++) {
    if (cp[i] === i && i !== buffer) {
      if (co[i] !== 0) {
        const position = cp[i];
        const orientation = co[i];
        twistedCorners.push(CORNER_LOCATIONS[position][orientation]);
      }
    }
  }
  return twistedCorners;
}