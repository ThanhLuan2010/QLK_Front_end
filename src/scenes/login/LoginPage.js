import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import HandleLogin from "./handleLogin";
import { setLoggingIn } from "../../api/common";
import backgroundImage from "../../assets/bg-login.png";
import eyeOpen from "../../assets/eye.png";
import eyeClosed from "../../assets/eye-off.png";

const Background = styled.div`
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  min-height: 100vh;
`;

const LoginContainer = styled.div`
  background-color: #f8f9fa;
  padding: 49px;
  border-radius: 40px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 496px;
  text-align: center;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media (max-width: 496px) {
    width: 75%;
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-top: 18px;
  margin-bottom: 5px;
  margin-left: 15px;
  font-weight: regular;
  text-align: left;
  width: 100%;
  display: block;
  color: ${({ disabled }) => (disabled ? "#979797" : "#535353")};
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  padding: 10px;
  padding-left: 15px;
  padding-right: 40px;
  border: 2px solid ${({ isEmpty }) => (isEmpty ? "#979797" : "#535353  ")};
  border-radius: 40px;
  font-size: 16px;
  width: 100%;
`;

const EyeIcon = styled.img`
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
`;

const Button = styled.button`
  padding: 8px;
  background-color: ${({ disabled }) => (disabled ? "#E4E4E4" : "#121212")};
  color: #fff;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
  margin-top: 40px;
  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#E4E4E4" : "#2D2D2D")};
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleCheckboxChange = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      setLoggingIn(true);
      try {
        const LoginData = await HandleLogin(loginForm);
        console.log("Login Success", LoginData.success);
        if (LoginData.success) {
          navigate("/");
        }
      } catch (error) {
        console.error("Login Error", error);
        alert("LOGIN FAIL!!!");
      }
    },
    [loginForm, navigate]
  );

  const onChangeLogin = useCallback(
    (event) => {
      setLoginForm({ ...loginForm, [event.target.name]: event.target.value });
    },
    [loginForm]
  );

  return (
    <Background>
      <LoginContainer>
        <h2 style={{ fontWeight: "bold", marginBottom: "12px" }}>Login</h2>
        <LoginForm>
          <Label htmlFor="username" disabled={!loginForm.username}>
            Username
          </Label>
          <Input
            type="text"
            isEmpty={!loginForm.username}
            id="name"
            name="username"
            onChange={onChangeLogin}
            value={loginForm.username}
            required
          />
          <Label htmlFor="password" disabled={!loginForm.password}>
            Password
          </Label>
          <InputContainer>
            <Input
              type={showPassword ? "text" : "password"}
              id="pass"
              name="password"
              isEmpty={!loginForm.password}
              onChange={onChangeLogin}
              value={loginForm.password}
              required
            />
            <EyeIcon
              src={showPassword ? eyeClosed : eyeOpen}
              onClick={handleCheckboxChange}
              disabled={!loginForm.password}
              alt="Toggle Password Visibility"
            />
          </InputContainer>
          <Button
            onClick={handleLogin}
            disabled={!loginForm.username || !loginForm.password}
          >
            Login
          </Button>
        </LoginForm>
      </LoginContainer>
    </Background>
  );
};

export default Login;
