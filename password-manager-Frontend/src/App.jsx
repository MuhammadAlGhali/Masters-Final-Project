import './App.css';
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { Container, Header, Content, Footer } from 'rsuite';
import { useRecoilValue } from 'recoil';
import { authStateAtom } from './recoil/atoms';
import NavigationBar from './components/NavigationBar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Main from './pages/Main';

const noNavbarRoutes = ["/login", "/signup"];

const RequireAuth = ({ children }) => {

  const authState = useRecoilValue(authStateAtom);
  const location = useLocation();
  return authState.authenticated ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
};

function App() {

  const routeLocation = useLocation();

  return (
    <Container className='App'>
      {!noNavbarRoutes.includes(routeLocation.pathname) && (
        <Header>
          <NavigationBar />
        </Header>
      )}
      <Content>
        <Routes>
          <Route path="/" element={<RequireAuth><Main /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Content>
      <Footer className='pm-footer'></Footer>
    </Container>
  )
}

export default App;
