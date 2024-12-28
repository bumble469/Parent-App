/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from 'App';
import i18n from './i18n'; // Assuming your i18n setup is here
import { I18nextProvider } from 'react-i18next';
import { MaterialUIControllerProvider } from 'context';

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <I18nextProvider i18n={i18n}> 
      <MaterialUIControllerProvider>
        <App />
      </MaterialUIControllerProvider>
    </I18nextProvider>
  </BrowserRouter>
);
