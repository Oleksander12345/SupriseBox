import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth-slice";

function Registration() {
    const dispatch = useDispatch()
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload.role;
    const navigate = useNavigate();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password})
            })
            const data = await response.json();
            if (password !== confirmPassword) {
                alert("Passwords do not match");
                return;
            }
            if(response.ok) {
                const userData = {
                    name: data.user.name,
                    email: data.user.email,
                    role: data.user.role,
                    token: data.user.token
                };
                dispatch(authActions.register(userData))
                navigate('/login');
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('')               
            }
            if(!response.ok) {
                throw new Error('user already exist')                
            }
        } catch(error) {
            console.error(error)
        }
    }

    return (
        <div className="registration-container">
            <div className="login-panel">
                <h2>
                    Create your Account
                </h2>

                <div className="login-social-login">
                    <button className="login-social-button"><FaGoogle style={{position: "relative", bottom: "1px"}} className="social-button-icons" size={20}/> <span>Google</span></button>
                    <button className="login-social-button"><FaApple style={{position: "relative", bottom: "2px"}} className="social-button-icons"  size={25}/> <span>Apple</span></button>
                </div>

                <p className="login-or">or</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)}/>
                    <input type="email" placeholder="Email" required  value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <input type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                    <button type="submit" className="login-submit-btn">Create an Acount</button>
                </form>

                <p className="login-signup-text">
                    Do you have an account? <button onClick={() => navigate("/login")}>Sign in</button>
                </p>
            </div>


            <div className="login-info-panel">
                <div style={{position: "relative", bottom: "30px"}}>
                    <div className="login-blur"></div>
                    <img src="/boxes/gift-box-icon1.png" alt="Gift Box" className="registration-gift-img" />
                    <h2>Surprise Someone Special</h2>
                    <p>Discover magical boxes and curated subscriptions just for you.</p>
                </div>
                
            </div>
        </div>
    );
}

export default Registration;