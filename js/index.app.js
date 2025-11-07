// Impor fungsi yang kita butuhkan HANYA untuk halaman index
import { validasiInput, simpanData } from "./logic.js";

// Ambil elemen dari HTML berdasarkan ID
const form = document.getElementById("formNilai");
const namaInput = document.getElementById("inputNama");
const nimInput = document.getElementById("inputNim");
const matkulInput = document.getElementById("inputMatkul");
const nilaiInput = document.getElementById("inputNilai");
const tombolSimpan = document.getElementById("tombolSimpan");

// Tambahkan "event listener" ke form
// Ini akan berjalan saat tombol 'submit' (Simpan Data) diklik
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = namaInput.value;
  const nim = nimInput.value;

  // Ambil KODE (value) dan NAMA (text) dari matkul
  const matkulKode = matkulInput.value;
  const matkulNama = matkulInput.options[matkulInput.selectedIndex].text;

  const nilai = nilaiInput.value;

  // Kirim KODE-nya untuk divalidasi
  const validasi = validasiInput(nama, nim, matkulKode, nilai);

  if (!validasi.valid) {
    alert(validasi.message);
    return;
  }

  try {
    tombolSimpan.innerText = "Menyimpan...";
    tombolSimpan.disabled = true;

    // Kirim KODE dan NAMA ke fungsi simpanData
    const hasil = await simpanData(nama, nim, matkulKode, matkulNama, nilai);

    if (hasil.success) {
      alert(hasil.message);
      form.reset();
    } else {
      alert(hasil.message);
    }
  } catch (error) {
    alert("Terjadi error: " + error.message);
  } finally {
    tombolSimpan.innerText = "Simpan Data";
    tombolSimpan.disabled = false;
  }
});
