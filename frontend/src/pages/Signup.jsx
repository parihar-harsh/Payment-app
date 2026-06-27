import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getApiError } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { Alert } from "../components/Alert";
import { AuthShell } from "../components/AuthShell";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { InputBox } from "../components/InputBox";

const initialForm = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
};

export const Signup = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { establishSession } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/user/signup", form);
      establishSession(response.data.token, response.data.user);
      navigate("/dashboard", {
        replace: true,
        state: { notice: "Your account is ready." },
      });
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to create your account"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your wallet"
      description="Set up your account with a few details. Your session stays only in this browser tab."
      footer={<BottomWarning label="Already have an account?" buttonText="Sign in" to="/signin" />}
    >
      <form onSubmit={submit} className="space-y-5">
        {error && <Alert>{error}</Alert>}
        <div className="grid gap-5 sm:grid-cols-2">
          <InputBox
            id="firstName"
            label="First name"
            placeholder="Ada"
            autoComplete="given-name"
            value={form.firstName}
            onChange={update("firstName")}
            required
          />
          <InputBox
            id="lastName"
            label="Last name"
            placeholder="Lovelace"
            autoComplete="family-name"
            value={form.lastName}
            onChange={update("lastName")}
            required
          />
        </div>
        <InputBox
          id="email"
          label="Email address"
          placeholder="you@example.com"
          type="email"
          autoComplete="email"
          value={form.username}
          onChange={update("username")}
          required
        />
        <InputBox
          id="new-password"
          label="Password"
          placeholder="At least 8 characters"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={update("password")}
          error={form.password && form.password.length < 8 ? "Use at least 8 characters." : ""}
          required
        />
        <Button label="Create account" type="submit" loading={loading} className="w-full" />
      </form>
    </AuthShell>
  );
};
