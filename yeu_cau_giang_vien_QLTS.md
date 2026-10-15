
# 2. Khảo sát và hệ thống tham khảo
Danh sách chức năng của MISA AMIS Tài sản mà nhóm cung cấp được chia thành 7 phân hệ; đề tài giữ cả 7 nhưng thu hẹp độ sâu để vừa sức một đồ án tốt nghiệp.

## 2.1 Đối chiếu chức năng

| Phân hệ | Chức năng ở hệ thống tham khảo | Phạm vi đề tài | Mức |
| --- | --- | --- | --- |
| P1. Danh mục và hồ sơ | Mã tài sản, tên, chủng loại, số sê-ri, ngày mua, nguyên giá, vị trí, phòng ban hoặc nhân sự đang dùng | Đầy đủ các trường này, thêm file đính kèm (hóa đơn, ảnh) | Must |
| P2. Vòng đời | Từ đề xuất mua, cấp phát, điều chuyển giữa chi nhánh, bảo trì định kỳ đến thanh lý | Đủ 5 nghiệp vụ, mỗi nghiệp vụ có phiếu và lịch sử | Must |
| P3. Mã vạch / QR | In và dán mã, quét bằng điện thoại để tra cứu hoặc kiểm kê | Mã QR, quét bằng camera trình duyệt, kiểm kê theo phiên | Must |
| P4. Khấu hao tự động | Tính hao mòn theo phương pháp kế toán chuẩn, hỗ trợ chốt số liệu | Đường thẳng, số dư giảm dần, chốt kỳ theo tháng | Must |
| P5. Bảo trì, sửa chữa | Nhắc lịch bảo dưỡng, lưu lịch sử hỏng hóc và chi phí | Lịch bảo trì định kỳ, phiếu sửa chữa, chi phí | Should |
| P6. Báo cáo, thống kê | Biểu đồ tình hình sử dụng, tổng giá trị hiện tại, danh mục sắp hết hạn hoặc cần thay mới theo bộ phận | 5 đến 7 báo cáo chuẩn, dashboard, xuất Excel | Should |
| P7. Luồng duyệt | Đề xuất mua sắm hoặc cấp phát qua mạng, nhiều cấp duyệt | Luồng duyệt cấu hình được số cấp theo loại phiếu | Must |


## 2.2 Điểm khác biệt và cách tiếp cận của đề tài
Tập trung vào SME: cấu hình đơn giản, triển khai nhanh, chi phí vận hành thấp.
Mô hình đa chi nhánh nhưng dùng chung một cơ sở dữ liệu (multi-branch, single tenant); chưa làm đa doanh nghiệp (multi-tenant).
Khấu hao là một mô-đun độc lập, có kiểm thử đơn vị với dữ liệu mẫu để chứng minh tính đúng.
Kiểm kê bằng QR chạy trên web, không cần cài ứng dụng.

## 2.3 Việc cần làm để hoàn thiện khảo sát
Bảng trên mới dựa trên danh sách chức năng được cung cấp. Để báo cáo có giá trị khảo sát thật, nhóm nên:
1. Dùng thử bản demo của sản phẩm tham khảo và ghi lại luồng thao tác thực tế.
2. Phỏng vấn ít nhất 2 đến 3 doanh nghiệp nhỏ về cách họ đang quản lý tài sản (dùng bộ câu hỏi ở mục 14).
3. Ghi rõ nguồn và ngày khảo sát; không trích số liệu thị phần hay giá bán nếu không có nguồn.

# 3. Yêu cầu chức năng
Hệ thống có 7 phân hệ với 40 yêu cầu chức năng (FR); độ ưu tiên theo MoSCoW: M = Must (bắt buộc cho MVP), S = Should (nên có), C = Could (làm nếu còn thời gian).

## 3.1 Quản trị hệ thống và danh mục dùng chung

| Mã | Yêu cầu | Ưu tiên |
| --- | --- | --- |
| FR-01 | Đăng nhập, đăng xuất, đổi và khôi phục mật khẩu | M |
| FR-02 | Quản lý người dùng, vai trò, phân quyền theo chức năng và theo chi nhánh | M |
| FR-03 | Quản lý cơ cấu tổ chức: chi nhánh, phòng ban, vị trí đặt tài sản | M |
| FR-04 | Quản lý danh mục: loại tài sản, nhà cung cấp, đơn vị tính, tình trạng | M |
| FR-05 | Cấu hình tham số: ngưỡng nguyên giá TSCĐ, quy tắc sinh mã, nhóm tài sản kèm thời gian khấu hao mặc định | M |
| FR-06 | Ghi nhật ký hoạt động (audit log) cho mọi thay đổi quan trọng | M |


## 3.2 P1. Quản lý danh mục và thông tin tài sản

| Mã | Yêu cầu | Ưu tiên |
| --- | --- | --- |
| FR-07 | Thêm, sửa, xem, ngừng sử dụng tài sản với các trường: mã, tên, chủng loại, số sê-ri, ngày mua, nguyên giá, vị trí, phòng ban, người sử dụng | M |
| FR-08 | Sinh mã tài sản tự động theo quy tắc cấu hình, không trùng | M |
| FR-09 | Tìm kiếm, lọc, sắp xếp, phân trang theo nhiều tiêu chí | M |
| FR-10 | Đính kèm tài liệu, hình ảnh (hóa đơn, bảo hành, ảnh thiết bị) | S |
| FR-11 | Nhập hàng loạt từ file Excel, có báo lỗi từng dòng | S |
| FR-12 | Xuất danh sách ra Excel | S |


## 3.3 P2. Theo dõi vòng đời tài sản

| Mã | Yêu cầu | Ưu tiên |
| --- | --- | --- |
| FR-13 | Lập đề xuất mua sắm, gắn với luồng duyệt (xem 3.8) | M |
| FR-14 | Ghi tăng tài sản từ đề xuất đã duyệt hoặc nhập thủ công | M |
| FR-15 | Cấp phát tài sản cho nhân viên hoặc phòng ban, có biên bản bàn giao | M |
| FR-16 | Thu hồi tài sản về kho | M |
| FR-17 | Điều chuyển giữa phòng ban, chi nhánh, có xác nhận bên nhận | M |
| FR-18 | Thanh lý hoặc ghi giảm tài sản, ghi nhận giá trị thanh lý | M |
| FR-19 | Xem dòng thời gian (timeline) toàn bộ lịch sử của một tài sản | M |


## 3.4 P3. Mã QR và kiểm kê

| Mã | Yêu cầu | Ưu tiên |
| --- | --- | --- |
| FR-20 | Sinh mã QR cho từng tài sản, in tem theo mẫu khổ giấy cấu hình được | M |
| FR-21 | Quét QR bằng điện thoại để xem nhanh thông tin và lịch sử | M |
| FR-22 | Tạo đợt kiểm kê theo phạm vi (chi nhánh, phòng, kho) | M |
| FR-23 | Quét QR để ghi nhận tài sản có mặt; hỗ trợ nhập tay khi tem hỏng | M |
| FR-24 | Đối chiếu tự động, liệt kê chênh lệch: thừa, thiếu, sai vị trí | M |
| FR-25 | Duyệt kết quả kiểm kê và cập nhật dữ liệu | S |


## 3.5 P4. Khấu hao tự động

| Mã | Yêu cầu | Ưu tiên |
| --- | --- | --- |
| FR-26 | Khai báo phương pháp, thời gian khấu hao, giá trị thanh lý ước tính cho từng tài sản | M |
| FR-27 | Chạy khấu hao hàng tháng cho toàn bộ hoặc theo chi nhánh | M |
| FR-28 | Lưu bảng hao mòn lũy kế và giá trị còn lại theo kỳ | M |
| FR-29 | Chốt kỳ, khóa số liệu kỳ đã chốt; mở khóa cần quyền và ghi log | S |
| FR-30 | Xuất báo cáo khấu hao theo kỳ, theo nhóm tài sản | S |


## 3.6 P5. Bảo trì, sửa chữa

| Mã | Yêu cầu | Ưu tiên |
| --- | --- | --- |
| FR-31 | Thiết lập lịch bảo trì định kỳ theo ngày hoặc theo chu kỳ | S |
| FR-32 | Nhắc lịch qua thông báo trong hệ thống và email | S |
| FR-33 | Lập phiếu bảo trì, sửa chữa: nguyên nhân, nhà cung cấp, chi phí, kết quả | S |
| FR-34 | Tổng hợp chi phí và số lần hỏng theo tài sản | C |


## 3.7 P6. Báo cáo và thống kê

| Mã | Yêu cầu | Ưu tiên |
| --- | --- | --- |
| FR-35 | Dashboard: số lượng, tổng nguyên giá, giá trị còn lại, tỷ lệ tài sản theo trạng thái | S |
| FR-36 | Báo cáo tài sản theo bộ phận, theo loại, theo vị trí | S |
| FR-37 | Danh mục tài sản sắp hết khấu hao hoặc đề xuất thay mới | S |


## 3.8 P7. Luồng duyệt nhiều cấp

| Mã | Yêu cầu | Ưu tiên |
| --- | --- | --- |
| FR-38 | Cấu hình quy trình duyệt cho từng loại phiếu (mua sắm, cấp phát, điều chuyển, thanh lý): số cấp, người duyệt theo vai trò hoặc trưởng bộ phận | M |
| FR-39 | Người duyệt đồng ý, từ chối kèm lý do, hoặc trả về chỉnh sửa | M |
| FR-40 | Thông báo cho người duyệt kế tiếp và người đề xuất; xem trạng thái phiếu theo thời gian thực | S |


# 4. Yêu cầu phi chức năng
Các yêu cầu dưới đây là mục tiêu thiết kế cho môi trường SME (khoảng 50 đến 500 người dùng, vài nghìn đến vài chục nghìn tài sản); con số cụ thể cần xác nhận lại với đơn vị thực nghiệm.

| Mã | Nhóm | Yêu cầu | Cách kiểm chứng |
| --- | --- | --- | --- |
| NFR-01 | Hiệu năng | Trang danh sách phản hồi dưới 2 giây với 20.000 tài sản (có phân trang và chỉ mục) | Kiểm thử tải với dữ liệu giả lập |
| NFR-02 | Hiệu năng | Chạy khấu hao tháng cho 10.000 tài sản trong vài phút, chạy nền, không chặn giao diện | Đo thời gian job trên dữ liệu giả lập |
| NFR-03 | Bảo mật | Mật khẩu băm bằng thuật toán chuyên dụng (bcrypt hoặc Argon2); phiên đăng nhập có hạn | Rà soát mã, kiểm thử bảo mật cơ bản |
| NFR-04 | Bảo mật | Phân quyền kiểm tra ở phía máy chủ cho mọi API, không chỉ ẩn nút trên giao diện | Kiểm thử gọi API trái quyền |
| NFR-05 | Bảo mật | Chống các lỗi phổ biến (OWASP Top 10): SQL injection, XSS, CSRF, truy cập đối tượng trái phép (IDOR) | Checklist OWASP, công cụ quét |
| NFR-06 | Toàn vẹn | Dữ liệu tài chính (nguyên giá, khấu hao) không xóa cứng; sửa đổi có audit log; kỳ đã chốt bị khóa | Kiểm thử nghiệp vụ |
| NFR-07 | Khả dụng | Sao lưu cơ sở dữ liệu hàng ngày, có quy trình khôi phục đã thử | Diễn tập khôi phục |
| NFR-08 | Dễ dùng | Người dùng mới thực hiện được tác vụ chính (tra cứu, đề xuất, kiểm kê) sau tối đa 30 phút hướng dẫn | Khảo sát người dùng thử |
| NFR-09 | Tương thích | Chạy trên Chrome, Edge, Safari bản mới; giao diện co giãn cho điện thoại | Kiểm thử trên thiết bị thật |
| NFR-10 | Mở rộng | Tách mô-đun rõ ràng để thêm loại tài sản hoặc phương pháp khấu hao mà không sửa lõi | Rà soát kiến trúc |
| NFR-11 | Tuân thủ | Tham số kế toán (ngưỡng nguyên giá, thời gian khấu hao) cấu hình được theo quy định hiện hành | Kiểm tra cấu hình, đối chiếu văn bản |
| NFR-12 | Bảo trì | Có tài liệu API, README, quy ước mã; độ phủ kiểm thử đơn vị cho mô-đun khấu hao và luồng duyệt từ 80% trở lên | Báo cáo coverage |


# 5. Tác nhân và use case
Hệ thống có 7 tác nhân và 24 use case; 5 use case lõi được đặc tả chi tiết ở mục 5.3.

## 5.1 Tác nhân

| Tác nhân | Vai trò trong hệ thống |
| --- | --- |
| Quản trị hệ thống | Quản lý người dùng, phân quyền, cấu hình tham số, sao lưu |
| Quản lý tài sản | Quản lý hồ sơ, cấp phát, điều chuyển, kiểm kê, thanh lý |
| Kế toán tài sản | Cấu hình khấu hao, chạy và chốt kỳ, xem báo cáo giá trị |
| Trưởng bộ phận | Đề xuất cho bộ phận, duyệt cấp 1, xem tài sản bộ phận |
| Giám đốc / Kế toán trưởng | Duyệt cấp cuối, xem dashboard toàn công ty |
| Nhân viên | Xem tài sản được giao, đề xuất, xác nhận bàn giao, báo hỏng |
| Kỹ thuật viên | Nhận và xử lý phiếu bảo trì, sửa chữa |

Ngoài ra có hai tác nhân hệ thống: Bộ lập lịch (chạy nhắc bảo trì, nhắc hết hạn) và Dịch vụ email.

## 5.2 Danh sách use case

| Mã | Use case | Tác nhân chính | Phân hệ |
| --- | --- | --- | --- |
| UC-01 | Đăng nhập, đổi mật khẩu | Tất cả | Quản trị |
| UC-02 | Quản lý người dùng và phân quyền | Quản trị hệ thống | Quản trị |
| UC-03 | Quản lý cơ cấu tổ chức và vị trí | Quản trị hệ thống | Quản trị |
| UC-04 | Cấu hình tham số, nhóm tài sản | Quản trị hệ thống, Kế toán | Quản trị |
| UC-05 | Quản lý hồ sơ tài sản | Quản lý tài sản | P1 |
| UC-06 | Tìm kiếm, lọc tài sản | Tất cả | P1 |
| UC-07 | Nhập tài sản từ Excel | Quản lý tài sản | P1 |
| UC-08 | Tạo đề xuất mua sắm | Nhân viên, Trưởng bộ phận | P2, P7 |
| UC-09 | Duyệt phiếu nhiều cấp | Trưởng bộ phận, Giám đốc | P7 |
| UC-10 | Ghi tăng tài sản | Quản lý tài sản | P2 |
| UC-11 | Cấp phát và thu hồi tài sản | Quản lý tài sản, Nhân viên | P2 |
| UC-12 | Điều chuyển tài sản | Quản lý tài sản | P2 |
| UC-13 | Thanh lý tài sản | Quản lý tài sản, Giám đốc | P2 |
| UC-14 | In tem QR | Quản lý tài sản | P3 |
| UC-15 | Quét QR tra cứu | Nhân viên, Quản lý tài sản | P3 |
| UC-16 | Kiểm kê bằng QR | Quản lý tài sản | P3 |
| UC-17 | Khai báo thông số khấu hao | Kế toán tài sản | P4 |
| UC-18 | Chạy khấu hao tháng và chốt kỳ | Kế toán tài sản | P4 |
| UC-19 | Lập lịch bảo trì | Quản lý tài sản | P5 |
| UC-20 | Xử lý phiếu bảo trì, sửa chữa | Kỹ thuật viên | P5 |
| UC-21 | Nhận thông báo, nhắc việc | Tất cả | P5, P7 |
| UC-22 | Xem dashboard | Giám đốc, Kế toán | P6 |
| UC-23 | Xem và xuất báo cáo | Quản lý, Kế toán | P6 |
| UC-24 | Xem nhật ký hoạt động | Quản trị hệ thống | Quản trị |


## 5.3 Đặc tả các use case lõi
UC-09. Duyệt phiếu nhiều cấp

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Người duyệt (Trưởng bộ phận, Giám đốc, theo cấu hình) |
| Tiền điều kiện | Phiếu ở trạng thái Chờ duyệt và đang ở cấp của người này |
| Luồng chính | 1. Người duyệt mở danh sách phiếu chờ. 2. Xem chi tiết và lịch sử duyệt. 3. Chọn Đồng ý. 4. Hệ thống ghi nhận, chuyển cấp kế tiếp hoặc chuyển phiếu sang Đã duyệt nếu là cấp cuối. 5. Gửi thông báo cho người đề xuất và người duyệt kế tiếp |
| Luồng thay thế | Từ chối: bắt buộc nhập lý do, phiếu về Bị từ chối. Trả về: phiếu về Cần chỉnh sửa, người đề xuất sửa rồi gửi lại từ cấp 1 |
| Luồng ngoại lệ | Phiếu đã bị người khác xử lý hoặc người đề xuất thu hồi: báo lỗi và tải lại |
| Hậu điều kiện | Có bản ghi duyệt (ai, lúc nào, quyết định, lý do) không sửa được |
| Quy tắc | Người đề xuất không được tự duyệt phiếu của mình; người duyệt ở cấp trước không duyệt lại cấp sau |

UC-12. Điều chuyển tài sản giữa chi nhánh

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Quản lý tài sản (bên giao), Quản lý tài sản chi nhánh nhận |
| Tiền điều kiện | Tài sản đang ở trạng thái Đang sử dụng hoặc Trong kho; không có phiếu điều chuyển khác đang mở; không thuộc đợt kiểm kê đang khóa |
| Luồng chính | 1. Tạo phiếu, chọn tài sản, nơi nhận, lý do. 2. Phiếu đi qua luồng duyệt nếu cấu hình yêu cầu. 3. Bên giao xác nhận xuất. 4. Tài sản chuyển trạng thái Đang điều chuyển. 5. Bên nhận xác nhận nhận. 6. Hệ thống cập nhật vị trí, đơn vị quản lý, ghi lịch sử |
| Luồng ngoại lệ | Bên nhận từ chối hoặc không nhận trong thời hạn: tài sản quay về trạng thái cũ, ghi lý do |
| Hậu điều kiện | Chi phí khấu hao các kỳ sau được tính vào đơn vị mới; kỳ đã chốt không bị thay đổi |

UC-16. Kiểm kê bằng QR

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Quản lý tài sản, người kiểm kê |
| Tiền điều kiện | Đã tạo đợt kiểm kê với phạm vi xác định; hệ thống chụp danh sách tài sản kỳ vọng tại thời điểm bắt đầu |
| Luồng chính | 1. Người kiểm kê mở phiên trên điện thoại. 2. Quét QR từng tài sản. 3. Hệ thống đánh dấu Có mặt và ghi người quét, thời điểm, vị trí. 4. Kết thúc phiên, hệ thống đối chiếu danh sách kỳ vọng với danh sách quét |
| Luồng thay thế | Tem hỏng: tìm theo mã hoặc số sê-ri rồi đánh dấu thủ công kèm ghi chú. Tài sản không thuộc phạm vi nhưng được quét: ghi nhận là Thừa hoặc Sai vị trí |
| Hậu điều kiện | Có báo cáo chênh lệch (thừa, thiếu, sai vị trí); chỉ cập nhật dữ liệu gốc sau khi quản lý duyệt kết quả |

UC-18. Chạy khấu hao tháng và chốt kỳ

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Kế toán tài sản |
| Tiền điều kiện | Kỳ trước đã chốt; mọi tài sản có đủ thông số khấu hao |
| Luồng chính | 1. Chọn kỳ và phạm vi. 2. Hệ thống tính khấu hao cho từng tài sản đủ điều kiện (xem mục 9). 3. Hiển thị bảng kết quả để kiểm tra. 4. Kế toán xác nhận lưu. 5. Chốt kỳ, khóa số liệu |
| Luồng ngoại lệ | Tài sản thiếu thông số: liệt kê để bổ sung, không chặn các tài sản còn lại. Chạy lại cùng kỳ chưa chốt: ghi đè kết quả cũ, ghi log |
| Hậu điều kiện | Mỗi tài sản có một dòng hao mòn trong kỳ; kỳ đã chốt chỉ mở khóa được bởi người có quyền và có audit log |

UC-13. Thanh lý tài sản

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Quản lý tài sản, Giám đốc (duyệt) |
| Tiền điều kiện | Tài sản không đang trong phiếu khác; đã chạy khấu hao đến kỳ gần nhất |
| Luồng chính | 1. Lập phiếu thanh lý: lý do, giá trị thu hồi dự kiến. 2. Duyệt. 3. Xác nhận hoàn tất, ghi giá trị thực thu. 4. Tài sản chuyển trạng thái Đã thanh lý, ngừng khấu hao |
| Hậu điều kiện | Hồ sơ tài sản được giữ để tra cứu, không xóa; hệ thống tính lãi hoặc lỗ thanh lý (giá trị thu trừ giá trị còn lại) |


## 8.2 Danh sách bảng và cột chính

| Nhóm | Bảng | Cột chính | Ghi chú |
| --- | --- | --- | --- |
| Tổ chức | org_units | id, parent_id, type (chi nhánh hay phòng ban), code, name | Cây tổ chức, dùng chung cho chi nhánh và phòng ban |
| Tổ chức | locations | id, org_unit_id, parent_id, name | Vị trí vật lý: tòa nhà, phòng, kho |
| Người dùng | users, roles, user_roles, role_permissions | username, password_hash, full_name, org_unit_id, status | Phân quyền RBAC kèm phạm vi chi nhánh |
| Danh mục | asset_categories | code, name, default_depreciation_method, default_life_months | Tham số khấu hao mặc định theo nhóm |
| Danh mục | suppliers | id, name, tax_code, contact | Nhà cung cấp và đơn vị bảo trì |
| Tài sản | assets | id, code (duy nhất), name, category_id, serial_no, purchase_date, original_cost, residual_value, depreciation_method, useful_life_months, depreciation_start, status, org_unit_id, location_id, assignee_id, supplier_id, version, deleted_at | Trạng thái theo mục 6.1; version dùng cho khóa lạc quan |
| Tài sản | asset_files | id, asset_id, file_path, file_type, uploaded_by | Chỉ lưu đường dẫn, nội dung ở kho tệp |
| Tài sản | asset_events | id, asset_id, event_type, from_org_unit_id, to_org_unit_id, from_assignee_id, to_assignee_id, request_id, performed_by, performed_at, note | Chỉ thêm, không sửa; nguồn cho timeline |
| Phiếu | requests | id, type, requester_id, org_unit_id, status, current_step, created_at | Một bảng cho cả 4 loại phiếu, phân biệt bằng type |
| Phiếu | request_lines | id, request_id, asset_id (có thể rỗng), item_name, quantity, estimated_cost | Dòng chi tiết; đề xuất mua chưa có asset_id |
| Phiếu | workflow_steps | id, request_type, step_order, approver_rule (vai trò hoặc trưởng bộ phận) | Cấu hình số cấp duyệt |
| Phiếu | request_approvals | id, request_id, step_order, approver_id, decision, reason, decided_at | Chỉ thêm, không sửa |
| Kiểm kê | stocktakes | id, scope_org_unit_id, status, started_at, closed_at | Phạm vi và trạng thái đợt |
| Kiểm kê | stocktake_items | id, stocktake_id, asset_id, expected_location_id, scanned_at, scanned_by, result | result: khớp, thiếu, thừa, sai vị trí |
| Khấu hao | depreciation_runs | id, period (năm-tháng), scope, status (nháp, đã chốt), locked_at, locked_by | Mỗi kỳ một lần chạy cho mỗi phạm vi |
| Khấu hao | depreciation_entries | id, run_id, asset_id, period, amount, accumulated, book_value_after | Ràng buộc duy nhất (asset_id, period) |
| Bảo trì | maintenance_plans | id, asset_id, interval_months, next_due_date, active | Kích hoạt nhắc lịch |
| Bảo trì | maintenance_orders | id, asset_id, plan_id, type, status, vendor_id, cost, started_at, finished_at, result | Phiếu bảo trì, sửa chữa |
| Hệ thống | notifications, audit_logs, system_settings | user_id, type, ref, read_at; action, entity, before, after; key, value | Thông báo, nhật ký, tham số cấu hình |

Số tiền dùng kiểu thập phân cố định (ví dụ DECIMAL), tuyệt đối không dùng số thực dấu phẩy động.
2. Dữ liệu nghiệp vụ xóa mềm (cột deleted_at); bảng lịch sử, duyệt, khấu hao chỉ thêm.
3. Mọi bảng có cột thời điểm tạo, người tạo, thời điểm sửa, người sửa.
4. Cột trạng thái dùng danh sách giá trị đóng (enum hoặc bảng tra), khóa ngoại đầy đủ, không để dữ liệu mồ côi.
5. Thay đổi cấu trúc cơ sở dữ liệu chỉ qua migration có phiên bản.
6. Ghi tăng, cấp phát, điều chuyển, thanh lý phải cập nhật hồ sơ và ghi asset_events trong cùng một giao dịch.

## 8.4 Chỉ mục và ràng buộc gợi ý

| Đối tượng | Loại | Mục đích |
| --- | --- | --- |
| assets(code) | Duy nhất | Không trùng mã tài sản, tra cứu khi quét QR |
| assets(org_unit_id, status) | Chỉ mục ghép | Lọc danh sách theo đơn vị và trạng thái |
| asset_events(asset_id, performed_at) | Chỉ mục ghép | Vẽ timeline nhanh |
| depreciation_entries(asset_id, period) | Duy nhất | Không tính hai lần cho cùng kỳ, hỗ trợ chạy lại an toàn |
| stocktake_items(stocktake_id, asset_id) | Duy nhất | Mỗi tài sản một dòng trong một đợt kiểm kê |
| request_approvals(request_id, step_order) | Duy nhất | Mỗi cấp chỉ có một quyết định cuối |

