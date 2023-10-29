import { View, Text, Modal, StyleSheet, TouchableHighlight } from "react-native";
import React, { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import QrcodeScanner from "../components/QrcodeScanner";
import getURL from "../utils/getURL";
import { getFullDate, getFullTime } from "../utils/dateFormat";

type ticketDetailType =
    | {
          email: string;
          type: string;
          priceType: string;
          date_of_use: Date;
          entrance_status: number | null;
          updated_at: Date | null;
      }
    | undefined;

const TicketDetailScreen = () => {
    const [showModal, setShowModal] = useState(false);
    const [hasScanned, setHasScanned] = useState(false);
    const [messageFail, setMessageFail] = useState("");
    const [fetchData, setFetchData]: [ticketDetailType, Dispatch<SetStateAction<ticketDetailType>>] = useState();

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        setHasScanned(true);
        try {
            fetch(getURL() + "send_TicketDetail?data=" + data)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        if (response.status === 404) {
                            setMessageFail("ไม่พบบัตรผ่านนี้ในระบบ");
                        } else {
                            setMessageFail("เกิดข้อผิดพลาด");
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
            setMessageFail("เกิดข้อผิดพลาด");
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
    fetchData: ticketDetailType;
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
                    {typeof fetchData !== "undefined" ? (
                        <>
                            <Text style={{ textAlign: "center" }}>รายละเอียดบัตรผ่าน</Text>
                            <Text>อีเมล: {fetchData.email}</Text>
                            <Text>
                                ประเภทบัตร: {fetchData.type} - {fetchData.priceType === "Adult" ? "บัตรผู้ใหญ่" : "บัตรเด็ก"}
                            </Text>
                            <Text>วันที่ใช้บัตรได้: {getFullDate(fetchData.date_of_use)}</Text>
                            <Text>สถานะบัตร: {statusMessage(fetchData.entrance_status)}</Text>
                            {fetchData.updated_at && <Text>เวลาที่ใช้งาน: {getFullTime(fetchData.updated_at)}</Text>}
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

const statusMessage = (entrance_status: number | null) => {
    switch (entrance_status) {
        case 0:
            return "ใช้แล้ว";
        case 1:
            return "ออกจากสวนสนุกแล้ว";
        case 2:
            return "หมดอายุ";
        default:
            return "ยังไม่ถูกใช้งาน";
    }
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
