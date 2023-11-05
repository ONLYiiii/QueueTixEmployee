import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import React, { useState } from "react";
import QuestionTab from "../components/FAQ/QuestionTab";

const FAQScreen = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    return (
        <SafeAreaView
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>QueueTix Help Center</Text>
            <View
                style={{
                    backgroundColor: "#F3C95B",
                    width: "85%",
                    height: 50,
                    borderRadius: 10,
                    borderColor: "black",
                    borderWidth: 2,
                    justifyContent: "center",
                    marginTop: 50,
                }}
            >
                <Text style={{ fontSize: 16, padding: 10, fontWeight: "bold" }}>FAQ</Text>
            </View>
            <QuestionTab selectedTab={selectedTab} />
            {/* <View style={{ width: "100%", height: "10%", flexDirection: "row", columnGap: 20 }}>
                <TouchableOpacity style={[styles.buttonSelect, { backgroundColor: "#F16B4E" }]}>
                        <Text style={styles.textStyle}>คำถาม{"\n"}ยอดฮิต</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonSelect, { backgroundColor: "#00AD50" }]}>
                    <Text style={styles.textStyle}>การซื้อ{"\n"}บัตรผ่าน</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonSelect, { backgroundColor: "#448ADC" }]}>
                    <Text style={styles.textStyle}>การซื้อ{"\n"}บัตรผ่าน</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonSelect, { backgroundColor: "#7B54CF" }]}>
                    <Text style={styles.textStyle}>การซื้อ{"\n"}บัตรผ่าน</Text>
                </TouchableOpacity>
            </View> */}
            <View
                style={{
                    width: "85%",
                    height: "40%",
                    borderColor: "#B5B4B4",
                    padding: 5,
                    borderWidth: 2,
                    borderRadius: 10,
                }}
            >
                <View style={{ width: "100%", height: "30%", borderColor: "#B5B4B4", borderBottomWidth: 2 }}>
                    <Text style={{ color: "#00AD50", fontSize: 14 }}>1. ฉันสามารถยกเลิกคำสั่งซื้อได้หรือไม่</Text>
                    <Text style={{ fontSize: 14 }}>
                        ลูกค้าสามารถยกเลิกคำสั่งซื้อที่ยังชำระเงินไม่สำเร็จได้
                        คำสั่งซื้อที่ชำระเงินสำเร็จเเล้วจะไม่สามารถยกเลิกได้ในทุกกรณี
                    </Text>
                </View>
                <View style={{ width: "100%", height: "40%", borderColor: "#B5B4B4", borderBottomWidth: 2 }}>
                    <Text>2. ฉันสามารถเปลี่ยนวันที่ต้องการไปใช้บริการสวนสนุกได้หรือไม่</Text>
                    <Text></Text>
                </View>
                <View style={{ width: "100%", height: "40%", borderColor: "#B5B4B4", borderBottomWidth: 2 }}>
                    <Text>3. ฉันมีข้อสงสัยในการใช้งานตัวเเอปพลิเคชั่น สามารถติดต่อช่องทางไหนได้บ้าง</Text>
                    <Text></Text>
                </View>
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    buttonSelect: {
        width: "18%",
        height: "100%",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    textStyle: {
        color: "white",
        textAlign: "center",
    },
});
export default FAQScreen;
