import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { useParams } from 'react-router-dom';


const PasswordReset = () => {
    const { token } = useParams();

    return (
        <div>PasswordReset</div>
    )

}

export default PasswordReset