{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // \uc0\u1583 \u1740 \u1578 \u1575 \u1576 \u1740 \u1587  IndexedDB\
let db;\
const dbName = "PDFLibrary";\
const storeName = "pdfs";\
\
// \uc0\u1585 \u1575 \u1607 \u8204 \u1575 \u1606 \u1583 \u1575 \u1586 \u1740  \u1583 \u1740 \u1578 \u1575 \u1576 \u1740 \u1587 \
const request = indexedDB.open(dbName, 1);\
\
request.onerror = (event) => \{\
    console.error("\uc0\u1583 \u1740 \u1578 \u1575 \u1576 \u1740 \u1587  \u1576 \u1575 \u1586  \u1606 \u1588 \u1583 :", event.target.error);\
\};\
\
request.onupgradeneeded = (event) => \{\
    db = event.target.result;\
    const store = db.createObjectStore(storeName, \{ keyPath: "id", autoIncrement: true \});\
    store.createIndex("name", "name", \{ unique: false \});\
    store.createIndex("date", "date", \{ unique: false \});\
\};\
\
request.onsuccess = (event) => \{\
    db = event.target.result;\
    loadPDFList();\
\};\
\
// \uc0\u1570 \u1662 \u1604 \u1608 \u1583  PDF\
document.getElementById("pdfUpload").addEventListener("change", async (e) => \{\
    const file = e.target.files[0];\
    if (!file) return;\
\
    const progress = document.getElementById("uploadProgress");\
    const progressBar = document.getElementById("progressBar");\
    progress.style.display = "block";\
\
    const reader = new FileReader();\
    reader.onprogress = (e) => \{\
        if (e.lengthComputable) \{\
            const percent = (e.loaded / e.total) * 100;\
            progressBar.style.width = percent + "%";\
            progressBar.textContent = Math.round(percent) + "%";\
        \}\
    \};\
\
    reader.onload = async () => \{\
        const arrayBuffer = reader.result;\
        \
        // \uc0\u1584 \u1582 \u1740 \u1585 \u1607  \u1583 \u1585  \u1583 \u1740 \u1578 \u1575 \u1576 \u1740 \u1587 \
        const transaction = db.transaction([storeName], "readwrite");\
        const store = transaction.objectStore(storeName);\
        const pdfData = \{\
            name: file.name,\
            size: file.size,\
            date: new Date().toISOString(),\
            data: arrayBuffer\
        \};\
\
        const addRequest = store.add(pdfData);\
        addRequest.onsuccess = () => \{\
            progress.style.display = "none";\
            document.getElementById("pdfUpload").value = "";\
            loadPDFList();\
        \};\
    \};\
\
    reader.readAsArrayBuffer(file);\
\});\
\
// \uc0\u1576 \u1575 \u1585 \u1711 \u1584 \u1575 \u1585 \u1740  \u1604 \u1740 \u1587 \u1578  PDF\u1607 \u1575 \
function loadPDFList() \{\
    const transaction = db.transaction([storeName], "readonly");\
    const store = transaction.objectStore(storeName);\
    const request = store.getAll();\
\
    request.onsuccess = () => \{\
        const pdfs = request.result;\
        const container = document.getElementById("pdfList");\
        container.innerHTML = "";\
\
        pdfs.forEach((pdf, index) => \{\
            const card = document.createElement("div");\
            card.className = "col-md-4 mb-3";\
            card.innerHTML = `\
                <div class="card pdf-card" onclick="openPDF($\{index\})">\
                    <div class="card-body">\
                        <h5 class="card-title">\uc0\u55357 \u56516  $\{pdf.name\}</h5>\
                        <p class="card-text">\
                            \uc0\u1581 \u1580 \u1605 : $\{(pdf.size / 1024 / 1024).toFixed(2)\} MB<br>\
                            \uc0\u1578 \u1575 \u1585 \u1740 \u1582 : $\{new Date(pdf.date).toLocaleDateString('fa-IR')\}\
                        </p>\
                        <button class="btn btn-sm btn-danger" onclick="deletePDF($\{pdf.id\}); event.stopPropagation();">\uc0\u55357 \u56785 \u65039  \u1581 \u1584 \u1601 </button>\
                    </div>\
                </div>\
            `;\
            container.appendChild(card);\
        \});\
    \};\
\}\
\
// \uc0\u1606 \u1605 \u1575 \u1740 \u1588  PDF\
let currentPDF = null;\
let currentPage = 1;\
let totalPages = 1;\
\
async function openPDF(index) \{\
    const transaction = db.transaction([storeName], "readonly");\
    const store = transaction.objectStore(storeName);\
    const request = store.getAll();\
\
    request.onsuccess = async () => \{\
        const pdfs = request.result;\
        const pdfData = pdfs[index];\
        \
        document.getElementById("pdfTitle").textContent = pdfData.name;\
        \
        // \uc0\u1576 \u1575 \u1585 \u1711 \u1584 \u1575 \u1585 \u1740  \u1576 \u1575  PDF.js\
        const loadingTask = pdfjsLib.getDocument(\{ data: pdfData.data \});\
        currentPDF = await loadingTask.promise;\
        totalPages = currentPDF.numPages;\
        \
        renderPage(1);\
        \
        const modal = new bootstrap.Modal(document.getElementById("pdfModal"));\
        modal.show();\
    \};\
\}\
\
// \uc0\u1585 \u1606 \u1583 \u1585  \u1589 \u1601 \u1581 \u1607  PDF\
async function renderPage(pageNum) \{\
    const page = await currentPDF.getPage(pageNum);\
    const scale = 1.5;\
    const viewport = page.getViewport(\{ scale \});\
\
    const canvas = document.getElementById("pdfCanvas");\
    const context = canvas.getContext("2d");\
    canvas.height = viewport.height;\
    canvas.width = viewport.width;\
\
    const renderContext = \{\
        canvasContext: context,\
        viewport: viewport\
    \};\
\
    await page.render(renderContext).promise;\
    document.getElementById("pageInfo").textContent = `\uc0\u1589 \u1601 \u1581 \u1607  $\{pageNum\} \u1575 \u1586  $\{totalPages\}`;\
    currentPage = pageNum;\
\}\
\
// \uc0\u1589 \u1601 \u1581 \u1607  \u1576 \u1593 \u1583 \u1740 \
document.getElementById("nextPage").addEventListener("click", () => \{\
    if (currentPage < totalPages) \{\
        renderPage(currentPage + 1);\
    \}\
\});\
\
// \uc0\u1589 \u1601 \u1581 \u1607  \u1602 \u1576 \u1604 \u1740 \
document.getElementById("prevPage").addEventListener("click", () => \{\
    if (currentPage > 1) \{\
        renderPage(currentPage - 1);\
    \}\
\});\
\
// \uc0\u1581 \u1584 \u1601  PDF\
function deletePDF(id) \{\
    if (confirm("\uc0\u1570 \u1740 \u1575  \u1605 \u1591 \u1605 \u1574 \u1606  \u1607 \u1587 \u1578 \u1740 \u1583 \u1567 ")) \{\
        const transaction = db.transaction([storeName], "readwrite");\
        const store = transaction.objectStore(storeName);\
        store.delete(id);\
        transaction.oncomplete = () => loadPDFList();\
    \}\
\}}