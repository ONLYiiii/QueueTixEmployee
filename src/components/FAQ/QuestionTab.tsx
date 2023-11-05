import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import type { ColorValue } from "react-native";
import React from "react";

interface tabListType {
    id: number;
    headerText: string;
    backgroundColor: ColorValue;
}

const QuestionTab = ({ selectedTab }: { selectedTab: number }) => {
    const tabList: tabListType[] = [
        {
            id: 0,
            headerText: "คำถาม\nยอดฮิต",
            backgroundColor: "#F16B4E",
        },
        {
            id: 1,
            headerText: "การซื้อ\nบัตรผ่าน",
            backgroundColor: "#00AD50",
        },
        {
            id: 2,
            headerText: "การจองคิว\nfastpass",
            backgroundColor: "#00AD50",
        },
        {
            id: 3,
            headerText: "การชำระเงิน",
            backgroundColor: "#00AD50",
        },
    ];
    const renderItem = ({ item }: { item: tabListType }) => {
        const tabBackgroundColor: ColorValue = selectedTab === item.id ? item.backgroundColor : "white";
        const textColor: ColorValue = selectedTab === item.id ? "white" : "black";
        return (
            <TouchableOpacity style={[styles.buttonSelect, { backgroundColor: tabBackgroundColor }]}>
                <Text style={{ color: textColor, textAlign: "center" }}>{item.headerText}</Text>
            </TouchableOpacity>
        );
    };
    return (
        <View style={{ width: "100%", height: "10%" }}>
            <FlatList horizontal data={tabList} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />
        </View>
    );
};

export default QuestionTab;

const styles = StyleSheet.create({
    buttonSelect: {
        width: "55%",
        height: "100%",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
});
