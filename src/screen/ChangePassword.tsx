import { View, Text, TextInput, TouchableHighlight, Dimensions } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import getURL from "../utils/getURL";

const ChangePassword = ({ route }: { route: any }) => {
    const navigation: any = useNavigation();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { token } = route.params;
    const handleCheckPassword = () => {
        if (newPassword === confirmPassword) {
            fetch(getURL() + "changePassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: token,
                },
                body: JSON.stringify({ password: newPassword }),
            }).then((response) => {
                if (response.ok) {
                    AsyncStorage.removeItem("changePass").then(() => navigation.replace("Home"));
                } else {
                    alert("Error");
                }
            });
        } else {
            alert("Passwords do not match. Please try again.");
        }
    };
    return (
        <View style={{ flex: 1 }}>
            <View style={{ alignItems: "center", justifyContent: "center", height: Dimensions.get("window").height }}>
                <Text style={{ fontSize: 32, fontWeight: "800" }}>QueueTix</Text>
                <Text style={{ fontSize: 24, fontWeight: "800" }}>Employee</Text>
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
                            Create New Password
                        </Text>
                        <TextInput
                            placeholder="New Password"
                            secureTextEntry={true}
                            style={{
                                fontSize: 16,
                                borderBottomWidth: 2,
                                width: "75%",
                                borderBottomColor: "#7C4DFF",
                            }}
                            placeholderTextColor="#210066"
                            onChangeText={setNewPassword}
                        ></TextInput>
                        <TextInput
                            placeholder="Confirm-Password"
                            secureTextEntry={true}
                            style={{
                                fontSize: 16,
                                borderBottomWidth: 2,
                                width: "75%",
                                borderBottomColor: "#7C4DFF",
                            }}
                            placeholderTextColor="#210066"
                            onChangeText={setConfirmPassword}
                        ></TextInput>
                        <TouchableHighlight
                            style={{
                                width: "75%",
                                height: "18%",
                                backgroundColor: "#7C4DFF",
                                marginTop: 30,
                                borderRadius: 12,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            underlayColor="#DDDDDD"
                            onPress={handleCheckPassword}
                        >
                            <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "600" }}>Confirm</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ChangePassword;
