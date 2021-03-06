import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import '@shopify/polaris/build/esm/styles.css';
import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider} from '@shopify/polaris';
import InstallTemplate from './templates/install'
import Guard from './components/guard';
import Home from './pages/home';
function App() {
  return (
    <AppProvider i18n={enTranslations}>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Guard validateSession><Home /></Guard>} />
          <Route path="/install" element={<InstallTemplate />} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
