import axios from "axios";
import { createContext } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

    const login = async (inputs) => {
    try {
        const res = await axios.post('http://localhost:6001/auth/login', inputs);

        localStorage.setItem('userToken', res.data.token);
        localStorage.setItem('userId', res.data.user._id);
        localStorage.setItem('userName', res.data.user.username);
        localStorage.setItem('userEmail', res.data.user.email);

        return res.data.user._id;  // Return the userId

    } catch (err) {
        console.log(err);
        return null;
    }
};


    const register = async (inputs) => {
        try {
            const res = await axios.post('http://localhost:6001/auth/register', inputs);

            localStorage.setItem('userToken', res.data.token);
            localStorage.setItem('userId', res.data.user._id);
            localStorage.setItem('userName', res.data.user.username);
            localStorage.setItem('userEmail', res.data.user.email);

            return true;

        } catch (err) {
            console.log(err);
            return false;
        }
    };

    const logout = async () => {
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
