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
{ id:'m025', matchNumber:25, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_a', teamAId:'africa_sul',    teamBId:'tcheca',         kickoffLocal:'2026-06-20T16:00:00-03:00', stadium:'Estadio Azteca',          city:'Cidade do México', country:'México' },
{ id:'m026', matchNumber:26, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_a', teamAId:'mexico',         teamBId:'coreia_sul',     kickoffLocal:'2026-06-20T19:00:00-03:00', stadium:'Estadio Akron',           city:'Guadalajara', country:'México' },
{ id:'m027', matchNumber:27, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_b', teamAId:'arabia_saudita', teamBId:'bosnia',         kickoffLocal:'2026-06-20T22:00:00-03:00', stadium:'Lumen Field',             city:'Seattle', country:'EUA' },
{ id:'m028', matchNumber:28, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_b', teamAId:'canada',         teamBId:'nova_zelandia',  kickoffLocal:'2026-06-21T13:00:00-03:00', stadium:'BMO Field',               city:'Toronto', country:'Canadá' },
{ id:'m029', matchNumber:29, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_c', teamAId:'haiti',          teamBId:'brasil',         kickoffLocal:'2026-06-19T21:30:00-03:00', stadium:'Lincoln Financial Field', city:'Filadélfia', country:'EUA' },
{ id:'m030', matchNumber:30, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_c', teamAId:'marrocos',       teamBId:'escocia',        kickoffLocal:'2026-06-21T17:00:00-03:00', stadium:'MetLife Stadium',         city:'Nova York/Nova Jersey', country:'EUA' },
{ id:'m031', matchNumber:31, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_d', teamAId:'paraguai',       teamBId:'senegal',        kickoffLocal:'2026-06-21T20:00:00-03:00', stadium:'SoFi Stadium',            city:'Los Angeles', country:'EUA' },
{ id:'m032', matchNumber:32, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_d', teamAId:'eua',            teamBId:'mexico2',        kickoffLocal:'2026-06-22T13:00:00-03:00', stadium:'AT&T Stadium',            city:'Dallas', country:'EUA' },
{ id:'m033', matchNumber:33, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_e', teamAId:'croacia',        teamBId:'africa_sul2',    kickoffLocal:'2026-06-22T16:00:00-03:00', stadium:'Estadio BBVA',            city:'Monterrey', country:'México' },
{ id:'m034', matchNumber:34, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_e', teamAId:'espanha',        teamBId:'inglaterra',     kickoffLocal:'2026-06-22T19:00:00-03:00', stadium:'AT&T Stadium',            city:'Dallas', country:'EUA' },
{ id:'m035', matchNumber:35, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_f', teamAId:'japao',          teamBId:'pais_gales',     kickoffLocal:'2026-06-22T22:00:00-03:00', stadium:'Rose Bowl',               city:'Los Angeles', country:'EUA' },
{ id:'m036', matchNumber:36, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_f', teamAId:'holanda',        teamBId:'brasil2',        kickoffLocal:'2026-06-23T13:00:00-03:00', stadium:'NRG Stadium',             city:'Houston', country:'EUA' },
{ id:'m037', matchNumber:37, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_g', teamAId:'albania',        teamBId:'australia',      kickoffLocal:'2026-06-23T17:00:00-03:00', stadium:'Gillette Stadium',        city:'Boston', country:'EUA' },
{ id:'m038', matchNumber:38, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_g', teamAId:'argentina',      teamBId:'polonia',        kickoffLocal:'2026-06-23T20:00:00-03:00', stadium:'MetLife Stadium',         city:'Nova York/Nova Jersey', country:'EUA' },
{ id:'m039', matchNumber:39, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_h', teamAId:'egito',          teamBId:'rumania',        kickoffLocal:'2026-06-24T13:00:00-03:00', stadium:'Levi\'s Stadium',         city:'San Francisco', country:'EUA' },
{ id:'m040', matchNumber:40, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_h', teamAId:'belgica',        teamBId:'colombia',       kickoffLocal:'2026-06-24T17:00:00-03:00', stadium:'NRG Stadium',             city:'Houston', country:'EUA' },
{ id:'m041', matchNumber:41, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_i', teamAId:'nigeria',        teamBId:'equador',        kickoffLocal:'2026-06-24T20:00:00-03:00', stadium:'Empower Field',           city:'Denver', country:'EUA' },
{ id:'m042', matchNumber:42, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_i', teamAId:'franca',         teamBId:'italia',         kickoffLocal:'2026-06-25T13:00:00-03:00', stadium:'Lincoln Financial Field', city:'Filadélfia', country:'EUA' },
{ id:'m043', matchNumber:43, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_j', teamAId:'zimbabue',       teamBId:'costa_rica',     kickoffLocal:'2026-06-25T16:00:00-03:00', stadium:'Estadio Azteca',          city:'Cidade do México', country:'México' },
{ id:'m044', matchNumber:44, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_j', teamAId:'portugal',       teamBId:'iran',           kickoffLocal:'2026-06-25T19:00:00-03:00', stadium:'Arrowhead Stadium',       city:'Kansas City', country:'EUA' },
{ id:'m045', matchNumber:45, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_k', teamAId:'gana',           teamBId:'arabia_saudita2',kickoffLocal:'2026-06-25T22:00:00-03:00', stadium:'Estadio Akron',           city:'Guadalajara', country:'México' },
{ id:'m046', matchNumber:46, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_k', teamAId:'alemanha',       teamBId:'turquia',        kickoffLocal:'2026-06-26T13:00:00-03:00', stadium:'Mercedes-Benz Stadium',   city:'Atlanta', country:'EUA' },
{ id:'m047', matchNumber:47, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_l', teamAId:'iraque',         teamBId:'servia',         kickoffLocal:'2026-06-26T17:00:00-03:00', stadium:'Hard Rock Stadium',       city:'Miami', country:'EUA' },
{ id:'m048', matchNumber:48, stageId:'group_stage', roundId:'round_g2', roundName:'Rodada 2', groupId:'group_l', teamAId:'uruguai',        teamBId:'suica',          kickoffLocal:'2026-06-26T20:00:00-03:00', stadium:'Hard Rock Stadium',       city:'Miami', country:'EUA' },
];

async function seed() {
  console.log('Criando 24 jogos da Rodada 2...');
  for (const m of matches) {
    await setDoc(doc(db, 'matches', m.id), {
      ...m, status: 'scheduled', officialScoreA: null, officialScoreB: null, predictionStatus: 'locked'
    });
  }
  console.log('Rodada 2 concluída!');
  process.exit(0);
}
seed().catch(e => { console.error(e); process.exit(1); });
