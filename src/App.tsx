import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Text } from '@chakra-ui/react';
import { Button, ButtonGroup } from '@chakra-ui/react'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Text fontSize='6xl'>Hello world!</Text>
        <Button colorScheme='blue'>Press Me</Button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
