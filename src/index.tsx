import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DefaultTemplate from './components/default-template';
import Home from './components/pages/home';
import NotFound from './components/pages/not-found';
import UserContextProvider from './contexts/UserContext';
import Style from './components/pages/style';
import EditMove from './components/pages/edit-move';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DefaultTemplate />}>
            <Route index element={<Home />} />
            <Route path="style/:styleId" element={<Style />} />
            <Route path="move/:moveId/edit" element={<EditMove />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  </React.StrictMode>
);
