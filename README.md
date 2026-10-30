# kliniknet.my.id

Situs statis PT Klinik Net: beranda, privacy policy, terms of service, 404.
Tanpa build dan tanpa framework — HTML/CSS/JS murni, siap GitHub Pages.

## Deploy (GitHub Pages)

1. Push repo ini ke GitHub, lalu Settings → Pages → Source: branch `main`, root.
2. File `CNAME` sudah berisi `kliniknet.my.id`.
3. DNS di registrar `.my.id`:
   - record A `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - record CNAME `www` → `<username>.github.io`
4. Setelah DNS propagasi, centang *Enforce HTTPS* di Settings → Pages; sertifikat terbit otomatis.

## Struktur

- `index.html` — beranda: hero, showcase foto asli, layanan, blok Rent Car, kontak
- `privacy-policy.html`, `terms-of-service.html` — dokumen legal aplikasi Klinik.Net (paket `net.klinik.rental`), ditulis sesuai perilaku kode di repo app
- `404.html` — dikenali GitHub Pages otomatis
- `assets/` — stylesheet bersama, JS reveal, font self-hosted (woff2), gambar
- `img-show/`, `image-rent-car/` — foto asli proyek otomasi, tablet, dan armada

Ganti foto: taruh file baru di folder yang sama, ubah `src` pada `index.html`.
Semua teks halaman berbasis fakta kode aplikasi dan data yang diberikan pemilik; jangan menulis fitur yang tidak ada di aplikasi.
