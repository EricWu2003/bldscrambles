import React from 'react';
import { Button, AppBar, Toolbar, Typography, Box, ButtonBase, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { generateRandomScramble } from './utils';
import { SettingsContext } from './App';


const Header = ({currentScramble, setCurrentScramble}) => {
  const {currentSettings, setCurrentSettings} = React.useContext(SettingsContext);

  const [editingScramble, setEditingScramble] = React.useState(currentScramble);

  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isError, setIsError] = React.useState(false);


  const handleNewScrambleClick = () => {
    setCurrentScramble(generateRandomScramble());
    setCurrentSettings({
      ...currentSettings,
      lightTheme: !currentSettings.lightTheme,
    })
  };

  const isValidScramble = scramble => {
    try {
      convertScrambleToStandardForm(scramble);
      return true;
    } catch (err) {
      return false;
    }
  }

  const handleTextFieldChange = e => {
    const inputValue = e.target.value;
    setEditingScramble(inputValue.replace("\n", ""));

    const isError = !isValidScramble(inputValue);
    setIsError(isError);

    if (!isError && inputValue.includes("\n")) {
      saveScramble();
    }
  };

  const saveScramble = () => {
    try {
      const newScramble = convertScrambleToStandardForm(editingScramble);
      setCurrentScramble(newScramble);
      setIsEditMode(false);
    } catch(err) {
      console.log("There was an unexpected exception thrown here.")
    }
  }

  return (
    <AppBar position="relative">
      <Toolbar>
        <Box display="flex" width="100%" flexDirection="column" mt={1} mb={1}>
          <Box flexGrow={1} mb={1}>
            {!isEditMode && (
              <Typography variant="h6">
                Scramble: {currentScramble}
                <Box ml={1} display="inline">
                  <ButtonBase onClick={() => {setIsEditMode(true); setEditingScramble(currentScramble)}}>
                    <EditIcon />
                  </ButtonBase>
                </Box>
              </Typography>
            )}
            {isEditMode && (
              <TextField
                // error
                label="Enter a custom scramble:"
                fullWidth
                multiline
                onChange={e => handleTextFieldChange(e)}
                error={isError}
                value={editingScramble}
              />
            )}
          </Box>
          <Box>
            {!isEditMode && 
              <Button onClick={handleNewScrambleClick} variant="contained" color="success">
                New Random Scramble
              </Button>
            }
            {isEditMode && 
              <Button onClick={saveScramble} variant="contained" disabled={isError}>
                Save
              </Button>

            }
          </Box>

        </Box>

      </Toolbar>
    </AppBar>
  )
}

const convertScrambleToStandardForm = scrambleString => {
  const validMoves = ["R", "L", "U", "D", "F", "B"];

  let scramble = scrambleString;
  scramble = scramble.replaceAll(" ", "").replaceAll("\n", "").toUpperCase();

  if (scramble === ""){
    throw new Error();
  }

  let scrambleTokens = []
  for (let i = 0; i < scramble.length; i ++) {
    if (!validMoves.includes(scramble[i])) {
      throw new Error()
    }
    if (scramble[i+1] === "'") {
      scrambleTokens.push(scramble[i] + "'");
      i ++;
    } else if (scramble[i+1] === "2") {
      scrambleTokens.push(scramble[i] + "2");
      i ++;
    } else {
      scrambleTokens.push(scramble[i]);
    }
  }

  return scrambleTokens.join(" ");
}

export default Header;