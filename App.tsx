import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import InitialScreen from "./src/screen/InitialScreen";
import HomeScreen from "./src/screen/HomeScreen";
// import TicketScreen from "./src/screen/TicketScreen";
import TicketDetailScreen from "./src/screen/TicketDetailScreen";
import FastpassScreen from "./src/screen/FastpassScreen";
import ScannerScreen from "./src/screen/ScannerScreen";
import ScannerOutScreen from "./src/screen/ScannerOutScreen";
import LoginScreen from "./src/screen/LoginScreen";
import ChangePassword from "./src/screen/ChangePassword";
import QueueScreen from "./src/screen/QueueScreen";
import TotalQueue from "./src/screen/TotalQueue";
import RidesScannerScreen from "./src/screen/RidesScannerScreen";

type AppStackParamList = {
    Initial: undefined;
    Login: undefined;
    Password: undefined;
    Home: undefined;
    Ticket: undefined;
    Fastpass: undefined;
    Scanner: undefined;
    ScannerOut: undefined;
    Queue: undefined;
    Total: undefined;
    Rides: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();

const routes: Array<React.ComponentProps<typeof Stack.Screen>> = [
    {
        name: "Initial",
        component: InitialScreen,
        options: {
            headerShown: false,
        },
    },
    {
        name: "Home",
        component: HomeScreen,
        options: {
            headerShown: false,
        },
    },
    {
        name: "Ticket",
        component: TicketDetailScreen,
        options: {
            headerShown: false,
        },
    },
    {
        name: "Fastpass",
        component: FastpassScreen,
        options: {
            headerShown: false,
        },
    },
    {
        name: "Scanner",
        component: ScannerScreen,
        options: {
            headerShown: false,
        },
    },
    {
        name: "ScannerOut",
        component: ScannerOutScreen,
        options: {
            headerShown: false,
        },
    },
    {
        name: "Queue",
        component: QueueScreen,
        options: {
            headerShown: false,
        },
    },
    {
        name: "Total",
        component: TotalQueue,
        options: {
            headerShown: false,
        },
    },
    {
        name: "Login",
        component: LoginScreen,
        options: {
            headerShown: false,
        },
    },
    {
        name: "Password",
        component: ChangePassword,
        options: {
            headerShown: false,
        },
    },
    {
        name: "Rides",
        component: RidesScannerScreen,
        options: {
            headerShown: false,
        },
    },
];

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Initial">
                {routes.map((routeConfig) => (
                    <Stack.Screen key={routeConfig.name} {...routeConfig} />
                ))}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
