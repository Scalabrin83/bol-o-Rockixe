import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper para converter telefone em email fictício
  const getEmailFromPhone = (phone) => {
    // Remove tudo que não for número
    const cleanPhone = phone.replace(/\\D/g, '');
    return `${cleanPhone}@bolao.rockixe`;
  };

  async function register(phone, password, name, championTeamId) {
    const email = getEmailFromPhone(phone);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Criar perfil no firestore
    const profileData = {
      uid: user.uid,
      phone: phone.replace(/\\D/g, ''),
      name,
      championTeamId,
      status: 'pending', // pendente de aprovação
      points: 0,
      exactScores: 0,
      isAdmin: false,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', user.uid), profileData);
    setUserData(profileData);
    return user;
  }

  async function login(phone, password) {
    const email = getEmailFromPhone(phone);
    return await signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    return await signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
