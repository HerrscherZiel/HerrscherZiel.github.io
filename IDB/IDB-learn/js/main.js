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
        bacaDariDatabase();
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


form.addEventListener('submit', tambahBaris);
tabel.addEventListener('click',hapusBaris)



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
    baris.id = nim.value;
    baris.insertCell().appendChild(document.createTextNode(nim.value));
    baris.insertCell().appendChild(document.createTextNode(nama.value));
    baris.insertCell().appendChild(document.createTextNode(gender.value));

    // tambah tombol hapus
    var tombolHapus = document.createElement('input');
    tombolHapus.type = 'button';
    tombolHapus.value = 'Hapus';
    tombolHapus.className = 'btn btn-sm btn-danger';
    tombolHapus.id = result.value.nim;
    baris.insertCell().appendChild(tombolHapus);
    e.preventDefault();
    
}

function tambahKeDatabase(mahasiswa) {
    var objectStore = buatTransaksi().objectStore('mahasiswa');
    var request = objectStore.add(mahasiswa);
    request.onerror = handleError;
    request.onsuccess = console.log('Mahasiswa [' + mahasiswa.nim + '] ditambahkan');
}

function buatTransaksi() {
    var transaction = db.transaction(['mahasiswa'], 'readwrite');
    transaction.onerror = handleError;
    transaction.complete = console.log('Transaksi baru sukses ');
    return transaction;
}

function bacaDariDatabase() {
    var objectStore= buatTransaksi().objectStore('mahasiswa');
    objectStore.openCursor().onsuccess = function(e) {
        var result = e.target.result;
        if (result) {
            console.log('Membaca mahasiswa [ ' + result.value.nim + ' ] dari database');

            var baris = tabel.insertRow();
            baris.id = result.value.nim;
            baris.insertCell().appendChild(document.createTextNode(result.value.nim));
            baris.insertCell().appendChild(document.createTextNode(result.value.nama));
            baris.insertCell().appendChild(document.createTextNode(result.value.gender));

            var tombolHapus = document.createElement('input');
            tombolHapus.type = 'button';
            tombolHapus.value = 'Hapus';
            tombolHapus.className = 'btn btn-sm btn-danger';
            tombolHapus.id = result.value.nim;
            baris.insertCell().appendChild(tombolHapus);
            e.preventDefault();
        }
    }
}

function hapusBaris(e) {
    if (e.target.type === 'button'){
        var hapus = confirm('Apakah anda yakin akan menghapus data ?');
        if (hapus){
            tabel.deleteRow(tabel.rows.namedItem(e.target.id).sectionRowIndex);
        }
    }
}



function hapusDariDB(nim) {
    var objectStore = buatTransaksi().objectStore('mahasiswa');
    var request = objectStore.delete(nim);
    request.onerror = handleError;
    request.onsuccess = console.log('Mahasiswa [ '+nim+' ] terhapus');
}



