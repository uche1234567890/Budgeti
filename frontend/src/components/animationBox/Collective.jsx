import styled from "styled-components";

export const Container = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

//HTML form that handles submissions
export const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 2.5px rgba(15, 15, 15, 0.19);
`;

export const DisplayError = styled.div`
  font-size: 11px;
  border-color: rgb(231, 25, 90);
  border: 1px;
  color: rgb(231, 25, 90);
  text-decoration: none;
  margin: 0 4px;
`;

//Design for the muted links
export const MutedLink = styled.span`
  font-size: 11px;
  color: rgba(200, 200, 200, 0.8);
  font-weight: 500;
  text-decoration: none;
`;

//Design for the bold links
export const BoldLink = styled.span`
  font-size: 11px;
  color: rgb(113, 9, 184);
  font-weight: 500;
  text-decoration: none;
  margin: 0 4px;
`;

//Design for the form input field
export const Input = styled.input`
  width: 100%;
  height: 42px;
  outline: none;
  border: 1px solid rgba(200, 200, 200, 0.3);
  padding: 0px 10px;
  border-bottom: 1.4px solid transparent;
  transition: all 200ms ease-in-out;
  font-size: 12px;
  &::placeholder {
    color: rgba(200, 200, 200, 1);
  }
  &:not(:last-of-type) {
    border-bottom: 1.5px solid rgba(200, 200, 200, 0.4);
  }
  &:focus {
    outline: none;
    border-bottom: 2px solid rgb(188, 118, 244);
  }
`;

//Design for the submit button
export const SubmitButton = styled.button`
  width: 100%;
  padding: 11px 40%;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 100px 100px 100px 100px;
  cursor: pointer;
  transition: all, 240ms ease-in-out;
  background: rgb(188, 118, 244);
  background: linear-gradient(
    90deg,
    rgba(188, 118, 244, 1) 16%,
    rgba(113, 9, 184, 1) 100%
  );
  &:hover {
    filter: brightness(1.03);
  }
`;