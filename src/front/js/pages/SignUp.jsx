import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const SignInForm = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    
    const [userType, setUserType] = useState("client"); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUserName] = useState("");
    const [department, setDepartment] = useState("");  
    const [city, setCity] = useState("");


    const handleSubmitRegister = async (e) => {
        e.preventDefault();
        if (userType && email && password && username && department && city) {
            const response = await actions.registerUser(userType, email, password, username, department, city);
            console.log(userType, email, password, username, department, city);
        }
    };

    return (
        <div className=" form container mt-4">
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button 
                        className={`nav-link ${userType === "client" ? "active" : ""}`}
                        onClick={() => setUserType("client")}
                    >
                        Sign in as a client
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${userType === "restaurant" ? "active" : ""}`}
                        onClick={() => setUserType("restaurant")}
                    >
                        Sign in as a restaurant
                    </button>
                </li>
            </ul>

            <div className="tab-content">
                <div className={`tab-pane fade ${userType === "client" ? "show active" : ""}`}>
                    <form onSubmit={handleSubmitRegister}>
                        <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input type="text" className="form-control" value={username} onChange={(e) => setUserName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">City</label>
                            <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Department</label>
                            <input type="text" className="form-control" value={department} onChange={(e) => setDepartment(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Sign In</button>
                    </form>
                </div>

                <div className={`tab-pane fade ${userType === "restaurant" ? "show active" : ""}`}>
                    <form onSubmit={handleSubmitRegister}>
                        <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input type="text" className="form-control" value={username} onChange={(e) => setUserName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">City</label>
                            <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Department</label>
                            <input type="text" className="form-control" value={department} onChange={(e) => setDepartment(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Sign In</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignInForm;