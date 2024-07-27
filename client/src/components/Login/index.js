import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import axios from 'axios';
import { Navigate,useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from "react-toastify";
import Cookies from 'js-cookie'

const LoginPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #d9edff;
`;

const LoginBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row-reverse;
  max-width: 1000px;
  background-color: white;
  box-shadow: 0 0 40px rgba(0,0,0,0.16);
  overflow: hidden;
  margin: 0 auto;
  border-radius: 12px;

  @media screen and (max-width: 1023px) {
    flex-direction: column;
    box-shadow: none;
  }
`;

const IllustrationWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  max-width: 800px;
  min-height: 100%;
  background-color: #fffdf2;

  img {
    display: block;
    width: 100%;
  }

  @media screen and (max-width: 1023px) {
    max-width: 100%;
    min-height: auto;
  }
`;

const LoginFormStyled = styled(Form)`
  flex: 1 0 100%;
  max-width: 480px;
  width: 100%;
  padding: 60px;

  p {
    margin-bottom: 30px;

    &.form-title {
      color: #333333;
      font-family: 'Josefin Sans', sans-serif;
      font-size: 42px;
      font-weight: bold;
      line-height: 1;
      margin-bottom: 0;
    }
  }

  .ant-form-item-control-input-content {
    text-align: left;
  }

  .ant-input-affix-wrapper {
    padding: 12px 15px;
  }

  .ant-btn {
    height: 42px;
    letter-spacing: 1px;
    border-radius: 6px;
  }

  .login-form-button {
    width: 100%;
  }

  .ant-form-item {
    text-align: center;

    a {
      color: #1890ff;

      &:hover {
        color: #40a9ff;
      }
    }
  }
`;

const LoginForm = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://localhost:8000/login', {
        name: values.username,
        password: values.password,
      });
      console.log(response);
      if (response.status === 200) {
        if(response.data.token){          
            Cookies.set("jwt_token", response.data.token, { expires: 1, path: "/" });
            Cookies.set("user_id", response.data.id, { expires: 1, path: "/" });
          navigate('/');
        } else {
          toast.error(
            `${response.data.message}`,
            {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
            },
          );
        }
      }
    } catch (error) {
      console.error('Failed:', error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken !== undefined) {
    return <Navigate to="/" />;
  }

  return (
    <LoginPage>
      <LoginBox>
        <IllustrationWrapper>
          <img
            src="https://mixkit.imgix.net/art/preview/mixkit-left-handed-man-sitting-at-a-table-writing-in-a-notebook-27-original-large.png?q=80&auto=format%2Ccompress&h=700"
            alt="Login"
          />
        </IllustrationWrapper>
        <LoginFormStyled
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <p className="form-title">Welcome back</p>
          <p>Login to the Dashboard</p>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              LOGIN
            </Button>
          </Form.Item>
          <Form.Item>
            <span>Don't have an account? </span>
            <Link to="/register">Register now!</Link>
          </Form.Item>
        </LoginFormStyled>
      </LoginBox>
    </LoginPage>
  );
};

export default LoginForm;
