import { useState } from "react";

export default function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem("token")
        const userToken = JSON.parse(tokenString)
        const tokenExpirationString = localStorage.getItem("tokenExpiration")
        if (tokenExpirationString) {
            const expiration = JSON.parse(tokenExpirationString)
            if (Date.now() > expiration) {
                destroyToken();
            }
        }
        return userToken
    }

    const [token, setToken] = useState()
    const [tokenExpiration, setTokenExpiration] = useState()
    const saveToken = userToken => {
        let expiration = Date.now() + 30 * 60 * 1000
        localStorage.setItem("token", JSON.stringify(userToken))
        localStorage.setItem("tokenExpiration", JSON.stringify(expiration))
        setToken(userToken.token)
        setTokenExpiration(expiration)
    }

    const destroyToken = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("tokenExpiration")
        setToken(undefined)
        setTokenExpiration(undefined)
    }

    return {
        setToken: saveToken,
        token: getToken(),
        destroyToken: destroyToken
    }
}