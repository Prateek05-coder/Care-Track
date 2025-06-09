import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import "./AccountSettings.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function AccountSettings({ user: propUser, hideTitle}) {
  const [user, setUser] = useState(propUser || auth.currentUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleGoogle = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email. Please sign up first.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/too-many-requests":
          setError("Too many failed attempts. Please try again later.");
          break;
        default:
          setError("Sign in failed. Please check your credentials.");
      }
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already registered. Please sign in.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;
        default:
          setError("Sign up failed. Please check your details.");
      }
    }
  };

  const handleSignOut = async () => {
    setError("");
    try {
      await signOut(auth);
    } catch (err) {
      setError("Sign out failed. Please try again.");
    }
  };

  return (
    <div className="account-section">
        <div className="account-container">
        {!user && !hideTitle && (
          <h2 className="account-title">Sign In to Care Track</h2>
        )}
        {error && <div className="account-error">{error}</div>}
        {user ? (
          <div className="account-user-info">
            <div className="account-avatar">
              {user.photoURL ? (
                <img src={user.photoURL} alt="avatar" />
              ) : (
                <span>{user.email?.[0]?.toUpperCase() || "U"}</span>
              )}
            </div>
            <p className="account-user-email">
              {user.email || user.displayName}
            </p>
            <button className="account-btn signout-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        ) : (
          <div className="account-signin-options">
            <button className="account-btn google-btn" onClick={handleGoogle}>
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="account-btn-icon"
              />
              Sign in with Google
            </button>
            <button
              className="account-btn email-btn"
              onClick={() => {
                setShowEmail(!showEmail);
                setIsSignUp(false);
                setError("");
              }}
            >
              <img
                src="https://img.icons8.com/ios-filled/50/000000/new-post.png"
                alt="Email"
                className="account-btn-icon"
              />
              Sign in with Email
            </button>

            {/* Email Form */}
            {showEmail && (
              <form
                className="account-form"
                onSubmit={isSignUp ? handleEmailSignUp : handleEmailSignIn}
              >
                <div className="input-group">
                  <label htmlFor="email" className="input-label">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="input-field"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group" style={{ position: "relative" }}>
                  <label htmlFor="password" className="input-label">
                    Password
                  </label>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="input-field"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="show-password-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                <button className="account-btn submit-btn" type="submit">
                  {isSignUp ? "Sign up" : "Sign in"}
                </button>
                <div className="account-form-switch">
                  {isSignUp ? (
                    <span>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setIsSignUp(false)}
                        className="account-link"
                      >
                        Sign in
                      </button>
                    </span>
                  ) : (
                    <span>
                      New here?{" "}
                      <button
                        type="button"
                        onClick={() => setIsSignUp(true)}
                        className="account-link"
                      >
                        Sign up
                      </button>
                    </span>
                  )}
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountSettings;