import UserIcon from "@rsuite/icons/legacy/User";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  ButtonToolbar,
  FlexboxGrid,
  Form,
  Panel,
} from "rsuite";
import { useSetRecoilState } from "recoil";
import { authStateAtom } from '../recoil/atoms';
import api from '../api';

export default function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const setAuthState = useSetRecoilState(authStateAtom);

  useEffect(() => {
    api.get('/user').then((res) => {
      setAuthState({
        email: res.data.email,
        username: `${res.data.firstname} ${res.data.lastname}`,
        authenticated: true
      })
      navigate('/');
    });
  }, [navigate, setAuthState]);

  const handleLogin = () => {
    const currentCredentials = { email: username, password: password };

    api.post('/user/login', currentCredentials)
      .then(() => {
        api.get('/user')
          .then((res) => {
            setAuthState({
              email: res.data.email,
              username: `${res.data.firstname} ${res.data.lastname}`,
              authenticated: true
            })
            navigate('/');
          })
      })
      .catch((err) => { alert(err.response.data) })

  }

  return (
    <FlexboxGrid justify="center" className="auth-form">
      <FlexboxGrid.Item colspan={12}>
        <Panel shaded>
          <Form onSubmit={handleLogin} className="auth-form-content" fluid>
            <Avatar size="lg" circle>
              <UserIcon />
            </Avatar>
            <Form.Group
              controlId="username"
              className="auth-form-input"
              onChange={(e) => setUsername(e.target.value)}
            >
              <Form.ControlLabel>Username</Form.ControlLabel>
              <Form.Control name="username" type="email" required />
            </Form.Group>
            <Form.Group
              controlId="password"
              className="auth-form-input"
              onChange={(e) => setPassword(e.target.value)}
            >
              <Form.ControlLabel>Password</Form.ControlLabel>
              <Form.Control
                name="password"
                type="password"
                autoComplete="off"
                required
              />
            </Form.Group>
            <Form.Group>
              <ButtonToolbar>
                <Button
                  appearance="primary"
                  type="submit"
                >
                  Login
                </Button>
              </ButtonToolbar>
            </Form.Group>
          </Form>
        </Panel>
        <Panel shaded>
          Don't have an account? Sign up <Link to="/signup"> here </Link>
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  )
}