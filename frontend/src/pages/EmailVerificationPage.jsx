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

const EmailVerificationPage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleVerifyEmail = async () => {
    const email = searchParams.get("email");
    const response = await fetch("/api/user/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
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
      <h1>Email Verification</h1>
      <Input
        type="text"
        placeholder="Verification Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button onClick={handleVerifyEmail}>Verify Email</Button>
      {error && <p>{error}</p>}
    </Container>
  );
};

export default EmailVerificationPage;