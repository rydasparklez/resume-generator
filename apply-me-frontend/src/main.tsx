import { StrictMode } from 'react'
import React  from 'react'
// import React, { Component, StrictMode }  from 'react';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'

const portalDiv = document.getElementById('root')!;
createRoot(portalDiv).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
