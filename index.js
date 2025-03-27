// 
// Autor: Alejandro Álvarez Patiño
// https://github.com/AlejandroAP98
// Fecha: 2025-27-03
// Descrpción: Aplicación andorid, complemento para el sistema de inventairo de productos.
// Proyecto: ScannerStock


import "react-native-gesture-handler";
import { registerRootComponent } from 'expo';
import App from './App.tsx';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App)
