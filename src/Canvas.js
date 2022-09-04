import React, {useRef, useEffect} from 'react'
const Cube = require('cubejs');



const GRIDSIZE = 20;
const GAP = 5;

const colors = {
  U: '#FFFFFF',
  D: '#FFFF00',
  L: '#FFA500',
  R: '#FF0000',
  F: '#00FF00',
  B: '#0000FF',
}

const Canvas = props => {
  const { currentScramble } = props;
  const cube = new Cube();
  cube.move(currentScramble);
  const cubeString = cube.asString();

  
  const canvasRef = useRef(null)
    
    
    
  useEffect(() => {
    const draw = ctx => {
      drawSquare(ctx, cubeString, 3*GRIDSIZE + 1*GAP, 0);
      drawSquare(ctx, cubeString.slice(9), 6*GRIDSIZE + 2*GAP, 3*GRIDSIZE + 1*GAP);
      drawSquare(ctx, cubeString.slice(18), 3*GRIDSIZE + 1*GAP, 3*GRIDSIZE + 1*GAP);
      drawSquare(ctx, cubeString.slice(27), 3*GRIDSIZE + 1*GAP, 6*GRIDSIZE + 2*GAP);
      drawSquare(ctx, cubeString.slice(36), 0*GRIDSIZE, 3*GRIDSIZE + 1*GAP);
      drawSquare(ctx, cubeString.slice(45), 9*GRIDSIZE + 3*GAP, 3*GRIDSIZE + 1*GAP);
    }

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    //Our draw come here
    draw(context)
  }, [canvasRef, cubeString])
  
  return <canvas ref={canvasRef} {...props}/>
}

const drawSquare =  (ctx, square, x, y) => {
  const positions = [[0,0], [1,0], [2,0], [0,1], [1,1], [2,1], [0,2], [1,2], [2,2]];

  ctx.strokeStyle = "#000000";
  for (let i = 0; i < 9; i ++) {
    ctx.fillStyle = colors[square[i]];
    ctx.fillRect(x + positions[i][0] * GRIDSIZE, y + positions[i][1] * GRIDSIZE, GRIDSIZE, GRIDSIZE);
    ctx.strokeRect(x + positions[i][0] * GRIDSIZE, y + positions[i][1] * GRIDSIZE, GRIDSIZE, GRIDSIZE);
  }

}


export default Canvas