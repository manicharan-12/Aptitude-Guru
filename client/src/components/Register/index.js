import React from 'react';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import { Navigate,useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import Cookies from 'js-cookie'

const RegisterPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #d9edff;
`;

const RegisterBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row-reverse;
  max-width: 1000px;
  background-color: white;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.16);
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

const RegisterFormStyled = styled(Form)`
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

  .register-form-button {
    width: 100%;
  }
`;

const RegisterForm = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://localhost:8000/register', {
        name: values.username,
        password: values.password,
      });
      if (response.status === 201) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration failed:', error);
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
    <RegisterPage>
      <RegisterBox>
        <IllustrationWrapper>
          <img
            src="https://mixkit.imgix.net/art/preview/mixkit-left-handed-man-sitting-at-a-table-writing-in-a-notebook-27-original-large.png?q=80&auto=format%2Ccompress&h=700"
            alt="Register"
          />
        </IllustrationWrapper>
        <RegisterFormStyled
          name="register-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <p className="form-title">Get Started</p>
          <p>Create your account</p>
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

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="register-form-button">
              REGISTER
            </Button>
          </Form.Item>
          <Form.Item>
            <span>Already have an account? </span>
            <Link to="/login">Login now!</Link>
          </Form.Item>
        </RegisterFormStyled>
      </RegisterBox>
    </RegisterPage>
  );
};

export default RegisterForm;
