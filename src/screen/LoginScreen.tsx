import { View, Text, TextInput, TouchableHighlight, Dimensions } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Error } from "../components/Icon";
import getURL from "../utils/getURL";

const LoginScreen = () => {
    const navigation: any = useNavigation();

    const [input, setInput] = useState({ email: "", password: "" });

    const [errorBox, setErrorBox] = useState(false);

    const handleInput = (name: string, value: string) => {
        const newInput = input;
        if (name === "email") {
            newInput.email = value;
        } else {
            newInput.password = value;
        }
        setInput(newInput);
    };

    const getRoleFetch = (fetchData: { token: string; fullname: string; message: string }) => {
        try {
            fetch(getURL() + "accountRole", {
                headers: {
                    "Content-Type": "application/json",
                    authorization: fetchData.token,
                },
            }).then(async (response) => {
                const types = await response.text();
                if (response.ok) {
                    await AsyncStorage.setItem("types", types);
                    await AsyncStorage.setItem("token", fetchData.token);
                    await AsyncStorage.setItem("fullname", fetchData.fullname);
                    if (fetchData.message === "Login successful") {
                        navigation.navigate("Home");
                    } else {
                        navigation.navigate("Password", { token: fetchData.token });
                    }
                } else {
                    setErrorBox(true);
                }
            });
        } catch (error) {
            console.log("Error Found In getRoleFetch: " + error);
        }
    };

    const loginFetch = () => {
        try {
            fetch(getURL() + "login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            }).then(async (response) => {
                if (response.status === 200) {
                    const fetchData: { token: string; fullname: string; message: string } = await response.json();
                    getRoleFetch(fetchData);
                } else {
                    setErrorBox(true);
                }
            });
        } catch (error) {
            console.log("Error Found In loginFetch: " + error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ alignItems: "center", justifyContent: "center", height: Dimensions.get("window").height }}>
                <Text style={{ fontSize: 32, fontWeight: "600" }}>QueueTix</Text>
                <Text style={{ fontSize: 24, fontWeight: "600" }}>Employee</Text>
                <View
                    style={{
                        height: "50%",
                        width: "80%",
                        marginTop: 40,
                        borderRadius: 14,
                        backgroundColor: "#ffffff",
                        elevation: 10,
                        justifyContent: "center",
                    }}
                >
                    <View style={{ alignItems: "center", width: "100%", rowGap: 40 }}>
                        <Text
                            style={{
                                fontSize: 24,
                                color: "#210066",
                                fontWeight: "600",
                            }}
                        >
                            Login Account
                        </Text>
                        <TextInput
                            placeholder="Email"
                            style={{ fontSize: 16, borderBottomWidth: 2, width: "75%", borderBottomColor: "#7C4DFF" }}
                            placeholderTextColor="#210066"
                            onChangeText={(value: string) => handleInput("email", value)}
                        ></TextInput>
                        <TextInput
                            placeholder="Password"
                            style={{ fontSize: 16, borderBottomWidth: 2, width: "75%", borderBottomColor: "#7C4DFF" }}
                            placeholderTextColor="#210066"
                            secureTextEntry
                            onChangeText={(value: string) => handleInput("password", value)}
                        ></TextInput>
                        {errorBox && (
                            <View
                                style={{
                                    backgroundColor: "#FFF7F5",
                                    borderColor: "red",
                                    borderWidth: 2,
                                    borderRadius: 5,
                                    width: "90%",
                                    height: "20%",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    columnGap: 5,
                                }}
                            >
                                <Error size={25} color="red" />
                                <Text style={{ fontSize: 14, color: "red" }}>{`Your email or password are incorrect.\nPlease try again!`}</Text>
                            </View>
                        )}
                        <TouchableHighlight
                            style={{
                                width: "75%",
                                height: "18%",
                                backgroundColor: "#7C4DFF",
                                // marginTop: 20,
                                borderRadius: 12,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            underlayColor="#DDDDDD"
                            onPress={() => loginFetch()}
                        >
                            <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "600" }}>Login</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default LoginScreen;
