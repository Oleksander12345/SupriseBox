import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authActions } from "../store/auth-slice";

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function Registration() {
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

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        alert(resData.message || "Registration failed");
        return;
      }

      const userData = {
        name: resData.user.name,
        email: resData.user.email, 
        role: resData.user.role,
        token: resData.token,
      };

      dispatch(authActions.register(userData));
      navigate("/login");
      reset();
    } catch (error) {
      console.error("❌ Network error:", error);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="registration-container">
      <div className="login-panel">
        <h2>Create your Account</h2>

        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <input type="text" placeholder="Name" {...register("name")} />
          {errors.name && <p className="error">{errors.name.message}</p>}

          <input type="email" placeholder="Email" {...register("email")} />
          {errors.email && <p className="error">{errors.email.message}</p>}

          <input type="password" placeholder="Password" {...register("password")} />
          {errors.password && <p className="error">{errors.password.message}</p>}

          <input type="password" placeholder="Confirm Password" {...register("confirmPassword")} />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword.message}</p>
          )}

          <button type="submit" className="login-submit-btn">
            Create an Account
          </button>
        </form>

        <p className="login-signup-text">
          Do you have an account?{" "}
          <button onClick={() => navigate("/login")}>Sign in</button>
        </p>
      </div>

      <div className="login-info-panel">
        <div style={{ position: "relative", bottom: "30px" }}>
          <div className="login-blur"></div>
          <img
            src="/boxes/gift-box-icon1.png"
            alt="Gift Box"
            className="registration-gift-img"
          />
          <h2>Surprise Someone Special</h2>
          <p>Discover magical boxes and curated subscriptions just for you.</p>
        </div>
      </div>
    </div>
  );
}
