import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Container, Row, Col, Card, Image} from 'react-bootstrap';
import {Typography, Avatar} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Swal from "sweetalert2";

const ProductRegister = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZ29jdHVuZyIsImlhdCI6MTcxNTMzMTczNCwiZXhwIjoxNzE1NDE4MTM0fQ.UKD6PBx6N_J8GGfVVXgDcwbyzcJSruZW4VUUQnTQMI4"
                },
                body: JSON.stringify(formData),
            };

            const response = await fetch("http://localhost:8080/api/auth/register", requestOptions);
            const data = await response.text();

            if (response.ok) {
                Swal.fire({
                    width: '450px',
                    position: 'center',
                    title: 'Register!',
                    icon: 'success',
                    timer: 1500
                }).then(() => {
                    window.location.href = `/logins`;
                });

            } else {
                Swal.fire({
                    width: '450px',
                    position: 'center',
                    title: 'Error!',
                    text: 'Failed registration failed. Please try again later.',
                    icon: 'error'
                })
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                width: '450px',
                position: 'top-end',
                title: 'Error!',
                text: 'Failed registration failed. Please try again laterg.',
                icon: 'error'
            })
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <>
            <Container className="border-0 shadow-lg">
                <Card>
                    <Row className="g-0">
                        <Col md="4">
                            <Image
                                src="data:image/jpeg;base64,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"
                                className="rounded-start w-100"
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
                                        Trang đăng ký
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>
                                    &nbsp;&nbsp;
                                    <div>
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            className="btn btn-primary"
                                        >
                                            Regiser
                                        </button>
                                    </div>
                                </form>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <Link href="#" variant="body2" style={{color: "#393f81"}}>
                                        Forgot password ?
                                    </Link>
                                    <p> &ensp;
                                        <Link to={"/logins"} style={{color: "#393f81"}}>
                                            Back to logging in
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

export default ProductRegister;