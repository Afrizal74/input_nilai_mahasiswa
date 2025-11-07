// Impor fungsi yang dibutuhkan HANYA untuk halaman data
import { loadData, tampilkanDataKeTable } from "./logic.js";

// Fungsi async untuk memuat dan menampilkan data
async function muatDanTampilkanData() {
  try {
    // 1. Panggil fungsi loadData dari logic.js
    const data = await loadData();

    // 2. Panggil fungsi tampilkanDataKeTable dari logic.js
    tampilkanDataKeTable(data);
  } catch (error) {
    console.error("Gagal memuat data:", error);
    // Tampilkan pesan error di tabel jika gagal
    const tableBody = document.getElementById("dataTable");
    if (tableBody) {
      tableBody.innerHTML = `<tr><td colspan="5">Gagal mengambil data dari database.</td></tr>`;
    }
  }
}

// Jalankan fungsi 'muatDanTampilkanData'
// saat halaman HTML selesai dimuat (DOMContentLoaded)
document.addEventListener("DOMContentLoaded", muatDanTampilkanData);
