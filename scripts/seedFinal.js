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

// ========== GRUPOS OFICIAIS FIFA 2026 ==========
const teams = [
  // Grupo A
  {id:'mexico',name:'México',groupId:'group_a'},
  {id:'africa_sul',name:'África do Sul',groupId:'group_a'},
  {id:'coreia_sul',name:'Coreia do Sul',groupId:'group_a'},
  {id:'tcheca',name:'República Tcheca',groupId:'group_a'},
  // Grupo B
  {id:'canada',name:'Canadá',groupId:'group_b'},
  {id:'bosnia',name:'Bósnia e Herzegovina',groupId:'group_b'},
  {id:'catar',name:'Catar',groupId:'group_b'},
  {id:'suica',name:'Suíça',groupId:'group_b'},
  // Grupo C
  {id:'brasil',name:'Brasil',groupId:'group_c'},
  {id:'marrocos',name:'Marrocos',groupId:'group_c'},
  {id:'haiti',name:'Haiti',groupId:'group_c'},
  {id:'escocia',name:'Escócia',groupId:'group_c'},
  // Grupo D
  {id:'eua',name:'Estados Unidos',groupId:'group_d'},
  {id:'paraguai',name:'Paraguai',groupId:'group_d'},
  {id:'australia',name:'Austrália',groupId:'group_d'},
  {id:'turquia',name:'Turquia',groupId:'group_d'},
  // Grupo E
  {id:'alemanha',name:'Alemanha',groupId:'group_e'},
  {id:'curacao',name:'Curaçao',groupId:'group_e'},
  {id:'costa_marfim',name:'Costa do Marfim',groupId:'group_e'},
  {id:'equador',name:'Equador',groupId:'group_e'},
  // Grupo F
  {id:'holanda',name:'Holanda',groupId:'group_f'},
  {id:'japao',name:'Japão',groupId:'group_f'},
  {id:'suecia',name:'Suécia',groupId:'group_f'},
  {id:'tunisia',name:'Tunísia',groupId:'group_f'},
  // Grupo G
  {id:'belgica',name:'Bélgica',groupId:'group_g'},
  {id:'egito',name:'Egito',groupId:'group_g'},
  {id:'ira',name:'Irã',groupId:'group_g'},
  {id:'nova_zelandia',name:'Nova Zelândia',groupId:'group_g'},
  // Grupo H
  {id:'espanha',name:'Espanha',groupId:'group_h'},
  {id:'cabo_verde',name:'Cabo Verde',groupId:'group_h'},
  {id:'arabia_saudita',name:'Arábia Saudita',groupId:'group_h'},
  {id:'uruguai',name:'Uruguai',groupId:'group_h'},
  // Grupo I
  {id:'franca',name:'França',groupId:'group_i'},
  {id:'senegal',name:'Senegal',groupId:'group_i'},
  {id:'iraque',name:'Iraque',groupId:'group_i'},
  {id:'noruega',name:'Noruega',groupId:'group_i'},
  // Grupo J
  {id:'argentina',name:'Argentina',groupId:'group_j'},
  {id:'argelia',name:'Argélia',groupId:'group_j'},
  {id:'austria',name:'Áustria',groupId:'group_j'},
  {id:'jordania',name:'Jordânia',groupId:'group_j'},
  // Grupo K
  {id:'portugal',name:'Portugal',groupId:'group_k'},
  {id:'rd_congo',name:'RD Congo',groupId:'group_k'},
  {id:'uzbequistao',name:'Uzbequistão',groupId:'group_k'},
  {id:'colombia',name:'Colômbia',groupId:'group_k'},
  // Grupo L
  {id:'inglaterra',name:'Inglaterra',groupId:'group_l'},
  {id:'croacia',name:'Croácia',groupId:'group_l'},
  {id:'gana',name:'Gana',groupId:'group_l'},
  {id:'panama',name:'Panamá',groupId:'group_l'},
];

// ========================================
// HORÁRIOS CORRIGIDOS - TODOS EM BRT (UTC-3)
// Fonte: Fox Sports / FIFA - Conversão ET+1h = BRT
// ========================================
// Cada grupo: Rodada 1 (t1vt2, t3vt4), Rodada 2 (t1vt3, t4vt2), Rodada 3 (t4vt1, t2vt3)

function getGroupMatches(groupId, t, roundDates) {
  return [
    { roundId:'round_g1', teamA: t[0], teamB: t[1], ...roundDates[0] },
    { roundId:'round_g1', teamA: t[2], teamB: t[3], ...roundDates[1] },
    { roundId:'round_g2', teamA: t[0], teamB: t[2], ...roundDates[2] },
    { roundId:'round_g2', teamA: t[3], teamB: t[1], ...roundDates[3] },
    { roundId:'round_g3', teamA: t[3], teamB: t[0], ...roundDates[4] },
    { roundId:'round_g3', teamA: t[1], teamB: t[2], ...roundDates[5] },
  ].map((m) => ({ ...m, groupId }));
}

const allGroupMatches = [
  // ===== GRUPO A: México, Áfr. Sul, Coreia Sul, Tcheca =====
  // R1: 11/06 MexvAfr 15h ET=16h BRT, 11/06 CorvTch 22h ET (vira 12/06) = 23h BRT
  // R2: 18/06 TchvAfr 12h ET=13h BRT, 18/06 MexvCor 21h ET=22h BRT
  // R3: 24/06 MexvTch 21h ET=22h BRT, AfrvCor 21h ET=22h BRT
  ...getGroupMatches('group_a', ['mexico','africa_sul','coreia_sul','tcheca'], [
    {k:'2026-06-11T16:00:00-03:00',s:'Estadio Azteca',c:'Cidade do México'},
    {k:'2026-06-11T23:00:00-03:00',s:'Estadio Akron',c:'Guadalajara'},
    {k:'2026-06-18T22:00:00-03:00',s:'Estadio Azteca',c:'Cidade do México'},
    {k:'2026-06-18T13:00:00-03:00',s:'Estadio Akron',c:'Guadalajara'},
    {k:'2026-06-24T22:00:00-03:00',s:'Estadio BBVA',c:'Monterrey'},
    {k:'2026-06-24T22:00:00-03:00',s:'Estadio Akron',c:'Guadalajara'},
  ]),

  // ===== GRUPO B: Canadá, Bósnia, Catar, Suíça =====
  // R1: 12/06 CanvBos 15h ET=16h BRT, 12/06 CatVSui (não encontrado direto, assumo 13/06)
  // Fox: 13/06 QatVSui 15h ET=16h BRT em San Francisco
  // R2: 18/06 SuivBos 15h ET=16h BRT, 18/06 CanvCat 18h ET=19h BRT
  // R3: 24/06 SuivCan 15h ET=16h BRT, BosvCat 15h ET=16h BRT
  ...getGroupMatches('group_b', ['canada','bosnia','catar','suica'], [
    {k:'2026-06-12T16:00:00-03:00',s:'BMO Field',c:'Toronto'},
    {k:'2026-06-13T16:00:00-03:00',s:"Levi's Stadium",c:'San Francisco'},
    {k:'2026-06-18T19:00:00-03:00',s:'BMO Field',c:'Toronto'},
    {k:'2026-06-18T16:00:00-03:00',s:'Lumen Field',c:'Seattle'},
    {k:'2026-06-24T16:00:00-03:00',s:'BC Place',c:'Vancouver'},
    {k:'2026-06-24T16:00:00-03:00',s:'BMO Field',c:'Toronto'},
  ]),

  // ===== GRUPO C: Brasil, Marrocos, Haiti, Escócia =====
  // R1: 13/06 BravMar 18h ET=19h BRT, HaivEsc 21h ET=22h BRT (Boston)
  // R2: 19/06 BravHai 20:30 ET=21:30 BRT, EscvMar 18h ET=19h BRT (Boston)
  // R3: 24/06 BravEsc 18h ET=19h BRT, MarvHai 18h ET=19h BRT
  ...getGroupMatches('group_c', ['brasil','marrocos','haiti','escocia'], [
    {k:'2026-06-13T19:00:00-03:00',s:'MetLife Stadium',c:'Nova York/Nova Jersey'},
    {k:'2026-06-13T22:00:00-03:00',s:'Gillette Stadium',c:'Boston'},
    {k:'2026-06-19T21:30:00-03:00',s:'Lincoln Financial Field',c:'Filadélfia'},
    {k:'2026-06-19T19:00:00-03:00',s:'Gillette Stadium',c:'Boston'},
    {k:'2026-06-24T19:00:00-03:00',s:'Hard Rock Stadium',c:'Miami'},
    {k:'2026-06-24T19:00:00-03:00',s:'MetLife Stadium',c:'Nova York/Nova Jersey'},
  ]),

  // ===== GRUPO D: EUA, Paraguai, Austrália, Turquia =====
  // R1: 12/06 EUAvPar 21h ET=22h BRT, AusvTur (13/06 midnight ET=14/06 01h BRT) Vancouver
  // R2: 19/06 EUAvAus 12h ET=13h BRT (Seattle), TurvPar (19/06 23h ET=14/06 00h BRT) SF  
  // R3: 25/06 EUAvTur 22h ET=23h BRT, ParvAus 22h ET=23h BRT
  ...getGroupMatches('group_d', ['eua','paraguai','australia','turquia'], [
    {k:'2026-06-12T22:00:00-03:00',s:'SoFi Stadium',c:'Los Angeles'},
    {k:'2026-06-14T01:00:00-03:00',s:'BC Place',c:'Vancouver'},
    {k:'2026-06-19T13:00:00-03:00',s:'Lumen Field',c:'Seattle'},
    {k:'2026-06-20T00:00:00-03:00',s:"Levi's Stadium",c:'San Francisco'},
    {k:'2026-06-25T23:00:00-03:00',s:'SoFi Stadium',c:'Los Angeles'},
    {k:'2026-06-25T23:00:00-03:00',s:'AT&T Stadium',c:'Dallas'},
  ]),

  // ===== GRUPO E: Alemanha, Curaçao, C.Marfim, Equador =====
  // R1: 14/06 AlevCur 13h ET=14h BRT (Houston), CdIvEqu 19h ET=20h BRT (Phila)
  // R2: 20/06 AlevCdI 16h ET=17h BRT (Toronto), EquvCur 20h ET=21h BRT (KC)
  // R3: 25/06 EquvAle 16h ET=17h BRT, CurvCdI 16h ET=17h BRT
  ...getGroupMatches('group_e', ['alemanha','curacao','costa_marfim','equador'], [
    {k:'2026-06-14T14:00:00-03:00',s:'NRG Stadium',c:'Houston'},
    {k:'2026-06-14T20:00:00-03:00',s:'Lincoln Financial Field',c:'Filadélfia'},
    {k:'2026-06-20T17:00:00-03:00',s:'BMO Field',c:'Toronto'},
    {k:'2026-06-20T21:00:00-03:00',s:'Arrowhead Stadium',c:'Kansas City'},
    {k:'2026-06-25T17:00:00-03:00',s:'Estadio Azteca',c:'Cidade do México'},
    {k:'2026-06-25T17:00:00-03:00',s:'Estadio BBVA',c:'Monterrey'},
  ]),

  // ===== GRUPO F: Holanda, Japão, Suécia, Tunísia =====
  // R1: 14/06 HolvJap 16h ET=17h BRT (Dallas), TunvSue 22h ET=23h BRT (Monterrey)
  // R2: 20/06 HolvSue 13h ET=14h BRT (Houston), TunvJap midnight ET 21/06=01h BRT (Guadalajara)
  // R3: 26/06 TunvHol midnight ET=01h BRT, JapvSue midnight ET=01h BRT
  ...getGroupMatches('group_f', ['holanda','japao','suecia','tunisia'], [
    {k:'2026-06-14T17:00:00-03:00',s:'AT&T Stadium',c:'Dallas'},
    {k:'2026-06-14T23:00:00-03:00',s:'Estadio BBVA',c:'Monterrey'},
    {k:'2026-06-20T14:00:00-03:00',s:'NRG Stadium',c:'Houston'},
    {k:'2026-06-21T01:00:00-03:00',s:'Estadio Akron',c:'Guadalajara'},
    {k:'2026-06-26T01:00:00-03:00',s:'NRG Stadium',c:'Houston'},
    {k:'2026-06-26T01:00:00-03:00',s:"Levi's Stadium",c:'San Francisco'},
  ]),

  // ===== GRUPO G: Bélgica, Egito, Irã, Nova Zelândia =====
  // R1: 15/06 BelvEgi 15h ET=16h BRT, IravNZ 21h ET=22h BRT
  // R2: 21/06 BelvIra 15h ET=16h BRT (LA), NZvEgi 21h ET=22h BRT (Vancouver)
  // R3: 27/06 NZvBel 04h ET=05h BRT, EgivIra 04h ET=05h BRT
  ...getGroupMatches('group_g', ['belgica','egito','ira','nova_zelandia'], [
    {k:'2026-06-15T16:00:00-03:00',s:"Levi's Stadium",c:'San Francisco'},
    {k:'2026-06-15T22:00:00-03:00',s:'Lumen Field',c:'Seattle'},
    {k:'2026-06-21T16:00:00-03:00',s:'SoFi Stadium',c:'Los Angeles'},
    {k:'2026-06-21T22:00:00-03:00',s:'BC Place',c:'Vancouver'},
    {k:'2026-06-27T05:00:00-03:00',s:'BC Place',c:'Vancouver'},
    {k:'2026-06-27T05:00:00-03:00',s:"Levi's Stadium",c:'San Francisco'},
  ]),

  // ===== GRUPO H: Espanha, Cabo Verde, Ar. Saudita, Uruguai =====
  // R1: 15/06 EspvCV 12h ET=13h BRT (Phila), ASvUru 18h ET=19h BRT (Miami)
  // R2: 21/06 EspvAS 12h ET=13h BRT (Atlanta), UruvCV 18h ET=19h BRT (Miami)
  // R3: 27/06 UruvEsp 01h ET=02h BRT, CVvAS 01h ET=02h BRT
  ...getGroupMatches('group_h', ['espanha','cabo_verde','arabia_saudita','uruguai'], [
    {k:'2026-06-15T13:00:00-03:00',s:'Lincoln Financial Field',c:'Filadélfia'},
    {k:'2026-06-15T19:00:00-03:00',s:'Hard Rock Stadium',c:'Miami'},
    {k:'2026-06-21T13:00:00-03:00',s:'Mercedes-Benz Stadium',c:'Atlanta'},
    {k:'2026-06-21T19:00:00-03:00',s:'Hard Rock Stadium',c:'Miami'},
    {k:'2026-06-27T02:00:00-03:00',s:'Hard Rock Stadium',c:'Miami'},
    {k:'2026-06-27T02:00:00-03:00',s:'Lincoln Financial Field',c:'Filadélfia'},
  ]),

  // ===== GRUPO I: França, Senegal, Iraque, Noruega =====
  // R1: 16/06 FravSen 15h ET=16h BRT (MetLife), IraqvNor 18h ET=19h BRT (Gillette/Boston)
  // R2: 22/06 FravIra 17h ET=18h BRT (Phila), NorvSen 20h ET=21h BRT (MetLife)
  // R3: 26/06 NorvFra 20h ET=21h BRT, SenvIra 20h ET=21h BRT
  ...getGroupMatches('group_i', ['franca','senegal','iraque','noruega'], [
    {k:'2026-06-16T16:00:00-03:00',s:'MetLife Stadium',c:'Nova York/Nova Jersey'},
    {k:'2026-06-16T19:00:00-03:00',s:'Gillette Stadium',c:'Boston'},
    {k:'2026-06-22T18:00:00-03:00',s:'Lincoln Financial Field',c:'Filadélfia'},
    {k:'2026-06-22T21:00:00-03:00',s:'MetLife Stadium',c:'Nova York/Nova Jersey'},
    {k:'2026-06-26T21:00:00-03:00',s:'Empower Field',c:'Denver'},
    {k:'2026-06-26T21:00:00-03:00',s:'Mercedes-Benz Stadium',c:'Atlanta'},
  ]),

  // ===== GRUPO J: Argentina, Argélia, Áustria, Jordânia =====
  // R1: 17/06 ArgvAlg (preciso confirmar) Assumo 17/06 ET afternoon MetLife
  // Fox: 17/06 não encontrado exato. Vou usar: ArgvAlg 16h ET=17h BRT, AusvJor 10h ET (KC) = 11h... 
  // Alternativa mais provável baseado no padrão:
  // R1: 16/06 ArgvAlg 21h ET=22h BRT, AusvJor 12h ET=13h BRT (KC) [mesma data grupo I]
  // R2: 22/06 ArgvAus 13h ET=14h BRT, JorvAlg 23h ET=00h BRT
  // R3: 28/06 JorvArg 03h ET=04h BRT, AlgvAus 03h ET=04h BRT
  ...getGroupMatches('group_j', ['argentina','argelia','austria','jordania'], [
    {k:'2026-06-16T22:00:00-03:00',s:'MetLife Stadium',c:'Nova York/Nova Jersey'},
    {k:'2026-06-16T13:00:00-03:00',s:'Arrowhead Stadium',c:'Kansas City'},
    {k:'2026-06-22T14:00:00-03:00',s:'MetLife Stadium',c:'Nova York/Nova Jersey'},
    {k:'2026-06-23T00:00:00-03:00',s:'Arrowhead Stadium',c:'Kansas City'},
    {k:'2026-06-28T04:00:00-03:00',s:'Arrowhead Stadium',c:'Kansas City'},
    {k:'2026-06-28T04:00:00-03:00',s:'MetLife Stadium',c:'Nova York/Nova Jersey'},
  ]),

  // ===== GRUPO K: Portugal, RD Congo, Uzbequistão, Colômbia =====
  // R1: 17/06 PorvCon 13h ET=14h BRT, UzbvCol 22h ET=23h BRT
  // R2: 23/06 PorvUzb 13h ET=14h BRT, ColvCon 22h ET=23h BRT
  // R3: 28/06 ColvPor 00:30 ET=01:30 BRT, ConvUzb 00:30 ET=01:30 BRT
  ...getGroupMatches('group_k', ['portugal','rd_congo','uzbequistao','colombia'], [
    {k:'2026-06-17T14:00:00-03:00',s:'Gillette Stadium',c:'Boston'},
    {k:'2026-06-17T23:00:00-03:00',s:'Empower Field',c:'Denver'},
    {k:'2026-06-23T14:00:00-03:00',s:'Gillette Stadium',c:'Boston'},
    {k:'2026-06-23T23:00:00-03:00',s:'Empower Field',c:'Denver'},
    {k:'2026-06-28T01:30:00-03:00',s:'Empower Field',c:'Denver'},
    {k:'2026-06-28T01:30:00-03:00',s:'Gillette Stadium',c:'Boston'},
  ]),

  // ===== GRUPO L: Inglaterra, Croácia, Gana, Panamá =====
  // R1: 17/06 IngvCro 16h ET=17h BRT (Dallas), GanvPan 19h ET=20h BRT (Atlanta)
  // R2: 23/06 IngvGan 16h ET=17h BRT (Dallas), PanvCro 19h ET=20h BRT (Atlanta)
  // R3: 27/06 PanvIng 22h ET=23h BRT, CrovGan 22h ET=23h BRT
  ...getGroupMatches('group_l', ['inglaterra','croacia','gana','panama'], [
    {k:'2026-06-17T17:00:00-03:00',s:'AT&T Stadium',c:'Dallas'},
    {k:'2026-06-17T20:00:00-03:00',s:'Mercedes-Benz Stadium',c:'Atlanta'},
    {k:'2026-06-23T17:00:00-03:00',s:'AT&T Stadium',c:'Dallas'},
    {k:'2026-06-23T20:00:00-03:00',s:'Mercedes-Benz Stadium',c:'Atlanta'},
    {k:'2026-06-27T23:00:00-03:00',s:'Mercedes-Benz Stadium',c:'Atlanta'},
    {k:'2026-06-27T23:00:00-03:00',s:'AT&T Stadium',c:'Dallas'},
  ]),
];

async function seed() {
  // 1. Limpar e recriar times
  console.log('Limpando times antigos...');
  const existingT = await getDocs(collection(db, 'teams'));
  for (const d of existingT.docs) await deleteDoc(doc(db, 'teams', d.id));

  console.log('Criando 48 seleções oficiais...');
  for (const t of teams) await setDoc(doc(db, 'teams', t.id), { ...t, flagUrl: '' });

  // 2. Limpar e recriar jogos da fase de grupos
  console.log('Limpando jogos antigos...');
  const existingM = await getDocs(collection(db, 'matches'));
  for (const d of existingM.docs) await deleteDoc(doc(db, 'matches', d.id));

  console.log('Criando 72 jogos da fase de grupos com horários corrigidos (BRT)...');
  let num = 1;
  for (const m of allGroupMatches) {
    const id = `m${String(num).padStart(3,'0')}`;
    const roundName = m.roundId === 'round_g1' ? 'Rodada 1' : m.roundId === 'round_g2' ? 'Rodada 2' : 'Rodada 3';
    await setDoc(doc(db, 'matches', id), {
      id, matchNumber: num, stageId: 'group_stage',
      roundId: m.roundId, roundName, groupId: m.groupId,
      teamAId: m.teamA, teamBId: m.teamB,
      kickoffLocal: m.k, stadium: m.s, city: m.c,
      status: 'scheduled', officialScoreA: null, officialScoreB: null, predictionStatus: 'locked'
    });
    num++;
  }

  console.log(`${num-1} jogos criados com horários BRT corrigidos!`);
  console.log('Agora rode: node scripts/seedKnockout.js');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
