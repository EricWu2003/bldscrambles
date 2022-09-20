import React from 'react'
import Canvas from './Canvas';
import { CssBaseline, Container } from '@mui/material';
import Header from './Header';
import { generateRandomScramble } from './utils';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CubeInfoDisplay from './CubeInfoDisplay';
import Cube from 'cubejs';
import Cookies from 'universal-cookie';



const themeLight = createTheme({
  palette: {
    background: {
      default: "#e4f0e2"
    }
  }
});

const themeDark = createTheme({
  palette: {
    background: {
      default: "#121212"
    }
  }
});

export const SettingsContext = React.createContext();
const cookies = new Cookies();


const App = () => {
  // This line must come before any call of the generateRandomScramble function.
  Cube.initSolver();

  const [currentScramble, setCurrentScramble] = React.useState(generateRandomScramble);

  const [currentSettings, setCurrentSettings] = React.useState({});

  const currentTheme = currentSettings.lightTheme ? themeLight : themeDark;

  React.useEffect(
    () => {
      // set the cookie whenever currentSettings changes
      if (currentSettings.lightTheme === undefined) {
        return;
      }

      if (currentSettings.lightTheme) {
        cookies.set('lightTheme', '1');
      } else {
        cookies.set('lightTheme', '0');
      }
    }, [currentSettings]
  );

  React.useEffect(
    () => {
      // load the current settings from cookies when the app starts
      let settings = {}
      if (cookies.get('lightTheme') === '1') {
        settings.lightTheme = true;
      } else {
        settings.lightTheme = false;
      }

      setCurrentSettings(settings);
    }, []
  );

  return (
    <ThemeProvider theme={currentTheme}>
      <SettingsContext.Provider value={{currentSettings, setCurrentSettings}}>
        <div className="App">
          <CssBaseline></CssBaseline>
          <header className="App-header">
            <Header 
              currentScramble={currentScramble || ""}
              setCurrentScramble={setCurrentScramble}
            />
          </header>

          <main>
            <Container maxWidth="md">
              <Canvas 
                currentScramble={currentScramble || ""} 
                width={300}
                height={220}
              />
              <CubeInfoDisplay currentScramble={currentScramble || ""} />
            </Container>
          </main>
        </div>
      </SettingsContext.Provider>
    </ThemeProvider>
  );
}




export default App;
