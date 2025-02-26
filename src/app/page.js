"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { loginSuccess } from "../reduxToolkit/slice";
import styled from "styled-components";

const Style = styled.div`
  .login-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background: #f9f9f9;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  h1 {
    text-align: center;
    margin-bottom: 20px;
    color: blue;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  label {
    font-size: 1rem;
    font-weight: 600;
    color: black;
  }

  input {
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  button {
    padding: 10px;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background: linear-gradient(
      to right,
      #8fdcfa 0%,
      #619ff0 50%,
      #6c9feb 50%,
      #3339e9 100%
    );
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
  }

  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  p {
    color: red;
    text-align: center;
  }

  .back-button {
    margin-top: 20px;
    background: #ccc;
    color: black;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
  }
`;

const Home = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration error by checking if component is mounted
  useEffect(() => {
    setIsClient(true);
  }, []);

  const loginemail = useSelector((state) => state.user.user?.email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore "users" collection
      await setDoc(
        doc(db, "users", user.uid),
        { uid: user.uid, email: user.email, lastLogin: new Date().toISOString() },
        { merge: true }
      );

      // Dispatch to Redux Store
      dispatch(loginSuccess({ uid: user.uid, email: user.email }));
      
      alert(`Welcome, ${user.email}`);

      // ✅ Redirect to ../dashboard after login
      router.push("../dashboard");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  if (!isClient) {
    return null; // Prevent server-side rendering mismatch
  }

  return (
    <Style>
      <div className="login-container">
        <h1>Login</h1>
        {loginemail ? (
          <button className="back-button" onClick={() => router.push("../dashboard")}>
            Logged in as: {loginemail}
          </button>
        ) : (
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        )}
        {error && <p>{error}</p>}

        
      </div>
    </Style>
  );
};

export default Home;
