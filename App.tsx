import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import InitialScreen from "./src/screen/InitialScreen";
import HomeScreen from "./src/screen/HomeScreen";
import TicketDetailScreen from "./src/screen/TicketDetailScreen";
import ScannerScreen from "./src/screen/ScannerScreen";
import ScannerOutScreen from "./src/screen/ScannerOutScreen";
import LoginScreen from "./src/screen/LoginScreen";
import ChangePassword from "./src/screen/ChangePassword";
import RidesScannerScreen from "./src/screen/RidesScannerScreen";
import FastpassScannerScreen from "./src/screen/FastpassScannerScreen";

type AppStackParamList = {
    Initial: undefined;
    Login: undefined;
    Password: undefined;
    Home: undefined;
    Ticket: undefined;
    Fastpass: undefined;
    Scanner: undefined;
    ScannerOut: undefined;
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
        component: FastpassScannerScreen,
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
        name: "Login",
        component: LoginScreen,
        options: {
            headerShown: false,
            animationTypeForReplace: "pop",
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
