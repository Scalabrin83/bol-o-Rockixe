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

const matches = [
{ id:'m049', matchNumber:49, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_a', teamAId:'tcheca',         teamBId:'mexico',         kickoffLocal:'2026-06-25T16:00:00-03:00', stadium:'Estadio BBVA',            city:'Monterrey', country:'México' },
{ id:'m050', matchNumber:50, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_a', teamAId:'coreia_sul',      teamBId:'africa_sul',     kickoffLocal:'2026-06-25T16:00:00-03:00', stadium:'Estadio Akron',           city:'Guadalajara', country:'México' },
{ id:'m051', matchNumber:51, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_b', teamAId:'bosnia',          teamBId:'nova_zelandia',  kickoffLocal:'2026-06-25T19:00:00-03:00', stadium:'BC Place',                city:'Vancouver', country:'Canadá' },
{ id:'m052', matchNumber:52, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_b', teamAId:'arabia_saudita',  teamBId:'canada',         kickoffLocal:'2026-06-25T19:00:00-03:00', stadium:'BMO Field',               city:'Toronto', country:'Canadá' },
{ id:'m053', matchNumber:53, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_c', teamAId:'escocia',         teamBId:'brasil',         kickoffLocal:'2026-06-24T19:00:00-03:00', stadium:'Hard Rock Stadium',       city:'Miami', country:'EUA' },
{ id:'m054', matchNumber:54, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_c', teamAId:'haiti',           teamBId:'marrocos',       kickoffLocal:'2026-06-24T19:00:00-03:00', stadium:'MetLife Stadium',         city:'Nova York/Nova Jersey', country:'EUA' },
{ id:'m055', matchNumber:55, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_d', teamAId:'senegal',         teamBId:'eua',            kickoffLocal:'2026-06-26T19:00:00-03:00', stadium:'SoFi Stadium',            city:'Los Angeles', country:'EUA' },
{ id:'m056', matchNumber:56, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_d', teamAId:'mexico2',         teamBId:'paraguai',       kickoffLocal:'2026-06-26T19:00:00-03:00', stadium:'AT&T Stadium',            city:'Dallas', country:'EUA' },
{ id:'m057', matchNumber:57, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_e', teamAId:'africa_sul2',     teamBId:'espanha',        kickoffLocal:'2026-06-26T22:00:00-03:00', stadium:'Estadio Azteca',          city:'Cidade do México', country:'México' },
{ id:'m058', matchNumber:58, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_e', teamAId:'croacia',         teamBId:'inglaterra',     kickoffLocal:'2026-06-26T22:00:00-03:00', stadium:'Estadio BBVA',            city:'Monterrey', country:'México' },
{ id:'m059', matchNumber:59, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_f', teamAId:'pais_gales',      teamBId:'holanda',        kickoffLocal:'2026-06-27T13:00:00-03:00', stadium:'Rose Bowl',               city:'Los Angeles', country:'EUA' },
{ id:'m060', matchNumber:60, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_f', teamAId:'brasil2',         teamBId:'japao',          kickoffLocal:'2026-06-27T13:00:00-03:00', stadium:'NRG Stadium',             city:'Houston', country:'EUA' },
{ id:'m061', matchNumber:61, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_g', teamAId:'polonia',         teamBId:'argentina',      kickoffLocal:'2026-06-27T17:00:00-03:00', stadium:'MetLife Stadium',         city:'Nova York/Nova Jersey', country:'EUA' },
{ id:'m062', matchNumber:62, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_g', teamAId:'australia',       teamBId:'albania',        kickoffLocal:'2026-06-27T17:00:00-03:00', stadium:'Gillette Stadium',        city:'Boston', country:'EUA' },
{ id:'m063', matchNumber:63, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_h', teamAId:'rumania',         teamBId:'belgica',        kickoffLocal:'2026-06-27T20:00:00-03:00', stadium:'NRG Stadium',             city:'Houston', country:'EUA' },
{ id:'m064', matchNumber:64, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_h', teamAId:'colombia',        teamBId:'egito',          kickoffLocal:'2026-06-27T20:00:00-03:00', stadium:'Levi\'s Stadium',         city:'San Francisco', country:'EUA' },
{ id:'m065', matchNumber:65, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_i', teamAId:'equador',         teamBId:'franca',         kickoffLocal:'2026-06-27T22:00:00-03:00', stadium:'Lincoln Financial Field', city:'Filadélfia', country:'EUA' },
{ id:'m066', matchNumber:66, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_i', teamAId:'nigeria',         teamBId:'italia',         kickoffLocal:'2026-06-27T22:00:00-03:00', stadium:'Empower Field',           city:'Denver', country:'EUA' },
{ id:'m067', matchNumber:67, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_j', teamAId:'costa_rica',      teamBId:'portugal',       kickoffLocal:'2026-06-28T13:00:00-03:00', stadium:'Arrowhead Stadium',       city:'Kansas City', country:'EUA' },
{ id:'m068', matchNumber:68, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_j', teamAId:'iran',            teamBId:'zimbabue',       kickoffLocal:'2026-06-28T13:00:00-03:00', stadium:'Estadio Azteca',          city:'Cidade do México', country:'México' },
{ id:'m069', matchNumber:69, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_k', teamAId:'arabia_saudita2', teamBId:'alemanha',       kickoffLocal:'2026-06-28T17:00:00-03:00', stadium:'Mercedes-Benz Stadium',   city:'Atlanta', country:'EUA' },
{ id:'m070', matchNumber:70, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_k', teamAId:'gana',            teamBId:'turquia',        kickoffLocal:'2026-06-28T17:00:00-03:00', stadium:'Estadio Akron',           city:'Guadalajara', country:'México' },
{ id:'m071', matchNumber:71, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_l', teamAId:'servia',          teamBId:'uruguai',        kickoffLocal:'2026-06-28T20:00:00-03:00', stadium:'Hard Rock Stadium',       city:'Miami', country:'EUA' },
{ id:'m072', matchNumber:72, stageId:'group_stage', roundId:'round_g3', roundName:'Rodada 3', groupId:'group_l', teamAId:'suica',           teamBId:'iraque',         kickoffLocal:'2026-06-28T20:00:00-03:00', stadium:'Lincoln Financial Field', city:'Filadélfia', country:'EUA' },
];

async function seed() {
  console.log('Criando 24 jogos da Rodada 3...');
  for (const m of matches) {
    await setDoc(doc(db, 'matches', m.id), {
      ...m, status: 'scheduled', officialScoreA: null, officialScoreB: null, predictionStatus: 'locked'
    });
  }
  console.log('Rodada 3 concluída!');
  process.exit(0);
}
seed().catch(e => { console.error(e); process.exit(1); });
