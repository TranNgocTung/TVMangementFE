import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from 'yup';
import storage from "../Config/firebaseConfig";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import Swal from "sweetalert2";

function FormProductUpdate() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [categories, setCategories] = useState([]);
    const [products, setProduct] = useState({});

    const validation = Yup.object().shape({
        productName: Yup.string().min(3, "Too short")
            .max(30, "Too long")
            .matches(/[a-zA-Z]+/, "Invalid name!")
            .required("Required!"),
        price: Yup.number().min(0, "Too less")
            .max(1000000, "Too great")
            .required("Required!"),
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("http://localhost:8080/api/categories", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            redirect: "follow"
        })
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then((result) => {
                console.log('Categories data:', result);
                setCategories(result);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };
        fetch(`http://localhost:8080/api/products/${id}`, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw Error(response.statusText);
            })
            .then((result) => {
                console.log(result);
                setProduct(result);
            })
            .catch((error) => {
                console.error(error)
            });
    }, [id]);

    const uploadFile = (e) => {
        if (e.target.files[0]) {
            const time = new Date().getTime()
            const storageRef = ref(storage, `image/${time}_${e.target.files[0].name}`);
            const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

            uploadTask.on("state_changed",
                (snapshot) => {
                    console.log(snapshot)
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        localStorage.setItem("url", downloadURL)
                    });
                }
            );
        }
    };

    const save = (values) => {

        const token = localStorage.getItem("token");
        let imageUrl = localStorage.getItem("url");
        if (imageUrl !== null) {
            values.imageUrl = imageUrl;
        } else {
            values.imageUrl = products.imageUrl || "https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg";
        }

        Swal.fire({
            position: 'top-end',
            title: 'Do you want to delete this student?',
            showDenyButton: true,
            confirmButtonText: 'Update',
            denyButtonText: 'Cancel',
        })
            .then((result) => {
                if (result.isConfirmed) {
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append("Authorization", `Bearer ${token}`);
                    const raw = JSON.stringify(values);
                    const requestOptions = {
                        method: "PUT",
                        headers: myHeaders,
                        body: raw,
                        redirect: "follow"
                    }

                    if (id) {
                            fetch(`http://localhost:8080/api/products/${id}`, requestOptions)
                                .then((response) => {
                                    if (!response.ok) {
                                        throw new Error('Network response was not ok');
                                    }
                                    return response.text();
                                })
                                .then((result) => {
                                    Swal.fire({
                                        width: '450px',
                                        position: 'top-end',
                                        title: 'Update!',
                                        icon: 'success'
                                    })
                                    navigate('/list');
                                    localStorage.removeItem("url");
                                })
                                .catch(error => {
                                console.error(error);
                                Swal.fire({
                                    width: '450px',
                                    position: 'top-end',
                                    title: 'Error!',
                                    text: 'Failed You do not have the right to edit.',
                                    icon: 'error'
                                })
                            });
                    } else if (result.isDenied) {
                        Swal.fire({
                            width: '450px',
                            position: 'top-end',
                            title: 'Canceled!',
                            icon: 'info'
                        })
                    }
                }
            })
    };

    return (
        <>
            <Formik
                initialValues={{
                    productName: products.productName || '',
                    price: products.price || 0,
                    categoryId: products.categoryId || '',
                    imgUrl: products.imageUrl || '',
                }}
                onSubmit={(values) => {
                    save(values)
                }}
                enableReinitialize={true}
                validationSchema={validation}
            >
                <Form>
                    <div className={'row'}>
                        <div className={'col-md-6'}>
                            <div className="mb-3">
                                <label htmlFor={'productName'} className={'form-label'}>ProductName</label>
                                <Field name={'productName'} type={'text'} className={'form-control'} id={'productName'}
                                       placeholder={'Enter name'}/>
                                <ErrorMessage name={'productName'} className={'error'} component={'span'}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor={'price'} className={'form-label'}>Price</label>
                                <Field name={'price'} type={'number'} className={'form-control'} id={'price'}
                                       placeholder={'Enter price'}/>
                                <ErrorMessage name={'price'} className={'error'} component={'span'}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor={'categoryId'} className={'form-label'}>Category</label>
                                <Field name={'categoryId'} as="select" className={'form-control'}>
                                    {categories.length > 0 && (
                                        <option value={products.categoryId}>
                                            {products.category && products.category.categoryName ? products.category.categoryName : 'Unknown Category'}
                                        </option>
                                    )}
                                    {categories.map(category => (
                                        <option key={category.categoryId} value={category.categoryId}>
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name={'categoryId'} className={'error'} component={'span'}/>
                            </div>
                        </div>
                        <div className={'col-md-6'}>
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label">Image</label>
                                <input type="file" className="form-control" id="image"
                                       onChange={(e) => uploadFile(e)}/>
                                <img src={products.imageUrl} alt={products.productName}
                                     style={{maxWidth: '50px', float: 'left'}}/>
                            </div>
                            <div className="mb-3 d-flex justify-content-center">
                                <button type="submit" className={'btn btn-primary me-2'}>
                                    <i className="fa-solid fa-floppy-disk"></i> Save
                                </button>
                                <Link className={'btn btn-primary'} to={'/list'}>
                                    <i className={"fa-solid fa-house"}></i> Back
                                </Link>
                            </div>
                        </div>
                    </div>
                </Form>
            </Formik>
        </>
    );
}

export default FormProductUpdate;