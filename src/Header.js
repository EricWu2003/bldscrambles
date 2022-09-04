import React from 'react';
import { Button, AppBar, Toolbar, Typography, Box } from '@mui/material';

import { generateRandomScramble } from './utils';

const Header = ({currentScramble, setCurrentScramble}) => {


  const handleNewScrambleClick = () => {
    
    setCurrentScramble(generateRandomScramble());
  }

  return (
    <AppBar position="relative">
      <Toolbar>
        <Box display="flex" width="100%" flexDirection="column" mt={1} mb={1}>
          <Box flexGrow={1} mb={1}>
            <Typography variant="h6">
              Scramble: {currentScramble}
            </Typography>
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