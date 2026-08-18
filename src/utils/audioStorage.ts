// IndexedDB Audio Storage for Permanent Custom Song Playback
const DB_NAME = 'HamsterBirthdayDB';
const DB_VERSION = 1;
const STORE_NAME = 'audio_store';
const SONG_KEY = 'user_birthday_song';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface StoredSong {
  dataUrl: string;
  name: string;
  timestamp: number;
}

export async function saveSongToDB(dataUrl: string, name: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const songData: StoredSong = {
        dataUrl,
        name,
        timestamp: Date.now(),
      };
      const req = store.put(songData, SONG_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Fallback to localStorage if IndexedDB is blocked
    try {
      localStorage.setItem(SONG_KEY, dataUrl);
      localStorage.setItem(`${SONG_KEY}_name`, name);
    } catch {
      // quota limit
    }
  }
}

export async function loadSongFromDB(): Promise<StoredSong | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(SONG_KEY);
      req.onsuccess = () => {
        if (req.result) {
          resolve(req.result as StoredSong);
        } else {
          // Check localStorage fallback
          const localUrl = localStorage.getItem(SONG_KEY);
          const localName = localStorage.getItem(`${SONG_KEY}_name`) || 'Your Song';
          if (localUrl) {
            resolve({ dataUrl: localUrl, name: localName, timestamp: Date.now() });
          } else {
            resolve(null);
          }
        }
      };
      req.onerror = () => {
        const localUrl = localStorage.getItem(SONG_KEY);
        const localName = localStorage.getItem(`${SONG_KEY}_name`) || 'Your Song';
        if (localUrl) {
          resolve({ dataUrl: localUrl, name: localName, timestamp: Date.now() });
        } else {
          resolve(null);
        }
      };
    });
  } catch {
    const localUrl = localStorage.getItem(SONG_KEY);
    const localName = localStorage.getItem(`${SONG_KEY}_name`) || 'Your Song';
    if (localUrl) {
      return { dataUrl: localUrl, name: localName, timestamp: Date.now() };
    }
    return null;
  }
}
