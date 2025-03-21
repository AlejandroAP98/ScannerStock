import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import React from "react";

interface Producto {
  id: number;
  nombre: string;
  cantidad: number;
  id_categoria: number | null;
  id_marca: number | null;
  precio: number;
  id_sala: string;
  codigo: string;
}

interface Movimiento {
  codigo: string; 
  id_producto: number;
  id_sala: string;
  cantidad: number;
  tipo_movimiento: string;
}

export default function BarcodeScanner({ navigation }: { navigation: any }) {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef(null);
  const [scanned, setScanned] = useState(false);
  const [serverUrl, setServerUrl] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [cantidad, setCantidad] = useState("");
  const [codigo, setCodigo] = useState("");
  const [sala, setSala] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [producto, setProducto] = useState<Producto | null>(null);
  const route = useRoute();
  const { action } = route.params as { action: string };

  useEffect(() => {
    const fetch = async () => {
      const sala = await AsyncStorage.getItem("sala");
      const token = await AsyncStorage.getItem("token");
      const url = await AsyncStorage.getItem("server_url");
      setSala(sala || "" );
      setToken(token || "");
      setServerUrl(url || "");
    };
    fetch();
  }, [sala, token ]);



  if (!permission) return null;
  if (!permission.granted) {
    return (
      <View style={{flex:1, backgroundColor:"#000", justifyContent:"center", alignItems:"center"}}>
        <Text style={styles.permissionText}>Se necesita permiso para usar la cámara</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    if (action === "copy") {
      enviarCodigo(data);
    } else {
      setCodigo(data);
      obtenerProducto(data);
    }
  };

  const obtenerProducto = async (codigo: string) => {
    try {
      const url =
        action === "entrada"
          ? `${serverUrl}/api/products/codigo/${codigo}`
          : `${serverUrl}/api/salas_productos/${sala}/${codigo}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) throw new Error("Error al obtener producto");
  
      let data = await response.json();
      if (data.length === 0) {
        Alert.alert("Error", "No se pudo obtener la información del producto con el codigo: " + codigo);
        setScanned(false);
        return;
      }
      // Si la respuesta es un array, tomar el primer elemento
      if (Array.isArray(data) && data.length > 0) {
        data = data[0];
      }
      // Normalizar la respuesta para que ambas estructuras sean iguales
      const productoFormateado: Producto = {
        id: data.id || data.id_producto, // Usar id o id_producto según la API
        nombre: data.nombre || data.nombre_producto, // Usar nombre o nombre_producto
        cantidad: data.cantidad || 0, // Si no viene cantidad, poner 0
        id_categoria: data.id_categoria || null,
        id_marca: data.id_marca || null,
        precio: data.precio || 0,
        id_sala: sala || "",
        codigo: codigo,
      };

      setProducto(productoFormateado);
      setModalVisible(true);
    } catch (error) {
      Alert.alert("Error", "No se pudo obtener la información del producto con el codigo: " + codigo);
      setScanned(false);
    }
  };
  

  const enviarCodigo = async (codigo: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const sala = await AsyncStorage.getItem("sala");
      const response = await fetch(`${serverUrl}/api/scanner/codigos`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ codigo, sala }),
      });

      if (!response.ok) throw new Error("Error al enviar código");
      Alert.alert("Código enviado ✅", "Se ha enviado correctamente al sistema.");
    } catch (error) {
      Alert.alert("Error ❌", "No se pudo enviar el código.");
    }

    setTimeout(() => setScanned(false), 2000);
  };

  const manejarMovimiento = async () => {
    try {

      const token = await AsyncStorage.getItem("token"); 
      const movimiento: Movimiento = {
        codigo: codigo,
        id_producto: producto?.id || 0,
        id_sala : sala || "",
        cantidad: parseInt(cantidad, 10),
        tipo_movimiento: action === "entrada" ? "ingreso" : "salida",
      };
      const url = action === "entrada" ? `${serverUrl}/api/movimientos/entrada-barcode` : `${serverUrl}/api/movimientos/salida-barcode`;
      const response = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(movimiento),
      });
      if (!response.ok) throw new Error("Error al registrar movimiento");
      Alert.alert("Confirmado ✅", "Movimiento registrado correctamente");
      setCodigo("");
      setCantidad("");
      setProducto(null);
    } catch (error) {
      Alert.alert("Error ❌", "No se pudo registrar el movimiento.");
    }
      cerrarModal();
  };
 
  const cerrarModal = () => {
    setModalVisible(false);
    setScanned(false);
    setCantidad("");
    setProducto(null);
  }

  const formatearPrecio = (precio: number | null) => {
    if (precio !== null) {
      const precioSinDecimales = Math.floor(precio);
      return precioSinDecimales.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    } else {
      return 'No disponible';
    }
  };
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}>
        <View style={styles.overlay}></View>
      </CameraView>
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {producto && (
                <> 
                  <Text style={styles.modalText}>Producto: {producto?.nombre}</Text>
                  {action === "salida" && (
                    <Text style={styles.modalText}>Stock: {producto?.cantidad}</Text>
                  )}
                  {action === "entrada" && (
                      <Text style={styles.modalText}>Precio: {formatearPrecio(producto?.precio)}</Text>
                  )}
                  <Text style={styles.modalText}>Codigo: {codigo}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ingrese cantidad..."
                    keyboardType="numeric"
                    value={cantidad}
                    onChangeText={setCantidad}
                  />
                  <TouchableOpacity style={styles.button} onPress={manejarMovimiento}>
                    <Text style={styles.buttonText}>Confirmar {action}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonCancel} onPress={cerrarModal}>
                    <Text style={styles.buttonTextCancel}>Cancelar</Text>
                  </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
        <Text style={styles.helpText}>Enfoque el código del producto</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1, alignItems: "center", justifyContent: "center" },
  overlay: { position: "absolute", top: "35%", width: 300, height: 250, borderWidth: 4, borderStyle: "dashed", borderColor: "#fff", borderRadius: 10 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" },
  modalContent: { backgroundColor: "white", justifyContent: "center", padding: 20, borderRadius: 10 , textAlign: "center", gap: 10, width: "80%", height: "50%", },
  modalText: { fontSize: 18, marginBottom: 0, textAlign: "left", fontWeight: "bold"},
  input: { 
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    textAlign: "center",
  },
  button: { backgroundColor: "#fbb034",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    textAlign: "center",
  },
  buttonCancel: { backgroundColor: "red", padding: 10, borderRadius: 5, marginTop: 10 },
  buttonText: { color: "#000", fontSize: 16, fontWeight: "bold", textAlign: "center", },
  buttonTextCancel: { color: "#fff", fontSize: 16, fontWeight: "bold", textAlign: "center", },
  backButton: { position: "absolute", top: 50,left: 10, backgroundColor: "#fff", padding: 10, borderRadius: 50 },
  permissionText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  helpText: { color: "#000", fontSize: 16, fontWeight: "bold", textAlign: "center", backgroundColor: "rgba(255,255,255,0.5)" },
});
