// Utility functions for handling audio in the application

/**
 * Checks if an audio file exists and returns it, or generates one using TTS if not available
 * @param audioUrl The URL of the audio file to check
 * @param textToSpeak The text to convert to speech if the audio file doesn't exist
 * @returns A Promise that resolves to the URL of the audio file
 */
export async function getOrGenerateAudio(audioUrl: string, fallbackText: string): Promise<string> {
  try {
    // First, try to check if the audio file exists
    const response = await fetch(audioUrl, { method: "HEAD" })

    if (response.ok) {
      // If the audio file exists, return its URL
      return audioUrl
    } else {
      // If the audio file doesn't exist, use the TTS API
      const ttsResponse = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: fallbackText }),
      })

      if (ttsResponse.ok) {
        const data = await ttsResponse.json()
        return data.audioUrl
      } else {
        // If TTS fails, throw an error
        throw new Error("Failed to generate audio from text")
      }
    }
  } catch (error) {
    console.error("Error in getOrGenerateAudio:", error)
    // Return a placeholder audio URL or the original URL as fallback
    return audioUrl
  }
}

/**
 * Generates speech from text using a Text-to-Speech API
 * @param text The text to convert to speech
 * @returns A Promise that resolves to the URL of the generated audio
 */
async function generateTextToSpeech(text: string): Promise<string> {
  try {
    // In a production environment, this would call an actual TTS API
    // For demo purposes, we'll make a call to our own API endpoint
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error(`TTS API returned ${response.status}`)
    }

    const data = await response.json()
    return data.audioUrl
  } catch (error) {
    console.error("Error generating TTS:", error)

    // Create a unique identifier based on the text to simulate different audio files
    const textHash = btoa(text.substring(0, 100))
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 10)

    // Return a mock audio URL as fallback
    return `/api/tts?text=${encodeURIComponent(text.substring(0, 100))}&id=${textHash}`
  }
}

/**
 * Preloads audio files to ensure they're ready to play
 * @param audioUrls Array of audio URLs to preload
 */
export function preloadAudioFiles(audioUrls: string[]): void {
  audioUrls.forEach((url) => {
    const audio = new Audio()
    audio.preload = "auto"
    audio.src = url
  })
}

/**
 * Creates and manages an audio player with enhanced error handling
 * @returns An object with methods to control audio playback
 */
export function createAudioPlayer() {
  let audio: HTMLAudioElement | null = null
  let isPlaying = false

  const play = async (url: string, onEnd?: () => void, onError?: (error: Error) => void) => {
    try {
      // Stop any currently playing audio
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }

      // Create a new audio element if needed
      if (!audio) {
        audio = new Audio()
      }

      // Set up event listeners
      audio.onended = () => {
        isPlaying = false
        if (onEnd) onEnd()
      }

      audio.onerror = (e) => {
        console.error("Audio playback error:", e)
        isPlaying = false
        if (onError) onError(new Error("Failed to play audio"))
      }

      // Set source and play
      audio.src = url
      await audio.play()
      isPlaying = true

      return true
    } catch (error) {
      console.error("Error playing audio:", error)
      isPlaying = false
      if (onError) onError(error instanceof Error ? error : new Error("Failed to play audio"))
      return false
    }
  }

  const stop = () => {
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      isPlaying = false
    }
  }

  const cleanup = () => {
    if (audio) {
      audio.pause()
      audio.src = ""
      audio = null
    }
  }

  return {
    play,
    stop,
    cleanup,
    get isPlaying() {
      return isPlaying
    },
  }
}

// Create a dummy audio element for browsers
export function createAudioElement(): HTMLAudioElement | null {
  if (typeof window !== "undefined") {
    return new Audio()
  }
  return null
}
