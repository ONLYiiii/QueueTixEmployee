import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import type { ColorValue } from "react-native";
import React from "react";
import type { Dispatch, SetStateAction } from "react";
import faqList from "../../json/faqList.json";
import { Up, Down } from "../Icon";

interface questionListType {
    id: string;
    question: string;
    answer: string;
}

const QuestionList = ({
    selectedTab,
    expanded,
    setExpanded,
}: {
    selectedTab: number;
    expanded: string[];
    setExpanded: Dispatch<SetStateAction<string[]>>;
}) => {
    const tabListName: string[] = ["hot", "purchase", "fastpass", "payment"];
    const tabName = tabListName[selectedTab] as "hot" | "purchase" | "fastpass" | "payment";

    const renderItem = ({ item, index }: { item: questionListType; index: number }) => {
        const textColor: ColorValue[] = ["#F16B4E", "#00AD50", "#448ADC", "#7B54CF"];
        const isExpanded: boolean = expanded.includes(item.id);
        const itemStyle: object = faqList[tabName].length - 1 === index ? styles.lastTextBox : styles.textBox;

        return (
            <View style={itemStyle}>
                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ color: textColor[selectedTab], fontSize: 14, fontWeight: "bold", marginBottom: 15, width: "80%" }}>
                        {item.id}. {item.question}
                    </Text>
                    <Pressable
                        style={{ height: 30, justifyContent: "center" }}
                        onPress={() => {
                            const newExpanded = expanded;
                            if (isExpanded) {
                                const removeIndex = newExpanded.indexOf(item.id);
                                newExpanded.splice(removeIndex, 1);
                            } else {
                                newExpanded.push(item.id);
                            }
                            setExpanded([...newExpanded]);
                        }}
                        android_ripple={{ borderless: true }}
                    >
                        {isExpanded ? <Up size={24} /> : <Down size={24} />}
                    </Pressable>
                </View>
                {isExpanded && <Text style={{ fontSize: 14, width: "88%" }}>{item.answer}</Text>}
            </View>
        );
    };

    return <FlatList data={faqList[tabName]} renderItem={renderItem} keyExtractor={(item) => item.id} />;
};

export default QuestionList;

const styles = StyleSheet.create({
    textBox: {
        width: "100%",
        height: "auto",
        borderColor: "#000000",
        borderBottomWidth: 2,
        paddingHorizontal: 18,
        paddingVertical: 13,
    },
    lastTextBox: {
        width: "100%",
        height: "auto",
        paddingHorizontal: 18,
        paddingVertical: 13,
    },
});
