import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './routes/home';
import Onboarding from "./routes/onboarding";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: 'onboarding',
    element: <Onboarding />
  }
])
function App() {
  return (
    <Onboarding />
  );
}

export default App;
