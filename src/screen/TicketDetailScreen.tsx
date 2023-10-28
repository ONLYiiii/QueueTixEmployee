import { View, Text, Modal, StyleSheet, TouchableHighlight } from "react-native";
import React, { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import QrcodeScanner from "../components/QrcodeScanner";
import getURL from "../utils/getURL";
import { getFullDate, getFullTime } from "../utils/dateFormat";

const TicketDetailScreen = () => {
    const [showModal, setShowModal] = useState(false);
    const [hasScanned, setHasScanned] = useState(false);
    const [messageFail, setmassageFail] = useState("");
    const [fetchData, setFetchData]: [any, Dispatch<SetStateAction<any>>] = useState({
        purchaseoftypesId: "",
        user_email: "",
        dateofuse: "",
        date_of_use: "",
        time_check: "",
        types: "",
        ticketTypes: "",
        status_ticket: -1,
    });

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        setHasScanned(true);
        try {
            fetch(getURL() + "send_TicketDetail?data=" + data)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        if (response.status === 404) {
                            setmassageFail("ไม่พบบัตรผ่านนี้ในระบบ");
                        } else {
                            setmassageFail("เกิดข้อผิดพลาด");
                        }
                        return undefined;
                    }
                })
                .then((data) => {
                    if (data !== "undefined") {
                        setFetchData(data);
                    }
                });
        } catch (error) {
            console.log(error);
            setmassageFail("เกิดข้อผิดพลาด");
        } finally {
            setShowModal(true);
        }
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
    messageFail: string;
    fetchData: any;
}

const ResultModal = ({ showModal, setShowModal, setHasScanned, messageFail, fetchData }: modalController) => {
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
                    {/* {success ? (
                        <Check
                            size={90}
                            color="#2EDD3D"
                            // style={{ backgroundColor: "white", borderRadius: 8 }}
                        />
                    ) : (
                        <Cross size={90} color="red" />
                    )}
                    <Text style={{ fontSize: 16, textAlign: "center" }}>
                        {success ? `ใช้${fetchData.type} - บัตร${fetchData.priceType === "Adult" ? "ผู้ใหญ่" : "เด็ก"} สำเร็จ` : `ใช้บัตรไม่สำเร็จ`}
                    </Text>

                    {messageFail === "ตั๋วนี้เคยใช้ไปเเล้ว" ? (
                        <>
                            <Text style={{ fontSize: 14, color: "red" }}>{messageFail}</Text>
                            <Text style={{ fontSize: 14, color: "red" }}>ใช้ไปแล้วเมื่อ {getFullTime(new Date(fetchData.timeCheckin!))}</Text>
                        </>
                    ) : messageFail === "ตั๋วนี้ยังไม่สามารถใช้ได้" ? (
                        <>
                            <Text style={{ fontSize: 14, color: "red" }}>{messageFail}</Text>
                            <Text style={{ fontSize: 14, color: "red" }}>ใช้ได้วันที่ {getFullDate(new Date(fetchData.timeCheckin!))}</Text>
                        </>
                    ) : (
                        <Text style={{ fontSize: 14 }}>
                            {success ? `Time Check in : ${getFullTime(new Date(fetchData.timeCheckin!))}` : messageFail}
                        </Text>
                    )} */}
                    {/* interface fetchDataType {
                        purchaseoftypesId: string;
                        user_email: string;
                        dateofuse: string;
                        date_of_use: string;
                        time_check: string;
                        type: string;
                        ticketTypes: string;
                        status_ticket: number;
                    } */}
                    {messageFail === "" ? (
                        <>
                            <Text style={{ textAlign: "center" }}>รายละเอียดบัตรผ่าน</Text>
                            <Text>อีเมล: {fetchData.user_email}</Text>
                            <Text>
                                ประเภทบัตร: {fetchData.ticketTypes} - {fetchData.types === "Adult" ? "บัตรผู้ใหญ่" : "บัตรเด็ก"}
                            </Text>
                            <Text>วันที่ใช้บัตรได้: {getFullDate(new Date(fetchData.date_of_use))}</Text>
                            <Text>
                                สถานะบัตร:{" "}
                                {fetchData.status_ticket === 0
                                    ? "ยังไม่ถูกใช้งาน"
                                    : fetchData.status_ticket === 1
                                    ? "ใช้แล้ว"
                                    : fetchData.status_ticket === 2
                                    ? "ออกจากสวนสนุกแล้ว"
                                    : "หมดอายุ"}
                            </Text>
                            <Text>
                                เวลาที่ใช้งาน: {fetchData.time_check !== null ? getFullTime(new Date(fetchData.time_check)) : "ยังไม่ถูกใช้งาน"}
                            </Text>
                        </>
                    ) : (
                        <Text>Error Found: {messageFail}</Text>
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

export default TicketDetailScreen;

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
