import {ErrorMessage, Field, Form, Formik} from "formik";
import {Link, useNavigate} from "react-router-dom";
import * as Yup from 'yup'
import storage from "../Config/firebaseConfig";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import React, {useEffect, useState} from "react";
import Swal from "sweetalert2";

function FormProduct(props) {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    const validation = Yup.object().shape({
        productName: Yup.string().min(3, "Too short")
            .max(30, "Too long")
            .matches(/[a-zA-Z]+/, "Invalid name!")
            .required("Required!"),
        price: Yup.number().min(0, "Too less")
            .max(1000000, "Too great")
            .required("Required!"),
        categoryId: Yup.number().required("Required!"),
    })


    useEffect(() => {
        const token = localStorage.getItem("token");
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };
        fetch("http://localhost:8080/api/categories", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setCategories(data);
            })
            .catch((error) => {
                console.error('Error sorting by price ascending:', error);
            });
    }, []);

    return (
        <>
            <Formik
                initialValues={{
                    productName: '',
                    price: 0,
                    categoryId: null,
                    imgUrl: '',
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
                                <Field name={'categoryId'} as="select" className={'form-control'} id={'categoryId'}>
                                    <option value={null}>-------</option>
                                    {categories.map(category => (
                                        <option key={category.categoryId}
                                                value={category.categoryId}>{category.categoryName}</option>
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

    function save(values) {
        const token = localStorage.getItem("token")
        let imageUrl = localStorage.getItem("url")
        if (imageUrl !== null && imageUrl !== undefined) {
            values.imageUrl = imageUrl
        } else {
            values.imageUrl = "https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg";
        }
        Swal.fire({
            position: 'top-end',
            title: 'Do you want to Create this student?',
            showDenyButton: true,
            confirmButtonText: 'Create',
            denyButtonText: 'Cancel',
        })
            .then((result) => {
                if (result.isConfirmed) {
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append("Authorization", `Bearer ${token}`);
                    const raw = JSON.stringify(values);
                    const requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        body: raw,
                        redirect: "follow"
                    }
                    fetch("http://localhost:8080/api/products", requestOptions)
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.text();
                        })
                        .then((result) => {
                            console.log(result);
                            Swal.fire({
                                width: '450px',
                                position: 'top-end',
                                title: 'Create!',
                                icon: 'success'
                            })
                            navigate('/list');
                            localStorage.removeItem("url");
                        })
                        .catch((error) => {
                            console.error('Error saving product:', error);
                            Swal.fire({
                                width: '450px',
                                position: 'top-end',
                                title: 'Error!',
                                text: 'Failed You do not have the right to create.',
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

            });
    }


function uploadFile(e) {
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
}
}
export default FormProduct;