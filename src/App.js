import React from 'react'
import './App.css';
import Canvas from './Canvas';

const Cube = require('cubejs');

function App() {
  const [cubeState, setCubeState] = React.useState("");

  function handleClick() {
    const cube = new Cube();
  
    let scramble = generateRandomScramble();
  
    cube.move(scramble);
  
    console.log(`your scramble is: ${scramble}`);
  
    setCubeState(cube.asString());
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => handleClick()}>Click me</button>
        <Canvas cubeString={cubeState} width={300} height={300}></Canvas>
      </header>
    </div>
  );
}



function generateRandomScramble() {
  // we will generate a scramble between 22 and 25 moves
  let moves = ["R", "R'", "R2", "L", "L'", "L2", "U", "U'", "U2", "D", "D'", "D2", "F", "F'", "F2", "B", "B'", "B2"];
  let scramble = "";
  let numMoves = getRndInteger(22, 25);
  let forbidden = "*";
  for (let i = 0; i < numMoves; i ++) {
    let nextMove = moves[getRndInteger(0, moves.length - 1)];
    while (nextMove.includes(forbidden)) {
      nextMove = moves[getRndInteger(0, moves.length - 1)];
    }

    forbidden = nextMove[0];
    scramble += nextMove + " ";
  }
  return scramble;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}


export default App;
