import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Container, Row, Col, Card, Image} from 'react-bootstrap';
import {Typography, Avatar} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Swal from "sweetalert2";
const ProductLogins = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        isLogin: localStorage.getItem("token") != null
    });
    const navigate = useNavigate();

    const setParam = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }
    const login = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "username": formData.username,
            "password": formData.password
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("http://localhost:8080/api/auth/login", requestOptions)
            .then((response) => {
                console.log(response);
                if (response.ok) {
                    return response.json();
                }

                throw Error(response.statusText);
            })
            .then((result) => {
                Swal.fire({
                    width: '450px',
                    position: 'center',
                    title: 'Login!',
                    icon: 'success',
                    timer: 1500
                })
                    .then(() => {
                    localStorage.setItem("token", result.token);
                    setFormData({...formData, isLogin: true});
                    window.location.href = `/list`;
                });
            })
            .catch((error) => {
                console.error(error);
                Swal.fire({
                    width: '450px',
                    position: 'center',
                    title: 'Error!',
                    text: 'Failed username or password is wrong.',
                    icon: 'error'
                })
            });
    }

    return (
        <>
            <Container className="border-0 shadow-lg">
                <Card>
                    <Row className="g-0">
                        <Col md="4">
                            <Image
                                src="data:image/jpeg;base64,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"
                                alt="login form"
                                className="rounded-start w-100 tivi-animation"
                            />
                        </Col>
                        <Col md="8" className={'pt-4'}>
                            <Card.Body className="d-flex flex-column">
                                <div className="d-flex flex-row mt-2">
                                    <img
                                        src="data:image/jpeg;base64,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"
                                        alt="Your Image"
                                        className="me-3"
                                        style={{width: '4rem', height: '4rem'}}
                                    />
                                    <span className="h1 fw-bold mb-0">Tivi</span>
                                </div>
                                <div
                                    style={{
                                        marginTop: 8,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Avatar sx={{m: 1, bgcolor: 'rgb(225, 0, 80)'}}>
                                        <LockOutlinedIcon/>
                                    </Avatar>
                                    <Typography component="h1" variant="h5">
                                        Trang đăng nhập
                                    </Typography>
                                </div>

                                <form className="my-form">
                                    <div className="form-group">
                                        <label htmlFor="username">UserName</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={setParam}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">PassWord</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={setParam}
                                            className="form-control"
                                        />
                                    </div>
                                    &nbsp;&nbsp;
                                    <div>
                                        <button
                                            type="button"
                                            onClick={login}
                                            className="btn btn-primary"
                                        >
                                            Login
                                        </button>
                                    </div>
                                </form>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <Link href="#" variant="body2" style={{color: "#393f81"}}>
                                        Forgot password ?
                                    </Link>
                                    <p>Do not have an account ? &ensp;
                                        <Link to={"/register"} style={{color: "#393f81"}}>
                                            Register here
                                        </Link>
                                    </p>
                                </div>
                            </Card.Body>
                        </Col>
                    </Row>
                </Card>
            </Container>
        </>
    );
};

export default ProductLogins;