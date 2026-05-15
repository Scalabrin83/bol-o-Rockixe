import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
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

const rounds = [
  { id: 'round_g1', name: 'Fase de Grupos - Rodada 1', stageId: 'group_stage', order: 1, predictionStatus: 'locked' },
  { id: 'round_g2', name: 'Fase de Grupos - Rodada 2', stageId: 'group_stage', order: 2, predictionStatus: 'locked' },
  { id: 'round_g3', name: 'Fase de Grupos - Rodada 3', stageId: 'group_stage', order: 3, predictionStatus: 'locked' },
  { id: 'round_32', name: '32-avos de Final', stageId: 'round_of_32', order: 4, predictionStatus: 'locked' },
  { id: 'round_16', name: 'Oitavas de Final', stageId: 'round_of_16', order: 5, predictionStatus: 'locked' },
  { id: 'round_qf', name: 'Quartas de Final', stageId: 'quarterfinals', order: 6, predictionStatus: 'locked' },
  { id: 'round_sf', name: 'Semifinais', stageId: 'semifinals', order: 7, predictionStatus: 'locked' },
  { id: 'round_3rd', name: '3° Lugar', stageId: 'third_place', order: 8, predictionStatus: 'locked' },
  { id: 'round_final', name: 'Final', stageId: 'final', order: 9, predictionStatus: 'locked' },
];

// All 72 group stage matches with BRT times (UTC-3)
// Time zones: Mexico City/Guadalajara/Monterrey = CST (UTC-6) +3h to BRT
//             New York/Boston/Philadelphia/Atlanta/Miami = EDT (UTC-4) +1h
//             Dallas/Houston/Kansas City = CDT (UTC-5) +2h
//             Los Angeles/San Francisco/Seattle/Vancouver = PDT (UTC-7) +4h
//             Toronto = EDT (UTC-4) +1h
//             Denver = MDT (UTC-6) +3h

const matches = [
// ===== RODADA 1 =====
{ id:'m001', matchNumber:1,  stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_a', teamAId:'mexico',     teamBId:'africa_sul',   kickoffLocal:'2026-06-11T16:00:00-03:00', stadium:'Estadio Azteca',              city:'Cidade do México', country:'México' },
{ id:'m002', matchNumber:2,  stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_a', teamAId:'coreia_sul', teamBId:'tcheca',       kickoffLocal:'2026-06-12T00:00:00-03:00', stadium:'Estadio Akron',               city:'Guadalajara', country:'México' },
{ id:'m003', matchNumber:3,  stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_b', teamAId:'canada',     teamBId:'bosnia',       kickoffLocal:'2026-06-12T17:00:00-03:00', stadium:'BMO Field',                   city:'Toronto', country:'Canadá' },
{ id:'m004', matchNumber:4,  stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_d', teamAId:'eua',        teamBId:'paraguai',     kickoffLocal:'2026-06-12T22:00:00-03:00', stadium:'SoFi Stadium',                city:'Los Angeles', country:'EUA' },
{ id:'m005', matchNumber:5,  stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_c', teamAId:'brasil',     teamBId:'marrocos',     kickoffLocal:'2026-06-13T19:00:00-03:00', stadium:'MetLife Stadium',             city:'Nova York/Nova Jersey', country:'EUA' },
{ id:'m006', matchNumber:6,  stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_c', teamAId:'escocia',    teamBId:'haiti',        kickoffLocal:'2026-06-13T22:00:00-03:00', stadium:'AT&T Stadium',                city:'Dallas', country:'EUA' },
{ id:'m007', matchNumber:7,  stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_e', teamAId:'espanha',    teamBId:'africa_sul2',  kickoffLocal:'2026-06-14T16:00:00-03:00', stadium:'Estadio BBVA',                city:'Monterrey', country:'México' },
{ id:'m008', matchNumber:8,  stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_f', teamAId:'holanda',    teamBId:'japao',        kickoffLocal:'2026-06-14T19:00:00-03:00', stadium:'AT&T Stadium',                city:'Dallas', country:'EUA' },
{ id:'m009', matchNumber:9,  stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_g', teamAId:'argentina',  teamBId:'albania',      kickoffLocal:'2026-06-14T22:00:00-03:00', stadium:'MetLife Stadium',             city:'Nova York/Nova Jersey', country:'EUA' },
{ id:'m010', matchNumber:10, stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_b', teamAId:'nova_zelandia',teamBId:'arabia_saudita', kickoffLocal:'2026-06-15T13:00:00-03:00', stadium:'Lumen Field',            city:'Seattle', country:'EUA' },
{ id:'m011', matchNumber:11, stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_h', teamAId:'belgica',    teamBId:'egito',        kickoffLocal:'2026-06-15T17:00:00-03:00', stadium:'Levi\'s Stadium',             city:'San Francisco', country:'EUA' },
{ id:'m012', matchNumber:12, stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_i', teamAId:'franca',     teamBId:'nigeria',      kickoffLocal:'2026-06-15T20:00:00-03:00', stadium:'Lincoln Financial Field',     city:'Filadélfia', country:'EUA' },
{ id:'m013', matchNumber:13, stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_j', teamAId:'portugal',   teamBId:'zimbabue',     kickoffLocal:'2026-06-16T13:00:00-03:00', stadium:'Arrowhead Stadium',           city:'Kansas City', country:'EUA' },
{ id:'m014', matchNumber:14, stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_k', teamAId:'alemanha',   teamBId:'arabia_saudita2', kickoffLocal:'2026-06-16T17:00:00-03:00', stadium:'Mercedes-Benz Stadium',   city:'Atlanta', country:'EUA' },
{ id:'m015', matchNumber:15, stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_l', teamAId:'uruguai',    teamBId:'iraque',       kickoffLocal:'2026-06-16T20:00:00-03:00', stadium:'Hard Rock Stadium',           city:'Miami', country:'EUA' },
{ id:'m016', matchNumber:16, stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_d', teamAId:'mexico2',    teamBId:'senegal',      kickoffLocal:'2026-06-17T13:00:00-03:00', stadium:'BC Place',                    city:'Vancouver', country:'Canadá' },
{ id:'m017', matchNumber:17, stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_e', teamAId:'inglaterra', teamBId:'croacia',      kickoffLocal:'2026-06-17T17:00:00-03:00', stadium:'AT&T Stadium',                city:'Dallas', country:'EUA' },
{ id:'m018', matchNumber:18, stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_f', teamAId:'brasil2',    teamBId:'pais_gales',   kickoffLocal:'2026-06-17T20:00:00-03:00', stadium:'Rose Bowl',                   city:'Los Angeles', country:'EUA' },
{ id:'m019', matchNumber:19, stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_g', teamAId:'australia',  teamBId:'polonia',      kickoffLocal:'2026-06-18T13:00:00-03:00', stadium:'Gillette Stadium',            city:'Boston', country:'EUA' },
{ id:'m020', matchNumber:20, stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_h', teamAId:'colombia',   teamBId:'rumania',      kickoffLocal:'2026-06-18T17:00:00-03:00', stadium:'NRG Stadium',                 city:'Houston', country:'EUA' },
{ id:'m021', matchNumber:21, stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_i', teamAId:'italia',     teamBId:'equador',      kickoffLocal:'2026-06-18T20:00:00-03:00', stadium:'Empower Field',               city:'Denver', country:'EUA' },
{ id:'m022', matchNumber:22, stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_j', teamAId:'iran',       teamBId:'costa_rica',   kickoffLocal:'2026-06-19T13:00:00-03:00', stadium:'Estadio Azteca',              city:'Cidade do México', country:'México' },
{ id:'m023', matchNumber:23, stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_k', teamAId:'turquia',    teamBId:'gana',         kickoffLocal:'2026-06-19T17:00:00-03:00', stadium:'Estadio Akron',               city:'Guadalajara', country:'México' },
{ id:'m024', matchNumber:24, stageId:'group_stage', roundId:'round_g1', roundName:'Rodada 1', groupId:'group_l', teamAId:'suica',      teamBId:'servia',       kickoffLocal:'2026-06-19T21:30:00-03:00', stadium:'Lincoln Financial Field',     city:'Filadélfia', country:'EUA' },
];

async function seed() {
  console.log('Limpando rodadas antigas...');
  const existing = await getDocs(collection(db, 'rounds'));
  for (const d of existing.docs) await deleteDoc(doc(db, 'rounds', d.id));

  console.log('Criando rodadas...');
  for (const r of rounds) await setDoc(doc(db, 'rounds', r.id), r);

  console.log('Limpando jogos antigos...');
  const existingM = await getDocs(collection(db, 'matches'));
  for (const d of existingM.docs) await deleteDoc(doc(db, 'matches', d.id));

  console.log('Criando 24 jogos da Rodada 1...');
  for (const m of matches) {
    await setDoc(doc(db, 'matches', m.id), {
      ...m,
      status: 'scheduled',
      officialScoreA: null,
      officialScoreB: null,
      predictionStatus: 'locked'
    });
  }

  console.log('Seed de rodadas concluído!');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
