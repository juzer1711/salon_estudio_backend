import * as admin from "firebase-admin";

// 1. Cargamos las credenciales dinámicamente según el entorno
let serviceAccount: admin.ServiceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // En Render: Usamos la variable de entorno
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // En Local: Usamos el require dinámico para que TypeScript no busque el archivo al compilar en producción
  serviceAccount = require("../../serviceAccountKey.json");
}

// 2. Inicializamos Firebase previniendo duplicados
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// 3. Exportamos las herramientas que usa tu app
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

export { db, admin };
export default admin;