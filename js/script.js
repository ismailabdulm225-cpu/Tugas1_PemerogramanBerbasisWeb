// ===============================
// LOGIN SYSTEM
// ===============================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        const user = dataPengguna.find(
            p => p.email === email && p.password === password
        );

        if (user) {
            localStorage.setItem("namaPengguna", user.nama);
            localStorage.setItem("lokasiPengguna", user.lokasi);
            localStorage.setItem("rolePengguna", user.role);

            openModal("successModal");
        } else {
            document.getElementById("alertMessage").innerText =
                "Email / password salah!";
            openModal("alertModal");
        }
    });
}


// Enter key submit
document.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {

        const successModal = document.getElementById("successModal");

        // kalau popup login sukses terbuka → masuk dashboard
        if (successModal && successModal.style.display === "block") {
            goToDashboard();
            return;
        }

        // kalau masih di form login → submit login
        if (loginForm) {
            loginForm.requestSubmit();
        }
    }
});


// ===============================
// MODAL SYSTEM (DOM INTERACTION)
// ===============================
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "block";
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
}

window.addEventListener("click", function (event) {
    document.querySelectorAll(".modal").forEach(modal => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

function showAlert(pesan) {
    document.getElementById("alertMessage").innerText = pesan;
    openModal("alertModal");
}

// ===============================
// DASHBOARD GREETING (DOM UPDATE)
// ===============================
function setGreeting() {
    const hour = new Date().getHours();

    let greeting = "Selamat Malam";

    if (hour >= 5 && hour < 12) greeting = "Selamat Pagi";
    else if (hour >= 12 && hour < 15) greeting = "Selamat Siang";
    else if (hour >= 15 && hour < 18) greeting = "Selamat Sore";

    const nama = localStorage.getItem("namaPengguna") || "Pengguna";
    const lokasi = localStorage.getItem("lokasiPengguna");
    const role = localStorage.getItem("rolePengguna");

    const el = document.getElementById("greeting");

    if (el) {
        el.innerHTML = `
            ${greeting}, <b>${nama}</b><br>
            <span style="font-size:14px; color:#555;">
                ${(role ? role : "")} ${(lokasi ? "• " + lokasi : "")}
            </span>
        `;
    }
}

// ===============================
// LOGOUT
// ===============================
function logout() {
    localStorage.clear();
    showAlert("Anda telah logout");
}

// ===============================
// TRACKING SYSTEM (DOM RENDER)
// ===============================
function searchTracking() {
    const input = document.getElementById("trackingInput");
    const result = document.getElementById("trackingResult");

    if (!input || !result) return;

    const value = input.value.trim();

    if (!value) {
        showAlert("Masukkan nomor DO!");
        return;
    }

    const data = dataTracking[value];

    if (!data) {
        result.innerHTML = "";
        showAlert("Data tidak ditemukan");
        return;
    }

    let history = "";

    data.perjalanan.forEach(item => {
        history += `
            <li>
                <strong>${item.waktu}</strong><br>
                ${item.keterangan}
            </li>
        `;
    });

    result.innerHTML = `
        <h3>Detail Pengiriman</h3>

        <div class="tracking-info-panel">

            <div class="tracking-row">
                <span class="label">Nama</span>
                <strong>${data.nama}</strong>
            </div>

            <div class="tracking-row">
                <span class="label">DO</span>
                <strong>${data.nomorDO}</strong>
            </div>

            <div class="tracking-row">
                <span class="label">Status</span>
                <strong>${data.status}</strong>
            </div>

            <div class="tracking-row">
                <span class="label">Ekspedisi</span>
                <strong>${data.ekspedisi}</strong>
            </div>

            <div class="tracking-row">
                <span class="label">Tanggal</span>
                <strong>${data.tanggalKirim}</strong>
            </div>

            <div class="tracking-row">
                <span class="label">Paket</span>
                <strong>${data.paket}</strong>
            </div>

            <div class="tracking-row">
                <span class="label">Total</span>
                <strong>${data.total}</strong>
            </div>

        </div>

        <h4>Riwayat:</h4>
        <ul>${history}</ul>
    `;
}

// ===============================
// STOK SYSTEM (DOM CRUD + RENDER)
// ===============================
window.addEventListener("DOMContentLoaded", function () {
    renderStok();
});

function renderStok() {
    const container = document.getElementById("stokContainer");
    if (!container) return;

    container.innerHTML = "";

    dataBahanAjar.forEach((item, index) => {

        const card = document.createElement("div");
        card.className = "book-card";

        card.innerHTML = `
            <div class="stok-badge">${item.stok}</div>
            <img src="${item.cover}">
            <h3>${item.namaBarang}</h3>

            <button class="btn-detail">Detail</button>

            <div class="book-detail" id="detail-${index}">
                <p>Kode: ${item.kodeBarang}</p>
                <p>Lokasi: ${item.kodeLokasi}</p>
                <p>Jenis: ${item.jenisBarang}</p>
                <p>Edisi: ${item.edisi}</p>
                <p>Stok: ${item.stok}</p>
            </div>
        `;

        card.querySelector(".btn-detail").addEventListener("click", function () {
            document.getElementById("detail-" + index).classList.toggle("active");
        });

        container.appendChild(card);
    });
}

// ===============================
// ADD STOK (CREATE DATA - DOM CRUD)
// ===============================
function addStok() {
    const kodeBarang = document.getElementById("kodeBarang").value.trim();
    const namaBarang = document.getElementById("namaBarang").value.trim();
    const stok = document.getElementById("stok").value.trim();

    if (!kodeBarang || !namaBarang || !stok) {
        showAlert("Semua field wajib diisi!");
        return;
    }

    const newItem = {
        kodeLokasi: "BARU",
        kodeBarang,
        namaBarang,
        jenisBarang: "BMP",
        edisi: "1",
        stok: Number(stok),
        cover: "img/default.jpg"
    };

    dataBahanAjar.push(newItem);

    renderStok();

    document.getElementById("kodeBarang").value = "";
    document.getElementById("namaBarang").value = "";
    document.getElementById("stok").value = "";

    showAlert("Data berhasil ditambahkan!");
}

function goToDashboard() {
    window.location.href = "dashboard.html";
}