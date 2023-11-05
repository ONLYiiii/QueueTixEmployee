import type { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

import { MaterialIcons, MaterialCommunityIcons, Feather, Entypo, Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

export const Ticket = ({ size, color }: { size?: number; color?: string | OpaqueColorValue }) => (
    <Entypo name="ticket" size={size} color={color} />
);

export const Scanner = ({ size, color }: { size?: number; color?: string | OpaqueColorValue }) => (
    <MaterialIcons name="qr-code-scanner" size={size} color={color} />
);
export const Ride = ({ size, color }: { size?: number; color?: string | OpaqueColorValue }) => (
    <MaterialCommunityIcons name="ticket" size={size} color={color} />
);
export const Fastpass = ({ size, color }: { size?: number; color?: string | OpaqueColorValue }) => (
    <MaterialCommunityIcons name="run-fast" size={size} color={color} />
);
export const Search = ({ size, color }: { size?: number; color?: string | OpaqueColorValue }) => (
    <Feather name="search" size={size} color={color} />
);
export const Queue = ({ size, color }: { size?: number; color?: string | OpaqueColorValue }) => (
    <MaterialCommunityIcons name="clock-fast" size={size} color={color} />
);
export const Check = ({
    size,
    color,
    style,
}: {
    size?: number;
    color?: string | OpaqueColorValue;
    style?: StyleProp<TextStyle>;
}) => <AntDesign name="checkcircle" size={size} color={color} style={style} />;

export const Cross = ({
    size,
    color,
    style,
}: {
    size?: number;
    color?: string | OpaqueColorValue;
    style?: StyleProp<TextStyle>;
}) => <Entypo name="circle-with-cross" size={size} color={color} style={style} />;

export const Error = ({
    size,
    color,
    style,
}: {
    size?: number;
    color?: string | OpaqueColorValue;
    style?: StyleProp<TextStyle>;
}) => <FontAwesome5 name="exclamation-circle" size={size} color={color} style={style} />;

export const Checkinout = ({
    size,
    color,
    style,
}: {
    size?: number;
    color?: string | OpaqueColorValue;
    style?: StyleProp<TextStyle>;
}) => <Ionicons name="md-exit-outline" size={size} color={color} style={style} />;

export const FAQfire = ({
    size,
    color,
    style,
}: {
    size?: number;
    color?: string | OpaqueColorValue;
    style?: StyleProp<TextStyle>;
}) => <FontAwesome5 name="fire-alt" size={size} color={color} style={style} />;

export const FAQTicket = ({
    size,
    color,
    style,
}: {
    size?: number;
    color?: string | OpaqueColorValue;
    style?: StyleProp<TextStyle>;
}) => <Entypo name="ticket" size={size} color={color} style={style} />;

export const FAQFastpass = ({
    size,
    color,
    style,
}: {
    size?: number;
    color?: string | OpaqueColorValue;
    style?: StyleProp<TextStyle>;
}) => <MaterialCommunityIcons name="human-queue" size={size} color={color} style={style} />;

export const FAQPayment = ({
    size,
    color,
    style,
}: {
    size?: number;
    color?: string | OpaqueColorValue;
    style?: StyleProp<TextStyle>;
}) => <MaterialIcons name="payment" size={size} color={color} style={style} />;

export const up = ({
    size,
    color,
    style,
}: {
    size?: number;
    color?: string | OpaqueColorValue;
    style?: StyleProp<TextStyle>;
}) => <AntDesign name="up" size={size} color={color} style={style} />;
