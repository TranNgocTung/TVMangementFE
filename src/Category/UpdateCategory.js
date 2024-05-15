import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function UpdateCategory() {
    const { id } = useParams();
    const [name, setName] = useState("");
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
                setName(result.categoryName);
            })
            .catch((error) => {
                console.error(error)
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found");
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "categoryName": name
        });

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        try {
            const response = await fetch(`http://localhost:8080/api/categories/${id}`, requestOptions);
            if (!response.ok) {
                throw Error(`Failed to update category: ${response.statusText}`);
            }
            const result = await response.json();
            window.location.href = "/";
            console.log("Category updated successfully:", result);
        } catch (error) {
            console.error("Error updating category:", error.message);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 d-flex justify-content-center">
                    <div>
                        <h1>Update Category</h1>
                        <div className="mb-3" style={{ textAlign: 'center', marginRight: '100px' }}>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="CategoryName"
                                required
                            />
                        </div>
                        <div className="mb-3 d-flex justify-content-center" style={{ marginRight: '100px' }}>
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

export default UpdateCategory;