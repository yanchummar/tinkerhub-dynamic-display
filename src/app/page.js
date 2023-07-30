'use client'

import BackgroundGradient from '@/components/BackgroundGradient'
import { useEffect, useState } from 'react'

import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDnQRXHWHOWVA_5Y8JJn7TEIVEnno8cQic",
  authDomain: "tinkerhub-dynamic-display.firebaseapp.com",
  databaseURL: "https://tinkerhub-dynamic-display-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tinkerhub-dynamic-display",
  storageBucket: "tinkerhub-dynamic-display.appspot.com",
  messagingSenderId: "1092822376371",
  appId: "1:1092822376371:web:482a27465c235b407675c6",
  measurementId: "G-YYTFBDLZ6T"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export default function Home() {

  const [isWebView, setIsWebView] = useState(false)
  const [liveData, setLiveData] = useState({})

  const primaryRef = ref(database, 'primary')

  useEffect(() => {
    onValue(primaryRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data)
      setLiveData(data);
    });
  }, [])

  return (
    <main className='main-content'>
      <BackgroundGradient isWebView={liveData?.live === 'web'} />
      <div className='data-holder' data-webview={liveData?.live === 'web'}>
        {
          liveData?.live === 'web' ? (
            <iframe src={liveData?.link} className='webview w-full h-full absolute inset-0' />
          ) : (
            <div className='text-holder'>
              <span className='title-text'>{liveData?.title}</span>
              <span className='subtitle-text'>{liveData?.subtitle}</span>
            </div>
          )
        }
      </div>
    </main>
  )
}
