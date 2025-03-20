import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./LoginScreen";
import ScannerScreen from "./ScannerScreen";
import ConfigScreen from "./ConfigDirServer";
import SelectionScreen from "./SelectionScreen";
import BarcodeScanner from "./BarcodeScanner";


type RootStackParamList = {
  Login: undefined;
  Scanner: undefined;
  Selection: undefined;
  BarcodeScanner: undefined;
  Config: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Config" component={ConfigScreen}  />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen}  />
        <Stack.Screen name="Selection" component={SelectionScreen} />
        <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
