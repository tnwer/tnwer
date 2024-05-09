import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (!emailRegex.test(value)) {
            setEmailError('Invalid email format');
        } else {
            setEmailError('');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (emailError) {
            setGeneralError('Please correct the errors before submitting.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/userRegister', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_email: email,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                login(data.token);
                navigate('/');
            } else {
                const errorData = await response.json();
                setGeneralError('Login failed. Please try again.');
                if (errorData.password) {
                    setPasswordError(errorData.password);
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setGeneralError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className='signin_container'>
            <div className='signin_inner'>
                <h1>Login</h1>
                <form className='signin_form' onSubmit={handleLogin}>
                    <div className='signin_input_group'>
                        <label htmlFor='email'>Email</label>
                        <input
                            type='email'
                            id='email'
                            placeholder='Enter your email'
                            value={email}
                            onChange={handleEmailChange}
                        />
                        {emailError && <p style={{ color: 'red' }}>{emailError}</p>} 
                    </div>

                    <div className='signin_input_group'> 
                        <label htmlFor='password'>Password</label>
                        <input
                            type='password'
                            id='password'
                            placeholder='Enter your password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>} 
                    </div>

                    <button type='submit' className='signin_button'>Login</button>
                </form>

                {generalError && <p style={{ color: 'red' }}>{generalError}</p>} 

                <a href='#' className='signin_forgot_password'>Forgot password?</a>
                <div className='signin_divider'>_________ New to Tnwar _________</div>
                <div className='signin_extra_buttons'>
                    <Link className='signin_create_account_button' to="/signup">Create New Tnwar Account</Link>
                    <Link className='signin_create_seller_button' to="/signup">Create New Seller Account</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
