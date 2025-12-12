import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Worker configuration
// Use Vite's ?url import to get the correct path to the worker in node_modules
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

function PDFCanvas({ file, children, onLoadSuccess, onLoadError }) {
    const [numPages, setNumPages] = useState(null);
    const [pageWidth, setPageWidth] = useState(null);
    const containerRef = useRef(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        if (onLoadSuccess) onLoadSuccess({ numPages });
    }

    // Render ALL pages
    return (
        <div className="pdf-canvas-container" ref={containerRef} style={{ position: 'relative', width: '100%', minHeight: '400px' }}>
            <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div className="p-4">PDF Yükleniyor...</div>}
                error={<div>PDF yüklenemedi. <br /> <span style={{ fontSize: '10px', color: 'red' }}>{window.pdfError}</span></div>}
                onLoadError={(error) => {
                    console.error('PDF Load Error:', error);
                    if (onLoadError) onLoadError(error);
                }}
            >
                {numPages && Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`} style={{ position: 'relative', marginBottom: '20px' }}>
                        <Page
                            pageNumber={index + 1}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            width={containerRef.current ? containerRef.current.clientWidth : null}
                            onLoadSuccess={(page) => {
                                if (index === 0) setPageWidth(page.width);
                            }}
                        />
                        {/* Overlay for first page only (for field mapping) */}
                        {index === 0 && pageWidth && (
                            <div className="pdf-overlay" style={{ position: 'absolute', inset: 0 }}>
                                {children}
                            </div>
                        )}
                    </div>
                ))}
            </Document>
        </div>
    );
}

export default PDFCanvas;
