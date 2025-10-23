import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = ({ pdfUrl }) => {
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [scale, setScale] = useState(0.5); // Escala inicial

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handlePageClick = () => {
        setCurrentPage((prevPage) => (prevPage < numPages ? prevPage + 1 : 1)); // Cambiar de página
    };

    // Función para aumentar el zoom
    const zoomIn = () => {
        setScale((prevScale) => Math.min(prevScale + 0.2, 2.0)); // Limita el zoom máximo a 2x
    };

    // Función para disminuir el zoom
    const zoomOut = () => {
        setScale((prevScale) => Math.max(prevScale - 0.2, 0.5)); // Limita el zoom mínimo a 0.5x
    };

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                maxWidth: '600px', // Tamaño máximo para el visor
                maxHeight: '400px', // Tamaño máximo para el visor
                margin: 'auto',
                overflow: 'auto', // Agrega scroll si es necesario
                border: '1px solid #ccc',
                // display: 'flex',
                // justifyContent: 'center',
                // alignItems: 'center',
                // position: 'relative',
                // flexDirection: 'column',
            }}
            onClick={handlePageClick}
        >
            {/* Contenedor de los botones de zoom */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                <button
                    onClick={zoomOut}
                    style={{
                        marginRight: '10px',
                        padding: '10px',
                        fontSize: '16px',
                        cursor: 'pointer',
                    }}
                >
                    Zoom Out
                </button>
                <button
                    onClick={zoomIn}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        cursor: 'pointer',
                    }}
                >
                    Zoom In
                </button>
            </div>

            {/* Mostrar el documento PDF */}
            <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={currentPage} scale={scale} />
            </Document>
        </div>
    );
};

export default PdfViewer;
