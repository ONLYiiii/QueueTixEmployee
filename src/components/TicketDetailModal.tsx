import { View, Text, Modal, StyleSheet, TouchableHighlight } from "react-native";
import React from "react";
import type { Dispatch, SetStateAction } from "react";
import { getFullDate, getFullTime } from "../utils/dateFormat";

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

interface modalController {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    messageFail: string;
    fetchData: ticketDetailType;
}

const TicketDetailModal = ({ showModal, setShowModal, messageFail, fetchData }: modalController) => {
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
                            <Text>วันที่ใช้บัตรได้: {getFullDate(new Date(fetchData.date_of_use))}</Text>
                            <Text>สถานะบัตร: {statusMessage(fetchData.entrance_status)}</Text>
                            {fetchData.entrance_status !== 2 && fetchData.updated_at && (
                                <Text>เวลาที่ใช้งาน: {getFullTime(new Date(fetchData.updated_at))}</Text>
                            )}
                        </>
                    ) : (
                        <Text>Error Found: {messageFail}</Text>
                    )}
                    <TouchableHighlight
                        onPress={() => {
                            setShowModal(false);
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

export default TicketDetailModal;
