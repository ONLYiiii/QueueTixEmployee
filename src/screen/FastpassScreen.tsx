import { View, Text, StyleSheet, TouchableHighlight, TextInput, FlatList, Image, SafeAreaView } from "react-native";

import React, { useState } from "react";
import { Search } from "../components/Icon";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import FastpassList from "../json/FastpassList.json";
import { dateFormat } from "../utils/dateFormat";
import picRide from "../utils/picRide";

type ItemData = {
    FastpassID: string;
    Name: string;
    Time: string;
};

const FastpassScreen = () => {
    const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState(0);
    const DATA: ItemData[] = FastpassList;
    const [showData, setShowData] = useState([...DATA]);

    const backgroundSelectedTab = (index: number) => {
        if (index === selectedTab) return "#5439A1";
        else return "#ffffff";
    };
    const fontColorSelectedTab = (index: number) => {
        if (index === selectedTab) return "#ffffff";
        else return "#5439A1";
    };
    return (
        <SafeAreaView style={{ flex: 1, paddingTop: 50, backgroundColor: "white" }}>
            <View style={{ justifyContent: "center", alignItems: "center", rowGap: 15, marginBottom: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: "500" }}>Fastpass</Text>
                <Text>{dateFormat(new Date())}</Text>
                <View style={styles.head}>
                    <View style={{ marginLeft: 10, flexDirection: "row" }}>
                        <Search size={20} color="#000000" />
                        <TextInput
                            style={{ fontSize: 12, color: "#999999", marginLeft: 5 }}
                            placeholder=" Search by Ticket ID"
                        ></TextInput>
                    </View>
                </View>
            </View>
            <View style={styles.navigate}>
                <TouchableHighlight
                    style={[styles.button, { backgroundColor: backgroundSelectedTab(0), width: "20%" }]}
                    underlayColor="#5439A155"
                    onPress={() => {
                        setSelectedTab(0);
                        setShowData([...DATA]);
                    }}
                >
                    <Text style={{ color: fontColorSelectedTab(0) }}>All</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={[styles.button, { backgroundColor: backgroundSelectedTab(1), width: "32%" }]}
                    underlayColor="#5439A155"
                    onPress={() => {
                        setSelectedTab(1);
                        const tempData = DATA.filter((item) => {
                            if (item.Name === "Sky Coaster - สกายโคสเตอร์") {
                                return item;
                            }
                        });
                        setShowData([...tempData]);
                    }}
                >
                    <Text style={{ color: fontColorSelectedTab(1) }}>Sky Coaster</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={[styles.button, { backgroundColor: backgroundSelectedTab(2), width: "32%" }]}
                    underlayColor="#5439A155"
                    onPress={() => {
                        setSelectedTab(2);
                        const tempData = DATA.filter((item) => {
                            if (item.Name === "Tornado - ทอร์นาโด") {
                                return item;
                            }
                        });
                        setShowData([...tempData]);
                    }}
                >
                    <Text style={{ color: fontColorSelectedTab(2) }}>Tornado</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={[styles.button, { backgroundColor: backgroundSelectedTab(3), width: "30%" }]}
                    underlayColor="#5439A155"
                    onPress={() => {
                        setSelectedTab(3);
                        const tempData = DATA.filter((item) => {
                            if (item.Name === "Super Splash - ซูเปอร์สแปลช") {
                                return item;
                            }
                        });
                        setShowData([...tempData]);
                    }}
                >
                    <Text style={{ color: fontColorSelectedTab(3) }}>Super Splash</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={[styles.button, { backgroundColor: backgroundSelectedTab(4), width: "30%" }]}
                    underlayColor="#5439A155"
                    onPress={() => {
                        setSelectedTab(4);
                        const tempData = DATA.filter((item) => {
                            if (item.Name === "Bump Car - รถบั๊มมหาสนุก") {
                                return item;
                            }
                        });
                        setShowData([...tempData]);
                    }}
                >
                    <Text style={{ color: fontColorSelectedTab(4) }}>Bump Car</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={[styles.button, { backgroundColor: backgroundSelectedTab(5), width: "30%" }]}
                    underlayColor="#5439A155"
                    onPress={() => {
                        setSelectedTab(5);
                        const tempData = DATA.filter((item) => {
                            if (item.Name === "Grand Canyon - แกรนด์แคนยอน") {
                                return item;
                            }
                        });
                        setShowData([...tempData]);
                    }}
                >
                    <Text style={{ color: fontColorSelectedTab(5) }}>Grand Canyon</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={[styles.button, { backgroundColor: backgroundSelectedTab(6), width: "35%" }]}
                    underlayColor="#5439A155"
                    onPress={() => {
                        setSelectedTab(6);
                        const tempData = DATA.filter((item) => {
                            if (item.Name === "Black Hole - แบล็กโฮล") {
                                return item;
                            }
                        });
                        setShowData([...tempData]);
                    }}
                >
                    <Text style={{ color: fontColorSelectedTab(6) }}>Black Hole</Text>
                </TouchableHighlight>
            </View>
            {showData.length > 0 ? (
                <FlatList
                    data={showData}
                    renderItem={({ item }: { item: ItemData }) => {
                        return (
                            <View style={styles.Box}>
                                <View style={{ flexDirection: "column", rowGap: 10 }}>
                                    <Text style={styles.TextInBox}>Fastpass ID: {item.FastpassID}</Text>
                                    <Text style={styles.TextInBox}>{item.Name}</Text>
                                    <Text style={styles.TextInBox}>Time: {item.Time}</Text>
                                </View>

                                <Image style={styles.ImageRide} source={picRide(item.Name)} />
                            </View>
                        );
                    }}
                />
            ) : (
                <Text style={styles.TextNoTicket}>No Ticket</Text>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    head: {
        width: "50%",
        height: 38,
        backgroundColor: "#ffffff",
        borderColor: "#000000",
        borderRadius: 17,
        borderWidth: 1,
        flexDirection: "row",

        alignItems: "center",
        columnGap: 10,
    },
    navigate: {
        flexDirection: "row",
        columnGap: 8,
        rowGap: 15,
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#ffffff",
        borderColor: "#5439A1",
        borderRadius: 17,
        borderWidth: 1,
        height: 36.2,
        justifyContent: "center",
        alignItems: "center",
    },
    TextBotton: {
        color: "#5439A1",
    },
    Box: {
        height: 120,
        width: "90%",
        borderColor: "#000000",
        borderRadius: 17,
        borderWidth: 1,
        justifyContent: "space-between",
        alignSelf: "center",
        alignItems: "center",
        backgroundColor: "#D8C9FF",
        marginTop: 15,
        flexDirection: "row",
    },
    TextInBox: {
        fontWeight: "600",
        marginLeft: 15,
    },
    TextNoTicket: {
        justifyContent: "center",
        alignSelf: "center",
        marginTop: "10%",
        fontSize: 20,
    },
    ImageRide: {
        width: "35%",
        height: "70%",
        alignSelf: "center",
        marginRight: 20,
        borderRadius: 8,
    },
});
export default FastpassScreen;
