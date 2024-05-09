import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 

function Signup() {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userLocation, setUserLocation] = useState('');

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    const navigate = useNavigate(); 

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (!emailRegex.test(value)) {
            setEmailError('Invalid email format'); 
        } else {
            setEmailError('');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (emailError) {
            setGeneralError('Please correct the errors before submitting.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/userLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_name: userName,
                    user_email: email,
                    password: password,
                    phone_number: phoneNumber,
                    user_location: userLocation,
                }),
            });

            if (response.ok) {
                navigate('/login'); 
            } else {
                const errorData = await response.json();
                setGeneralError('Signup failed. Please try again.');
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
        <div className='signup_container'>
            <div className='signup_inner'>
                <h1>Signup</h1>
                <form className='signup_form' onSubmit={handleSignup}>
                    <div className='signup_input_group'>
                        <label htmlFor='user_name'>Full Name</label>
                        <input
                            type='text'
                            id='user_name'
                            placeholder='Enter your full name'
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>

                    <div className='signup_input_group'>
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

                    <div className='signup_input_group'>
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

                    <div className='signup_input_group'>
                        <label htmlFor='phone_number'>Phone Number</label>
                        <input
                            type='text'
                            id='phone_number'
                            placeholder='Enter your phone number'
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>

                    <div className='signup_input_group'>
                        <label htmlFor='user_location'>Location</label>
                        <input
                            type='text'
                            id='user_location'
                            placeholder='Enter your location'
                            value={userLocation}
                            onChange={(e) => setUserLocation(e.target.value)}
                        />
                    </div>

                    {generalError && <p style={{ color: 'red' }}>{generalError}</p>} 

                    <button type='submit' className='signup_button'>Signup</button> 
                </form>

                <p>
                    Already have an account?{' '}
                    <Link to="/login">Sign In!</Link> 
                </p>
            </div>
        </div>
    );
}

export default Signup;
