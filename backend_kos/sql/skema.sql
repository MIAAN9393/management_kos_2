-- 1. USERS
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    refresh_token TEXT NULL,
    role ENUM('pemilik', 'admin') DEFAULT 'pemilik',
    status ENUM('aktif','nonaktif','diblokir') DEFAULT 'aktif',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. KOS
CREATE TABLE kos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pemilik_id INT NOT NULL,
  nama_kos VARCHAR(150) NOT NULL,
  alamat TEXT,
  deskripsi TEXT,
  status ENUM('aktif','nonaktif') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (pemilik_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- 3. KAMAR
CREATE TABLE kamar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  -- pemilik_id INT,
  kos_id INT,
  nomor VARCHAR(20),
  harga BIGINT,
  kapasitas INT UNSIGNED,
  status_kondisi ENUM('kosong','sebagian','penuh') DEFAULT 'kosong',
  status ENUM('aktif','nonaktif') DEFAULT 'aktif',

  -- FOREIGN KEY (pemilik_id) REFERENCES users(id),
  FOREIGN KEY (kos_id) REFERENCES kos(id)
) ENGINE=InnoDB;

--4. KONTRAK
CREATE TABLE kontrak (
    id INT AUTO_INCREMENT PRIMARY KEY,

    penyewa_id INT NOT NULL,
    kamar_id INT NOT NULL,

    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NULL,

    harga_sewa BIGINT NOT NULL,
    siklus ENUM('bulanan','mingguan','harian') DEFAULT 'bulanan',

    status ENUM('aktif','selesai','dibatalkan') DEFAULT 'aktif',

    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diperbarui_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (penyewa_id) REFERENCES penyewa(id) ON DELETE RESTRICT,
    FOREIGN KEY (kamar_id) REFERENCES kamar(id) ON DELETE RESTRICT,

    INDEX idx_kontrak_penyewa (penyewa_id),
    INDEX idx_kontrak_status (status),
    INDEX idx_kontrak_kamar_status (kamar_id, status),
    INDEX idx_kontrak_penyewa_status (penyewa_id, status)
) ENGINE=InnoDB;

-- 5. PENYEWA
CREATE TABLE penyewa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pemilik_id INT NOT NULL,
  nama VARCHAR(100) NOT NULL,
  no_telpon VARCHAR(20),
  status ENUM('aktif','nonaktif') DEFAULT 'aktif',
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (pemilik_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- 6. TAGIHAN
CREATE TABLE tagihan (
    id INT AUTO_INCREMENT PRIMARY KEY,

    kode_tagihan VARCHAR(50) UNIQUE,

    kontrak_id INT NOT NULL,

    periode_awal DATE NOT NULL,
    periode_akhir DATE NOT NULL,

    jatuh_tempo DATE NOT NULL,
    total_tagihan BIGINT NOT NULL DEFAULT 0,

    lifecycle ENUM('draft','issued','cancelled')
        DEFAULT 'draft',

    status_pembayaran ENUM(
        'belum_bayar',
        'sebagian',
        'lunas',
        'telat'
    ) DEFAULT 'belum_bayar',

    catatan TEXT,

    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diperbarui_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (kontrak_id) REFERENCES kontrak(id),

    UNIQUE (kontrak_id, periode_awal, periode_akhir),

    INDEX idx_tagihan_kontrak (kontrak_id),
    INDEX idx_tagihan_status (status_pembayaran),
    INDEX idx_tagihan_lifecycle (lifecycle),
    INDEX idx_tagihan_jatuh_tempo (jatuh_tempo)

) ENGINE=InnoDB;

--8. TAGIHAN ITEM
CREATE TABLE tagihan_item (
    id INT AUTO_INCREMENT PRIMARY KEY,

    tagihan_id INT NOT NULL,

    tipe ENUM('sewa','insiden','denda','diskon') NOT NULL,

    nama_item VARCHAR(100) NOT NULL,
    deskripsi VARCHAR(255),

    nominal BIGINT NOT NULL,

    event_date DATE NULL,

    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (tagihan_id) REFERENCES tagihan(id),

    INDEX idx_item_tagihan (tagihan_id),
    INDEX idx_item_tipe (tipe)
) ENGINE=InnoDB;

-- 9. PEMBAYARAN (ledger style)
CREATE TABLE pembayaran (
  id INT AUTO_INCREMENT PRIMARY KEY,

  tagihan_id INT NOT NULL,
  jumlah_bayar BIGINT NOT NULL,

  status ENUM('valid','refund') DEFAULT 'valid',

  pembayaran_ref_id INT NULL,

  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dibatalkan_pada TIMESTAMP NULL,

  FOREIGN KEY (tagihan_id) REFERENCES tagihan(id),

  CONSTRAINT fk_pembayaran_ref
  FOREIGN KEY (pembayaran_ref_id) REFERENCES pembayaran(id),

  INDEX idx_pembayaran_tagihan (tagihan_id),
  INDEX idx_pembayaran_ref (pembayaran_ref_id),
  INDEX idx_status_ref (status, pembayaran_ref_id)

) ENGINE=InnoDB;