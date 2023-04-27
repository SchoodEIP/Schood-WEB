import { useState } from "react";
import '../../styles/login.scss'
import childrenLogin from '../../assets/children_login.png'
import logoSchood from '../../assets/logo_schood.png'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const baseUrl = "http://localhost:8080/user/login";

    const handleLogin = async (event) => {
        event.preventDefault();

        // Vérifier que l'email est valide avant de faire la requête
        if (!validateEmail(email)) {
            setMessage("Email is not valid");
            return;
        }

        const payload = {
            email: email,
            password: password
        };

        try {
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem("token", data.token);
                localStorage.setItem("token", data.token);
                sessionStorage.setItem("role", data.role);
                localStorage.setItem("role", data.role);
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            setMessage(`Error: ${error}`);
        }
    }

    const validateEmail = (email) => {
        const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;

        return regEx.test(email);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    return (
        <div className="Login-page">
            <div id={"background-part"}>
                <img id="childrenImg" src={childrenLogin} alt="children" />
            </div>
            <div id={"login-part"}>
                <img id="schoodLogo" src={logoSchood} alt="Schood" />
                <div id={"login-form"}>
                    <form>
                        <div>
                            <input id="userInput" type={"text"} placeholder={"Email"} onChange={handleEmailChange} value={email} required/>
                        </div>
                        <div>
                            <input id="passInput" type={"password"} placeholder={"********"} onChange={handlePasswordChange} value={password} required/>
                        </div>
                    </form>
                </div>
                <div>
                    <label id="rememberLabel">
                        <input id="rememberCheckbox" type="checkbox" /> Remember me
                    </label>
                </div>
                <div>
                    <button onClick={handleLogin} type={"submit"} id={"login-button"}>Login</button>
                </div>
                <div>
                    <p id="errorMessage">{message}</p>
                </div>
                <div>
                    <p id="signUpRedirect">Forgot your password? <a href="/#">Reset here.</a></p>
                </div>
            </div>
        </div>
    );
}