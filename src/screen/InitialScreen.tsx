import React, { useState, useEffect } from "react";
import { getAccountType, deleteToken } from "../utils/getStorageData";
import HomeScreen from "./HomeScreen";
import LoginScreen from "./LoginScreen";
import getURL from "../utils/getURL";
import { useNavigation } from "@react-navigation/native";

const InitialScreen = () => {
    const navigation: any = useNavigation();
    const [isLogin, setIsLogin] = useState(-1);

    useEffect(() => {
        getAccountType("token").then((token: string | null) => {
            if (!token) {
                setIsLogin(0);
            } else {
                getAccountType("changePass").then((changePass: string | null) => {
                    fetch(getURL() + "verifyJwt", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            authorization: token,
                        },
                    }).then((response) => {
                        if (response.ok) {
                            if (changePass === "true") {
                                navigation.replace("Password", { token: token });
                            } else {
                                setIsLogin(1);
                            }
                        } else {
                            deleteToken("token").then(() => setIsLogin(0));
                        }
                    });
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
