'use client'

import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';

export default function BackgroundGradient(props) {

  const { isWebView, isImageView } = props

  useEffect(() => {
    var gradient = new Gradient()
    gradient.initGradient('#gradient-canvas');
  }, [])
  
  return (
    <>
      <Script src="/gradient.js" strategy="beforeInteractive"></Script>
      <canvas id="gradient-canvas" data-faded={isWebView} data-hidden={isImageView}></canvas>
    </>
  )

}