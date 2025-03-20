import React, { useState } from "react";
import { View, TextInput, Alert, Text, ImageBackground, Image, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnLine from "./OnLine";
import { MaterialIcons } from "@expo/vector-icons";
const LoginScreen = ({ navigation }) => {

  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  
  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.1.11:3000/api/users/login", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, contrasena }),
      });   
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error en el inicio de sesión");
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("sala", data.sala.toString()); 
      Alert.alert("Inicio de sesión exitoso");
      navigation.navigate("Scanner"); // Redirigir a la pantalla del escáner
    } catch (error) {
      Alert.alert("Error al iniciar sesión de usuario");
    }
  };

  return (
    <ImageBackground source={require("./assets/background.jpg")} style={styles.background}>
      <View style={styles.container}>
      <OnLine />
        <TouchableOpacity style={styles.buttonConfig} onPress={() => navigation.navigate("Config")}>
          <MaterialIcons name="settings" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.card}>
          <Image source={require("./assets/logo.jpg")} style={styles.logo} />
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de usuario o email"
              placeholderTextColor="#aaa"
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              autoCorrect={false}
              autoFocus={true}
              returnKeyType="next"
              onSubmitEditing={() => {
                const nextInput = document.getElementById("contrasena");
                if (nextInput) {
                  nextInput.focus();
                }
              }}
              
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese su contraseña"
              placeholderTextColor="#aaa"
              value={contrasena}
              onChangeText={setContrasena}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "rgba(241, 236, 160, 0.95)",
    padding: 20,
    borderRadius: 15,
    width: "85%",
    alignItems: "center",
  },
  logo: {
    width: 250,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#fbb034",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonConfig: {
    position: "absolute",
    top: 30,
    left: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 50,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LoginScreen;
