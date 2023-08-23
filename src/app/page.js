'use client'

import BackgroundGradient from '@/components/BackgroundGradient'
import { useEffect, useRef, useState } from 'react'

import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "tinkerhub-dynamic-display.firebaseapp.com",
  databaseURL: "https://tinkerhub-dynamic-display-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tinkerhub-dynamic-display",
  storageBucket: "tinkerhub-dynamic-display.appspot.com",
  messagingSenderId: "1092822376371",
  appId: "1:1092822376371:web:482a27465c235b407675c6",
  measurementId: "G-YYTFBDLZ6T"
}

const announcementAudio = '/assets/audio/annoucement.mp3'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export default function Home() {

  const audioRef = useRef(null)

  const [isWebView, setIsWebView] = useState(false)
  const [liveData, setLiveData] = useState(undefined)

  const primaryRef = ref(database, 'primary')

  useEffect(() => {
    onValue(primaryRef, (snapshot) => {
      const data = snapshot.val()
      console.log(data)
      setLiveData(data)
      if (data?.announce) {
        audioRef.current.play()
      }
    });
  }, [])

  return (
    <main className='main-content'>
      <BackgroundGradient 
        isImageView={liveData?.live === 'image'}
        isWebView={liveData?.live === 'web'} />
      <div className='data-holder' data-webview={liveData?.live === 'web'}>
        {
          liveData?.live === 'web' ? (
            <iframe src={liveData?.link} className='webview w-full h-full absolute' />
          ) : liveData?.live === 'image' ? (
            <img src={liveData?.image} className='w-full h-full fixed object-contain' />
          ) : (
            <div className='text-holder'>
              <span className='title-text'>{liveData?.title}</span>
              <span className='subtitle-text'>{liveData?.subtitle}</span>
            </div>
          )
        }
      </div>
      <audio
        style={{display: 'none'}}
        ref={audioRef} controls>
        <source src={announcementAudio} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </main>
  )
}
