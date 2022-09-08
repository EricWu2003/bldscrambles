import React from 'react';
import { Button, AppBar, Toolbar, Typography, Box, ButtonBase, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { generateRandomScramble } from './utils';

const Header = ({currentScramble, setCurrentScramble}) => {

  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isError, setIsError] = React.useState(false);


  const handleNewScrambleClick = () => {
    setCurrentScramble(generateRandomScramble());
  };

  const isValidScramble = scramble => {
    const tokens = scramble.split(' ');
    const validTokens = ["R", "R'", "R2", "L", "L'", "L2", "U", "U'", "U2", "D", "D'", "D2", "F", "F'", "F2", "B", "B'", "B2"];
    let invalid = false;
    tokens.forEach(token => {
      if (!validTokens.includes(token)) {
        invalid = true;
      }
    });
    return !invalid;
  }

  const handleTextFieldChange = e => {
    const inputValue = e.target.value;

    
  


    if (inputValue.includes('\n')) {
      const processedScramble = inputValue.replaceAll('\n', '')
      const isValid = isValidScramble(processedScramble);
      if (isValid) {
        setCurrentScramble(processedScramble);
        setIsEditMode(false);
      }
    }

    const isValid = isValidScramble(inputValue);

    setIsError(!isValid);
  };

  return (
    <AppBar position="relative">
      <Toolbar>
        <Box display="flex" width="100%" flexDirection="column" mt={1} mb={1}>
          <Box flexGrow={1} mb={1}>
            {!isEditMode && (
              <Typography variant="h6">
                Scramble: {currentScramble}
                <Box ml={1} display="inline">
                  <ButtonBase onClick={() => setIsEditMode(true)}>
                    <EditIcon />
                  </ButtonBase>
                </Box>
              </Typography>
            )}
            {isEditMode && (
              <TextField
                // error
                label="Input Scramble"
                fullWidth
                multiline
                onChange={e => handleTextFieldChange(e)}
                defaultValue={currentScramble}
                error={isError}
              />
            )}
          </Box>
          <Box>
            <Button onClick={handleNewScrambleClick} variant="contained" color="success">
              New Scramble
            </Button>
          </Box>

        </Box>

      </Toolbar>
    </AppBar>
  )
}

export default Header;