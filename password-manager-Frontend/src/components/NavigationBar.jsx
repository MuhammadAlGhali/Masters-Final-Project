import { Navbar, Nav } from 'rsuite';
import {
    MdExitToApp,
    MdOutlineAccountCircle,
    MdEdit,
    MdDelete
} from "react-icons/md";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authStateAtom } from '../recoil/atoms';
import api from '../api';

const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default function NavigationBar() {

    const authState = useRecoilValue(authStateAtom);
    const setAuthState = useSetRecoilState(authStateAtom);

    const handleChangeEmail = () => {
        let new_email = prompt('Please enter the new email you would like to use:');
        if (new_email !== null) {
            if (new_email.match(emailPattern)) {
                api.put('/user', { email: new_email })
                    .then((res) => {
                        setAuthState({
                            ...authState,
                            email: new_email
                        })
                        alert(res.data);
                    })
                    .catch((err) => { console.log(err) });
            } else {
                alert('please enter a valid email address');
            }
        }
    }

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete the account?')) {
            api.delete("/user")
                .then(() => {
                    setAuthState({
                        email: null,
                        username: null,
                        authenticated: false
                    });
                })
                .catch((err) => console.log(err));
        }
    };

    const handleLogout = () => {
        api.post('/user/logout').then(() => {
            setAuthState({
                email: null,
                username: null,
                authenticated: false
            });
        });
    }

    return (
        <Navbar className='pm-navbar'>
            <Navbar.Brand>Password Manager</Navbar.Brand>
            <Nav pullRight>
                <Nav.Menu icon={<MdOutlineAccountCircle />} title={authState.username}>
                    <Nav.Item
                        eventKey="my_user"
                        icon={<MdExitToApp />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Nav.Item>
                    <Nav.Item icon={<MdEdit />} onClick={handleChangeEmail}>
                        Change Email
                    </Nav.Item>
                    <Nav.Item
                        icon={<MdDelete />}
                        style={{ color: "red" }}
                        onClick={handleDeleteAccount}
                    >
                        Delete Account
                    </Nav.Item>
                </Nav.Menu>
            </Nav>
        </Navbar>
    );
}