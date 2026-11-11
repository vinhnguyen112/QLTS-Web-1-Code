# HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN QUẢN LÝ TÀI SẢN (QLTS)

> **Hệ thống Quản lý Tài sản Doanh nghiệp**  
> Công nghệ: **Node.js (Express 5)** + **Handlebars View Engine** + **MySQL 8** + **Bootstrap 5**

---

## 1. Yêu cầu môi trường

Trước khi chạy, máy tính cần cài sẵn:
1. **Node.js**: Phiên bản 18, 20 LTS hoặc 22 LTS (Tải tại [nodejs.org](https://nodejs.org/)).
2. **MySQL Server**: Phiên bản 8.x hoặc dùng thông qua **XAMPP / Laragon** (bật cổng MySQL 3306).
3. **Trình duyệt web**: Chrome, Edge, Firefox hoặc trình duyệt bất kỳ.

Kiểm tra nhanh trong Terminal (PowerShell hoặc CMD):
```bash
node -v      # Yêu cầu >= v18.x (khuyến nghị v20.x hoặc v22.x)
npm -v       # Đi kèm Node.js
```

---

## 2. Hướng dẫn khởi chạy nhanh (3 Bước)

### Bước 1: Nhập cơ sở dữ liệu (Import Database)
Trong thư mục dự án đã có sẵn file dữ liệu đầy đủ: **`devmaster_demo_backup.sql`**.

* **Cách 1: Dùng phpMyAdmin (XAMPP / Laragon - Khuyên dùng, dễ nhất)**:
  1. Mở trình duyệt vào [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
  2. Bấm vào tab **Databases (Cơ sở dữ liệu)**, tạo database mới tên là: `qlts_dev` (chọn bảng mã `utf8mb4_general_ci` hoặc `utf8mb4_unicode_ci`).
  3. Chọn database `qlts_dev` vừa tạo, bấm tab **Import (Nhập)**.
  4. Bấm **Choose File (Chọn tệp)**, chọn đến file `devmaster_demo_backup.sql` nằm trong thư mục dự án, rồi bấm **Import (Thực hiện)** ở cuối trang.

* **Cách 2: Dùng dòng lệnh (Command Line)**:
  ```bash
  # Đăng nhập MySQL và tạo database
  mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS qlts_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
  
  # Import file devmaster_demo_backup.sql vào database
  mysql -u root -p qlts_dev < devmaster_demo_backup.sql
  ```

---

### Bước 2: Cấu hình biến môi trường (`.env`)
Kiểm tra file **`.env`** tại thư mục gốc của dự án. Nếu chưa có, tạo file tên là `.env` (hoặc sao chép từ `.env.example`) với nội dung như sau:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=qlts_dev
SESSION_SECRET=qlts-devmaster-secret-key-2026
```

> **Lưu ý:**
> * Nếu bạn dùng **XAMPP / Laragon**: Mặc định `DB_USER=root` và `DB_PASSWORD=` (để trống).
> * Nếu bạn dùng **MySQL Server cài độc lập**: Nhập mật khẩu tài khoản `root` của máy bạn vào `DB_PASSWORD`.

---

### Bước 3: Cài đặt thư viện & Khởi chạy

Mở Terminal (PowerShell, CMD hoặc Git Bash) tại thư mục dự án:

```bash
# 1. Cài đặt các thư viện phụ thuộc (chỉ cần chạy lần đầu)
npm install

# 2. Khởi chạy ứng dụng
npm run dev
```

*(Hoặc dùng lệnh `npm start` để chạy ở chế độ chuẩn)*

Khi màn hình Terminal xuất hiện thông báo:
```text
Server đang chạy tại http://localhost:3000
Kết nối MySQL thành công!
```

Mở trình duyệt truy cập: **http://localhost:3000** để trải nghiệm hệ thống.

---

## 3. Danh sách tài khoản đăng nhập mẫu

Hệ thống được thiết kế theo mô hình phân quyền chặt chẽ (RBAC). Bạn có thể đăng nhập thử theo các vai trò:

| STT | Vai trò trong hệ thống | Tên đăng nhập (Username) | Mật khẩu mặc định | Ghi chú quyền hạn |
|:---:|---|:---:|:---:|---|
| 1 | **Quản trị viên Hệ thống** | `admin` | `Admin@QLTS2026!` | Toàn quyền quản trị người dùng, hệ thống và audit log |
| 2 | **Ban Giám đốc** | `gd.trinh` | `Devmaster@2026!` | Phê duyệt đề xuất, giám sát toàn diện, xem khấu hao |
| 3 | **Quản lý tài sản (Trưởng phòng CSVC)** | `tp.csvc` | `Devmaster@2026!` | Quản lý hồ sơ tài sản, kho, kiểm kê, danh mục |
| 4 | **Kế toán trưởng / Kế toán tài sản** | `tp.ketoan`<br>`kt.huyen` | `Devmaster@2026!` | Xem và trích lập khấu hao tài sản, báo cáo tài chính |
| 5 | **Kỹ thuật viên bảo trì** | `ktv.csvc.dung` | `Devmaster@2026!` | Tiếp nhận xử lý sự cố, cập nhật hoàn thành bảo trì |
| 6 | **Trưởng các phòng ban** | `tp.hcns`<br>`tp.kythuat`<br>`tp.daotao` | `Devmaster@2026!` | Lập và duyệt đề xuất cấp phát/mua sắm phòng ban |
| 7 | **Nhân viên thông thường** | `nv.hcns.1`<br>`nv.kythuat.1` | `Devmaster@2026!` | Lập yêu cầu đề xuất tài sản cá nhân |

---

## 4. Cấu trúc thư mục mã nguồn

```text
QLTS-Web-1-Code/
├── devmaster_demo_backup.sql  # File sao lưu cơ sở dữ liệu MySQL đầy đủ
├── server.js                  # Điểm khởi chạy chính của ứng dụng
├── .env                       # File cấu hình biến môi trường kết nối CSDL
├── package.json               # Khai báo các thư viện npm và lệnh chạy
├── src/
│   ├── config/                # Cấu hình kết nối MySQL và định nghĩa quyền
│   │   ├── db.js
│   │   └── permissions.js
│   ├── controllers/           # Xử lý logic nghiệp vụ cho từng phân hệ
│   ├── middlewares/           # Kiểm tra đăng nhập và phân quyền (Auth)
│   ├── routes/                # Khai báo các tuyến đường dẫn URL
│   ├── utils/                 # Các hàm tiện ích dùng chung (Khấu hao, Helpers)
│   │   ├── hbsHelpers.js      # Bộ hàm bổ trợ cho giao diện Handlebars
│   │   ├── depreciation.js    # Thuật toán tính khấu hao theo Thông tư BTC
│   │   └── logger.js          # Ghi nhật ký biến động tài sản
│   ├── views/                 # Giao diện ứng dụng (Handlebars Engine)
│   │   ├── layouts/           # Khung layout chuẩn (main.hbs)
│   │   ├── partials/          # Thanh điều hướng (sidebar, navbar)
│   │   └── ...                # Giao diện các chức năng nghiệp vụ
│   └── public/                # Tài nguyên tĩnh (CSS, JS)
```

---

## 5. Xử lý các sự cố thường gặp (Troubleshooting)

| Sự cố | Nguyên nhân | Cách khắc phục |
|---|---|---|
| **`Kết nối MySQL thất bại: connect ECONNREFUSED`** | MySQL chưa được khởi động. | Mở XAMPP / Laragon và nhấn **Start** dịch vụ MySQL. |
| **`Access denied for user 'root'@'localhost'`** | Sai mật khẩu MySQL trong file `.env`. | Mở file `.env` và điền đúng mật khẩu MySQL của bạn vào mục `DB_PASSWORD`. |
| **`Unknown database 'qlts_dev'`** | Chưa tạo hoặc chưa import cơ sở dữ liệu. | Làm theo **Bước 1** để import file `devmaster_demo_backup.sql` vào MySQL. |
| **`Error: listen EADDRINUSE: address already in use :::3000`** | Cổng 3000 đang bị ứng dụng khác chiếm dụng. | Mở `.env` đổi `PORT=3000` thành `PORT=3001` (hoặc cổng khác) rồi chạy lại. |
| **`Cannot find module ...`** | Chưa cài đặt gói thư viện qua npm. | Chạy lệnh `npm install` tại thư mục chứa file `package.json`. |
| **Lỗi thư mục lồng nhau sau khi giải nén** | Phần mềm giải nén tạo thêm thư mục cùng tên (ví dụ: `QLTS-Web-1-Code/QLTS-Web-1-Code`). | Dùng lệnh `cd` di chuyển vào đúng thư mục có chứa file `package.json` và `server.js` trước khi gõ lệnh chạy. |

---

> 💡 **Mẹo:** Để tắt server khi đang chạy trên Terminal, nhấn tổ hợp phím **`Ctrl + C`**.
