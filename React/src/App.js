import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Container } from "reactstrap";

import Loading from './components/Loading';
import NavBar from './components/NavBar';
import Footer from "./components/Footer";

import Home from './views/Home';
import Profile from "./views/Profile";

import './App.css';

import initFontAwesome from "./utils/initFontAwesome";
initFontAwesome();


function App() {
  const { isAuthenticated, isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BrowserRouter >
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <Container className="flex-grow-1 mt-5">
          <Routes>
            <Route path="/" element={ isAuthenticated ? <Navigate to="/profile" /> : <Home />} />
            <Route path="/profile" element={<Profile />}/>
          </Routes>
        </Container>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
