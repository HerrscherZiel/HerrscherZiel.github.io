createDatabase();
function createDatabase() {
    if (!('indexedDB' in window)){
        console.log('Web Browser tidak mendukung Indexed DB');
        return;
    }
    var request = window.indexedDB.open('latihan-idb',1);
    request.onerror = handleError;
    request.onupgradeneeded = (e)=>{
        var db = e.target.result;
        db.onerror = handleError;
        var objectStore = db.createObjectStore('mahasiswa',
            {keyPath: 'nim'});
        console.log('Object store mahasiswa berhasil dibuat');
    }
    request.onsuccess = (e) => {
        db = e.target.result;
        db.error = handleError;
        console.log('Berhasil melakukan koneksi ke database lokal');
        // do something...
    }
}

function handleError(e) {
    console.log('Error DB : '+e.target.errorCode);
}

var nim = document.getElementById('nim'),
    nama = document.getElementById('nama'),
    gender = document.getElementById('gender'),
    form = document.getElementById('form-tambah'),
    tabel = document.getElementById('tabel-mahasiswa');

// tambah data
form.addEventListener('submit', tambahBaris);

function tambahBaris(e) {
    // cek apakah nim sudah ada
    if(tabel.rows.namedItem(nim.value)) {
        alert('Error : NIM sudah terdaftar');
        e.preventDefault();
        return;
    }

    // tambahkan ke dalam database
    tambahKeDatabase( {
        nim: nim.value,
        nama: nama.value,
        gender: gender.value
    });

    // nambahin baris
    var baris = tabel.insertRow();
    baris.insertCell().appendChild(document.createTextNode(nim.value));
    baris.insertCell().appendChild(document.createTextNode(nama.value));
    baris.insertCell().appendChild(document.createTextNode(gender.value));

    // tambah tombol hapus
    var tombolHapus = document.createElement('input');
    tombolHapus.type = 'button';
    tombolHapus.value = 'Hapus';
    tombolHapus.id = nim.value;
    baris.insertCell().appendChild(tombolHapus);
    e.preventDefault();

function tambahKeDatabase(mahasiswa) {
    var objectStore = buatTransaksi().objectStore('Mahasiswa');
    transaction.onerror = handleError;
    transaction.onsuccess = console.log('Mahasiswa [' + mahasiswa.nim + '] ditambahkan');
}

function buatTransaksi() {
    var transaction = db.transaction(['mahasiswa'], 'readwrite');
    transaction.onerror = handleError;
    transaction.onsuccess = console.log('Transaksi baru sukses ');
    return transaction;
}

}

