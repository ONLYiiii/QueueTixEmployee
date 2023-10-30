import { View, Text, StyleSheet, TextInput, FlatList, TouchableHighlight, SafeAreaView, TouchableOpacity } from "react-native";
import type { ColorValue } from "react-native";
import { Ticket, TicketTemplate } from "../interface/ticket";
import React, { useState, useEffect } from "react";
import { Search } from "../components/Icon";
import { useRoute } from "@react-navigation/native";
import { dateFormat, getFullTime } from "../utils/dateFormat";
import ticketList from "../utils/FetchData/ticketList";

const TicketScreen = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [DATA, setData] = useState(TicketTemplate);
    const [showData, setShowData] = useState(TicketTemplate);
    const [search, setSearch] = useState("");
    const TypeColor = (TicketType: string): ColorValue | undefined => {
        switch (TicketType) {
            case "บัตรผ่านประตู":
                return "#F3C95B";
            case "บัตรรวมเครื่องเล่น":
                return "#448ADC";
            case "บัตรดรีมเวิลด์วีซ่า":
                return "#F16B4E";
            case "บัตรซุปเปอร์วีซ่า":
                return "#00AD50";
        }
    };
    const backgroundSelectedTab = (index: number) => {
        if (index === selectedTab) return "#5439A1";
        else return "#ffffff";
    };
    const fontColorSelectedTab = (index: number) => {
        if (index === selectedTab) return "#ffffff";
        else return "#5439A1";
    };
    const route: any = useRoute();
    let ticketId: string = "";
    if (typeof route.params !== "undefined") {
        ticketId = route.params._id;
    }
    // const { _id } = route.params;

    const searchTicketID = (ticketId: string) => {
        const searchTicket = DATA.filter((item) => item._id === ticketId);
        setShowData(searchTicket);
    };

    useEffect(() => {
        ticketList().then((data) => {
            setData(data);
        });
    }, []);

    useEffect(() => setShowData(DATA), [DATA]);

    useEffect(() => setSearch(ticketId), [ticketId]);

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: 50, backgroundColor: "white" }}>
            <View style={{ justifyContent: "center", alignItems: "center", rowGap: 15, marginBottom: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: "500" }}>Tickets</Text>
                <Text>{dateFormat(new Date())}</Text>
                <View style={styles.head}>
                    <View style={{ marginLeft: 10, flexDirection: "row" }}>
                        <TouchableOpacity onPress={() => searchTicketID(search)}>
                            <Search size={20} color="#000000" />
                        </TouchableOpacity>
                        <TextInput
                            style={{ fontSize: 12, color: "#999999", marginLeft: 5 }}
                            placeholder=" Search by Ticket ID"
                            onChangeText={setSearch}
                            value={search}
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
                            if (item.type === "บัตรผ่านประตู") {
                                return item;
                            }
                        });
                        setShowData([...tempData]);
                    }}
                >
                    <Text style={{ color: fontColorSelectedTab(1) }}>บัตรผ่านประตู</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={[styles.button, { backgroundColor: backgroundSelectedTab(2), width: "32%" }]}
                    underlayColor="#5439A155"
                    onPress={() => {
                        setSelectedTab(2);
                        const tempData = DATA.filter((item) => {
                            if (item.type === "บัตรรวมเครื่องเล่น") {
                                return item;
                            }
                        });
                        setShowData([...tempData]);
                    }}
                >
                    <Text style={{ color: fontColorSelectedTab(2) }}>บัตรรวมเครื่องเล่น</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={[styles.button, { backgroundColor: backgroundSelectedTab(3), width: "32%" }]}
                    underlayColor="#5439A155"
                    onPress={() => {
                        setSelectedTab(3);
                        const tempData = DATA.filter((item) => {
                            if (item.type === "บัตรดรีมเวิลด์วีซ่า") {
                                return item;
                            }
                        });
                        setShowData([...tempData]);
                    }}
                >
                    <Text style={{ color: fontColorSelectedTab(3) }}>บัตรดรีมเวิลด์วีซ่า</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={[styles.button, { backgroundColor: backgroundSelectedTab(4), width: "32%" }]}
                    underlayColor="#5439A155"
                    onPress={() => {
                        setSelectedTab(4);
                        const tempData = DATA.filter((item) => {
                            if (item.type === "บัตรซุปเปอร์วีซ่า") {
                                return item;
                            }
                        });
                        setShowData([...tempData]);
                    }}
                >
                    <Text style={{ color: fontColorSelectedTab(4) }}>บัตรซุปเปอร์วีซ่า</Text>
                </TouchableHighlight>
            </View>
            {showData.length > 0 ? (
                <FlatList
                    data={showData}
                    renderItem={({ item }: { item: Ticket }) => {
                        const color = TypeColor(item.type);
                        return (
                            <View style={[styles.Box, { backgroundColor: color, alignSelf: "center", marginTop: 20 }]}>
                                <Text style={styles.TextInBox}>ID Ticket : {item._id}</Text>
                                <Text style={styles.TextInBox}>Email Customer : {item.email}</Text>
                                <Text style={styles.TextInBox}>Type of Ticket: {item.type}</Text>
                                <Text style={styles.TextInBox}>Time Check in: {getFullTime(new Date(item.updated_at))}</Text>
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
        width: "60%",
        height: 38,
        backgroundColor: "#ffffff",
        borderColor: "#000000",
        borderRadius: 17,
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "center",
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
        borderColor: "#5439A1",
        borderRadius: 17,
        borderWidth: 1,
        height: 36.2,
        justifyContent: "center",
        alignItems: "center",
    },
    Box: {
        height: 150,
        width: "90%",
        borderColor: "#000000",
        borderRadius: 17,
        borderWidth: 1,
        justifyContent: "center",
        rowGap: 10,
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
});
export default TicketScreen;
