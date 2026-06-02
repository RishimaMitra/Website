/* ═══════════════════════════════════════
   LIVE SPREADSHEET STORAGE ENGINE LINK
   ════════════════════════════════════════ */
window.SensioData = {
  sourceFile: "Sensio Excel Data Hub",
  tenders: []
};

// Sync and read rows out of your generated spreadsheet before charts render
(function initializeSensioExcelStream() {
  try {
    const request = new XMLHttpRequest();
    // Connect to your local Excel-parsing python script
    request.open('GET', 'http://localhost:5000/api/sensio-stream', false); // 'false' blocks page rendering until data is loaded
    request.send(null);

    if (request.status === 200) {
      const streamPayload = JSON.parse(request.responseText);
      
      // Inject the Excel rows straight into your Sensio interface object
      window.SensioData.tenders = streamPayload.tenders;
      window.SensioData.sourceFile = streamPayload.sourceFile;
      
      console.log(`⚡ Excel Sheet connected successfully! Loaded ${streamPayload.tenders.length} active rows into UI.`);
      
      // ──── AUTOMATED WATCHLIST RE-SYNC WITH PYTHON BACKEND FOR GMAIL ALERTS ────
      const saved = localStorage.getItem('sensio_saved_tenders');
      const savedIds = saved ? JSON.parse(saved) : [];
      
      // Send a silent background request for each saved item so server.py knows about them on launch
      savedIds.forEach(id => {
        fetch('http://localhost:5000/api/save-tender', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tenderId: id, isSaved: true })
        })
        .then(res => res.json())
        .then(data => console.log(`[Startup Sync]: Watchlist asset ${id} aligned with Gmail pipeline.`))
        .catch(err => console.error("[Startup Sync Failure]: Couldn't reach email engine node:", err));
      });

    } else {
      throw new Error(`Server returned invalid status code: ${request.status}`);
    }
  } catch (err) {
    console.error("Dashboard failed to read from Excel API Bridge. Ensure server.py is running! Error: ", err);
    window.SensioData.tenders = []; // Graceful empty fallback to keep dashboard from crashing
  }
})();
