import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SelectionScreen from "./SelectionScreen";

const ScannerScreen = ({ navigation }: { navigation: any }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Acceso denegado", "Debes iniciar sesión.");
        navigation.replace("Login"); // Redirigir a inicio de sesión
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return <SelectionScreen />;
};

export default ScannerScreen;
