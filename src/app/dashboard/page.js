'use client'

import { useEffect, useState } from 'react'

import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue, update } from "firebase/database";

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

  const [liveData, setLiveData] = useState({})
  const [active, setActive] = useState('text')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [link, setLink] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const primaryRef = ref(database, 'primary')

  useEffect(() => {
    onValue(primaryRef, (snapshot) => {
      const data = snapshot.val()
      console.log(data)
      setLiveData(data)
      setTitle(data?.title)
      setSubtitle(data?.subtitle)
      setLink(data?.link)
    })
  }, [])

  const updateData = () => {
    setIsUpdating(true)
    const updates = {}
    updates[`primary/live`] = active
    updates[`primary/title`] = title
    updates[`primary/subtitle`] = subtitle
    updates[`primary/link`] = link

    update(ref(database), updates)
    .then(() => {
      setIsUpdating(false)
    })
    .catch((error) => { 
      setIsUpdating(false)
    })
  }

  return (
    <main className='dashboard-content'>
      <div className='form-holder'>
        <span className='title'>Display Data</span>
        <span className='item-label'>Type</span>
        <ul className='type-tabs'>
          <li 
            onClick={() => setActive('text')}
            data-active={active === 'text'}>
            <span className='label'>Text</span>
            {
              liveData?.live === 'text' ? (
                <span className='chip'>active</span>
              ) : false
            }
          </li>
          <li 
            onClick={() => setActive('web')}
            data-active={active === 'web'}>
            <span className='label'>Webpage</span>
            {
              liveData?.live === 'web' ? (
                <span className='chip'>active</span>
              ) : false
            }
          </li>
        </ul>
        <br />
        <span className='item-label'>Data</span>
        {
          active === 'text' ? (
            <div className='text-inputs'>
              <textarea 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='text-input' placeholder='Title' />
              <textarea 
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className='text-input' placeholder='Subtitle' />
            </div>
          ) : active === 'web' ? (
            <input 
              value={link}
              onChange={(e) => setLink(e.target.value)}
              type='url' placeholder='Enter URL' />
          ) : false
        }
        <button 
          onClick={updateData}
          className='update-btn'
          data-disabled={isUpdating}>
          <span className='label'>{ isUpdating ? 'Updating...' : 'Update'}</span>
        </button>
      </div>
    </main>
  )
}
