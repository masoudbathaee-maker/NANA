let db;
let currentPDF = null;
let currentPage = 1;
let totalPages = 1;

const dbName = "PDFLibrary";
const storeName = "pdfs";

const request = indexedDB.open(dbName, 1);

request.onerror = () => {
    alert("خطا در باز کردن دیتابیس!");
};

request.onupgradeneeded = (event) => {
    db = event.target.result;
    db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
};

request.onsuccess = (event) => {
    db = event.target.result;
    loadPDFList();
};

document.getElementById("pdfUpload").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const progress = document.getElementById("uploadProgress");
    const progressBar = document.getElementById("progressBar");
    progress.style.display = "block";
    progressBar.style.width = "0%";
    progressBar.textContent = "0%";

    const reader = new FileReader();
    
    reader.onload = () => {
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        
        store.add({
            name: file.name,
            size: file.size,
            date: new Date().toISOString(),
            data: reader.result
        });

        progress.style.display = "none";
        document.getElementById("pdfUpload").value = "";
        loadPDFList();
    };

    reader.readAsArrayBuffer(file);
});

function loadPDFList() {
    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => {
        const container = document.getElementById("pdfList");
        container.innerHTML = "";

        request.result.forEach((pdf, index) => {
            const card = document.createElement("div");
            card.className = "col-md-4";
            card.innerHTML = `
                <div class="card pdf-card" onclick="openPDF(${index})">
                    <div class="card-body">
                        <h5>📄 ${pdf.name}</h5>
                        <p>📅 ${new Date(pdf.date).toLocaleDateString('fa-IR')}</p>
                        <button class="btn btn-sm btn-danger" onclick="deletePDF(${pdf.id}); event.stopPropagation()">🗑️ حذف</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    };
}

async function openPDF(index) {
    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = async () => {
        const pdfData = request.result[index];
        document.getElementById("pdfTitle").textContent = pdfData.name;
        
        const loadingTask = pdfjsLib.getDocument({ data: pdfData.data });
        currentPDF = await loadingTask.promise;
        totalPages = currentPDF.numPages;
        
        await renderPage(1);
        
        const modal = new bootstrap.Modal(document.getElementById("pdfModal"));
        modal.show();
    };
}

async function renderPage(pageNum) {
    const page = await currentPDF.getPage(pageNum);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });

    const canvas = document.getElementById("pdfCanvas");
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;
    
    document.getElementById("pageInfo").textContent = `صفحه ${pageNum} از ${totalPages}`;
    currentPage = pageNum;
}

document.getElementById("nextPage").addEventListener("click", () => {
    if (currentPage < totalPages) renderPage(currentPage + 1);
});

document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) renderPage(currentPage - 1);
});

function deletePDF(id) {
    if (confirm("آیا مطمئن هستید؟")) {
        const transaction = db.transaction([storeName], "readwrite");
        transaction.objectStore(storeName).delete(id);
        transaction.oncomplete = () => loadPDFList();
    }
}