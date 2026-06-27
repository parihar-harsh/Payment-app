import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api, { getApiError } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { Alert } from "../components/Alert";
import { AuthShell } from "../components/AuthShell";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { InputBox } from "../components/InputBox";

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { establishSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/user/signin", { username, password });
      establishSession(response.data.token, response.data.user);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to sign in"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to Payflow"
      description="Use your email and password to access your wallet."
      footer={<BottomWarning label="New to Payflow?" buttonText="Create an account" to="/signup" />}
    >
      <form onSubmit={submit} className="space-y-5">
        {error && <Alert>{error}</Alert>}
        <InputBox
          id="email"
          label="Email address"
          placeholder="you@example.com"
          type="email"
          autoComplete="email"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <InputBox
          id="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Button label="Sign in" type="submit" loading={loading} className="w-full" />
      </form>
    </AuthShell>
  );
};
