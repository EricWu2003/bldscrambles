import React from 'react'
import Canvas from './Canvas';
import { CssBaseline, Container } from '@mui/material';
import Header from './Header';
import { generateRandomScramble } from './utils';




const App = () => {
  const [currentScramble, setCurrentScramble] = React.useState(generateRandomScramble());


  return (
    <div className="App">
      <CssBaseline></CssBaseline>
      <header className="App-header">
        <Header 
          currentScramble={currentScramble}
          setCurrentScramble={setCurrentScramble}
        />
      </header>

      <main>
        <Container maxWidth="md">
          <Canvas 
            currentScramble={currentScramble} 
            width={300}
            height={220}
          />
        </Container>
      </main>
    </div>
  );
}




export default App;
