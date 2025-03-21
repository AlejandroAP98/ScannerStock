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
      <Stack.Navigator initialRouteName="Login" 
        screenOptions={{
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 20, fontWeight: 'bold', color: 'black' },
          headerStyle: { backgroundColor: '#FCE762', height: 80}, 
        }}>
        <Stack.Screen name="Config" component={ConfigScreen} options={{title: 'Configuración' }}  />
        <Stack.Screen name="Login" component={LoginScreen} options={{title: 'Inicio de sesión', headerLeft:()=>null }}  />
        <Stack.Screen name="Scanner" component={ScannerScreen} options={{title: 'Acciones'}} />
        <Stack.Screen name="Selection" component={SelectionScreen}  />
        <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} options={{title: 'Escaner de código'}}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
