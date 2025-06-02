import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authActions } from "../store/auth-slice";

const formSchema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters").nonempty("Password is required"),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data) {
    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const resData = await response.json();

      if (!response.ok) {
        alert(resData.message || "Login failed");
        return;
      }

      const userData = {
        name: resData.user.name,
        email: resData.user.email,
        role: resData.user.role,
        token: resData.token,
      };

      localStorage.setItem("token", resData.token);
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("username", resData.user.name);
      localStorage.setItem("email", resData.user.email);

      dispatch(authActions.login(userData));
      navigate("/");
      reset();
    } catch (error) {
      console.error("❌ Network error:", error);
      alert("Network error. Please try again.");
    }
  }

  return (
    <div className="login-container">
      <div className="login-panel">
        <h2>
          Sign In to <span className="login-brand">SurpriseBox</span>
        </h2>

        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}

          <input
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && <p className="error">{errors.password.message}</p>}

          <button type="submit" className="login-submit-btn">Sign In</button>
        </form>

        <p className="login-signup-text">
          Don't have an account?{" "}
          <button onClick={() => navigate("/registration")}>Sign Up</button>
        </p>
      </div>

      <div className="login-info-panel">
        <div style={{ position: "relative", bottom: "30px" }}>
          <div className="login-blur"></div>
          <img
            src="/boxes/gift-box-icon.png"
            alt="Gift Box"
            className="login-gift-img"
          />
          <h2>Surprise Someone Special</h2>
          <p>Discover magical boxes and curated subscriptions just for you.</p>
        </div>
      </div>
    </div>
  );
}
