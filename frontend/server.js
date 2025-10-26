const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// Static dosyaları serve et
app.use(express.static(path.join(__dirname, 'out')));

// Tüm route'ları index.html'e yönlendir (SPA için)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'out', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Static server running on port ${PORT}`);
});
