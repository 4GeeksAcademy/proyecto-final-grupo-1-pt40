import React, { useState } from "react";


const SignIn = () => {

    const [formData, setFormData] = useState({
        userType: "client",
        email: "",
        password: "",
        username: "",
        department: "",
        city: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUserTypeChange = (type) => {
        setFormData({ ...formData, userType: type });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos enviados:", formData);
    };

    return (
        <div className="form container mt-4">
            <ul className="nav nav-tabs mb-3" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${formData.userType === "client" ? "active" : ""}`}
                        onClick={() => handleUserTypeChange("client")}
                        type="button"
                    >
                        Sign in as a client
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${formData.userType === "restaurant" ? "active" : ""}`}
                        onClick={() => handleUserTypeChange("restaurant")}
                        type="button"
                    >
                        Sign in as a restaurant
                    </button>
                </li>
            </ul>

            <div className="tab-content">
                <div className={`tab-pane fade ${formData.userType === "client" ? "show active" : ""}`}>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">City</label>
                            <input type="text" className="form-control" name="department" value={formData.department} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Department</label>
                            <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Sign In</button>
                    </form>
                </div>

                <div className={`tab-pane fade ${formData.userType === "restaurant" ? "show active" : ""}`}>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">City</label>
                            <input type="text" className="form-control" name="department" value={formData.department} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Department</label>
                            <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Sign In</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignIn;