// Importa las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCJJ-bQytIh17XUV34pluS9B66F5cEmFu8",
  authDomain: "appmovilpush.firebaseapp.com",
  projectId: "appmovilpush",
  storageBucket: "appmovilpush.firebasestorage.app",
  messagingSenderId: "1092531814494",
  appId: "1:1092531814494:web:d2ebf32f7727354ade34cf",
  measurementId: "G-Q4BY9LQ05N",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Configura Firebase Messaging
const messaging = getMessaging(app);

// Función para obtener el token FCM
const obtenerTokenFCM = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey:
        "BNQsvMSMKh_mCT6NN1BmmPqvg9DfFYKAB1FDyLt_fPdNIAv1j4DcxXGmk2VrwTu9msSNaV0DKIBAZDsHg4tI8cs",
    });

    if (currentToken) {
      console.log("Token FCM:", currentToken);
      // Envía este token al backend para guardarlo en la base de datos
    } else {
      console.log("No se pudo obtener el token FCM.");
    }
  } catch (error) {
    console.error("Error al obtener el token FCM:", error);
  }
};

// Solicitar permiso para notificaciones y obtener el token FCM
if (typeof window !== "undefined" && "Notification" in window) {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Permiso para notificaciones concedido.");
      obtenerTokenFCM();
    } else {
      console.log("Permiso para notificaciones denegado.");
    }
  });
}

export { messaging };
