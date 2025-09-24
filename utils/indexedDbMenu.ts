// IndexedDB ile menü verisini saklamak ve okumak için yardımcı fonksiyonlar
export async function saveMenuToIndexedDB(menu) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('RoomAppDB', 1);
    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains('menu')) {
        db.createObjectStore('menu', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('menu', 'readwrite');
      const store = tx.objectStore('menu');
      menu.forEach(item => store.put(item));
      tx.oncomplete = () => {
        db.close();
        resolve(true);
      };
      tx.onerror = (e) => reject(e);
    };
    request.onerror = (e) => reject(e);
  });
}

export async function getMenuFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('RoomAppDB', 1);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('menu', 'readonly');
      const store = tx.objectStore('menu');
      const items = [];
      store.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          items.push(cursor.value);
          cursor.continue();
        } else {
          db.close();
          resolve(items);
        }
      };
      tx.onerror = (e) => reject(e);
    };
    request.onerror = (e) => reject(e);
  });
}
