import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './Drop.module.css';
import Button from './Button';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

type DropzoneProps = {
  onConversionDone?: () => void;
  jobDescription?: string;
};

enum ConversionState {
  Idle = 'idle',
  Converting = 'converting',
  Done = 'done',
}

export function Basic({ onConversionDone, jobDescription }: DropzoneProps) {
  const [conversionState, setConversionState] = useState<ConversionState>(ConversionState.Idle);
  const [progress, setProgress] = useState(0);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [pdfReady, setPdfReady] = useState(false);

  // Handle file drop and upload
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    setConversionState(ConversionState.Converting);
    setProgress(0);
    setPdfReady(false);
    setResumeUrl(null);

    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    if (jobDescription) {
      formData.append('job', jobDescription);
    }

    try {
      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Backend response status:', response.status);
      console.log('Backend response content-type:', response.headers.get('content-type'));

      if (!response.ok) throw new Error('Upload failed');

      const blob = await response.blob();
      console.log('Blob size:', blob.size);

      // Check if the blob is actually a PDF
      if (blob.type !== 'application/pdf') {
        const text = await blob.text();
        console.error('Expected PDF but got:', text);
        alert('Backend did not return a PDF. Check backend logs.');
        setConversionState(ConversionState.Idle);
        return;
      }

      const url = window.URL.createObjectURL(blob);
      setResumeUrl(url);
      setPdfReady(true); // PDF is ready!
    } catch (e) {
      console.error('Error during upload:', e);
      alert('Failed to upload and convert PDF.');
      setConversionState(ConversionState.Idle);
    }
  }, [jobDescription, onConversionDone]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/pdf': [] },
  });

  // Progress bar logic: stop at 90% until PDF is ready, then jump to 100%
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (conversionState === ConversionState.Converting) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (!pdfReady && prev >= 90) return 90;
          if (pdfReady && prev < 100) {
            clearInterval(timer);
            return 100;
          }
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    }
    return () => clearInterval(timer);
  }, [conversionState, pdfReady]);

  // When both PDF is ready and progress is 100%, show the download button
  useEffect(() => {
    if (pdfReady && progress >= 100 && conversionState === ConversionState.Converting) {
      setConversionState(ConversionState.Done);
      if (onConversionDone) onConversionDone();
    }
  }, [pdfReady, progress, conversionState, onConversionDone]);

  return (
    <section className={styles.container}>
      {conversionState === ConversionState.Idle && (
        <div {...getRootProps({ className: styles.dropzone })}>
          <input {...getInputProps()} />
          <p>Drop files here or click to select files</p>
          <div className={styles.reservedSpace} />
        </div>
      )}

      {conversionState === ConversionState.Converting && (
        <div className={styles.stateContainer}>
          <div className={styles.progressText}>
            Converting... {progress}%
          </div>
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className={styles.reservedSpace} />
        </div>
      )}

      {conversionState === ConversionState.Done && resumeUrl && (
        <div className={styles.stateContainer}>
          <div className={styles.doneMessage}>
            Conversion complete!
          </div>
          <div className={styles.buttonContainer}>
            <Button
              text="Download Resume"
              filled={true}
              type="secondary"
              href={resumeUrl}
              icon={<ArrowDownTrayIcon style={{ width: 24, height: 24 }} />}
              download
              target="_blank"
            />
          </div>
          <div className={styles.reservedSpace} />
        </div>
      )}
    </section>
  );
}