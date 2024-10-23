document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  const submitButton = document.querySelector('button[type="submit"]');
  let isSubmitting = false; // Variabel untuk melacak status submit

  // Sembunyikan elemen secara default
  toggleVisibility('.hide-2-product', true);
  toggleVisibility('.hide-3-product', true);

  // Event listener untuk tombol toggle
  const btnTwoProducts = document.getElementById('toggleTwoProducts');
  const btnThreeProducts = document.getElementById('toggleThreeProducts');

  btnTwoProducts.addEventListener('click', function(event) {
    event.preventDefault();
    const isHidden = document.querySelector('.hide-2-product').style.display === 'none';
    toggleProducts('.hide-2-product', isHidden);

    if (isHidden) { // Show 2 Product
      btnTwoProducts.textContent = "Batalkan 2 Product";
      btnTwoProducts.classList.add('cancel');
    } else { // Hide 2 Product
      btnTwoProducts.textContent = "2 Product";
      btnTwoProducts.classList.remove('cancel');
      toggleProducts('.hide-3-product', false); // Also hide 3 Product
      btnThreeProducts.textContent = "3 Product";
      btnThreeProducts.classList.remove('cancel');
    }
  });

  btnThreeProducts.addEventListener('click', function(event) {
    event.preventDefault();
    const isHidden = document.querySelector('.hide-3-product').style.display === 'none';
    toggleProducts('.hide-3-product', isHidden);

    if (isHidden) { // Show 3 Product
      btnThreeProducts.textContent = "Batalkan 3 Product";
      btnThreeProducts.classList.add('cancel');
      toggleProducts('.hide-2-product', true); // Ensure 2 Product is shown
      btnTwoProducts.textContent = "Batalkan 2 Product";
      btnTwoProducts.classList.add('cancel');
    } else { // Hide 3 Product
      btnThreeProducts.textContent = "3 Product";
      btnThreeProducts.classList.remove('cancel');
    }
  });

  // Event listener untuk submit form
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Menghentikan form dari submit biasa

    if (isSubmitting) return; // Jika sudah dalam proses submit, hentikan

    isSubmitting = true; // Tandai bahwa submit sedang berlangsung
    submitButton.disabled = true; // Menonaktifkan tombol submit
    submitButton.textContent = 'Sending...'; // Mengubah teks tombol untuk memberi tahu pengguna bahwa proses sedang berlangsung

    // Lakukan submit data
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
    })
    .then(response => response.json())
    .then(data => {
      if (data.result === 'success') {
        // Tampilkan modal sukses
        showSuccessModal(data.id);
      } else {
        alert('Error: ' + data.error);
        resetSubmitButton();
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Submission failed!');
      resetSubmitButton();
    });
  });

  // Fungsi untuk menampilkan modal sukses
  function showSuccessModal(id) {
    const modalHTML = `
      <div class="modal fade" id="successModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Submit Success</h5>
              <span aria-hidden="true" data-dismiss="modal" style="cursor: pointer;">&times;</span>
            </div>
            <div class="modal-body">
              <p>Data has been successfully submitted!</p>
              <p>ID: <strong id="popup-id">${id}</strong></p>
            </div>
            <div class="modal-footer">
              <button id="copy-id-button" class="btn btn-success">Copy ID</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Menampilkan modal
    $('#successModal').modal('show');

    // Event listener untuk copy ID
    document.getElementById('copy-id-button').onclick = function() {
      const idElement = document.getElementById('popup-id');
      const range = document.createRange();
      range.selectNode(idElement);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      try {
        document.execCommand('copy');
        alert('ID berhasil disalin ke clipboard!');
      } catch (err) {
        alert('Gagal menyalin ID');
      }
      window.getSelection().removeAllRanges();
    };

    // Event listener untuk close modal dengan ikon "X" dan tombol "Close"
$('#successModal').on('hidden.bs.modal', function () {
  submitButton.disabled = false; // Mengaktifkan kembali tombol submit
  submitButton.textContent = 'Submit'; // Mengubah teks tombol kembali ke 'Submit'
  isSubmitting = false; // Reset status submit setelah modal ditutup
  
  // Reset dropdown "Kabupaten / Kota" menggunakan Select2
  $('#kabupaten_kota').val(null).trigger('change');
  
  $('#successModal').remove(); // Menghapus modal dari DOM setelah ditutup
});


    form.reset(); // Reset form jika perlu
  }

  // Fungsi untuk mengaktifkan kembali tombol submit dan mereset teksnya
  function resetSubmitButton() {
    submitButton.disabled = false;
    submitButton.textContent = 'Submit';
    isSubmitting = false; // Reset status submit
  }

  // Fungsi untuk toggle visibility
  function toggleVisibility(selector, hide) {
    document.querySelectorAll(selector).forEach(function(element) {
      element.style.display = hide ? 'none' : 'block';
    });
  }

  // Fungsi untuk toggle produk
  function toggleProducts(target, shouldShow) {
    document.querySelectorAll(target).forEach(function(element) {
      element.style.display = shouldShow ? 'block' : 'none';
    });
  }

  //tambahkan disini jika ingin menambahkan data dropdown yang di ambil dari spreadsheet
  // Populate dropdowns (asynchronous request)
fetch('https://script.google.com/macros/s/AKfycbzRnHTACfMdVgA6Y1frWhQpL6FumlFRg-Tk-abn_9Lr613tL3jBEYRM3t1rh_olwgX2/exec')
.then(response => response.json())
.then(data => {
  if (document.getElementById('product')) {
    populateDropdown('product', data.product);
  }
  if (document.getElementById('product2')) {
    populateDropdown('product2', data.product2);
  }
  if (document.getElementById('product3')) {
    populateDropdown('product3', data.product3);
  }
  if (document.getElementById('gift')) {
    populateDropdown('gift', data.gift);
  }
  if (document.getElementById('gift_akuisisi')) {
    populateDropdown('gift_akuisisi', data.gift_akuisisi);
  }
  if (document.getElementById('nama_cs')) {
    populateDropdown('nama_cs', data.nama_cs);
  }
  if (document.getElementById('nama_adv')) {
    populateDropdown('nama_adv', data.nama_adv);
  }
  if (document.getElementById('nama_cs_akuisisi')) {
    populateDropdown('nama_cs_akuisisi', data.nama_cs_akuisisi);
  }
})
.catch(error => console.error('Error:', error));

// Fungsi untuk populate dropdown
function populateDropdown(elementId, items) {
const selectElement = document.getElementById(elementId);
if (!selectElement) return;  // Tidak lanjutkan jika elemen tidak ditemukan

items.forEach(function(item) {
  if (item.trim() !== '') {
    const option = document.createElement('option');
    option.value = item;
    option.textContent = item;
    selectElement.appendChild(option);
  }
});
}
});

// Fungsi untuk memformat nomor telepon
function formatPhoneNumber(input) {
  let value = input.value;

  if (event.inputType === "deleteContentBackward") {
    if (value === "62") {
      input.value = "";
    }
    return;
  }

  value = value.replace(/\D/g, '');

  if (value.startsWith('0')) {
    value = value.substring(1);
  }

  if (!value.startsWith('62')) {
    value = '62' + value;
  }

  input.value = value;
}





function formatRupiah(input) {
  // Ambil nilai dari input
  let value = input.value;

  // Hapus semua karakter selain angka dan koma
  value = value.replace(/[^,\d]/g, '');

  // Pastikan value diubah menjadi angka sebelum diformat
  const numberValue = parseFloat(value) || 0;

  // Format angka ke dalam format Rupiah
  const rupiah = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
  }).format(numberValue);

  // Set nilai yang diformat kembali ke input dengan spasi setelah 'Rp'
  input.value = rupiah.replace("Rp", "Rp ");
}



function showWarningBiayaAdmin(input) {
if (!warned) {
  if (confirm('Anda ingin mengedit Total Biaya Admin? Perubahan akan mengabaikan perhitungan otomatis.')) {
    warned = true;
    input.readOnly = false; // Membiarkan pengguna mengedit
  } else {
    input.blur(); // Menghilangkan fokus dari input jika pengguna membatalkan
  }
}
}





// Fungsi untuk memperbarui total
//untuk formcod
function updateTotalCod() {
  const harga1 = getNumericValue('harga_product');
  const harga2 = getNumericValue('harga_product2');
  const harga3 = getNumericValue('harga_product3');
  const ongkir = getNumericValue('biaya_ongkir');
  const penanganan = getNumericValue('biaya_penanganan');
  const diskon = getNumericValue('diskon_ongkir');
  const total = harga1 + harga2 + harga3 + ongkir + penanganan - diskon;
  document.getElementById('total_cod').value = formatRupiahAmount(total);
}

//untuk formtf
function updateTotalTF() {
  const harga1 = getNumericValue('harga_product');
  const harga2 = getNumericValue('harga_product2');
  const harga3 = getNumericValue('harga_product3');
  const ongkir = getNumericValue('biaya_ongkir');
  // const penanganan = getNumericValue('biaya_penanganan');
  const diskon = getNumericValue('diskon_ongkir');
  const total = harga1 + harga2 + harga3 + ongkir - diskon;
  document.getElementById('total_tf').value = formatRupiahAmount(total);
}

// Fungsi untuk mendapatkan nilai numerik dari elemen
function getNumericValue(elementId) {
  const value = document.getElementById(elementId).value;
  return parseInt(value.replace(/[^0-9]/g, '')) || 0;
}

// Fungsi untuk memformat angka dalam format Rupiah
function formatRupiahAmount(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace("Rp", "Rp ");
}

// Fungsi untuk menampilkan peringatan saat mengedit total COD
let warned = false;

function showWarning(input) {
  if (!warned) {
    if (confirm('Anda ingin mengedit Total COD? Perubahan akan mengabaikan perhitungan otomatis.')) {
      warned = true;
      input.readOnly = false; // Membiarkan pengguna mengedit
    } else {
      input.blur(); // Menghilangkan fokus dari input jika pengguna membatalkan
    }
  }
}





// login dan logout

    // Cek status login
    if (!sessionStorage.getItem('loggedIn')) {
      // Jika belum login, arahkan ke halaman login
      window.location.href = "login.html";
    }
  
  
    // Fungsi logout
    function logout() {
      // Hapus status login dari sessionStorage
      sessionStorage.removeItem('loggedIn');
      // Arahkan kembali ke halaman login
      window.location.href = "login.html";
    }
  


    //DEPENDENT DROPDOWN UTK PROVINCE KAB KECAMATAN
    document.addEventListener('DOMContentLoaded', function () {
      // Fetch data from Google Apps Script
      fetch('https://script.google.com/macros/s/AKfycbzRnHTACfMdVgA6Y1frWhQpL6FumlFRg-Tk-abn_9Lr613tL3jBEYRM3t1rh_olwgX2/exec')
        .then(response => response.json())
        .then(data => {
          // Sort data provinsi sebelum mengisi dropdown
          const sortedProvinsi = [...new Set(data.alamat.map(item => item[0]))].sort(); // Ambil provinsi unik lalu urutkan
          populateProvinsi(sortedProvinsi, data.alamat); // Menyesuaikan dengan data.alamat dari Google Apps Script
        });
    
      // Function to populate the 'Provinsi' dropdown
      function populateProvinsi(sortedProvinsi, alamat) {
        var provinsiDropdown = document.getElementById("provinsi");
    
        sortedProvinsi.forEach(function (prov) {
          var option = document.createElement("option");
          option.value = prov; // Nama Provinsi
          option.text = prov; // Nama Provinsi
          provinsiDropdown.appendChild(option);
        });
    
        // Setelah Provinsi diisi, kita lanjutkan untuk menangani dependent dropdown
        handleDependentDropdown(alamat);
      }
    
      // Function to handle dependent dropdown for Kabupaten/Kota and Kecamatan
      function handleDependentDropdown(alamat) {
        var kabupatenDropdown = document.getElementById("kabupaten_kota");
        var kecamatanDropdown = document.getElementById("kecamatan");
    
        // Event listener for Provinsi dropdown change
        document.getElementById("provinsi").addEventListener("change", function () {
          var selectedProvinsi = this.value;
    
          // Reset Kabupaten/Kota and Kecamatan when Provinsi is selected again
          kabupatenDropdown.innerHTML = "<option value='' disabled selected hidden>Pilih Kabupaten/Kota</option>"; // Reset Kabupaten/Kota dropdown
          kecamatanDropdown.innerHTML = "<option value='' disabled selected hidden>Pilih Kecamatan</option>"; // Reset Kecamatan dropdown
    
          // Sort kabupaten based on selected provinsi
          const filteredKabupaten = alamat.filter(item => item[0] === selectedProvinsi).map(item => item[1]);
          const sortedKabupaten = [...new Set(filteredKabupaten)].sort((a, b) => a.localeCompare(b)); // Sort with localeCompare for string sorting
    
          populateKabupaten(sortedKabupaten); // Populate Kabupaten/Kota based on the selected Provinsi
        });
    
        // Event listener for Kabupaten/Kota dropdown change
        document.getElementById("kabupaten_kota").addEventListener("change", function () {
          var selectedKabupaten = this.value;
          kecamatanDropdown.innerHTML = "<option value='' disabled selected hidden>Pilih Kecamatan</option>"; // Reset Kecamatan dropdown saat kabupaten dipilih ulang
    
          // Sort kecamatan based on selected kabupaten
          const filteredKecamatan = alamat.filter(item => item[1] === selectedKabupaten).map(item => item[2]);
          const sortedKecamatan = [...new Set(filteredKecamatan)].sort((a, b) => a.localeCompare(b)); // Sort with localeCompare for string sorting
          populateKecamatan(sortedKecamatan); // Populate Kecamatan based on the selected Kabupaten/Kota
        });
    
        // Populate Kabupaten/Kota based on selected Provinsi
        function populateKabupaten(sortedKabupaten) {
          sortedKabupaten.forEach(function (kab) {
            var option = document.createElement("option");
            option.value = kab; // Nama Kabupaten
            option.text = kab; // Nama Kabupaten
            kabupatenDropdown.appendChild(option);
          });
        }
    
        // Populate Kecamatan based on selected Kabupaten/Kota
        function populateKecamatan(sortedKecamatan) {
          sortedKecamatan.forEach(function (kec) {
            var option = document.createElement("option");
            option.value = kec; // Nama Kecamatan
            option.text = kec; // Nama Kecamatan
            kecamatanDropdown.appendChild(option);
          });
        }
      }
    });