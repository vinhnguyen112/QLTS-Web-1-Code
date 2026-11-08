# HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN QLTS-Web-1-Code

**Hệ thống Quản lý Tài sản Doanh nghiệp** – Node.js + Express 5 + Handlebars + MySQL 8.

---

## 1. Yêu cầu phần mềm

| Phần mềm | Phiên bản khuyến nghị | Lệnh kiểm tra | Tải về |
|---|---|---|---|
| Node.js | 20 LTS hoặc 22 LTS (tối thiểu 18) | `node -v` | https://nodejs.org |
| npm | đi kèm Node.js (10.x) | `npm -v` | – |
| MySQL Server | 8.x | `mysql --version` | https://dev.mysql.com/downloads hoặc XAMPP / Laragon |
| Git | bất kỳ | `git --version` | https://git-scm.com |
| Trình duyệt | Chrome / Edge / Firefox mới | – | – |

> Máy phát triển hiện tại: Node.js v22.13.0, npm 10.9.2.

---

## 2. Cấu trúc thư mục dự án

`package.json` phải nằm ngay trong thư mục bạn chạy lệnh `npm`:

```
D:\001\QLTS-Web-1-Code\
├── node_modules\          # Thư viện (sinh ra sau khi npm install)
├── src\
│   ├── config\            # Kết nối MySQL
│   ├── controllers\       # Xử lý nghiệp vụ
│   ├── middlewares\       # Kiểm tra đăng nhập, phân quyền
│   ├── routes\            # Định tuyến URL
│   ├── views\             # Giao diện Handlebars (.hbs)
│   └── public\            # CSS, JS tĩnh
├── .env                   # Biến môi trường (DB, cổng, session)
├── package.json           # Khai báo thư viện & lệnh chạy
├── package-lock.json      # Khóa phiên bản thư viện
└── server.js              # Điểm khởi chạy ứng dụng
```

> **Lưu ý khi giải nén file .rar / .zip:** phần mềm giải nén thường tạo thêm thư mục lồng, ví dụ `D:\001\QLTS-Web-1-Code\QLTS-Web-1-Code\package.json`. Khi đó chạy `npm run dev` ở thư mục ngoài sẽ báo lỗi `ENOENT: Could not read package.json`. Hãy `cd` vào đúng thư mục chứa `package.json`.

---

## 3. Danh sách thư viện sử dụng

### 3.1. Thư viện chính (dependencies)

| Thư viện | Phiên bản | Công dụng |
|---|---|---|
| express | 5.2.1 | Web framework, xử lý route và request/response |
| express-handlebars | 8.0.1 | Template engine render giao diện `.hbs` |
| express-session | 1.19.0 | Quản lý phiên đăng nhập (session) |
| mysql2 | 3.24.4 | Kết nối và truy vấn cơ sở dữ liệu MySQL |
| dotenv | 17.4.2 | Đọc biến môi trường từ file `.env` |
| argon2 | 0.45.1 | Băm và xác thực mật khẩu (Argon2id) |
| bcryptjs | 3.0.3 | Băm mật khẩu dự phòng |
| qrcode | 1.5.4 | Sinh mã QR cho tem tài sản |
| bwip-js | 4.11.4 | Sinh mã vạch (barcode) |
| chart.js | 4.5.1 | Vẽ biểu đồ báo cáo thống kê |
| dayjs | 1.11.23 | Xử lý, định dạng ngày giờ |

### 3.2. Thư viện phát triển (devDependencies)

| Thư viện | Phiên bản | Công dụng |
|---|---|---|
| nodemon | 3.1.14 | Tự khởi động lại server khi sửa code (`npm run dev`) |

### 3.3. Thư viện nạp qua CDN (không cần cài)

| Thư viện | Phiên bản | Công dụng |
|---|---|---|
| Bootstrap | 5.3.3 | Khung giao diện, bảng, form, modal |
| Bootstrap Icons | 1.11.3 | Bộ icon đơn sắc |
| html5-qrcode | – | Quét mã QR bằng camera khi kiểm kê |

> Các thư viện CDN cần máy có kết nối Internet khi mở giao diện.

---

## 4. Cài đặt thư viện

### Cách 1 – Cài toàn bộ theo package.json (khuyến nghị)

```bash
cd /d/001/QLTS-Web-1-Code
npm install
```

Lệnh này đọc `package.json` + `package-lock.json` và cài đúng phiên bản vào thư mục `node_modules`.

### Cách 2 – Cài thủ công từng thư viện (khi tạo dự án mới hoặc package.json bị mất)

```bash
npm init -y
npm install express@5.2.1 express-handlebars@8.0.1 express-session@1.19.0 mysql2@3.24.4 dotenv@17.4.2
npm install argon2@0.45.1 bcryptjs@3.0.3 qrcode@1.5.4 bwip-js@4.11.4 chart.js@4.5.1 dayjs@1.11.23
npm install --save-dev nodemon@3.1.14
```

Sau đó thêm phần `scripts` vào `package.json`:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Kiểm tra cài đặt thành công

```bash
npm ls --depth=0
```

Kết quả phải liệt kê đủ 12 thư viện ở mục 3, không có dòng `UNMET DEPENDENCY` hay `missing`.

### Lưu ý về argon2

`argon2` là thư viện native (biên dịch C). Thông thường npm tự tải bản dựng sẵn cho Windows x64. Nếu cài bị lỗi `node-gyp` / `gyp ERR!`:

1. Cài **Visual Studio Build Tools** (chọn "Desktop development with C++").
2. Cài **Python 3**.
3. Xóa `node_modules` và chạy lại `npm install`.

---

## 5. Chuẩn bị cơ sở dữ liệu

Dự án dùng chung database **`qlts_dev`** với dự án `QLTS-NTVINH`.

### Bước 5.1 – Bật MySQL

Mở XAMPP / Laragon và bấm Start MySQL, hoặc bật dịch vụ MySQL80 trong Windows Services.

### Bước 5.2 – Tạo database (nếu chưa có)

```sql
CREATE DATABASE qlts_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Bước 5.3 – Tạo bảng và dữ liệu mẫu (dùng dự án QLTS-NTVINH)

```bash
cd /d/001/QLTS-NTVINH/backend
npm install
npm run db:migrate
npm run db:seed
```

> Nếu database `qlts_dev` đã có dữ liệu thì bỏ qua bước 5.2 và 5.3.

---

## 6. Cấu hình file .env

Tạo (hoặc kiểm tra) file `.env` ở thư mục gốc `D:\001\QLTS-Web-1-Code\`:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=mat_khau_mysql_cua_ban
DB_NAME=qlts_dev
SESSION_SECRET=chuoi_bi_mat_bat_ky
```

| Biến | Ý nghĩa |
|---|---|
| PORT | Cổng chạy web (mặc định 3000) |
| DB_HOST / DB_PORT | Địa chỉ và cổng MySQL |
| DB_USER / DB_PASSWORD | Tài khoản MySQL |
| DB_NAME | Tên database (`qlts_dev`) |
| SESSION_SECRET | Khóa mã hóa phiên đăng nhập |

---

## 7. Chạy dự án

### Bước 7.1 – Mở terminal đúng thư mục

```bash
cd /d/001/QLTS-Web-1-Code      # Git Bash
cd D:\001\QLTS-Web-1-Code      # PowerShell / CMD
```

### Bước 7.2 – Khởi động server

```bash
npm run dev     # Chế độ phát triển – tự restart khi sửa code
npm start       # Chế độ chạy thường
```

Thành công khi terminal hiển thị:

```
Server đang chạy tại http://localhost:3000
Kết nối MySQL thành công!
```

### Bước 7.3 – Truy cập

Mở trình duyệt vào địa chỉ: **http://localhost:3000**

Dừng server: nhấn `Ctrl + C` trong terminal.

---

## 8. Tài khoản đăng nhập demo

| Vai trò | Username | Mật khẩu |
|---|---|---|
| Quản trị hệ thống (SYS_ADMIN) | admin | Admin@QLTS2026! |
| Giám đốc | gd.trinh | Devmaster@2026! |
| Trưởng phòng CSVC (Quản lý tài sản) | tp.csvc | Devmaster@2026! |
| Kế toán | tp.ketoan, kt.huyen | Devmaster@2026! |
| Nhân viên | nv.hcns.1 | Devmaster@2026! |

---

## 9. Xử lý lỗi thường gặp

| Lỗi | Nguyên nhân | Cách khắc phục |
|---|---|---|
| ENOENT: Could not read package.json | Đứng sai thư mục (thư mục lồng sau giải nén) | `cd` vào thư mục chứa `package.json` |
| Cannot find module 'xxx' | Chưa cài thư viện | Chạy `npm install` |
| 'nodemon' is not recognized | Chưa cài devDependencies | Chạy `npm install` hoặc dùng `npm start` |
| gyp ERR! khi cài argon2 | Thiếu công cụ biên dịch C++ | Xem mục 4 – Lưu ý về argon2 |
| ECONNREFUSED 127.0.0.1:3306 | MySQL chưa bật | Bật MySQL |
| Access denied for user 'root' | Sai tài khoản MySQL | Sửa `DB_USER` / `DB_PASSWORD` trong `.env` |
| Unknown database 'qlts_dev' | Chưa tạo database | Làm lại mục 5 |
| EADDRINUSE :::3000 | Cổng 3000 đang bị chiếm | Tắt tiến trình cũ hoặc đổi `PORT` |
| Giao diện mất CSS / icon | Không có Internet (CDN) | Kết nối mạng rồi tải lại trang |

Tìm và tắt tiến trình đang chiếm cổng 3000 (PowerShell):

```powershell
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess
Stop-Process -Id <OwningProcess> -Force
```

---

## 10. Sao lưu & khôi phục

Bản backup có sẵn: **`D:\001\QLTS-Web-1-Code_backup_20261108.zip`** – gồm toàn bộ mã nguồn, `.env`, lịch sử Git (`.git`) và `node_modules` (chạy được ngay, không cần Internet để cài lại).

### Tạo bản backup .zip mới (PowerShell)

```powershell
cd D:\001
tar -a -c -f QLTS-Web-1-Code_backup_NGAY.zip QLTS-Web-1-Code
```

> Dùng `tar` thay cho `Compress-Archive` vì `Compress-Archive` bỏ qua thư mục ẩn `.git`. Muốn file nhẹ hơn thì thêm `--exclude=node_modules` (khi khôi phục chạy lại `npm install`).

### Khôi phục từ bản backup

1. Đổi tên hoặc xóa thư mục `D:\001\QLTS-Web-1-Code` hiện tại (nếu có).
2. Giải nén file `.zip` **tại `D:\001\`** (chọn "Extract Here") – sẽ tạo ra `D:\001\QLTS-Web-1-Code\`.
3. Kiểm tra `package.json` nằm ngay trong `D:\001\QLTS-Web-1-Code\` (không bị lồng thư mục).
4. Chạy `npm run dev` (chạy `npm install` trước nếu bản backup không có `node_modules`).

---

## 11. Lệnh nhanh

```bash
cd /d/001/QLTS-Web-1-Code
npm install        # Lần đầu hoặc sau khi khôi phục backup
npm run dev        # Chạy dự án
# Mở http://localhost:3000
```
