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
      // Reset fields for product 2
      resetFields('.hide-2-product');
      resetFields('.hide-3-product'); // Also reset fields for product 3
    }
  });

  btnThreeProducts.addEventListener('click', function(event) {
    event.preventDefault();
    const isHidden = document.querySelector('.hide-3-product').style.display === 'none';

    // Ensure 2 Product section is shown when 3 Product is clicked
    toggleProducts('.hide-2-product', true); // Show 2 Product section
    btnTwoProducts.textContent = "Batalkan 2 Product"; // Update 2 Product button text
    btnTwoProducts.classList.add('cancel');

    toggleProducts('.hide-3-product', isHidden); // Toggle 3 Product section

    if (isHidden) { // Show 3 Product
      btnThreeProducts.textContent = "Batalkan 3 Product";
      btnThreeProducts.classList.add('cancel');
    } else { // Hide 3 Product
      btnThreeProducts.textContent = "3 Product";
      btnThreeProducts.classList.remove('cancel');
      // Reset fields for product 3
      resetFields('.hide-3-product');
    }
  });

  function toggleProducts(selector, show) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(function(element) {
      element.style.display = show ? 'block' : 'none';
    });
  }

  // Function to reset fields when hiding product sections
  function resetFields(selector) {
    const elements = document.querySelectorAll(`${selector} input, ${selector} select`);
    elements.forEach(function(element) {
      if (element.tagName.toLowerCase() === 'select') {
        element.selectedIndex = 0; // Reset select element to default
      } else if (element.tagName.toLowerCase() === 'input') {
        element.value = ''; // Clear input fields
      }
    });
  }

  function toggleVisibility(selector, hide) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(function(element) {
      element.style.display = hide ? 'none' : 'block';
    });
  }


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
fetch('https://script.google.com/macros/s/AKfycbwoyJq87DOqYkxmebd0iaYh91dXKzGvXxBcxEaG_lv59OaFCGZsJw453GaqvKT3kRKu/exec')
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
  if (document.getElementById('nama_cs')) {
    populateDropdown('nama_cs', data.nama_cs);
  }
  if (document.getElementById('nama_adv')) {
    populateDropdown('nama_adv', data.nama_adv);
  }
  if (document.getElementById('nama_cs_akuisisi')) {
    populateDropdown('nama_cs_akuisisi', data.nama_cs_akuisisi);
  }
  if (document.getElementById('gift_akuisisi')) {
    populateDropdown('gift_akuisisi', data.gift_akuisisi);
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
      fetch('https://script.google.com/macros/s/AKfycbwoyJq87DOqYkxmebd0iaYh91dXKzGvXxBcxEaG_lv59OaFCGZsJw453GaqvKT3kRKu/exec')
        .then(response => response.json())
        .then(data => {
          const sortedProvinsi = [...new Set(data.alamat.map(item => item[0]))].sort();
          populateProvinsi(sortedProvinsi, data.alamat);
        });

      function populateProvinsi(sortedProvinsi, alamat) {
        var provinsiDropdown = $('#provinsi');

        sortedProvinsi.forEach(function (prov) {
          var option = new Option(prov, prov, false, false);
          provinsiDropdown.append(option);
        });

        handleDependentDropdown(alamat);

        // Initialize Select2 on Provinsi dropdown
        $('.searchable-dropdown').select2({
          placeholder: 'Pilih Provinsi',
          allowClear: true
        });

        $('.searchable-dropdown-city').select2({
          placeholder: 'Pilih Kabupaten / Kota',
          allowClear: true
        });
        $('.searchable-dropdown-district').select2({
          placeholder: 'Pilih Kecamatan',
          allowClear: true
        });
      }

      function handleDependentDropdown(alamat) {
        var kabupatenDropdown = $('#kabupaten_kota');
        var kecamatanDropdown = $('#kecamatan');

        $('#provinsi').on('change', function () {
          var selectedProvinsi = $(this).val();
          kabupatenDropdown.html('<option value="" disabled selected hidden>Pilih Kabupaten/Kota</option>');
          kecamatanDropdown.html('<option value="" disabled selected hidden>Pilih Kecamatan</option>');

          const filteredKabupaten = alamat.filter(item => item[0] === selectedProvinsi).map(item => item[1]);
          const sortedKabupaten = [...new Set(filteredKabupaten)].sort((a, b) => a.localeCompare(b));

          populateKabupaten(sortedKabupaten);
        });

        $('#kabupaten_kota').on('change', function () {
          var selectedKabupaten = $(this).val();
          kecamatanDropdown.html('<option value="" disabled selected hidden>Pilih Kecamatan</option>');

          const filteredKecamatan = alamat.filter(item => item[1] === selectedKabupaten).map(item => item[2]);
          const sortedKecamatan = [...new Set(filteredKecamatan)].sort((a, b) => a.localeCompare(b));
          populateKecamatan(sortedKecamatan);
        });

        function populateKabupaten(sortedKabupaten) {
          sortedKabupaten.forEach(function (kab) {
            var option = new Option(kab, kab, false, false);
            kabupatenDropdown.append(option);
          });
          kabupatenDropdown.trigger('change');
        }

        function populateKecamatan(sortedKecamatan) {
          sortedKecamatan.forEach(function (kec) {
            var option = new Option(kec, kec, false, false);
            kecamatanDropdown.append(option);
          });
          kecamatanDropdown.trigger('change');
        }
      }
    });

    	// Fungsi untuk menghapus karakter tanda petik tunggal dan petik belakang dari input
	function validateAlamat(input) {
	  input.value = input.value.replace(/['`]/g, ""); // Menghapus tanda petik tunggal dan petik belakang jika ditemukan
	}
	
	// Menambahkan event listener pada kolom alamat
	document.getElementById('alamat').addEventListener('input', function() {
	  validateAlamat(this);
	});




  //tidak boleh ada spasi di awal nama customer
  function validateNamaCustomer(input) {
    // Convert to uppercase
    input.value = input.value.toUpperCase();
  
    // Validate: no leading space, space allowed only after second character
    const pattern = /^[^\s][A-Z ]*$/;
    if (!pattern.test(input.value)) {
      input.value = input.value.trimStart(); // Remove leading spaces if any
      if (input.value.length >= 2) {
        input.value = input.value.replace(/(\w{2})(\s+)/, '$1 '); // Ensure spaces are allowed after 2 characters
      }
    }
  }