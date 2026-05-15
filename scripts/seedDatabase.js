import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seedFile = fs.readFileSync(new URL('../worldcup2026_seed.json', import.meta.url), 'utf-8');
const data = JSON.parse(seedFile);

async function seed() {
  console.log('Seeding settings...');
  await setDoc(doc(db, 'settings', 'general'), data.settings);

  console.log('Seeding stages...');
  for (const stage of data.stages) {
    await setDoc(doc(db, 'stages', stage.id), stage);
  }

  console.log('Seeding groups...');
  for (const group of data.groups) {
    await setDoc(doc(db, 'groups', group.id), group);
  }

  console.log('Clearing old teams...');
  const existingTeams = await getDocs(collection(db, 'teams'));
  for (const docSnap of existingTeams.docs) {
    await deleteDoc(doc(db, 'teams', docSnap.id));
  }

  console.log('Seeding 48 teams...');
  if (data.teams) {
    for (const team of data.teams) {
      await setDoc(doc(db, 'teams', team.id), team);
    }
  }

  console.log('Seeding matches...');
  for (const match of data.matches) {
    await setDoc(doc(db, 'matches', match.id), match);
  }

  console.log('Seed completo!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
