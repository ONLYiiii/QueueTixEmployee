import { View, Text, Modal, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import QrcodeScanner from "../components/QrcodeScanner";
import { Check, Cross } from "../components/Icon";
import { getFullDate, getFullTime } from "../utils/dateFormat";
import getURL from "../utils/getURL";
import TicketDetailModal from "../components/TicketDetailModal";
import ticketDetails from "../utils/FetchData/ticketDetails";

interface fetchDataType {
    _id?: string;
    type?: string;
    timeCheckin?: string;
    priceType?: string;
    status: string;
}

type ticketDetailType =
    | {
          email: string;
          type: string;
          priceType: string;
          date_of_use: string;
          entrance_status: number | null;
          updated_at: string | null;
      }
    | undefined;

const ScannerOutScreen = () => {
    const [showModal, setShowModal] = useState(false);
    const [hasScanned, setHasScanned] = useState(false);
    const [success, setSuccess] = useState(false);
    const [messageFail, setmassageFail] = useState("");
    const [scannerData, setScannerData] = useState("");
    const [fetchData, setFetchData]: [fetchDataType, Dispatch<SetStateAction<fetchDataType>>] = useState({
        status: "",
    });

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        //ข้อมูลที่สแกน QR Code มี type(เวอร์ชั่น QR Code) กับ data
        setHasScanned(true);
        setScannerData(data);
        fetch(getURL() + "qrcode/verify/", {
            method: "POST",
            body: JSON.stringify({ data: JSON.parse(data), mode: "OUT" }),
            headers: {
                "Content-Type": "application/json",
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
                    case "no ticket": //? No Ticket
                        setmassageFail("ไม่มีตั๋วนี้ในระบบ");
                        break;
                    case "not used": //? Not Used
                        setFetchData(result);
                        setmassageFail("ตั๋วนี้ยังไม่ถูกใช้งาน");
                        break;
                    case "not this date": //? Not Today
                        setFetchData(result);
                        setmassageFail("ตั๋วนี้ยังไม่สามารถใช้ได้");
                        break;
                    case "exit": //? Already Exit
                        setFetchData(result);
                        setmassageFail("ตั๋วนี้เคยใช้ไปเเล้ว");
                        break;
                    case "expired": //? Already Expired
                        setFetchData(result);
                        setmassageFail("ตั๋วนี้หมดอายุเเล้ว");
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
                    scannerData={scannerData}
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
    scannerData: string;
}

const ResultModal = ({ showModal, setShowModal, setHasScanned, success, messageFail, fetchData, scannerData }: modalController) => {
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [messageFailDetail, setMessageFailDetail] = useState("");
    const [fetchDataDetail, setFetchDataDetail]: [ticketDetailType, Dispatch<SetStateAction<ticketDetailType>>] = useState();

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
                    <Text style={{ fontSize: 16, textAlign: "center" }}>
                        {success
                            ? `${fetchData.type} - บัตร${fetchData.priceType === "Adult" ? "ผู้ใหญ่" : "เด็ก"} \nออกจากสวนสนุกสำเร็จ`
                            : `ออกจากสวนสนุกไม่สำเร็จ`}
                    </Text>

                    <StatusComponent success={success} messageFail={messageFail} fetchData={fetchData} />

                    <TouchableHighlight
                        onPress={() => {
                            setShowModal(false);
                            setHasScanned(false);
                        }}
                        style={styles.CloseBotton}
                    >
                        <Text style={{ color: "white", fontSize: 18 }}>Close</Text>
                    </TouchableHighlight>
                    {messageFail !== "เกิดข้อผิดพลาด" && messageFail !== "ไม่มีตั๋วนี้ในระบบ" && (
                        <TouchableOpacity
                            style={{ alignSelf: "flex-end", marginRight: 10 }}
                            onPress={() => {
                                ticketDetails(scannerData, setMessageFailDetail, setShowDetailModal, setFetchDataDetail);
                            }}
                        >
                            <Text style={{ color: "red", fontSize: 14 }}>ดูข้อมูลเพิ่มเติม</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <TicketDetailModal
                showModal={showDetailModal}
                setShowModal={setShowDetailModal}
                messageFail={messageFailDetail}
                fetchData={fetchDataDetail}
            />
        </Modal>
    );
};

const StatusComponent = ({ success, messageFail, fetchData }: { success: boolean; messageFail: string; fetchData: fetchDataType }) => {
    switch (messageFail) {
        case "ตั๋วนี้ยังไม่สามารถใช้ได้":
        case "ตั๋วนี้หมดอายุเเล้ว":
        case "ตั๋วนี้ยังไม่ถูกใช้งาน":
            return (
                <>
                    <Text style={{ fontSize: 14, color: "red" }}>{messageFail}</Text>
                    <Text style={{ fontSize: 14 }}>ใช้ได้วันที่ {getFullDate(new Date(fetchData.timeCheckin!))}</Text>
                </>
            );
        case "ตั๋วนี้เคยใช้ไปเเล้ว":
            return (
                <>
                    <Text style={{ fontSize: 14, color: "red" }}>{messageFail}</Text>
                    <Text style={{ fontSize: 14 }}>ออกจากสวนสนุกเมื่อวันที่ {getFullDate(new Date(fetchData.timeCheckin!))}</Text>
                    <Text style={{ fontSize: 14 }}>เวลา {getFullTime(new Date(fetchData.timeCheckin!), true)}</Text>
                </>
            );
        default:
            return (
                <Text style={{ fontSize: 14 }}>
                    {success ? `Time Check in : ${getFullTime(new Date(fetchData.timeCheckin!), true)}` : messageFail}
                </Text>
            );
    }
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
export default ScannerOutScreen;
