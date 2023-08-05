'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { initializeApp } from 'firebase/app'
import { getDatabase, onValue, update, ref as dbRef } from "firebase/database";

import { getStorage, uploadBytes, getDownloadURL, ref as storageRef } from "firebase/storage";

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

// Create a root reference
const storage = getStorage(app)

export default function Home() {

  const imageInputRef = useRef(null);

  const router = useRouter()
  const [liveData, setLiveData] = useState({})
  const [active, setActive] = useState('text')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [image, setImage] = useState(undefined)
  const [link, setLink] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [imagePreview, setImagePreview] = useState(undefined)

  const primaryRef = dbRef(database, 'primary')
  const tvImageRef = storageRef(storage, 'images/tv.jpg')

  useEffect(() => {
    // handleLogin()

    onValue(primaryRef, (snapshot) => {
      const data = snapshot.val()
      console.log(data)
      setLiveData(data)
      setTitle(data?.title)
      setSubtitle(data?.subtitle)
      setLink(data?.link)
      setActive(data?.live)
      setImageUrl(data?.image)
    })
  }, [])

  const handleLogin = () => {
    const password = prompt('Enter your password:');

    // Replace the following lines with your authentication logic
    const validPassword = 'tinkerspace123';

    if (password === validPassword) {
      console.log('logged in')
    } else {
      console.log('not logged in')
      router.replace('/nop');
    }
  };

  const handleImageInputClick = () => {
    imageInputRef.current.click()
  }

  const onImageInput = (e) => {
    const file = e.target.files[0]
    setImage(file)
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(undefined);
    }
  }

  const updateData = (image) => {
    setIsUpdating(true)
    const updates = {}
    console.log(image)
    updates[`primary/live`] = active
    updates[`primary/title`] = title
    updates[`primary/subtitle`] = subtitle
    updates[`primary/link`] = link
    updates[`primary/image`] = image ? image : imageUrl

    update(dbRef(database), updates)
    .then(() => {
      setIsUpdating(false)
    })
    .catch((error) => { 
      setIsUpdating(false)
    })
  }

  const uploadImage = () => {
    setIsUpdating(true)
    uploadBytes(tvImageRef, image).then((snapshot) => {
      console.log(snapshot)
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        setImagePreview(undefined)
        updateData(downloadURL)
      })
    })
  }

  const onUpdateClick = () => {
    if (active === 'image') {
      uploadImage()
    } else {
      updateData()
    }
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
            onClick={() => setActive('image')}
            data-active={active === 'image'}>
            <span className='label'>Image</span>
            {
              liveData?.live === 'image' ? (
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
          ) : active === 'image' ? (
              <div className='image-holder'>
                {
                  imagePreview || imageUrl !== '' ? (
                    <img 
                      className='image-preview'
                      src={imagePreview ? imagePreview : imageUrl} 
                      alt="Preview" />
                  ) : false
                }
                <div 
                  onClick={handleImageInputClick}
                  className='image-input'>
                  <input 
                    ref={imageInputRef} 
                    className='file-input' type="file" accept="image/*"
                    onInput={onImageInput}></input>
                  <span className='upload-text'>{imagePreview || imageUrl !== '' ? 'Replace Image' : 'Upload an Image'}</span>
                </div>
              </div>
            ) : false
        }
        <button 
          onClick={onUpdateClick}
          className='update-btn'
          data-disabled={isUpdating}>
          <span className='label'>{ isUpdating ? 'Updating...' : 'Update'}</span>
        </button>
      </div>
    </main>
  )
}
