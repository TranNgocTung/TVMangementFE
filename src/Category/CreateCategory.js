import React, {useState} from "react";
import {Link} from "react-router-dom";

function CreateCategory() {
    const [name, setName] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);
            const raw = JSON.stringify({
                "categoryName": name
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };
            await fetch("http://localhost:8080/api/categories", requestOptions);
            window.location.href = "/";
        } catch (error) {
            setError(error.message);
        }
    };

    return (

        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 d-flex justify-content-center">
                    <div>
                            <h1>Create New Category</h1>
                        &nbsp;
                        <div className="mb-3" style={{ textAlign: 'center', marginRight:'100px' }}>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="CategoryName"
                                required
                            />
                        </div>
                        <div className="mb-3 d-flex justify-content-center" style={{marginRight: '100px'}}>
                            <button type="submit" className={'btn btn-primary me-2'}>
                                <i className="fa-solid fa-floppy-disk"></i> Save
                            </button>
                            <Link className={'btn btn-primary'} to={'/'}>
                                <i className={"fa-solid fa-house"}></i> Back
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default CreateCategory;