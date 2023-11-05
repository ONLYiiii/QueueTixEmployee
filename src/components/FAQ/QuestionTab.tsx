import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import type { ColorValue } from "react-native";
import React from "react";
import type { Dispatch, SetStateAction } from "react";
import { FAQfire, FAQTicket, FAQFastpass, FAQPayment } from "../Icon";

interface tabListType {
    id: number;
    headerText: string;
    backgroundColor: ColorValue;
    icon: React.JSX.Element;
}

const QuestionTab = ({
    selectedTab,
    setSelectedTab,
    setExpanded,
}: {
    selectedTab: number;
    setSelectedTab: Dispatch<SetStateAction<number>>;
    setExpanded: Dispatch<SetStateAction<string[]>>;
}) => {
    const tabList: tabListType[] = [
        {
            id: 0,
            headerText: "คำถาม\nยอดฮิต",
            backgroundColor: "#F16B4E",
            icon: <FAQfire size={26} color="white" style={[styles.icon, { backgroundColor: "#F16B4E" }]} />,
        },
        {
            id: 1,
            headerText: "การซื้อ\nบัตรผ่าน",
            backgroundColor: "#00AD50",
            icon: <FAQTicket size={26} color="white" style={[styles.icon, { backgroundColor: "#00AD50" }]} />,
        },
        {
            id: 2,
            headerText: "การจองคิว\nfastpass",
            backgroundColor: "#448ADC",
            icon: <FAQFastpass size={26} color="white" style={[styles.icon, { backgroundColor: "#448ADC" }]} />,
        },
        {
            id: 3,
            headerText: "การชำระเงิน",
            backgroundColor: "#7B54CF",
            icon: <FAQPayment size={26} color="white" style={[styles.icon, { backgroundColor: "#7B54CF" }]} />,
        },
    ];
    const renderItem = ({ item }: { item: tabListType }) => {
        const tabBackgroundColor: ColorValue = selectedTab === item.id ? item.backgroundColor : "white";
        const textColor: ColorValue = selectedTab === item.id ? "white" : "black";
        return (
            <Pressable
                style={[styles.buttonSelect, { backgroundColor: tabBackgroundColor }]}
                onPress={() => {
                    setSelectedTab(item.id);
                    setExpanded([""]);
                }}
            >
                {item.icon}
                <Text style={{ color: textColor, textAlign: "center", fontSize: 11 }}>{item.headerText}</Text>
            </Pressable>
        );
    };
    return (
        <View style={{ width: "95%", height: "15%", marginTop: 20, alignItems: "center" }}>
            <FlatList
                data={tabList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={4}
                columnWrapperStyle={{ justifyContent: "space-between" }}
            />
        </View>
    );
};

export default QuestionTab;

const styles = StyleSheet.create({
    buttonSelect: {
        width: "23%",
        height: "100%",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    icon: {
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 30,
        marginBottom: 7,
    },
});
