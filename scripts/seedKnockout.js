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

// 32-avos de final: 28 jun - 3 jul (16 jogos)
// Oitavas: 4-7 jul (8 jogos)
// Quartas: 9-11 jul (4 jogos)
// Semis: 14-15 jul (2 jogos)
// 3o lugar: 18 jul
// Final: 19 jul
const matches = [
  // ===== 32-AVOS DE FINAL (16 jogos) =====
  { id:'m073', matchNumber:73, stageId:'round_of_32', roundId:'round_32', roundName:'32-avos', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-06-28T17:00:00-03:00', stadium:'MetLife Stadium', city:'Nova York/Nova Jersey', country:'EUA' },
  { id:'m074', matchNumber:74, stageId:'round_of_32', roundId:'round_32', roundName:'32-avos', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-06-28T21:00:00-03:00', stadium:'AT&T Stadium', city:'Dallas', country:'EUA' },
  { id:'m075', matchNumber:75, stageId:'round_of_32', roundId:'round_32', roundName:'32-avos', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-06-29T13:00:00-03:00', stadium:'Estadio Azteca', city:'Cidade do México', country:'México' },
  { id:'m076', matchNumber:76, stageId:'round_of_32', roundId:'round_32', roundName:'32-avos', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-06-29T17:00:00-03:00', stadium:'SoFi Stadium', city:'Los Angeles', country:'EUA' },
  { id:'m077', matchNumber:77, stageId:'round_of_32', roundId:'round_32', roundName:'32-avos', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-06-29T21:00:00-03:00', stadium:'NRG Stadium', city:'Houston', country:'EUA' },
  { id:'m078', matchNumber:78, stageId:'round_of_32', roundId:'round_32', roundName:'32-avos', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-06-30T13:00:00-03:00', stadium:'Mercedes-Benz Stadium', city:'Atlanta', country:'EUA' },
  { id:'m079', matchNumber:79, stageId:'round_of_32', roundId:'round_32', roundName:'32-avos', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-06-30T17:00:00-03:00', stadium:'Hard Rock Stadium', city:'Miami', country:'EUA' },
  { id:'m080', matchNumber:80, stageId:'round_of_32', roundId:'round_32', roundName:'32-avos', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-06-30T21:00:00-03:00', stadium:'Gillette Stadium', city:'Boston', country:'EUA' },
  { id:'m081', matchNumber:81, stageId:'round_of_32', roundId:'round_32', roundName:'32-avos', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-01T13:00:00-03:00', stadium:'Lincoln Financial Field', city:'Filadélfia', country:'EUA' },
  { id:'m082', matchNumber:82, stageId:'round_of_32', roundId:'round_32', roundName:'32-avos', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-01T17:00:00-03:00', stadium:'Arrowhead Stadium', city:'Kansas City', country:'EUA' },
  { id:'m083', matchNumber:83, stageId:'round_of_32', roundId:'round_32', roundName:'32-avos', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-01T21:00:00-03:00', stadium:'Lumen Field', city:'Seattle', country:'EUA' },
  { id:'m084', matchNumber:84, stageId:'round_of_32', roundId:'round_32', roundName:'32-avos', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-02T13:00:00-03:00', stadium:'BMO Field', city:'Toronto', country:'Canadá' },
  { id:'m085', matchNumber:85, stageId:'round_of_32', roundId:'round_32', roundName:'32-avos', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-02T17:00:00-03:00', stadium:'Estadio Akron', city:'Guadalajara', country:'México' },
  { id:'m086', matchNumber:86, stageId:'round_of_32', roundId:'round_32', roundName:'32-avos', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-02T21:00:00-03:00', stadium:'Empower Field', city:'Denver', country:'EUA' },
  { id:'m087', matchNumber:87, stageId:'round_of_32', roundId:'round_32', roundName:'32-avos', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-03T17:00:00-03:00', stadium:'Levi\'s Stadium', city:'San Francisco', country:'EUA' },
  { id:'m088', matchNumber:88, stageId:'round_of_32', roundId:'round_32', roundName:'32-avos', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-03T21:00:00-03:00', stadium:'BC Place', city:'Vancouver', country:'Canadá' },

  // ===== OITAVAS DE FINAL (8 jogos) =====
  { id:'m089', matchNumber:89, stageId:'round_of_16', roundId:'round_16', roundName:'Oitavas', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-04T17:00:00-03:00', stadium:'MetLife Stadium', city:'Nova York/Nova Jersey', country:'EUA' },
  { id:'m090', matchNumber:90, stageId:'round_of_16', roundId:'round_16', roundName:'Oitavas', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-04T21:00:00-03:00', stadium:'AT&T Stadium', city:'Dallas', country:'EUA' },
  { id:'m091', matchNumber:91, stageId:'round_of_16', roundId:'round_16', roundName:'Oitavas', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-05T17:00:00-03:00', stadium:'SoFi Stadium', city:'Los Angeles', country:'EUA' },
  { id:'m092', matchNumber:92, stageId:'round_of_16', roundId:'round_16', roundName:'Oitavas', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-05T21:00:00-03:00', stadium:'NRG Stadium', city:'Houston', country:'EUA' },
  { id:'m093', matchNumber:93, stageId:'round_of_16', roundId:'round_16', roundName:'Oitavas', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-06T17:00:00-03:00', stadium:'Hard Rock Stadium', city:'Miami', country:'EUA' },
  { id:'m094', matchNumber:94, stageId:'round_of_16', roundId:'round_16', roundName:'Oitavas', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-06T21:00:00-03:00', stadium:'Mercedes-Benz Stadium', city:'Atlanta', country:'EUA' },
  { id:'m095', matchNumber:95, stageId:'round_of_16', roundId:'round_16', roundName:'Oitavas', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-07T17:00:00-03:00', stadium:'Lincoln Financial Field', city:'Filadélfia', country:'EUA' },
  { id:'m096', matchNumber:96, stageId:'round_of_16', roundId:'round_16', roundName:'Oitavas', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-07T21:00:00-03:00', stadium:'Gillette Stadium', city:'Boston', country:'EUA' },

  // ===== QUARTAS DE FINAL (4 jogos) =====
  { id:'m097', matchNumber:97, stageId:'quarterfinals', roundId:'round_qf', roundName:'Quartas', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-09T21:00:00-03:00', stadium:'SoFi Stadium', city:'Los Angeles', country:'EUA' },
  { id:'m098', matchNumber:98, stageId:'quarterfinals', roundId:'round_qf', roundName:'Quartas', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-10T17:00:00-03:00', stadium:'MetLife Stadium', city:'Nova York/Nova Jersey', country:'EUA' },
  { id:'m099', matchNumber:99, stageId:'quarterfinals', roundId:'round_qf', roundName:'Quartas', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-10T21:00:00-03:00', stadium:'NRG Stadium', city:'Houston', country:'EUA' },
  { id:'m100', matchNumber:100, stageId:'quarterfinals', roundId:'round_qf', roundName:'Quartas', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-11T21:00:00-03:00', stadium:'AT&T Stadium', city:'Dallas', country:'EUA' },

  // ===== SEMIFINAIS (2 jogos) =====
  { id:'m101', matchNumber:101, stageId:'semifinals', roundId:'round_sf', roundName:'Semifinal', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-14T21:00:00-03:00', stadium:'MetLife Stadium', city:'Nova York/Nova Jersey', country:'EUA' },
  { id:'m102', matchNumber:102, stageId:'semifinals', roundId:'round_sf', roundName:'Semifinal', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-15T21:00:00-03:00', stadium:'AT&T Stadium', city:'Dallas', country:'EUA' },

  // ===== 3º LUGAR =====
  { id:'m103', matchNumber:103, stageId:'third_place', roundId:'round_3rd', roundName:'3º Lugar', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-18T17:00:00-03:00', stadium:'Hard Rock Stadium', city:'Miami', country:'EUA' },

  // ===== FINAL =====
  { id:'m104', matchNumber:104, stageId:'final', roundId:'round_final', roundName:'Final', groupId:null, teamAId:null, teamBId:null, kickoffLocal:'2026-07-19T17:00:00-03:00', stadium:'MetLife Stadium', city:'Nova York/Nova Jersey', country:'EUA' },
];

async function seed() {
  console.log('Criando 32 jogos do mata-mata...');
  for (const m of matches) {
    await setDoc(doc(db, 'matches', m.id), {
      ...m, status: 'scheduled', officialScoreA: null, officialScoreB: null, predictionStatus: 'locked'
    });
  }
  console.log('Mata-mata concluído! (32-avos até Final)');
  process.exit(0);
}
seed().catch(e => { console.error(e); process.exit(1); });
