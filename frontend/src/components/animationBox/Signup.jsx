import React, { useContext } from "react";
import { useState } from "react";
import { useSignup } from "../../hooks/useSignup";
import {
  BoldLink,
  Container,
  FormContainer,
  Input,
  MutedLink,
  DisplayError,
  SubmitButton,
} from "./Collective";
import { Marginer } from "../marginer/marginMaker";
import { AnimationContext } from "./animationContext";
import "../../index.css";

export function SignupForm(props) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errpass, setErrpass] = useState(Error());
  const { signup, isLoading, error } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (confirmPassword !== password) {
        throw Error("Passwords don't match each other");
      }
    } catch (e) {
      setErrpass(e);
      console.error(e);
      throw Error("Passwords don't match each other");
    }
    await signup(firstname, lastname, username, email, password);
  };
  const { switchToLogin } = useContext(AnimationContext);

  return (
    <Container onSubmit={handleSubmit}>
      <FormContainer>
        <Input
          type="text"
          onChange={(e) => setFirstname(e.target.value)}
          value={firstname}
          placeholder="First Name"
        />
        <Input
          type="text"
          onChange={(e) => setLastname(e.target.value)}
          value={lastname}
          placeholder="Last Name"
        />
        <Input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          placeholder="Username"
        />
        <Input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Email"
        />
        <Input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Password"
        />
        <Input
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          placeholder="Confirm Password"
        />
      </FormContainer>
      <Marginer direction="vertical" margin={10} />
      <SubmitButton type="submit" disabled={isLoading}>
        Signup
      </SubmitButton>
      <Marginer direction="vertical" margin="1em" />
      <MutedLink href="#">
        Already have an account?
        <BoldLink href="#" onClick={switchToLogin}>
          Login
        </BoldLink>
      </MutedLink>
      {error && <DisplayError>{error}</DisplayError>}
      <DisplayError>{errpass.message}</DisplayError>
    </Container>
  );
}