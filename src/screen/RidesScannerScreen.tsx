import { View, Text, Modal, StyleSheet, TouchableHighlight } from "react-native";
import React, { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import QrcodeScanner from "../components/QrcodeScanner";
import { Check, Cross } from "../components/Icon";
import { getFullDate, getFullTime } from "../utils/dateFormat";
import getURL from "../utils/getURL";
import { getAccountType } from "../utils/getStorageData";
import { useNavigation } from "@react-navigation/native";

interface fetchDataType {
    rideName?: string;
    ticketType?: string;
    priceType?: string;
    cooldown?: number;
    timeCheckin?: string;
    status: string;
}

const RidesScannerScreen = () => {
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
        fetch(getURL() + "rides", {
            method: "POST",
            body: data,
            headers: {
                "Content-Type": "application/json",
                authorization: token,
            },
        }).then(async (response) => {
            const result: fetchDataType = await response.json();
            console.log(result.timeCheckin);
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
                //"not used" | "no more rides to play" | "error" | "limit" | "no ticket"
                switch (result.status) {
                    case "no ticket": //? No Ticket
                        setmassageFail("ไม่มีตั๋วนี้ในระบบ");
                        break;
                    case "not used": //? Already Used
                        setFetchData(result);
                        setmassageFail("ตั๋วนี้ยังไม่ถูกใช้งาน");
                        break;
                    case "no more rides to play": //? No Ride To Play
                        setFetchData(result);
                        setmassageFail("ตั๋วไม่สามารถใช้เล่นเครื่องเล่นได้แล้ว");
                        break;
                    case "limit": //? Can't Play This Ride
                        setFetchData(result);
                        setmassageFail("ตั๋วไม่สามารถเล่นเครื่องเล่นนี้ได้แล้ว");
                        break;
                    case "cooldown":
                        setFetchData(result);
                        setmassageFail("ยังไม่สามารถเล่นเครื่องเล่นได้");
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
                    {/* <Text style={{ fontSize: 16, textAlign: "center" }}>
                        {success
                            ? `ใช้${fetchData.ticketType} - บัตร${fetchData.priceType === "Adult" ? "ผู้ใหญ่" : "เด็ก"} \nเล่นเครื่องเล่นสำเร็จ`
                            : `ใช้บัตรเล่นเครื่องเล่นไม่สำเร็จ`}
                    </Text> */}
                    <Text style={{ fontSize: 16, textAlign: "center" }}>
                        {fetchData.ticketType !== undefined &&
                            fetchData.priceType !== undefined &&
                            `ใช้${fetchData.ticketType} - บัตร${fetchData.priceType === "Adult" ? "ผู้ใหญ่" : "เด็ก"}`}{" "}
                        {`\nเล่นเครื่องเล่น`}
                        {success ? `สำเร็จ` : `ไม่สำเร็จ`}
                        {fetchData.ticketType === undefined && fetchData.priceType === undefined && `ใช้บัตรเล่นเครื่องเล่นไม่สำเร็จ`}
                    </Text>

                    {fetchData.rideName !== undefined && <Text style={{ fontSize: 14 }}>เครื่องเล่น{fetchData.rideName}</Text>}

                    {!success ? (
                        <Text style={{ fontSize: 14, color: "red" }}>{messageFail}</Text>
                    ) : (
                        fetchData.timeCheckin !== undefined && (
                            <Text style={{ fontSize: 14 }}>Check In: {getFullTime(new Date(fetchData.timeCheckin))}</Text>
                        )
                    )}

                    {fetchData.cooldown !== undefined && <Text style={{ fontSize: 14 }}>สามารถเล่นได้อีกภายใน {fetchData.cooldown} นาที</Text>}

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

// const StatusComponent = ({ success, messageFail, fetchData }: { success: boolean; messageFail: string; fetchData: fetchDataType }) => {
//     switch (messageFail) {
//         case "ตั๋วนี้เคยใช้ไปเเล้ว":
//             return (
//                 <>
//                     <Text style={{ fontSize: 14, color: "red" }}>{messageFail}</Text>
//                     <Text style={{ fontSize: 14 }}>ใช้ไปแล้วเมื่อวันที่ {getFullDate(new Date(fetchData.timeCheckin!))}</Text>
//                     <Text style={{ fontSize: 14 }}>เวลา {getFullTime(new Date(fetchData.timeCheckin!))}</Text>
//                 </>
//             );
//         case "ตั๋วนี้ยังไม่สามารถใช้ได้":
//         case "ตั๋วนี้หมดอายุเเล้ว":
//             return (
//                 <>
//                     <Text style={{ fontSize: 14, color: "red" }}>{messageFail}</Text>
//                     <Text style={{ fontSize: 14 }}>ใช้ได้วันที่ {getFullDate(new Date(fetchData.timeCheckin!))}</Text>
//                 </>
//             );
//         case "ตั๋วนี้ถูกใช้และออกจากสวนสนุกไปเเล้ว":
//             return (
//                 <>
//                     <Text style={{ fontSize: 14, color: "red" }}>{messageFail}</Text>
//                     <Text style={{ fontSize: 14 }}>ออกจากสวนสนุกเมื่อ {getFullTime(new Date(fetchData.timeCheckin!))}</Text>
//                 </>
//             );
//         default:
//             return <Text style={{ fontSize: 14 }}>{success ? `Time Check in : ${getFullTime(new Date(fetchData.timeCheckin!))}` : messageFail}</Text>;
//     }
// };

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
export default RidesScannerScreen;
