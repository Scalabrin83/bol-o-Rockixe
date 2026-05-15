import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import dotenv from 'dotenv';
dotenv.config();

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
});
const db = getFirestore(app);

const teams = [
  { id:'africa_sul', name:'África do Sul', groupId:'group_a', flagUrl:'' },
  { id:'tcheca', name:'Tchéquia', groupId:'group_a', flagUrl:'' },
  { id:'bosnia', name:'Bósnia e Herzegovina', groupId:'group_b', flagUrl:'' },
  { id:'escocia', name:'Escócia', groupId:'group_c', flagUrl:'' },
  { id:'haiti', name:'Haiti', groupId:'group_c', flagUrl:'' },
  { id:'africa_sul2', name:'TBD (Grupo E)', groupId:'group_e', flagUrl:'' },
  { id:'albania', name:'Albânia', groupId:'group_g', flagUrl:'' },
  { id:'pais_gales', name:'País de Gales', groupId:'group_f', flagUrl:'' },
  { id:'brasil2', name:'TBD (Grupo F)', groupId:'group_f', flagUrl:'' },
  { id:'mexico2', name:'TBD (Grupo D)', groupId:'group_d', flagUrl:'' },
  { id:'rumania', name:'Romênia', groupId:'group_h', flagUrl:'' },
  { id:'zimbabue', name:'Zimbábue', groupId:'group_j', flagUrl:'' },
  { id:'iran', name:'Irã', groupId:'group_j', flagUrl:'' },
  { id:'iraque', name:'Iraque', groupId:'group_l', flagUrl:'' },
  { id:'turquia', name:'Turquia', groupId:'group_k', flagUrl:'' },
  { id:'gana', name:'Gana', groupId:'group_k', flagUrl:'' },
  { id:'arabia_saudita2', name:'TBD (Grupo K)', groupId:'group_k', flagUrl:'' },
  { id:'australia', name:'Austrália', groupId:'group_g', flagUrl:'' },
  { id:'polonia', name:'Polônia', groupId:'group_g', flagUrl:'' },
  { id:'costa_rica', name:'Costa Rica', groupId:'group_j', flagUrl:'' },
];

async function seed() {
  console.log('Adicionando times reais da Copa 2026...');
  for (const t of teams) {
    await setDoc(doc(db, 'teams', t.id), t);
  }
  console.log('Times adicionados!');
  process.exit(0);
}
seed().catch(e => { console.error(e); process.exit(1); });
