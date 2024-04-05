import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { login } from '../auth'; // Import the login function
import { useNavigate } from 'react-router-dom';
import "./LogInPage.css"; // Import CSS file for styling

const LoginPage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const loginUser = async (data) => {
    console.log(data);
    try {
      const response = await login(data);
      console.log(response.access_token);
      // Redirect to homepage using navigate
      navigate('/cuisine-selection');
    } catch (error) {
      console.error('Login failed', error);
      alert('Invalid username or password');
    } finally {
      reset(); // Reset the form after submission
    }
  };

  return (
    <div className="log-in-page"> 
      <b className="mastercook1">MasterCook</b>
      <section className="log-in-page-inner">
        <div className="frame-group">
          <div className="welcome-to-mastercook-container">
            <h3 className="welcome-to-mastercook1">Welcome to MasterCook</h3>
          </div>
          <form className="frame-container" onSubmit={handleSubmit(loginUser)}> 
            <div className="form-fields-container-wrapper">
              <div className="form-fields-container">
                <div className="username1">Username</div>
                <div className="textfield4">
                  <input
                    className="text3"
                    placeholder="Enter your username"
                    type="text"
                    {...register('username', { required: true, maxLength: 25 })} 
                  />
                </div>
                {errors.username && <p className='error-message'>Username is required</p>}
                {errors.username?.type === "maxLength" && <p className='error-message'>Username should be 25 characters</p>}
                <div className="password1">Password</div>
                <div className="textfield5">
                  <input
                    className="text4"
                    placeholder="Enter your password" 
                    type="password" 
                    {...register('password', { required: true, minLength: 8 })} 
                  />
                </div>
                {errors.password && <p className='error-message'>Password is required</p>}
                {errors.password?.type === "minLength" && <p className='error-message'>Password should be more than 8 characters</p>}
              </div>
            </div>
            <div className="primary-group">
              <Button type="submit" className="primary1"> 
                <div className="title1">Login</div>
              </Button>
              <div className="new-to-foodie-wrapper">
                <div className="new-to-foodie1"><Link to='/'>New to MasterCook?</Link></div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;