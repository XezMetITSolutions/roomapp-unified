// IndexedDB ile menü verisini saklamak ve okumak için yardımcı fonksiyonlar
type MenuItem = {
  id: string | number;
  [key: string]: unknown;
};

export async function saveMenuToIndexedDB(menu: MenuItem[]): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('RoomXQRDB', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('menu')) {
        db.createObjectStore('menu', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('menu', 'readwrite');
      const store = tx.objectStore('menu');
      menu.forEach((item: MenuItem) => store.put(item));
      tx.oncomplete = () => {
        db.close();
        resolve(true);
      };
      tx.onerror = () => reject(tx.error);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getMenuFromIndexedDB(): Promise<MenuItem[]> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('RoomXQRDB', 1);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('menu', 'readonly');
      const store = tx.objectStore('menu');
      const items: MenuItem[] = [];
      const cursorReq = store.openCursor();
      cursorReq.onsuccess = (event: Event) => {
        const target = event.target as IDBRequest<IDBCursorWithValue | null>;
        const cursor = target.result;
        if (cursor) {
          items.push(cursor.value as MenuItem);
          cursor.continue();
        } else {
          db.close();
          resolve(items);
        }
      };
      cursorReq.onerror = () => reject(cursorReq.error);
      tx.onerror = () => reject(tx.error);
    };
    request.onerror = () => reject(request.error);
  });
}
