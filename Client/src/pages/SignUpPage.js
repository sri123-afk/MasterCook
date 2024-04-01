import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { signup } from '../auth';
import { Link } from 'react-router-dom';
import './SignUpPage.css';

const SignUpPage = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [show, setShow] = useState(false);
    const [serverResponse, setServerResponse] = useState('');
    const navigate = useNavigate();

    const submitForm = (data) => {
        if (data.password === data.confirmPassword) {
            signup(data)
                .then(data => {
                    console.log(data);
                    setServerResponse(data.message);
                    setShow(true);
                    navigate('/log-in-page');
                })
                .catch(err => console.log(err));
            reset();
        } else {
            alert("Passwords do not match");
        }
    };

    return (
        <div className="sign-up-page">
            <b className="mastercook">MasterCook</b>
            <section className="sign-up-page-inner">
                <form className="frame-parent" onSubmit={handleSubmit(submitForm)}>
                    <div className="welcome-to-mastercook-wrapper">
                        <h3 className="welcome-to-mastercook">Welcome to MasterCook</h3>
                    </div>
                    <div className="email-field">
                        <div className="password-field">
                            <div className="username">Username</div>
                            <div className="textfield">
                                <input
                                    className="inputs"
                                    placeholder="Enter your username"
                                    type="text"
                                    {...register("username", { required: "Username is required", maxLength: { value: 25, message: "Username must be less than 25 characters" } })}
                                />
                                {errors.username && <p className="error-message">{errors.username.message}</p>}
                            </div>
                            <div className="email">Email</div>
                            <div className="textfield-wrapper">
                                <div className="textfield1">
                                    <input
                                        className="text"
                                        placeholder="Enter your Email"
                                        type="text"
                                        {...register("email", { 
                                            required: "Email is required", 
                                            maxLength: { value: 80, message: "Email must be less than 80 characters" },
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                    />
                                </div>
                            </div>
                            {errors.email && <p className="error-message">{errors.email.message}</p>}
                            <div className="password">Password</div>
                            <div className="textfield-container">
                                <div className="textfield2">
                                    <input
                                        className="text1"
                                        placeholder="Enter your Password"
                                        type="password"
                                        {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })}
                                    />
                                    {errors.password && <p className="error-message">{errors.password.message}</p>}
                                </div>
                            </div>
                            <div className="re-enter-password">Re-enter Password</div>
                            <div className="textfield3">
                                <input
                                    className="text2"
                                    placeholder="Re-enter your Password"
                                    type="password"
                                    {...register("confirmPassword", { required: "Confirm Password is required", minLength: { value: 8, message: "Confirm Password must be at least 8 characters" } })}
                                />
                                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="primary-parent">
                        <button className="primary" type="submit"><div className="title">Signup</div></button>
                        <div className="welcome-message">
                            <div className="new-to-foodie">
                                <Link to='/log-in-page' className="login-link">Already Registered?</Link>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default SignUpPage;
