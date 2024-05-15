import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Swal from "sweetalert2";

function ListProduct() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState({});
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const requestAPI = (url, method = "GET", body = null, headers = {}) => {
        const token = localStorage.getItem("token");
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        const requestOptions = {
            method: method,
            headers: headers,
            redirect: "follow"
        };
        if (body) {
            requestOptions.body = JSON.stringify(body);
            headers["Content-Type"] = "application/json";
        }
        return fetch(url, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Request failed");
            })
            .catch((error) => {
                console.error("API request error:", error);
                throw error;
            });
    };

    useEffect(() => {
        nextPage(0);
    }, []);


    useEffect(() => {
        const initialDisplayedProducts = products.slice(0, 5);
        setDisplayedProducts(initialDisplayedProducts);
    }, [products]);

    const nextPage = (pageNumber) => {
        const url = `http://localhost:8080/api/products/pagination?page=${pageNumber}`;

        requestAPI(url)
            .then((res) => {
                setProducts(res.content);
                setPage(res);
                setTotalPage(res.totalPages);
                setCurrentPage(pageNumber);
            })
            .catch((error) => {
                console.error('Error fetching next page:', error);
            });
    };

    function previousPage(pageNumber) {
        const url = `http://localhost:8080/api/products/pagination?page=${pageNumber}`
        requestAPI(url)
            .then((res) => {
                setProducts(res.content);
                setPage(res);
                setTotalPage(res.totalPages);
                setCurrentPage(pageNumber);
            }).catch(error => {
            console.error('Error fetching previous page:', error);
        });
    }

    useEffect(() => {
        loadDataProfile();
    }, []);

    const loadDataProfile = () => {
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

        fetch("http://localhost:8080/api/products", requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw Error(response.statusText);
            })
            .then((result) => {
                console.log(result);
                setProducts(result);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }
    const logout = () => {
        localStorage.removeItem('token');
        alert("Logout successfully");
        window.location.href = `/logins`
    }

    const sortByPriceAscending = () => {
        const token = localStorage.getItem("token");
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };
        fetch("http://localhost:8080/api/products/ascending", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
            })
            .catch((error) => {
                console.error('Error sorting by price ascending:', error);
            });
    };

    const sortByPriceDescending = () => {
        const token = localStorage.getItem("token");
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };
        fetch("http://localhost:8080/api/products/descending", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
            })
            .catch((error) => {
                console.error('Error sorting by price ascending:', error);
            });
    };

    const handleDelete = (id) => {
        Swal.fire({
            position: 'top-end',
            title: 'Do you want to delete this student?',
            showDenyButton: true,
            confirmButtonText: 'Delete',
            denyButtonText: 'Cancel',
        })
            .then((result) => {
                if (result.isConfirmed) {
                    const token = localStorage.getItem("token");
                    const axiosConfig = {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    };
                    axios.delete(`http://localhost:8080/api/products/${id}`, axiosConfig)
                        .then(() => {
                            setProducts(prevProducts => prevProducts.filter(product => product.productId !== id));
                            Swal.fire({
                                width: '450px',
                                position: 'top-end',
                                title: 'Deleted!',
                                icon: 'success'
                            })
                        })
                        .catch(error => {
                            console.error(error);
                            Swal.fire({
                                width: '450px',
                                position: 'top-end',
                                title: 'Error!',
                                text: 'Failed to delete the prodcut.',
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
            })
    }
    return (
        <>
            <div style={{overflowX: 'auto'}}>
                <table className={'table table-hover'}>
                    <tbody>
                    <tr>
                        <th>ID</th>
                        <th>ProductName</th>
                        <th>Price</th>
                        <th>Image</th>
                        <th>Category</th>
                        <th>Select</th>

                    </tr>
                    {displayedProducts.map((item, index) => {
                        const itemNumber = index + 1 + currentPage * 5
                        return (
                            <>
                                <tr style={{position: 'relative'}} key={item.productId}>
                                    <td>{itemNumber}</td>
                                    <td>{item.productName}</td>
                                    <td>{item.price}</td>
                                    <td>
                                        {item.imageUrl && (
                                            <img src={item.imageUrl} alt={item.productName} style={{maxWidth: '50px'}}/>
                                        )}
                                    </td>
                                    {item.category && (
                                        <td>{item.category.categoryName}</td>
                                    )}
                                    <td style={{position: 'absolute', right: '0'}}>
                                        <div style={{display: 'flex', marginRight: '90px'}}>
                                            <Link className={'btn btn-warning me-2'}
                                                  to={`/updateProduct/${item.productId}`}>
                                                <i className={"fa-solid fa-pen-to-square"}></i>
                                            </Link>
                                            <button onClick={() => handleDelete(item.productId)}
                                                    className={'btn btn-danger me-2'}>
                                                <i className={"fa-solid fa-trash-can"}></i>
                                            </button>
                                            <Link className={'btn btn-info'} to={`/viewProduct/${item.productId}`}>
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
                <Link className={'btn btn-primary'} to={'/'}>
                    <i className={"fa-solid fa-house"}></i> Category
                </Link>
                &nbsp;&nbsp;
                <Link className={'btn btn-primary'} to={'/search'}>
                    <i className={"fas fa-search"}></i> Search ProductName
                </Link>
                &nbsp;&nbsp;
                <button onClick={sortByPriceAscending} className={'btn btn-primary'}>
                    <i className="fas fa-sort-amount-up"></i>Sort by Price Ascending
                </button>
                &nbsp;&nbsp;
                <button onClick={sortByPriceDescending} className={'btn btn-primary'}>
                    <i className="fas fa-sort-amount-down"></i>Sort by Price Descending
                </button>
                &nbsp;&nbsp; &nbsp;&nbsp;
                <Link className={'btn btn-primary'} to={'/createProduct'}>
                    <i className={"fa-solid fa-circle-plus"}></i>
                </Link>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button className="btn btn-primary" onClick={() => previousPage(page.number - 1)}
                        disabled={page.first}>Previous
                </button>
                <span>{currentPage + 1} | {totalPage}</span>
                <button className="btn btn-primary" onClick={() => nextPage(page.number + 1)}
                        disabled={page.last}>Next
                </button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button className={'btn btn-primary'} onClick={logout}>
                    <i className={"fa-solid fa-door-open"}></i> Logout
                </button>
            </div>


        </>
    )

}

export default ListProduct;