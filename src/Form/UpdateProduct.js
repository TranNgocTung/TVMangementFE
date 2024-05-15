import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import FormProductUpdate from "./FormProductUpdate";


export default function Update() {
    const [product, setProduct] = useState({})
    const {id} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`http://localhost:8080/api/products/${id}`)
            .then((res) => {
                setProduct(res.data)
            })
            .catch((error) => {
                console.error('Error fetching product details:', error);
            });
    }, [id])

    return (
        <>
            <FormProductUpdate product={product} navigate={navigate}/>
        </>
    )
}
