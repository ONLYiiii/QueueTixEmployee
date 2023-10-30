import { View, Text, Modal, StyleSheet, TouchableHighlight } from "react-native";
import React, { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import QrcodeScanner from "../components/QrcodeScanner";
import { Check, Cross } from "../components/Icon";
import { getFullTime } from "../utils/dateFormat";
import getURL from "../utils/getURL";
import { getAccountType } from "../utils/getStorageData";

interface fetchDataType {
    timeCheckin?: string;
    rideName?: string;
    status: string;
}

const FastpassScannerScreen = () => {
    const [token, setToken] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [hasScanned, setHasScanned] = useState(false);
    const [success, setSuccess] = useState(false);
    const [messageFail, setmassageFail] = useState("");
    const [fetchData, setFetchData]: [fetchDataType, Dispatch<SetStateAction<fetchDataType>>] = useState({
        status: "",
    });

    useEffect(() => {
        getAccountType("token").then((getToken: string | null) => {
            if (getToken) {
                setToken(getToken);
            }
        });
    }, []);

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        //ข้อมูลที่สแกน QR Code มี type(เวอร์ชั่น QR Code) กับ data
        setHasScanned(true);
        fetch(getURL() + "rides/fastpass", {
            method: "POST",
            body: data,
            headers: {
                "Content-Type": "application/json",
                authorization: token,
            },
        }).then(async (response) => {
            const result: fetchDataType = await response.json();
            console.log(result);
            //?--------------------Success--------------------
            if (response.status === 200) {
                setFetchData(result);
                setSuccess(true);
                setmassageFail("");
            }
            //?-----------------------------------------------

            //?--------------------Not_Success--------------------
            else if (response.status === 400) {
                setSuccess(false);
                //?--------------------Not_Success_Status--------------------
                switch (result.status) {
                    case "no fastpass": //? No Fastpass
                        setFetchData(result);
                        setmassageFail("ไม่มีการจอง Fastpass นี้ในระบบ");
                        break;
                    case "used": //? Already Used
                        setFetchData(result);
                        setmassageFail("Fastpass นี้เคยใช้ไปเเล้ว");
                        break;
                    case "not this time": //? Not In Time
                        setFetchData(result);
                        setmassageFail("Fastpass นี้ยังไม่สามารถใช้ได้ตอนนี้");
                        break;
                    case "expired": //? Already Expired
                        setFetchData(result);
                        setmassageFail("Fastpass นี้หมดอายุเเล้ว");
                        break;
                    case "error": //? Error
                        setmassageFail("เกิดข้อผิดพลาด");
                        break;
                }
                //?----------------------------------------------------------
            }
            //?---------------------------------------------------
            setShowModal(true); //? Show_Modal
        });

        // setShowModal(true);
        // Handle the scanned QR code data here
        // console.log(`Scanned QR code with type: ${type} and data: ${data}`);
    };

    return (
        <>
            <View style={{ flex: 2 }}>
                <QrcodeScanner handleBarCodeScanned={handleBarCodeScanned} hasScanned={hasScanned} />
            </View>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ textAlign: "center" }}>
                    คณสามารถสเเกนคิวอาร์โค้ดบัตรผ่านสวนสนุกเเละบัตรคิวfastpass{"\n"}เพื่อยืนยันการใช้งานของลูกค้าได้
                </Text>
                <ResultModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    setHasScanned={setHasScanned}
                    success={success}
                    messageFail={messageFail}
                    fetchData={fetchData}
                />
            </View>
        </>
    );
};

interface modalController {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    setHasScanned: React.Dispatch<React.SetStateAction<boolean>>;
    success: boolean;
    messageFail: string;
    fetchData: fetchDataType;
}

const ResultModal = ({ showModal, setShowModal, setHasScanned, success, messageFail, fetchData }: modalController) => {
    return (
        <Modal visible={showModal} transparent={true} animationType="slide">
            <View style={{ backgroundColor: "rgba(0,0,0,0.25)", flex: 1, justifyContent: "center", alignItems: "center" }}>
                <View
                    style={{
                        backgroundColor: "rgb(255,255,255)",
                        width: "70%",
                        height: "40%",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        borderRadius: 8,
                    }}
                >
                    {success ? (
                        <Check
                            size={90}
                            color="#2EDD3D"
                            // style={{ backgroundColor: "white", borderRadius: 8 }}
                        />
                    ) : (
                        <Cross size={90} color="red" />
                    )}
                    <Text style={{ fontSize: 16, textAlign: "center" }}>{success ? `ใช้ Fastpass สำเร็จ` : `ใช้ Fastpass ไม่สำเร็จ`}</Text>
                    {fetchData.rideName && <Text style={{ fontSize: 14, textAlign: "center" }}>เครื่องเล่น{fetchData.rideName}</Text>}
                    {success ? (
                        <Text style={{ fontSize: 14, textAlign: "center" }}>Time Check: {getFullTime(new Date(fetchData.timeCheckin!))}</Text>
                    ) : (
                        <Text style={{ fontSize: 14, textAlign: "center", color: "red" }}>{messageFail}</Text>
                    )}

                    <TouchableHighlight
                        onPress={() => {
                            setShowModal(false);
                            setHasScanned(false);
                        }}
                        style={styles.CloseBotton}
                    >
                        <Text style={{ color: "white", fontSize: 18 }}>Close</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    CloseBotton: {
        width: 220,
        height: 50,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
});
export default FastpassScannerScreen;
