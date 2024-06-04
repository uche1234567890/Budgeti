import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Input = styled.input`
  margin: 10px;
  padding: 10px;
  font-size: 16px;
`;

const Button = styled.button`
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: var(--primary);
  color: white;
  border: none;
  cursor: pointer;
`;

const PasswordResetPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleResetPassword = async () => {
    const token = searchParams.get("token");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const response = await fetch("/api/user/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await response.json();

    if (response.ok) {
      navigate("/login");
    } else {
      setError(data.error);
    }
  };

  return (
    <Container>
      <h1>Reset Password</h1>
      <Input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button onClick={handleResetPassword}>Reset Password</Button>
      {error && <p>{error}</p>}
    </Container>
  );
};

export default PasswordResetPage;