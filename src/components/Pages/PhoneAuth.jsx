import React, { useState } from 'react';
import './PhoneAuthCss.css';
import WhatsappLogo from "../../images/whatsapp-logo.png"
import firebase from '../../firebase-Config'

class LoginPage extends React.Component {
    constructor() {
        super();
        this.state = {
            showPhoneText: true,
            showOtpText: false
        }
    }

    onChangeHandler = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value,
        });
    };

    setupRecaptcha = () => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                console.log('recapta resolved')
                this.onSignInSubmit();
            },
            defaultCountry: "IN",
        });
    }

    onSignInSubmit = (event) => {
        event.preventDefault();
        this.setupRecaptcha();
        const phoneNumber = `+91${this.state.phoneNumber}`;
        console.log(phoneNumber);
        const appVerifier = window.recaptchaVerifier;
        firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                this.setState({ showPhoneText: false })
                this.setState({ showOtpText: true })
            }).catch((error) => {
                alert('Please try again OTP not sent');
                window.location.reload()
            });
    }
    getOtp = (e) => {
        e.preventDefault();
        const code = this.state.OTPcode;
        window.confirmationResult.confirm(code).then((result) => {
            // User signed in successfully.
            const user = result.user;
            const uid = user.uid;
            this.login(uid)
        }).catch((error) => {
            alert('Wrong Otp');
            window.location.reload();
        });
    }
    login = (uid) => {
        this.props.history.push(`/details-page/${uid}`);
    };
    render() {
        return (
            <div className="containerLogin">
                <img src={WhatsappLogo} className="Logo" />
                <div className="titelLogin">
                    Login to Whatsapp
                </div>
                {this.state.showPhoneText ?
                    <div style={{ display: "block" }}>
                        <div className="title">Enter Your Phone Number Below</div>
                        <div id="sign-in-button"></div>
                        <form onSubmit={this.onSignInSubmit}>
                            <input type="text" placeholder="+91-12345-67890" class="number" name="phoneNumber" onChange={this.onChangeHandler} required="required" />
                            <button className="button" type="submit">Continue</button>
                        </form>
                    </div>
                    : null}
                {this.state.showOtpText ?
                    <div style={{ display: "block" }}>
                        <div className="title">Enter OTP send to Mobile Number</div>
                        <form onSubmit={this.getOtp}>
                            <input type="text" placeholder="123456" class="number" name="OTPcode" onChange={this.onChangeHandler} required="required" />
                            <button className="button" type="submit">Verify</button>
                        </form>
                    </div>
                    : null
                }
            </div>
        );
    };

};

export default LoginPage;