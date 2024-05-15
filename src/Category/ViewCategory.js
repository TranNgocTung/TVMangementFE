import React, {useState, useEffect} from "react";
import {Link, useParams} from "react-router-dom";

function ViewCategory() {
    const {id} = useParams();
    const [category, setCategory] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategory();
    }, []);

    const fetchCategory = async () => {
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

        fetch(`http://localhost:8080/api/categories/${id}`, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw Error(response.statusText);
            })
            .then((result) => {
                console.log(result);
                setCategory(result);
            })
            .catch((error) => {
                console.error(error);
            })
    };

    if (error) {
        return (
            <div>
                <h1>Error</h1>
                <p>{error}</p>
            </div>
        );
    }

    if (!category) {
        return <p>Loading...</p>;
    }

    return (
        <div className="mb-3 d-flex justify-content-center">
            <div>
                <h1>Product Details</h1>
                <p>ID: {category.categoryId}</p>
                <p>CategoryName: {category.categoryName}</p>
                <Link className={'btn btn-primary'} to={'/'}>
                    <i className={"fa-solid fa-house"}></i> Back
                </Link>
            </div>
        </div>

    );
}

export default ViewCategory;