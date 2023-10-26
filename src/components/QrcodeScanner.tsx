import { Camera, CameraType, BarCodeScanningResult } from "expo-camera";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { BlurView } from "expo-blur";

const QrcodeScanner = ({
    handleBarCodeScanned,
    hasScanned,
}: {
    handleBarCodeScanned: ((scanningResult: BarCodeScanningResult) => void) | undefined;
    hasScanned: boolean;
}) => {
    const [type, setType] = useState(CameraType.back);
    const [permissionStatus, setpermissionStatus] = useState(false);

    const cameraPermissions = async () => {
        const status: boolean = (await Camera.getCameraPermissionsAsync()).granted;
        console.log(status);
        if (!status) {
            const statusRequest = await Camera.requestCameraPermissionsAsync();
            console.log(statusRequest);
            setpermissionStatus(statusRequest.granted);
        } else {
            setpermissionStatus(status);
        }
    };

    useEffect(() => {
        cameraPermissions();
    }, []);

    return (
        permissionStatus && (
            <View>
                <BlurView intensity={90}>
                    <Camera
                        style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}
                        onBarCodeScanned={hasScanned ? undefined : handleBarCodeScanned}
                        type={type}
                    >
                        <View style={styles.frame} />
                    </Camera>
                </BlurView>
            </View>
        )
    );
};

const styles = StyleSheet.create({
    frame: {
        flex: 1,
        position: "absolute",
        top: "30%",
        left: "15%",
        width: "70%",
        aspectRatio: 1,
    },
});

export default QrcodeScanner;
