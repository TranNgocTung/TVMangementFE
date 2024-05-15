import React, { useState, useEffect } from "react";
import {Link, useParams} from "react-router-dom";

function ViewProduct() {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = () => {
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
    }
    return (
        <>
            <div className="mb-3 d-flex justify-content-center">
                {product ? (
            <div>
                <h1>Product Details</h1>
                <p>ID: {product.productId}</p>
                <p>Name: {product.productName}</p>
                <p>Price: {product.price}</p>
                <p> {product.category && (
                    <div>Category: {product.category.categoryName}</div>
                )}</p>
                <p>{product.imageUrl &&
                    <img src={product.imageUrl} alt={product.productName} style={{maxWidth: '50px'}}/>}</p>

                    <Link className={'btn btn-primary'} to={'/list'}>
                        <i className={"fa-solid fa-house"}></i> Back
                    </Link>
            </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </>
    );
}
export default ViewProduct;