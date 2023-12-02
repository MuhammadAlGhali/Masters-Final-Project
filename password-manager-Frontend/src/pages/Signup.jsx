import UserIcon from "@rsuite/icons/legacy/User";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Avatar,
    Button,
    ButtonToolbar,
    FlexboxGrid,
    Form,
    Panel,
} from "rsuite";
import api from '../api';

export default function Signup() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");

    const navigate = useNavigate();

    const handleSignUp = () => {
        api.post('/user/register', {
            email: username,
            password: password,
            firstname: firstName,
            lastname: lastName
        })
            .then(() => {
                navigate('/login');
            })
            .catch((err) => {
                alert(err.response.data);
            })
    }

    return (
        <FlexboxGrid justify="center" className="auth-form">
            <FlexboxGrid.Item colspan={12}>
                <Panel shaded>
                    <Form onSubmit={handleSignUp} className="auth-form-content" fluid>
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
                            controlId="firstname"
                            className="auth-form-input"
                            onChange={(e) => setfirstName(e.target.value)}
                        >
                            <Form.ControlLabel>First name</Form.ControlLabel>
                            <Form.Control name="firstname" required />
                        </Form.Group>
                        <Form.Group
                            controlId="lastname"
                            className="auth-form-input"
                            onChange={(e) => setlastName(e.target.value)}
                        >
                            <Form.ControlLabel>Last Name</Form.ControlLabel>
                            <Form.Control name="lastname" required />
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
                                    Sign Up
                                </Button>
                            </ButtonToolbar>
                        </Form.Group>
                    </Form>
                </Panel>
                <Panel shaded>
                    Already have an account? Log in <Link to="/login"> here </Link>
                </Panel>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    );
}