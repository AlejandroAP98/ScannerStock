import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./LoginScreen";
import ScannerScreen from "./ScannerScreen";
import ConfigScreen from "./ConfigDirServer";
import SelectionScreen from "./SelectionScreen";
import BarcodeScanner from "./BarcodeScanner";


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined} initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Config" component={ConfigScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Scanner" component={ScannerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Selection" component={SelectionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
