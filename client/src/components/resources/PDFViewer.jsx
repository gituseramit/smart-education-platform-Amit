const PDFViewer = ({ url, title }) => {
  // Use the full URL if it's external, or prepend API base if local
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const pdfUrl = url.startsWith('/') ? `${API_URL}${url}` : url;

  return (
    <div className="flex flex-col h-[80vh] w-full border-[1.5px] border-[var(--cs-border)] rounded-[32px] overflow-hidden bg-[#f8fafc] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]">
      <div className="bg-white px-8 py-5 border-b-[1.5px] border-[var(--cs-border)] flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4 truncate">
          <div className="w-10 h-10 rounded-xl bg-[var(--cs-primary)]/5 flex items-center justify-center text-xl">📄</div>
          <h3 className="font-black text-[#111827] text-[1.1rem] truncate tracking-tight" title={title}>
            {title}
          </h3>
        </div>
        <a 
          href={pdfUrl} 
          download 
          target="_blank" 
          rel="noopener noreferrer"
          className="cs-button-primary px-6 py-2.5 rounded-xl text-[.85rem] font-black flex items-center gap-2 shadow-sm whitespace-nowrap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </a>
      </div>
      <div className="flex-1 w-full bg-[#334155]/10 backdrop-blur-sm p-4">
        <iframe 
          src={`${pdfUrl}#toolbar=0`} 
          className="w-full h-full border-none rounded-2xl shadow-2xl bg-[#1e293b]" 
          title={title}
          allowFullScreen
        >
          <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-[#1e293b] text-white">
            <p className="text-[1.2rem] font-bold mb-4">
              Platform Knowledge Viewer
            </p>
            <p className="text-[#94a3b8] mb-8 font-medium">
              Your current explorer doesn't support built-in PDF viewing.
            </p>
            <a href={pdfUrl} className="cs-button-primary px-8 py-3 rounded-xl">Download the Wisdom Directly</a>
          </div>
        </iframe>
      </div>
    </div>
  );
};

export default PDFViewer;
