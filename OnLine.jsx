import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, ActivityIndicator } from "react-native";

const checkServerStatus = async () => {
  const serverUrl = await AsyncStorage.getItem("server_url");
  if (!serverUrl) return false;

  try {
    const response = await fetch(`${serverUrl}/api/test/online`, { method: "GET" });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export default function HomeScreen() {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const online = await checkServerStatus();
      setIsOnline(online);
    }, 5000); // Verifica cada 5 segundos

    return () => clearInterval(interval); // Limpia el intervalo al salir
  }, []);

  if (isOnline === null) {
    return <ActivityIndicator size="large" color="#fff" style={{ position: "absolute", bottom: 20, left: 15 }} />;
  }

  return (
      <View style={{ justifyContent: "center", alignItems: "center", position: "absolute",  bottom: 10, left: 10}}>
      <Text style={{ color: "#fff" }}>{isOnline ? "🟢 Servidor en línea" : "🔴 Servidor desconectado"}</Text>
    </View>
  );
}
