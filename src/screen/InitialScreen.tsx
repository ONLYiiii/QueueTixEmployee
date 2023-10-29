import React, { useState, useEffect } from "react";
import { getAccountType, deleteToken } from "../utils/getStorageData";
import HomeScreen from "./HomeScreen";
import LoginScreen from "./LoginScreen";
import getURL from "../utils/getURL";

const InitialScreen = () => {
    const [isLogin, setIsLogin] = useState(-1);

    useEffect(() => {
        getAccountType("token").then((token: string | null) => {
            if (!token) {
                setIsLogin(0);
            } else {
                fetch(getURL() + "verifyJwt", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: token,
                    },
                }).then((response) => {
                    if (response.ok) {
                        setIsLogin(1);
                    } else {
                        deleteToken("token").then(() => setIsLogin(0));
                    }
                });
            }
        });
    }, []);

    if (isLogin === 0) {
        return <LoginScreen />;
    } else if (isLogin === 1) {
        return <HomeScreen />;
    }
    return <></>;
};

export default InitialScreen;
