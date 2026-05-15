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

// 72 jogos da fase de grupos com datas/horários BRT e estádios.
// teamAId e teamBId = null para o admin escolher.
const matches = [
// ===== RODADA 1 (11-19 jun) =====
{id:'m001',n:1,  roundId:'round_g1',g:'group_a',t:'2026-06-11T16:00:00-03:00',s:'Estadio Azteca',c:'Cidade do México'},
{id:'m002',n:2,  roundId:'round_g1',g:'group_a',t:'2026-06-12T00:00:00-03:00',s:'Estadio Akron',c:'Guadalajara'},
{id:'m003',n:3,  roundId:'round_g1',g:'group_b',t:'2026-06-12T17:00:00-03:00',s:'BMO Field',c:'Toronto'},
{id:'m004',n:4,  roundId:'round_g1',g:'group_d',t:'2026-06-12T22:00:00-03:00',s:'SoFi Stadium',c:'Los Angeles'},
{id:'m005',n:5,  roundId:'round_g1',g:'group_c',t:'2026-06-13T19:00:00-03:00',s:'MetLife Stadium',c:'Nova York/Nova Jersey'},
{id:'m006',n:6,  roundId:'round_g1',g:'group_c',t:'2026-06-13T22:00:00-03:00',s:'AT&T Stadium',c:'Dallas'},
{id:'m007',n:7,  roundId:'round_g1',g:'group_e',t:'2026-06-14T16:00:00-03:00',s:'Estadio BBVA',c:'Monterrey'},
{id:'m008',n:8,  roundId:'round_g1',g:'group_f',t:'2026-06-14T19:00:00-03:00',s:'AT&T Stadium',c:'Dallas'},
{id:'m009',n:9,  roundId:'round_g1',g:'group_g',t:'2026-06-14T22:00:00-03:00',s:'MetLife Stadium',c:'Nova York/Nova Jersey'},
{id:'m010',n:10, roundId:'round_g1',g:'group_b',t:'2026-06-15T13:00:00-03:00',s:'Lumen Field',c:'Seattle'},
{id:'m011',n:11, roundId:'round_g1',g:'group_h',t:'2026-06-15T17:00:00-03:00',s:'Levi\'s Stadium',c:'San Francisco'},
{id:'m012',n:12, roundId:'round_g1',g:'group_i',t:'2026-06-15T20:00:00-03:00',s:'Lincoln Financial Field',c:'Filadélfia'},
{id:'m013',n:13, roundId:'round_g1',g:'group_j',t:'2026-06-16T13:00:00-03:00',s:'Arrowhead Stadium',c:'Kansas City'},
{id:'m014',n:14, roundId:'round_g1',g:'group_k',t:'2026-06-16T17:00:00-03:00',s:'Mercedes-Benz Stadium',c:'Atlanta'},
{id:'m015',n:15, roundId:'round_g1',g:'group_l',t:'2026-06-16T20:00:00-03:00',s:'Hard Rock Stadium',c:'Miami'},
{id:'m016',n:16, roundId:'round_g1',g:'group_d',t:'2026-06-17T13:00:00-03:00',s:'BC Place',c:'Vancouver'},
{id:'m017',n:17, roundId:'round_g1',g:'group_e',t:'2026-06-17T17:00:00-03:00',s:'AT&T Stadium',c:'Dallas'},
{id:'m018',n:18, roundId:'round_g1',g:'group_f',t:'2026-06-17T20:00:00-03:00',s:'Rose Bowl',c:'Los Angeles'},
{id:'m019',n:19, roundId:'round_g1',g:'group_g',t:'2026-06-18T13:00:00-03:00',s:'Gillette Stadium',c:'Boston'},
{id:'m020',n:20, roundId:'round_g1',g:'group_h',t:'2026-06-18T17:00:00-03:00',s:'NRG Stadium',c:'Houston'},
{id:'m021',n:21, roundId:'round_g1',g:'group_i',t:'2026-06-18T20:00:00-03:00',s:'Empower Field',c:'Denver'},
{id:'m022',n:22, roundId:'round_g1',g:'group_j',t:'2026-06-19T13:00:00-03:00',s:'Estadio Azteca',c:'Cidade do México'},
{id:'m023',n:23, roundId:'round_g1',g:'group_k',t:'2026-06-19T17:00:00-03:00',s:'Estadio Akron',c:'Guadalajara'},
{id:'m024',n:24, roundId:'round_g1',g:'group_l',t:'2026-06-19T21:30:00-03:00',s:'Lincoln Financial Field',c:'Filadélfia'},
// ===== RODADA 2 (20-26 jun) =====
{id:'m025',n:25, roundId:'round_g2',g:'group_a',t:'2026-06-20T16:00:00-03:00',s:'Estadio Azteca',c:'Cidade do México'},
{id:'m026',n:26, roundId:'round_g2',g:'group_a',t:'2026-06-20T19:00:00-03:00',s:'Estadio Akron',c:'Guadalajara'},
{id:'m027',n:27, roundId:'round_g2',g:'group_b',t:'2026-06-20T22:00:00-03:00',s:'Lumen Field',c:'Seattle'},
{id:'m028',n:28, roundId:'round_g2',g:'group_b',t:'2026-06-21T13:00:00-03:00',s:'BMO Field',c:'Toronto'},
{id:'m029',n:29, roundId:'round_g2',g:'group_c',t:'2026-06-19T21:30:00-03:00',s:'Lincoln Financial Field',c:'Filadélfia'},
{id:'m030',n:30, roundId:'round_g2',g:'group_c',t:'2026-06-21T17:00:00-03:00',s:'MetLife Stadium',c:'Nova York/Nova Jersey'},
{id:'m031',n:31, roundId:'round_g2',g:'group_d',t:'2026-06-21T20:00:00-03:00',s:'SoFi Stadium',c:'Los Angeles'},
{id:'m032',n:32, roundId:'round_g2',g:'group_d',t:'2026-06-22T13:00:00-03:00',s:'AT&T Stadium',c:'Dallas'},
{id:'m033',n:33, roundId:'round_g2',g:'group_e',t:'2026-06-22T16:00:00-03:00',s:'Estadio BBVA',c:'Monterrey'},
{id:'m034',n:34, roundId:'round_g2',g:'group_e',t:'2026-06-22T19:00:00-03:00',s:'AT&T Stadium',c:'Dallas'},
{id:'m035',n:35, roundId:'round_g2',g:'group_f',t:'2026-06-22T22:00:00-03:00',s:'Rose Bowl',c:'Los Angeles'},
{id:'m036',n:36, roundId:'round_g2',g:'group_f',t:'2026-06-23T13:00:00-03:00',s:'NRG Stadium',c:'Houston'},
{id:'m037',n:37, roundId:'round_g2',g:'group_g',t:'2026-06-23T17:00:00-03:00',s:'Gillette Stadium',c:'Boston'},
{id:'m038',n:38, roundId:'round_g2',g:'group_g',t:'2026-06-23T20:00:00-03:00',s:'MetLife Stadium',c:'Nova York/Nova Jersey'},
{id:'m039',n:39, roundId:'round_g2',g:'group_h',t:'2026-06-24T13:00:00-03:00',s:'Levi\'s Stadium',c:'San Francisco'},
{id:'m040',n:40, roundId:'round_g2',g:'group_h',t:'2026-06-24T17:00:00-03:00',s:'NRG Stadium',c:'Houston'},
{id:'m041',n:41, roundId:'round_g2',g:'group_i',t:'2026-06-24T20:00:00-03:00',s:'Empower Field',c:'Denver'},
{id:'m042',n:42, roundId:'round_g2',g:'group_i',t:'2026-06-25T13:00:00-03:00',s:'Lincoln Financial Field',c:'Filadélfia'},
{id:'m043',n:43, roundId:'round_g2',g:'group_j',t:'2026-06-25T16:00:00-03:00',s:'Estadio Azteca',c:'Cidade do México'},
{id:'m044',n:44, roundId:'round_g2',g:'group_j',t:'2026-06-25T19:00:00-03:00',s:'Arrowhead Stadium',c:'Kansas City'},
{id:'m045',n:45, roundId:'round_g2',g:'group_k',t:'2026-06-25T22:00:00-03:00',s:'Estadio Akron',c:'Guadalajara'},
{id:'m046',n:46, roundId:'round_g2',g:'group_k',t:'2026-06-26T13:00:00-03:00',s:'Mercedes-Benz Stadium',c:'Atlanta'},
{id:'m047',n:47, roundId:'round_g2',g:'group_l',t:'2026-06-26T17:00:00-03:00',s:'Hard Rock Stadium',c:'Miami'},
{id:'m048',n:48, roundId:'round_g2',g:'group_l',t:'2026-06-26T20:00:00-03:00',s:'Hard Rock Stadium',c:'Miami'},
// ===== RODADA 3 (25-28 jun) =====
{id:'m049',n:49, roundId:'round_g3',g:'group_a',t:'2026-06-25T16:00:00-03:00',s:'Estadio BBVA',c:'Monterrey'},
{id:'m050',n:50, roundId:'round_g3',g:'group_a',t:'2026-06-25T16:00:00-03:00',s:'Estadio Akron',c:'Guadalajara'},
{id:'m051',n:51, roundId:'round_g3',g:'group_b',t:'2026-06-25T19:00:00-03:00',s:'BC Place',c:'Vancouver'},
{id:'m052',n:52, roundId:'round_g3',g:'group_b',t:'2026-06-25T19:00:00-03:00',s:'BMO Field',c:'Toronto'},
{id:'m053',n:53, roundId:'round_g3',g:'group_c',t:'2026-06-24T19:00:00-03:00',s:'Hard Rock Stadium',c:'Miami'},
{id:'m054',n:54, roundId:'round_g3',g:'group_c',t:'2026-06-24T19:00:00-03:00',s:'MetLife Stadium',c:'Nova York/Nova Jersey'},
{id:'m055',n:55, roundId:'round_g3',g:'group_d',t:'2026-06-26T19:00:00-03:00',s:'SoFi Stadium',c:'Los Angeles'},
{id:'m056',n:56, roundId:'round_g3',g:'group_d',t:'2026-06-26T19:00:00-03:00',s:'AT&T Stadium',c:'Dallas'},
{id:'m057',n:57, roundId:'round_g3',g:'group_e',t:'2026-06-26T22:00:00-03:00',s:'Estadio Azteca',c:'Cidade do México'},
{id:'m058',n:58, roundId:'round_g3',g:'group_e',t:'2026-06-26T22:00:00-03:00',s:'Estadio BBVA',c:'Monterrey'},
{id:'m059',n:59, roundId:'round_g3',g:'group_f',t:'2026-06-27T13:00:00-03:00',s:'Rose Bowl',c:'Los Angeles'},
{id:'m060',n:60, roundId:'round_g3',g:'group_f',t:'2026-06-27T13:00:00-03:00',s:'NRG Stadium',c:'Houston'},
{id:'m061',n:61, roundId:'round_g3',g:'group_g',t:'2026-06-27T17:00:00-03:00',s:'MetLife Stadium',c:'Nova York/Nova Jersey'},
{id:'m062',n:62, roundId:'round_g3',g:'group_g',t:'2026-06-27T17:00:00-03:00',s:'Gillette Stadium',c:'Boston'},
{id:'m063',n:63, roundId:'round_g3',g:'group_h',t:'2026-06-27T20:00:00-03:00',s:'NRG Stadium',c:'Houston'},
{id:'m064',n:64, roundId:'round_g3',g:'group_h',t:'2026-06-27T20:00:00-03:00',s:'Levi\'s Stadium',c:'San Francisco'},
{id:'m065',n:65, roundId:'round_g3',g:'group_i',t:'2026-06-27T22:00:00-03:00',s:'Lincoln Financial Field',c:'Filadélfia'},
{id:'m066',n:66, roundId:'round_g3',g:'group_i',t:'2026-06-27T22:00:00-03:00',s:'Empower Field',c:'Denver'},
{id:'m067',n:67, roundId:'round_g3',g:'group_j',t:'2026-06-28T13:00:00-03:00',s:'Arrowhead Stadium',c:'Kansas City'},
{id:'m068',n:68, roundId:'round_g3',g:'group_j',t:'2026-06-28T13:00:00-03:00',s:'Estadio Azteca',c:'Cidade do México'},
{id:'m069',n:69, roundId:'round_g3',g:'group_k',t:'2026-06-28T17:00:00-03:00',s:'Mercedes-Benz Stadium',c:'Atlanta'},
{id:'m070',n:70, roundId:'round_g3',g:'group_k',t:'2026-06-28T17:00:00-03:00',s:'Estadio Akron',c:'Guadalajara'},
{id:'m071',n:71, roundId:'round_g3',g:'group_l',t:'2026-06-28T20:00:00-03:00',s:'Hard Rock Stadium',c:'Miami'},
{id:'m072',n:72, roundId:'round_g3',g:'group_l',t:'2026-06-28T20:00:00-03:00',s:'Lincoln Financial Field',c:'Filadélfia'},
];

async function seed() {
  // Limpa jogos existentes
  console.log('Limpando todos os jogos antigos...');
  const existing = await getDocs(collection(db, 'matches'));
  for (const d of existing.docs) await deleteDoc(doc(db, 'matches', d.id));

  console.log('Criando 72 jogos da fase de grupos (sem times, para o admin escolher)...');
  for (const m of matches) {
    await setDoc(doc(db, 'matches', m.id), {
      id: m.id,
      matchNumber: m.n,
      stageId: 'group_stage',
      roundId: m.roundId,
      roundName: m.roundId === 'round_g1' ? 'Rodada 1' : m.roundId === 'round_g2' ? 'Rodada 2' : 'Rodada 3',
      groupId: m.g,
      teamAId: null,
      teamBId: null,
      kickoffLocal: m.t,
      stadium: m.s,
      city: m.c,
      status: 'scheduled',
      officialScoreA: null,
      officialScoreB: null,
      predictionStatus: 'locked'
    });
  }
  console.log('Fase de grupos concluída!');
  process.exit(0);
}
seed().catch(e => { console.error(e); process.exit(1); });
