import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons"
import { ImageBackground } from "react-native";

const SelectionScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground source={require("./assets/background.jpg")} style={styles.background}>
        <View style={styles.logoutButton}>
          <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace("Login")}>
          <MaterialIcons name="logout" size={28} color="white" />
          <Text style={{color: "white"}}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
    <View style={styles.container}>
      <Text style={styles.title}>Seleccione una opción: </Text>
      <TouchableOpacity
        style={styles.buttonCopy}
        onPress={() => navigation.navigate("BarcodeScanner", { action: "copy" })}
      >
        <MaterialIcons name="copy-all" size={24} color="black" />
        <Text style={styles.buttonText}>
            Copiar Código</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonEntrada}
        onPress={() => navigation.navigate("BarcodeScanner", { action: "entrada" })}
      >
        <MaterialIcons name="add-circle-outline" size={24} color="black" />     
        <Text style={styles.buttonText}>
            Ingresar Producto</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSalida}
        onPress={() => navigation.navigate("BarcodeScanner", { action: "salida" })}
      >
         <MaterialIcons name="remove-circle-outline" size={24} color="black" />
        <Text style={styles.buttonText}>
           
            Salida de Producto</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 10,
    alignContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    height: "50%",
    width: "95%",
    borderWidth: 1,
    borderColor: "#F28123",
  },
  logoutButton: {
    position: "absolute",
    top: 5,
    right: 5,
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 50,
  },
  button: {
    backgroundColor: "#fbb034",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    width: "80%",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "300",
    textAlign: "center",
  },
  buttonCopy: {
    backgroundColor: "#D8E2DC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "80%",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  buttonEntrada: {
    backgroundColor: "#7CE577",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    width: "80%",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  buttonSalida: {
    backgroundColor: "#FF715B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    width: "80%",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
});

export default SelectionScreen;
