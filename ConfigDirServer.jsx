import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from "react-native";

export default function ConfigScreen({ navigation }) {
  const [serverUrl, setServerUrl] = useState("");

  useEffect(() => {
    // Cargar la URL guardada si existe
    AsyncStorage.getItem("server_url").then((url) => {
      if (url) setServerUrl(url);
    });
  }, []);

  const testServerConnection = async (url) => {
    try {
      const response = await fetch(`${url}/api/test/online`);
      if (!response.ok) throw new Error("No se pudo conectar al servidor");
      Alert.alert("Conexión exitosa", "Se pudo conectar al servidor.");
      return true;
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar al servidor. Por favor, verifique la URL e intente nuevamente.");
      return false;
    }
  };

  const saveServerUrl = async () => {
    if (!serverUrl.startsWith("http")) {
      Alert.alert("URL inválida", "Debe comenzar con http:// o https://");
      return;
    }
    const isValid = await testServerConnection(serverUrl);
    if (isValid) {
      await AsyncStorage.setItem("server_url", serverUrl);
      Alert.alert("Guardado", "Dirección del servidor guardada.");
      navigation.replace("Login"); // Redirigir al login después de guardar
    }
    else {
      Alert.alert("Error", "No se pudo conectar al servidor. Por favor, verifique la URL e intente nuevamente.");
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ingrese la dirección del servidor:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: http://10.90.X.X:XXX"
        value={serverUrl}
        onChangeText={setServerUrl}
        autoCapitalize="none"
        keyboardType="url"
      />
        <TouchableOpacity style={styles.button} title="Guardar y continuar" onPress={saveServerUrl} >
        <Text style={styles.text}>Guardar y continuar</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#000" },
  label: { fontSize: 18, marginBottom: 10, color: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    color: "#000",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#fbb034",
    padding: 10,
    borderRadius: 50,
    marginTop: 10,
  },
  text: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
