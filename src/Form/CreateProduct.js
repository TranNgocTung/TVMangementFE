import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Product} from "../Model/Product";
import FormProduct from "./FormProduct";


function Create() {
    const [product] = useState(new Product())
    const navigate = useNavigate()

    return (
        <>
            <FormProduct student={product} naviage={navigate}/>
        </>
    )
}
export default Create;
