


export function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

export function generateRandomScramble() {
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
