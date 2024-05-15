import React, {useState} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

const SearchForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        searchWithAPI();
    };

    const searchWithAPI = () => {
        const token = localStorage.getItem("token");
        const apiUrl = `http://localhost:8080/api/products/search?search=${searchQuery}`;
        axios
            .get(apiUrl, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            .then((response) => {
                const data = response.data;
                setSearchResults(data);
            })
            .catch((error) => {
                alert("Error fetching data from API:" + error.messages);
            });
    };


    return (
        <div className={"form-search"}>
            <div className="d-flex justify-content-between align-items-center">
                <form className="d-flex" onSubmit={handleSubmit}>
                    <Link className={'btn btn-primary'} to={'/list'}>
                        <i className={"fa-solid fa-house"}></i> Back
                    </Link>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Input Inch Tivi"
                        title="Search Here"
                        aria-label="Search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{width: '150px'}}
                    />
                    <button className={"btn btn-success"} type="submit">
                        Search
                    </button>
                </form>
                <h6 className={`h1 text-center flex-grow-1 mr-8`} style={{marginRight: "300px"}}>List Search Tivi</h6>
            </div>
            <hr/>
            <table className={`table table-hover`} style={{margin: "auto", width: 500}}>
                <thead className={`tbody`}>
                <tr>
                    <th>Id</th>
                    <th>ProductName</th>
                    <th>Price</th>
                    <th>Image</th>
                    <th>Category</th>
                </tr>
                </thead>
                <tbody style={{textAlign: "center"}}>
                {searchResults.map((item) => (
                    <tr>
                        <td>{item.productId}</td>
                        <td>{item.productName}</td>
                        <td>{item.price}</td>
                        <td><img src={item.imageUrl} alt={item.productName} style={{maxWidth: '50px'}}/></td>
                        <td>{item.category.categoryName}</td>
                        <td><Link className={'btn btn-info'} to={`/viewProduct/${item.productId}`}>
                            <i className={"fa-solid fa-eye"}></i>
                        </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    );
};

export default SearchForm;