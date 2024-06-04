import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuthContext } from "../hooks/useAuthContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const WelcomeMessage = styled.h1`
  color: #333;
`;

const UserInfo = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const UserDetail = styled.p`
  margin: 5px 0;
  color: #555;
`;

const HomePage = () => {
  const { user } = useAuthContext();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch("/api/user/me", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setUserData(data);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (!user) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <WelcomeMessage>
        Welcome, {userData ? userData.firstname : "User"}!
      </WelcomeMessage>
      {userData && (
        <UserInfo>
          <UserDetail>First Name: {userData.firstname}</UserDetail>
          <UserDetail>Last Name: {userData.lastname}</UserDetail>
          <UserDetail>Username: {userData.username}</UserDetail>
          <UserDetail>Email: {userData.email}</UserDetail>
        </UserInfo>
      )}
    </Container>
  );
};

export default HomePage;