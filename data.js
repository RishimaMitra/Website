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
    } else {
      throw new Error(`Server returned invalid status code: ${request.status}`);
    }
  } catch (err) {
    console.error("Dashboard failed to read from Excel API Bridge. Ensure server.py is running! Error: ", err);
    window.SensioData.tenders = []; // Graceful empty fallback to keep dashboard from crashing
  }
})();
