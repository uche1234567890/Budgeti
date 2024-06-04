import React, { useState } from "react";
import styled from "styled-components";
import { LoginForm } from "./Login";
import { motion } from "framer-motion";
import { AnimationContext } from "./animationContext";
import { SignupForm } from "./Signup";

//SignUp/Login container
const Container = styled.div`
  width: 280px;
  min-height: 550px;
  display: flex;
  flex-direction: column;
  border-radius: 19px;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(15, 15, 15, 0.28);
  position: relative;
  overflow: hidden;
`;

//Top part background that holds the welcome text
const StyleTop = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 1.8em;
  padding-bottom: 5em;
`;

//Animated Drop down design
const StyleDrop = styled(motion.div)`
  width: 160%;
  height: 550px;
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 50%;
  transform: rotate(60deg);
  top: -290px;
  left: -70px;
  background: rgb(188, 118, 244);
  background: linear-gradient(
    90deg,
    rgba(188, 118, 244, 1) 16%,
    rgba(113, 9, 184, 1) 100%
  );
`;

//Holds the Text
const TopContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

//The Bold Text
const TopText = styled.h2`
  font-size: 30px;
  font-weight: 600;
  line-height: 1.24;
  color: #fff;
  z-index: 10;
  margin: 0;
`;

//The small text
const SmallText = styled.h5`
  color: #fff;
  font-weight: 500;
  font-size: 11px;
  z-index: 10;
  margin: 0;
  margin-top: 7px;
`;

//Container that holds the form
const InnerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 1.8em;
`;

const styledropVariants = {
  dropdown: {
    width: "233%",
    height: "1050px",
    borderRadius: "20%",
    transform: "rotate(60deg)",
  },
  broughtup: {
    width: "160%",
    height: "550px",
    borderRadius: "50%",
    transform: "rotate(60deg)",
  },
};

const dropTransition = {
  type: "spring",
  duration: 2.3,
  stiffness: 30,
};

export function AnimationBox(props) {
  const [isExpanded, setExpanded] = useState(false);
  const [active, setActive] = useState("login");

  const playDropAnimation = () => {
    setExpanded(true);
    setTimeout(() => {
      setExpanded(false);
    }, dropTransition.duration * 1000 - 1500);
  };

  const switchToSignup = () => {
    playDropAnimation();
    setTimeout(() => {
      setActive("signup");
    }, 400);
  };

  const switchToLogin = () => {
    playDropAnimation();
    setTimeout(() => {
      setActive("login");
    }, 400);
  };

  const contextValue = { switchToSignup, switchToLogin };

  return (
    <AnimationContext.Provider value={contextValue}>
      <Container>
        <StyleTop>
          <StyleDrop
            initial={false}
            animate={isExpanded ? "dropdown" : "broughtup"}
            variants={styledropVariants}
            transition={dropTransition}
          />
          {active === "login" && (
            <TopContainer>
              <TopText>Welcome</TopText>
              <TopText>Back</TopText>
              <SmallText>Please Login to continue</SmallText>
            </TopContainer>
          )}
          {active === "signup" && (
            <TopContainer>
              <TopText>Create</TopText>
              <TopText>Account</TopText>
              <SmallText>Please Signup to continue</SmallText>
            </TopContainer>
          )}
        </StyleTop>
        <InnerContainer>
          {active === "login" && <LoginForm />}
          {active === "signup" && <SignupForm />}
        </InnerContainer>
      </Container>
    </AnimationContext.Provider>
  );
}