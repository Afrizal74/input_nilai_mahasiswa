// KONFIGURASI FIREBASE
// ==========================================
// Meng-import 'db' yang sudah diinisialisasi dari file terpisah
import { db } from "./firebase-config.js";

// Meng-import FUNGSI-FUNGSI Firestore yang akan kita gunakan di file ini
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ==========================================
// CLASS MAHASISWA
// ==========================================
/**
 * Class Mahasiswa
 * Merepresentasikan data mahasiswa sesuai class diagram
 */
class Mahasiswa {
  constructor(nim, nama, prodi) {
    this.nim = nim;
    this.nama = nama;
    this.prodi = prodi;
  }

  /**
   * Method untuk menampilkan data mahasiswa
   */
  tampilData() {
    return {
      nim: this.nim,
      nama: this.nama,
      prodi: this.prodi,
    };
  }

  /**
   * Method untuk input data mahasiswa baru
   */
  inputData(nim, nama, prodi) {
    this.nim = nim;
    this.nama = nama;
    this.prodi = prodi;
  }
}

// ==========================================
// CLASS MATAKULIAH
// ==========================================
/**
 * Class MataKuliah
 * Merepresentasikan data mata kuliah sesuai class diagram
 */
class MataKuliah {
  constructor(kode_mk, nama_mk, sks) {
    this.kode_mk = kode_mk;
    this.nama_mk = nama_mk;
    this.sks = sks;
  }

  /**
   * Method untuk menampilkan data mata kuliah
   */
  tampilMK() {
    return {
      kode_mk: this.kode_mk,
      nama_mk: this.nama_mk,
      sks: this.sks,
    };
  }

  /**
   * Method untuk update data mata kuliah
   */
  updateMK(kode_mk, nama_mk, sks) {
    this.kode_mk = kode_mk;
    this.nama_mk = nama_mk;
    this.sks = sks;
  }
}

// ==========================================
// CLASS NILAI
// ==========================================
/**
 * Class Nilai
 * Merepresentasikan data nilai mahasiswa sesuai class diagram
 * Memiliki relasi dengan Mahasiswa (0..*) dan MataKuliah (0..*)
 */
class Nilai {
  constructor(id_nilai, kode_mk, nilai, nim) {
    this.id_nilai = id_nilai;
    this.kode_mk = kode_mk;
    this.nilai = nilai;
    this.nim = nim;
  }

  /**
   * Method untuk input nilai baru
   */
  inputNilai(kode_mk, nilai, nim) {
    this.kode_mk = kode_mk;
    this.nilai = nilai;
    this.nim = nim;
  }

  /**
   * Method untuk menampilkan data nilai
   */
  tampilNilai() {
    return {
      id_nilai: this.id_nilai,
      kode_mk: this.kode_mk,
      nilai: this.nilai,
      nim: this.nim,
    };
  }
}

// ==========================================
// FUNGSI VALIDASI INPUT
// ==========================================
/**
 * Fungsi validasiInput()
 * Memeriksa apakah semua field telah diisi dengan benar
 * Sesuai dengan activity diagram: langkah validasi data
 *
 * @param {string} nama - Nama lengkap mahasiswa
 * @param {string} nim - Nomor Induk Mahasiswa
 * @param {string} matkul - Mata kuliah yang dipilih
 * @param {string} nilai - Nilai mahasiswa
 * @returns {object} - {valid: boolean, message: string}
 */
function validasiInput(nama, nim, matkul, nilai) {
  // Validasi: cek apakah ada field yang kosong
  if (!nama || nama.trim() === "") {
    return {
      valid: false,
      message: "Nama lengkap tidak boleh kosong!",
    };
  }

  if (!nim || nim.trim() === "") {
    return {
      valid: false,
      message: "NIM tidak boleh kosong!",
    };
  }

  // Validasi: cek apakah NIM hanya berisi angka
  if (!/^\d+$/.test(nim)) {
    return {
      valid: false,
      message: "NIM harus berupa angka!",
    };
  }

  // Validasi: cek apakah mata kuliah sudah dipilih
  if (!matkul) {
    // Cukup cek jika string-nya kosong (falsy)
    return {
      valid: false,
      message: "Silakan pilih mata kuliah!",
    };
  }

  // Validasi: cek apakah nilai sudah diisi
  if (!nilai || nilai.trim() === "") {
    return {
      valid: false,
      message: "Nilai tidak boleh kosong!",
    };
  }

  // Validasi: cek apakah nilai adalah angka valid
  const nilaiNum = parseFloat(nilai);
  if (isNaN(nilaiNum)) {
    return {
      valid: false,
      message: "Nilai harus berupa angka!",
    };
  }

  // Validasi: cek range nilai (0-100)
  if (nilaiNum < 0 || nilaiNum > 100) {
    return {
      valid: false,
      message: "Nilai harus antara 0 sampai 100!",
    };
  }

  // Jika semua validasi berhasil
  return {
    valid: true,
    message: "Validasi berhasil!",
  };
}

// ==========================================
// FUNGSI SIMPAN DATA KE FIREBASE
// ==========================================
/**
 * Fungsi simpanData()
 * Menyimpan data nilai mahasiswa ke Firebase Firestore
 * Sesuai dengan activity diagram: Mengirim data ke firebase
 *
 * @param {string} nama - Nama lengkap mahasiswa
 * @param {string} nim - Nomor Induk Mahasiswa
 * @param {string} matkul - Mata kuliah yang dipilih
 * @param {number} nilai - Nilai mahasiswa
 * @returns {Promise<object>} - {success: boolean, message: string}
 */
// Ubah parameter fungsi
async function simpanData(nama, nim, matkulKode, matkulNama, nilai) {
  try {
    const id_nilai = `NL${Date.now()}`;

    // Buat instance dari class Nilai
    const dataNilai = new Nilai(
      id_nilai,
      matkulKode, // 'kode_mk' sekarang berisi "MK-PM"
      parseFloat(nilai),
      nim
    );

    const dataMahasiswa = new Mahasiswa(nim, nama, "Teknik Informatika");

    // Simpan ke Firestore collection "nilai"
    // Kita membuat SATU dokumen 'nilai'
    const docRef = await addDoc(collection(db, "nilai"), {
      // Data dari 'Nilai'
      id_nilai: dataNilai.id_nilai,
      nilai: dataNilai.nilai,

      // Kunci (FK) dari 'Mahasiswa'
      nim: dataNilai.nim,
      // Data tambahan dari 'Mahasiswa'
      nama: dataMahasiswa.nama,

      // Kunci (FK) dari 'MataKuliah'
      kode_mk: dataNilai.kode_mk,
      // Data tambahan dari 'MataKuliah'
      nama_mk: matkulNama,

      timestamp: new Date().toISOString(),
    });

    console.log("Data berhasil disimpan dengan ID:", docRef.id);

    return {
      success: true,
      message: "Data berhasil disimpan ke database!",
    };
  } catch (error) {
    console.error("Error saat menyimpan data:", error);
    return {
      success: false,
      message: "Gagal menyimpan data: " + error.message,
    };
  }
}

// ==========================================
// FUNGSI LOAD DATA DARI FIREBASE
// ==========================================
/**
 * Fungsi loadData()
 * Mengambil semua data nilai dari Firebase Firestore
 * dan menampilkannya ke tabel di halaman web
 * mengambil data dari firebase & Menampilkan data ke tabel nilai
 *
 * @returns {Promise<Array>} - Array berisi data nilai mahasiswa
 */
async function loadData() {
  try {
    // Query data dari collection "nilai", diurutkan berdasarkan timestamp
    const q = query(collection(db, "nilai"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    const dataNilai = [];

    // Loop semua dokumen yang ditemukan
    querySnapshot.forEach((doc) => {
      dataNilai.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log("Data berhasil dimuat:", dataNilai.length, "record");

    return dataNilai;
  } catch (error) {
    console.error("Error saat memuat data:", error);
    return [];
  }
}

// ==========================================
// FUNGSI TAMPILKAN DATA KE TABEL
// ==========================================
/**
 * Fungsi tampilkanDataKeTable()
 * Menampilkan data dari array ke dalam tabel HTML
 *
 * @param {Array} data - Array berisi data nilai mahasiswa
 */
function tampilkanDataKeTable(data) {
  const tableBody = document.getElementById("dataTable");

  if (!tableBody) {
    console.error("Element dengan id 'dataTable' tidak ditemukan!");
    return;
  }

  // Kosongkan tabel terlebih dahulu
  tableBody.innerHTML = "";

  // Jika tidak ada data
  if (data.length === 0) {
    tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-muted">Belum ada data yang tersimpan.</td>
            </tr>
        `;
    return;
  }

  // Tampilkan setiap data ke tabel
  data.forEach((item, index) => {
    const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${item.nama}</td>
                <td>${item.nim}</td>
                <td>${item.nama_mk}</td>
                <td>${item.nilai}</td>
            </tr>
        `;
    tableBody.innerHTML += row;
  });
}

// ==========================================
// EXPORT FUNCTION
// ==========================================
// Export agar bisa digunakan di file HTML
export {
  validasiInput,
  simpanData,
  loadData,
  tampilkanDataKeTable,
  Mahasiswa,
  MataKuliah,
  Nilai,
};
