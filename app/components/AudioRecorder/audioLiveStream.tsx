import React, { useState, useRef } from 'react';
import './audioLiveStream.css'; // Importing the custom CSS for dark theme and animation

const AudioRecorder = ({audioUrl, setAudioUrl}) => {
  const [recording, setRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Start recording
  const startRecording = async () => {
    try {
      // Access user's microphone
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorderRef.current = new MediaRecorder(streamRef.current);
      
      recorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorderRef.current.onstop = async () => {
        // Create a Blob from the recorded audio data and create an audio URL
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        setAudioUrl(audioUrl);
        setRecording(false);
      };

      recorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    recorderRef.current.stop();
    streamRef.current.getTracks().forEach((track) => track.stop());
  };

  // Save the recording to the user's file system
  const saveRecording = async () => {
    if (audioUrl && !isSaving) {
      try {
        setIsSaving(true);

        // Prompt user to save the file
        const suggestedName = 'microphone-recording.mp3';
        const handle = await window.showSaveFilePicker({
          suggestedName,
        });

        const writable = await handle.createWritable();
        const audioBlob = await fetch(audioUrl).then((res) => res.blob());
        
        // Write the audio blob data to the file
        await writable.write(audioBlob);
        await writable.close();
        setIsSaving(false);
      } catch (err) {
        console.error('Error saving file:', err);
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="audio-recorder-container">
      <h2 className="title">Audio Sentiment & Rating Analyzer</h2>
      {!recording ? (
        <button
          className="record-button start"
          onClick={startRecording}
        >
          Start Recording
        </button>
      ) : (
        <button
          className="record-button stop"
          onClick={stopRecording}
        >
          Stop Recording
        </button>
      )}
      {audioUrl && !recording && (
        <div>
          <audio controls src={audioUrl}></audio>
          <button onClick={saveRecording} disabled={isSaving} className="save-button">
            {isSaving ? 'Saving...' : 'Save Recording'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
