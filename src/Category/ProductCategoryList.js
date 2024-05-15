import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function ProductCategoryList() {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
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

        fetch("http://localhost:8080/api/categories", requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw Error(response.statusText);
            })
            .then((result) => {
                console.log(result);
                setCategories(result);
            })
            .catch((error) => {
                console.error(error);
            })
    };

    const handleDelete = (id) => {
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                width: '450px',
                position: 'top-end',
                title: 'Error!',
                text: 'Token not found. Please login again.',
                icon: 'error'
            });
            return;
        }
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        Swal.fire({
            position: 'top-end',
            title: 'Do you want to delete this category?',
            showDenyButton: true,
            confirmButtonText: 'Delete',
            denyButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                const requestOptions = {
                    method: "DELETE",
                    headers: myHeaders,
                    redirect: "follow"
                };

                fetch(`http://localhost:8080/api/categories/${id}`, requestOptions)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.text();
                    })
                    .then(() => {
                        setCategories(prevCategories => prevCategories.filter(category => category.categoryId !== id));
                        Swal.fire({
                            width: '450px',
                            position: 'top-end',
                            title: 'Deleted!',
                            icon: 'success'
                        });
                    })
                    .catch(error => {
                        console.error(error);
                        Swal.fire({
                            width: '450px',
                            position: 'top-end',
                            title: 'Error!',
                            text: 'Failed to delete the category.',
                            icon: 'error'
                        });
                    });
            } else if (result.isDenied) {
                Swal.fire({
                    width: '450px',
                    position: 'top-end',
                    title: 'Canceled!',
                    icon: 'info'
                });
            }
        });
    };
    
    return (
        <>
            <table className={'table table-hover'}>
                <tbody>
                <tr>
                    <th>ID</th>
                    <th>CategoryName</th>
                    <th>Select</th>

                </tr>
                {categories.map((item, index) => {
                    return (
                        <>
                            <tr style={{position: 'relative'}}>
                                <td>{++index}</td>
                                <td>{item.categoryName}</td>
                                <td style={{position: 'absolute', right: '0'}}>
                                    <div style={{display: 'flex', marginRight: '300px'}}>
                                        <Link className={'btn btn-warning me-2'}
                                              to={`/update/${item.categoryId}`}>
                                            <i className={"fa-solid fa-pen-to-square"}></i>
                                        </Link>
                                        <button onClick={() => handleDelete(item.categoryId)}
                                                className={'btn btn-danger me-2'}>
                                            <i className={"fa-solid fa-trash-can"}></i>
                                        </button>

                                        <Link className={'btn btn-info'}
                                              to={`/view/${item.categoryId}`}>
                                            <i className={"fa-solid fa-eye"}></i>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        </>
                    )
                })}
                </tbody>
            </table>
            <Link className={'btn btn-primary'} to={'/list'}>
                <i className={"fa-solid fa-house"}></i> Product
            </Link>
            &nbsp;&nbsp;&nbsp;
            <Link className={'btn btn-primary'} to={'/create'}>
                <i className={"fa-solid fa-circle-plus"}></i>
            </Link>

        </>
    );
}

export default ProductCategoryList;