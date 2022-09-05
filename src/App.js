import React from 'react'
import Canvas from './Canvas';
import { CssBaseline, Container } from '@mui/material';
import Header from './Header';
import { generateRandomScramble } from './utils';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CubeInfoDisplay from './CubeInfoDisplay';



const themeLight = createTheme({
  palette: {
    background: {
      default: "#e4f0e2"
    }
  }
});

const App = () => {
  const [currentScramble, setCurrentScramble] = React.useState(generateRandomScramble());


  return (
    <ThemeProvider theme={themeLight}>
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
            <CubeInfoDisplay currentScramble={currentScramble} />
          </Container>
        </main>
      </div>
    </ThemeProvider>
  );
}




export default App;
