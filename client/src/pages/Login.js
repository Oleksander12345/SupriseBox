import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { FaGoogle } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { authActions } from "../store/auth-slice";

function Login({ setIsLogged }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const token = localStorage.getItem("token");


    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const response = await fetch(`/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password})
            })
            const data = await response.json()
            console.log(data)
            if(response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userData", JSON.stringify({
                    name: data.user.name,
                    email: data.user.email,
                    role: data.user.role,
                    token: data.token
                  }));
                localStorage.setItem("username", data.user.name);
                localStorage.setItem("email", data.user.email);
                const userData = {
                    name: data.user.name,
                    email: data.user.email,
                    role: data.user.role,
                    token: token,
                };
                dispatch(authActions.login(userData))
                console.log("It's victory")
                navigate('/');
            }
            console.log(data)
        } catch(error) {
            console.error(error)
        }
    }

    return (
        <div className="login-container">
            <div className="login-panel">
                <h2>Sign In to <span className="login-brand">SurpriseBox</span></h2>

                <div className="login-social-login">
                    <button className="login-social-button"><FaGoogle style={{position: "relative", bottom: "1px"}} className="social-button-icons" size={20}/> <span>Google</span></button>
                    <button className="login-social-button"><FaApple style={{position: "relative", bottom: "2px"}} className="social-button-icons"  size={25}/> <span>Apple</span></button>
                </div>

                <p className="login-or">or</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <div className="login-forgot">Forgot Password?</div>
                    <button type="submit" className="login-submit-btn">Sign In</button>
                </form>

                <p className="login-signup-text">
                    Don't have an account? <button onClick={() => navigate("/registration")}>Sign Up</button>
                </p>
            </div>


            <div className="login-info-panel">
                <div style={{position: "relative", bottom: "30px"}}>
                    <div className="login-blur"></div>
                    <img src="/boxes/gift-box-icon.png" alt="Gift Box" className="login-gift-img" />
                    <h2>Surprise Someone Special</h2>
                    <p>Discover magical boxes and curated subscriptions just for you.</p>
                </div>
                
            </div>
        </div>
    );
}

export default Login;