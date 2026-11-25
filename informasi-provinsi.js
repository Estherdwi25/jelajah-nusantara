/* =====================================================================
   INFORMASI SINGKAT untuk kartu di halaman pilih provinsi (pulau.html)
   ---------------------------------------------------------------------
   - INFO_PULAU    : teks default kartu (kunci = nama pulau di URL, mis. "sumatra")
   - INFO_PROVINSI : teks yang muncul saat kursor menyentuh sebuah provinsi
                     (kunci = nama provinsi persis seperti di provinsi-data.js)

   Mau ganti isi? Cukup ubah teks di dalam tanda kutip. Pemisah paragraf: \n
   Kalau sebuah provinsi tidak ada di daftar, kartu kembali menampilkan info pulau.
   ===================================================================== */

window.INFO_PULAU = {
  "sumatra":
    "Sumatra adalah pulau terbesar di bagian barat Indonesia dan terdiri dari 10 provinsi.\n" +
    "Pulau ini kaya hutan hujan, pegunungan, dan danau, seperti Danau Toba.\n" +
    "Budayanya beragam: Aceh, Batak, Minangkabau, Melayu, hingga Lampung.",
  "jawa":
    "Jawa adalah pulau dengan penduduk terpadat di Indonesia dan pusat pemerintahan serta ekonomi.\n" +
    "Terdiri dari 6 provinsi dengan budaya Sunda, Jawa, Betawi, dan Madura.\n" +
    "Di sini ada Candi Borobudur, gunung berapi, dan keraton yang masih lestari.",
  "kalimantan":
    "Kalimantan adalah bagian Indonesia dari Pulau Borneo, pulau terbesar ketiga di dunia.\n" +
    "Terdiri dari 5 provinsi, dialiri sungai-sungai besar dan diselimuti hutan tropis.\n" +
    "Rumah bagi suku Dayak, Banjar, dan Melayu serta satwa seperti orangutan.",
  "sulawesi":
    "Sulawesi berbentuk unik seperti huruf K dan terdiri dari 6 provinsi.\n" +
    "Budayanya kaya: Minahasa, Bugis, Makassar, Toraja, Mandar, dan Gorontalo.\n" +
    "Lautnya terkenal dengan terumbu karang dan perahu layar phinisi.",
  "bali-nusa-tenggara":
    "Bali dan Nusa Tenggara adalah rangkaian pulau di selatan Indonesia bagian timur, terdiri dari 3 provinsi.\n" +
    "Di sini ada Bali, Lombok, Sumbawa, Sumba, Flores, dan Timor.\n" +
    "Terkenal dengan budaya Hindu Bali, tenun ikat, komodo, dan pemandangan alam yang dramatis.",
  "maluku":
    "Maluku adalah gugusan pulau di Indonesia timur yang terdiri dari 2 provinsi.\n" +
    "Sejak dulu dijuluki Kepulauan Rempah karena pala dan cengkihnya.\n" +
    "Lautnya luas dengan ratusan pulau serta budaya pesisir yang kuat.",
  "papua":
    "Papua berada di ujung timur Indonesia, dengan 6 provinsi di bagian barat Pulau Papua.\n" +
    "Memiliki hutan hujan luas, pegunungan tinggi, dan laut yang kaya terumbu karang.\n" +
    "Ratusan suku dengan bahasa dan adat yang berbeda-beda hidup di sini.",
};

window.INFO_PROVINSI = {
  /* Sumatra */
  "Aceh": "Ibu kota: Banda Aceh. Dijuluki Serambi Mekkah. Terkenal dengan Tari Saman, kopi Gayo, dan rumah adat Rumoh Aceh.",
  "Sumatera Utara": "Ibu kota: Medan. Rumah bagi Danau Toba dan suku Batak, Melayu, serta Nias. Terkenal dengan ulos dan lompat batu.",
  "Sumatera Barat": "Ibu kota: Padang. Tanah Minangkabau dengan rumah gadang yang beratap melengkung dan masakan rendang.",
  "Riau": "Ibu kota: Pekanbaru. Pusat kebudayaan Melayu dengan sungai-sungai besar serta hasil minyak bumi dan kelapa sawit.",
  "Kepulauan Riau": "Ibu kota: Tanjungpinang. Provinsi kepulauan yang berbatasan dengan Singapura dan Malaysia, dengan budaya Melayu pesisir.",
  "Jambi": "Ibu kota: Jambi. Di sini ada kompleks Candi Muaro Jambi dan Sungai Batanghari yang menjadi jalur kehidupan masyarakat.",
  "Sumatera Selatan": "Ibu kota: Palembang. Terkenal dengan Sungai Musi, Jembatan Ampera, kain songket, dan pempek.",
  "Kepulauan Bangka Belitung": "Ibu kota: Pangkalpinang. Dikenal dengan pantai berbatu granit, hasil timah, dan budaya Melayu serta Tionghoa.",
  "Bengkulu": "Ibu kota: Bengkulu. Dikenal sebagai tempat tumbuhnya bunga Rafflesia arnoldii dan memiliki Benteng Marlborough.",
  "Lampung": "Ibu kota: Bandar Lampung. Ujung selatan Sumatra dengan aksara Lampung, kain tapis, kopi robusta, dan gajah di Way Kambas.",

  /* Jawa */
  "Banten": "Ibu kota: Serang. Rumah bagi masyarakat Baduy dan Taman Nasional Ujung Kulon, habitat badak Jawa.",
  "DKI Jakarta": "Kota terbesar di Indonesia dan pusat pemerintahan serta ekonomi. Budaya aslinya Betawi, dengan ondel-ondel yang khas.",
  "Jawa Barat": "Ibu kota: Bandung. Tanah Sunda dengan alat musik angklung, pegunungan hijau, dan perkebunan teh.",
  "Jawa Tengah": "Ibu kota: Semarang. Tempat berdirinya Candi Borobudur dan Prambanan, serta batik dan budaya Jawa yang kental.",
  "Daerah Istimewa Yogyakarta": "Ibu kota: Yogyakarta. Dipimpin oleh Sultan, pusat budaya Jawa dengan keraton, gamelan, dan batik.",
  "Jawa Timur": "Ibu kota: Surabaya. Terkenal dengan Gunung Bromo, kesenian Reog Ponorogo, dan budaya Arek serta Madura.",

  /* Kalimantan */
  "Kalimantan Barat": "Ibu kota: Pontianak. Dilalui garis khatulistiwa. Budaya Dayak, Melayu, dan Tionghoa hidup berdampingan.",
  "Kalimantan Tengah": "Ibu kota: Palangka Raya. Hutan luas dan Taman Nasional Tanjung Puting, tempat orangutan hidup bebas.",
  "Kalimantan Selatan": "Ibu kota: Banjarmasin. Kota seribu sungai dengan pasar terapung dan budaya suku Banjar.",
  "Kalimantan Timur": "Ibu kota: Samarinda. Dialiri Sungai Mahakam, kaya budaya Dayak, dan menjadi lokasi Ibu Kota Nusantara.",
  "Kalimantan Utara": "Ibu kota: Tanjung Selor. Provinsi termuda di Kalimantan, berbatasan dengan Malaysia, dengan budaya Dayak dan Tidung.",

  /* Sulawesi */
  "Sulawesi Utara": "Ibu kota: Manado. Terkenal dengan Taman Laut Bunaken, budaya Minahasa, dan kuliner pedasnya.",
  "Gorontalo": "Ibu kota: Gorontalo. Dijuluki Serambi Madinah, dengan adat yang lekat dengan nilai agama dan pakaian adat Bili'u.",
  "Sulawesi Tengah": "Ibu kota: Palu. Memiliki Danau Poso, Taman Nasional Lore Lindu, dan kain tenun Donggala.",
  "Sulawesi Barat": "Ibu kota: Mamuju. Tanah suku Mandar yang terkenal dengan perahu sandeq dan tenun sutra Mandar.",
  "Sulawesi Selatan": "Ibu kota: Makassar. Budaya Bugis, Makassar, dan Toraja, dengan rumah tongkonan dan perahu phinisi.",
  "Sulawesi Tenggara": "Ibu kota: Kendari. Terkenal dengan Taman Nasional Wakatobi, kain tenun, dan budaya Tolaki serta Buton.",

  /* Bali dan Nusa Tenggara */
  "Bali": "Ibu kota: Denpasar. Pulau Dewata dengan budaya Hindu Bali, pura, tari, upacara adat, dan sistem pengairan subak.",

  "Nusa Tenggara Barat": "Ibu kota: Mataram. Meliputi Pulau Lombok dan Sumbawa, dengan Gunung Rinjani dan budaya suku Sasak.",
  "Nusa Tenggara Timur": "Ibu kota: Kupang. Rumah bagi komodo, Pulau Flores, Sumba, dan tenun ikat dengan motif yang beragam.",

  /* Maluku */
  "Maluku": "Ibu kota: Ambon. Kepulauan rempah penghasil pala dan cengkih, dengan musik tradisional dan laut yang indah.",
  "Maluku Utara": "Ibu kota: Sofifi. Pulau Ternate dan Tidore pernah menjadi pusat perdagangan rempah dunia.",

  /* Papua */
  "Papua": "Ibu kota: Jayapura. Dikenal dengan Danau Sentani, ukiran suku Asmat, dan keragaman budaya yang sangat kaya.",
  "Papua Barat": "Ibu kota: Manokwari. Kawasan Kepala Burung Pulau Papua dengan hutan hujan, pantai, dan budaya pesisir.",
  "Papua Barat Daya": "Ibu kota: Sorong. Pintu masuk menuju Raja Ampat, kawasan laut dengan keanekaragaman hayati yang luar biasa.",
  "Papua Selatan": "Ibu kota: Merauke. Daerah dataran rendah dan rawa luas dengan Taman Nasional Wasur dan budaya suku Marind.",
  "Papua Tengah": "Ibu kota: Nabire. Kawasan pegunungan dan pesisir dengan beragam suku serta lanskap yang menantang.",
  "Papua Pegunungan": "Ibu kota: Jayawijaya (Wamena). Terkenal dengan Lembah Baliem, festival budaya, dan rumah honai.",
};
