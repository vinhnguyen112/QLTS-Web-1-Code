# TÀI LIỆU PHÂN TÍCH THIẾT KẾ HỆ THỐNG: HỆ THỐNG QUẢN LÝ TÀI SẢN CHO DOANH NGHIỆP VỪA VÀ NHỎ

**Dự án: Hệ thống quản lý tài sản cho doanh nghiệp vừa và nhỏ**
Phân tích và thiết kế hướng đối tượng với UML

> **Ghi chú về bản chuyển đổi (.docx → .md):**
> - Nội dung được giữ nguyên từ tài liệu gốc; chỉ làm sạch định dạng (bảng, danh sách, in đậm bị vỡ).
> - **Các biểu đồ UML (Hình 1 đến Hình 10) không có trong file .docx gốc**, chỉ còn chú thích. Đã đánh dấu 🖼️ tại vị trí tương ứng.
> - **Hai công thức khấu hao (mục 9.2)** là ảnh trong file gốc, đã được viết lại bằng LaTeX và dạng văn bản.
> - **Tài liệu gốc kết thúc ở mục 11.2.** Các mục 11.3, 12, 13, 14 chỉ xuất hiện trong mục lục, phần nội dung không có trong file.

---

## Mục lục

- 1. Giới thiệu
  - 1.1 Bối cảnh và bài toán
  - 1.2 Mục tiêu
  - 1.3 Phạm vi
  - 1.4 Đối tượng sử dụng
  - 1.5 Thuật ngữ
  - 1.6 Phương pháp phân tích và thiết kế hướng đối tượng
- 2. Khảo sát và hệ thống tham khảo
  - 2.1 Đối chiếu chức năng
  - 2.2 Điểm khác biệt và cách tiếp cận của đề tài
  - 2.3 Việc cần làm để hoàn thiện khảo sát
- 3. Yêu cầu chức năng
  - 3.1 Quản trị hệ thống và danh mục dùng chung
  - 3.2 P1. Quản lý danh mục và thông tin tài sản
  - 3.3 P2. Theo dõi vòng đời tài sản
  - 3.4 P3. Mã QR và kiểm kê
  - 3.5 P4. Khấu hao tự động
  - 3.6 P5. Bảo trì, sửa chữa
  - 3.7 P6. Báo cáo và thống kê
  - 3.8 P7. Luồng duyệt nhiều cấp
- 4. Yêu cầu phi chức năng
- 5. Tác nhân và use case
  - 5.1 Tác nhân
  - 5.2 Danh sách use case
  - 5.3 Đặc tả các use case lõi
  - 5.4 Biểu đồ use case
- 6. Mô hình nghiệp vụ
  - 6.1 Vòng đời và trạng thái tài sản
  - 6.2 Luồng duyệt nhiều cấp
  - 6.3 Kiểm kê bằng QR
  - 6.4 Biểu đồ tuần tự
- 7. Kiến trúc hệ thống và công nghệ
  - 7.1 Kiến trúc tổng thể
  - 7.2 Các quyết định kiến trúc
  - 7.3 So sánh phương án công nghệ
  - 7.4 Khuyến nghị
- 8. Thiết kế cơ sở dữ liệu
  - 8.1 Biểu đồ lớp và ánh xạ sang mô hình quan hệ
  - 8.2 Danh sách bảng và cột chính
  - 8.3 Quy tắc thiết kế dữ liệu
  - 8.4 Chỉ mục và ràng buộc gợi ý
- 9. Thiết kế khấu hao tự động
  - 9.1 Phương pháp hỗ trợ
  - 9.2 Công thức
  - 9.3 Quy tắc nghiệp vụ
  - 9.4 Ví dụ số kiểm thử
  - 9.5 Lưu ý cho nhóm
  - 9.6 Mẫu Strategy cho phương pháp khấu hao
- 10. Thiết kế API và giao diện
  - 10.1 Quy ước API
  - 10.2 Các endpoint chính
  - 10.3 Danh sách màn hình
  - 10.4 Nguyên tắc thiết kế giao diện
- 11. Phân quyền và bảo mật
  - 11.1 Ma trận phân quyền (rút gọn)
  - 11.2 Các biện pháp bảo mật
  - 11.3 Rủi ro bảo mật cần nêu trong báo cáo
- 12. Kế hoạch kiểm thử và triển khai
  - 12.1 Các mức kiểm thử
  - 12.2 Ca kiểm thử trọng điểm
  - 12.3 Triển khai
- 13. Kế hoạch thực hiện, phân công và rủi ro
  - 13.1 Giả định
  - 13.2 Lộ trình
  - 13.3 Phân công theo vai trò
  - 13.4 Quản lý rủi ro
  - 13.5 Quy trình làm việc đề xuất
- 14. Ghi chú dành cho giảng viên hướng dẫn
  - 14.1 Cách dùng tài liệu
  - 14.2 Tiêu chí đánh giá gợi ý
  - 14.3 Câu hỏi phản biện mẫu
  - 14.4 Bộ câu hỏi phỏng vấn doanh nghiệp (cho mục 2.3)
  - 14.5 Bước tiếp theo

---

# 1. Giới thiệu

Đề tài xây dựng một ứng dụng web (kèm giao diện di động để quét mã QR) giúp doanh nghiệp vừa và nhỏ (SME) quản lý toàn bộ tài sản từ lúc đề xuất mua sắm đến khi thanh lý, thay thế cho các bảng tính Excel rời rạc.

## 1.1 Bối cảnh và bài toán

- SME thường theo dõi tài sản bằng Excel hoặc sổ giấy, nên số liệu của kế toán và thực tế dễ lệch nhau.
- Không ai biết chính xác thiết bị đang ở đâu, do ai giữ, khi nào cần bảo trì.

- Kiểm kê định kỳ tốn nhiều ngày công vì phải đếm và đối chiếu thủ công.
- Đề xuất mua sắm, cấp phát đi qua email, giấy tờ, thiếu dấu vết phê duyệt.

- Tính khấu hao thủ công cuối kỳ dễ sai và khó truy vết.

Một số sản phẩm thương mại (ví dụ MISA AMIS Tài sản) đã giải quyết các vấn đề này, nhưng chi phí và độ phức tạp thường vượt nhu cầu của doanh nghiệp nhỏ. Đề tài tập trung vào bộ chức năng cốt lõi, dễ triển khai và dễ cấu hình.

## 1.2 Mục tiêu

| Mã | Mục tiêu | Tiêu chí đo (đề xuất, cần xác nhận với đơn vị thực nghiệm) |
| --- | --- | --- |
| M1 | Quản lý tập trung danh mục và hồ sơ tài sản | 100% tài sản có mã định danh duy nhất và đủ trường bắt buộc |
| M2 | Theo dõi trọn vòng đời tài sản | Mọi biến động (cấp phát, điều chuyển, bảo trì, thanh lý) đều có bản ghi lịch sử |
| M3 | Rút ngắn kiểm kê bằng mã QR | Kiểm kê một phòng hoặc kho bằng điện thoại, không cần đối chiếu giấy |
| M4 | Tự động tính khấu hao | Kết quả khớp với tính tay trên bộ dữ liệu mẫu (xem mục 9) |
| M5 | Số hóa luồng duyệt mua sắm, cấp phát | Cấu hình được tối thiểu 2 cấp duyệt, có nhật ký phê duyệt |
| M6 | Báo cáo thống kê theo bộ phận | Có tối thiểu 5 báo cáo chuẩn, xuất được Excel và PDF |

## 1.3 Phạm vi

| Trong phạm vi | Ngoài phạm vi (để mở rộng) |
| --- | --- |
| Tài sản cố định hữu hình và công cụ dụng cụ | Tài sản vô hình, bất động sản đầu tư |
| Quản lý nhiều chi nhánh, phòng ban | Hạch toán kế toán đầy đủ, sổ cái, kết nối phần mềm kế toán |
| Tính khấu hao theo phương pháp đường thẳng, số dư giảm dần | Hợp nhất báo cáo tài chính nhiều pháp nhân |
| In tem QR, quét bằng trình duyệt điện thoại | Ứng dụng di động native, đọc RFID |
| Báo cáo và dashboard cơ bản | Phân tích dự báo bằng AI |

## 1.4 Đối tượng sử dụng

- Quản trị hệ thống (IT).
- Quản lý tài sản (hành chính, thiết bị).

- Kế toán tài sản.
- Trưởng bộ phận (duyệt đề xuất).

- Giám đốc hoặc kế toán trưởng (duyệt cấp cuối, xem báo cáo).
- Nhân viên (đề xuất, nhận tài sản, báo hỏng).

- Kỹ thuật viên bảo trì.

## 1.5 Thuật ngữ

| Thuật ngữ | Giải thích |
| --- | --- |
| Tài sản cố định (TSCĐ) | Tài sản có giá trị và thời gian sử dụng vượt ngưỡng theo quy định kế toán, được khấu hao dần |
| Công cụ dụng cụ (CCDC) | Tài sản giá trị nhỏ hơn ngưỡng TSCĐ, thường phân bổ chi phí |
| Nguyên giá | Giá trị ghi nhận ban đầu của tài sản (giá mua cộng chi phí liên quan) |
| Khấu hao | Phân bổ nguyên giá vào chi phí qua thời gian sử dụng hữu ích |
| Giá trị còn lại | Nguyên giá trừ hao mòn lũy kế |
| Kiểm kê | Đối chiếu tài sản thực tế với sổ sách |
| RBAC | Phân quyền theo vai trò (Role-Based Access Control) |
| Audit log | Nhật ký ghi lại ai đã làm gì, lúc nào |

*Lưu ý quy định: ngưỡng nguyên giá TSCĐ và khung thời gian khấu hao do Bộ Tài chính quy định và đã có văn bản mới thay thế Thông tư 45/2013/TT-BTC. Nhóm cần kiểm chứng văn bản đang có hiệu lực trước khi chốt số liệu; hệ thống nên lưu các tham số này ở dạng cấu hình, không viết cứng vào mã.*

## 1.6 Phương pháp phân tích và thiết kế hướng đối tượng

Tài liệu áp dụng phân tích và thiết kế hướng đối tượng (OOAD) với ngôn ngữ mô hình hóa UML 2.x: từ yêu cầu xác định tác nhân và use case, tìm các lớp của miền nghiệp vụ, mô tả hành vi bằng biểu đồ trạng thái, hoạt động và tuần tự, rồi ánh xạ lớp sang kiến trúc phần mềm và cơ sở dữ liệu quan hệ. Các bước thực hiện:

1. Thu thập yêu cầu (mục 3, 4), xác định tác nhân và use case (mục 5).

2. Mô hình hóa nghiệp vụ bằng biểu đồ trạng thái và biểu đồ hoạt động (mục 6.1, 6.2).

3. Mô hình hóa tương tác bằng biểu đồ tuần tự cho các use case lõi (mục 6.4).

4. Thiết kế kiến trúc bằng biểu đồ thành phần và biểu đồ triển khai (mục 7.1).

5. Thiết kế lớp và ánh xạ sang cơ sở dữ liệu (mục 8.1); áp dụng mẫu Strategy cho khấu hao (mục 9.6).

| Biểu đồ UML | Mục đích trong tài liệu | Mục |
| --- | --- | --- |
| Use case | Phạm vi chức năng theo góc nhìn của từng tác nhân | 5.4 |
| Trạng thái (State Machine) | Vòng đời của tài sản và của phiếu nghiệp vụ | 6.1, 6.2 |
| Hoạt động (Activity) | Quy trình từ đề xuất mua sắm đến cấp phát, có làn trách nhiệm | 6.2 |
| Tuần tự (Sequence) | Tương tác theo thời gian của duyệt phiếu, kiểm kê QR, khấu hao | 6.4 |
| Thành phần (Component) | Các mô-đun của ứng dụng máy chủ và phụ thuộc giữa chúng | 7.1 |
| Triển khai (Deployment) | Các nút phần cứng, phần mềm chạy hệ thống | 7.1 |
| Lớp (Class) | Lớp miền nghiệp vụ, quan hệ, kế thừa, giao diện | 8.1, 9.6 |

Quy ước ký hiệu: đường liền nối hai lớp là kết hợp (association) kèm bội số; hình thoi đặc là hợp thành (composition); tam giác rỗng là kế thừa hoặc hiện thực giao diện; mũi tên nét đứt là phụ thuộc; «include» và «extend» là hai quan hệ giữa các use case. Các biểu đồ trong tài liệu là bản tham chiếu; nhóm nên vẽ lại bằng công cụ như PlantUML, draw.io hoặc StarUML để có tệp nguồn dùng lại khi chỉnh sửa.

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

- Tập trung vào SME: cấu hình đơn giản, triển khai nhanh, chi phí vận hành thấp.
- Mô hình đa chi nhánh nhưng dùng chung một cơ sở dữ liệu (multi-branch, single tenant); chưa làm đa doanh nghiệp (multi-tenant).

- Khấu hao là một mô-đun độc lập, có kiểm thử đơn vị với dữ liệu mẫu để chứng minh tính đúng.
- Kiểm kê bằng QR chạy trên web, không cần cài ứng dụng.

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

**UC-09. Duyệt phiếu nhiều cấp**

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Người duyệt (Trưởng bộ phận, Giám đốc, theo cấu hình) |
| Tiền điều kiện | Phiếu ở trạng thái Chờ duyệt và đang ở cấp của người này |
| Luồng chính | 1. Người duyệt mở danh sách phiếu chờ. 2. Xem chi tiết và lịch sử duyệt. 3. Chọn Đồng ý. 4. Hệ thống ghi nhận, chuyển cấp kế tiếp hoặc chuyển phiếu sang Đã duyệt nếu là cấp cuối. 5. Gửi thông báo cho người đề xuất và người duyệt kế tiếp |
| Luồng thay thế | Từ chối: bắt buộc nhập lý do, phiếu về Bị từ chối. Trả về: phiếu về Cần chỉnh sửa, người đề xuất sửa rồi gửi lại từ cấp 1 |
| Luồng ngoại lệ | Phiếu đã bị người khác xử lý hoặc người đề xuất thu hồi: báo lỗi và tải lại |
| Hậu điều kiện | Có bản ghi duyệt (ai, lúc nào, quyết định, lý do) không sửa được |
| Quy tắc | Người đề xuất không được tự duyệt phiếu của mình; người duyệt ở cấp trước không duyệt lại cấp sau |

**UC-12. Điều chuyển tài sản giữa chi nhánh**

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Quản lý tài sản (bên giao), Quản lý tài sản chi nhánh nhận |
| Tiền điều kiện | Tài sản đang ở trạng thái Đang sử dụng hoặc Trong kho; không có phiếu điều chuyển khác đang mở; không thuộc đợt kiểm kê đang khóa |
| Luồng chính | 1. Tạo phiếu, chọn tài sản, nơi nhận, lý do. 2. Phiếu đi qua luồng duyệt nếu cấu hình yêu cầu. 3. Bên giao xác nhận xuất. 4. Tài sản chuyển trạng thái Đang điều chuyển. 5. Bên nhận xác nhận nhận. 6. Hệ thống cập nhật vị trí, đơn vị quản lý, ghi lịch sử |
| Luồng ngoại lệ | Bên nhận từ chối hoặc không nhận trong thời hạn: tài sản quay về trạng thái cũ, ghi lý do |
| Hậu điều kiện | Chi phí khấu hao các kỳ sau được tính vào đơn vị mới; kỳ đã chốt không bị thay đổi |

**UC-16. Kiểm kê bằng QR**

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Quản lý tài sản, người kiểm kê |
| Tiền điều kiện | Đã tạo đợt kiểm kê với phạm vi xác định; hệ thống chụp danh sách tài sản kỳ vọng tại thời điểm bắt đầu |
| Luồng chính | 1. Người kiểm kê mở phiên trên điện thoại. 2. Quét QR từng tài sản. 3. Hệ thống đánh dấu Có mặt và ghi người quét, thời điểm, vị trí. 4. Kết thúc phiên, hệ thống đối chiếu danh sách kỳ vọng với danh sách quét |
| Luồng thay thế | Tem hỏng: tìm theo mã hoặc số sê-ri rồi đánh dấu thủ công kèm ghi chú. Tài sản không thuộc phạm vi nhưng được quét: ghi nhận là Thừa hoặc Sai vị trí |
| Hậu điều kiện | Có báo cáo chênh lệch (thừa, thiếu, sai vị trí); chỉ cập nhật dữ liệu gốc sau khi quản lý duyệt kết quả |

**UC-18. Chạy khấu hao tháng và chốt kỳ**

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Kế toán tài sản |
| Tiền điều kiện | Kỳ trước đã chốt; mọi tài sản có đủ thông số khấu hao |
| Luồng chính | 1. Chọn kỳ và phạm vi. 2. Hệ thống tính khấu hao cho từng tài sản đủ điều kiện (xem mục 9). 3. Hiển thị bảng kết quả để kiểm tra. 4. Kế toán xác nhận lưu. 5. Chốt kỳ, khóa số liệu |
| Luồng ngoại lệ | Tài sản thiếu thông số: liệt kê để bổ sung, không chặn các tài sản còn lại. Chạy lại cùng kỳ chưa chốt: ghi đè kết quả cũ, ghi log |
| Hậu điều kiện | Mỗi tài sản có một dòng hao mòn trong kỳ; kỳ đã chốt chỉ mở khóa được bởi người có quyền và có audit log |

**UC-13. Thanh lý tài sản**

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Quản lý tài sản, Giám đốc (duyệt) |
| Tiền điều kiện | Tài sản không đang trong phiếu khác; đã chạy khấu hao đến kỳ gần nhất |
| Luồng chính | 1. Lập phiếu thanh lý: lý do, giá trị thu hồi dự kiến. 2. Duyệt. 3. Xác nhận hoàn tất, ghi giá trị thực thu. 4. Tài sản chuyển trạng thái Đã thanh lý, ngừng khấu hao |
| Hậu điều kiện | Hồ sơ tài sản được giữ để tra cứu, không xóa; hệ thống tính lãi hoặc lỗ thanh lý (giá trị thu trừ giá trị còn lại) |

## 5.4 Biểu đồ use case

Hai biểu đồ dưới đây chia use case theo nhóm phân hệ để dễ đọc. Đường liền nối tác nhân với use case. Quan hệ «include» nghĩa là use case nguồn luôn gọi use case đích: duyệt phiếu nhiều cấp (UC-09) được dùng chung cho mua sắm, điều chuyển và thanh lý; kiểm kê (UC-16) dùng lại thao tác quét QR (UC-15). Quan hệ «extend» nghĩa là use case nguồn là phần mở rộng tùy chọn của use case đích: nhập từ Excel (UC-07) mở rộng quản lý hồ sơ tài sản (UC-05).

> 🖼️ **Hình 1.** Biểu đồ use case: quản trị, tài sản, vòng đời và luồng duyệt
> *(Hình vẽ không có trong file .docx gốc. Cần vẽ lại bằng PlantUML / draw.io / StarUML và đính kèm.)*

> 🖼️ **Hình 2.** Biểu đồ use case: QR, kiểm kê, khấu hao, bảo trì và báo cáo
> *(Hình vẽ không có trong file .docx gốc. Cần vẽ lại bằng PlantUML / draw.io / StarUML và đính kèm.)*

Mọi use case ngoài UC-01 đều yêu cầu người dùng đã đăng nhập, nên hình không vẽ thêm quan hệ «include» tới UC-01. UC-03, UC-06 và UC-21 là chức năng hỗ trợ (cơ cấu tổ chức, tìm kiếm, thông báo) nên không vẽ trong hình mà chỉ đặc tả trong bảng ở mục 5.2. Hai tác nhân hệ thống (bộ lập lịch, dịch vụ email) tham gia UC-21 và luồng nhắc bảo trì.

# 6. Mô hình nghiệp vụ

Ba mô hình nghiệp vụ chi phối toàn bộ thiết kế: vòng đời tài sản, luồng duyệt nhiều cấp và quy trình kiểm kê bằng QR.

## 6.1 Vòng đời và trạng thái tài sản

> 🖼️ **Hình 3.** Biểu đồ trạng thái của đối tượng Asset
> *(Hình vẽ không có trong file .docx gốc. Cần vẽ lại bằng PlantUML / draw.io / StarUML và đính kèm.)*

Tài sản chỉ đổi trạng thái thông qua một phiếu nghiệp vụ, nên hệ thống luôn biết ai đã đổi, lúc nào và vì sao. Biểu đồ trạng thái ở trên mô tả các trạng thái hợp lệ của đối tượng Asset và các sự kiện làm nó chuyển trạng thái. Điều kiện trong ngoặc vuông là guard: ví dụ chỉ thanh lý khi phiếu thanh lý đã được duyệt. Mỗi lần chuyển trạng thái được cài đặt bằng một phương thức của lớp Asset (assign, transfer, sendToMaintenance, dispose) và ghi một bản ghi AssetEvent.

| Trạng thái | Ý nghĩa | Vào bằng | Ra bằng |
| --- | --- | --- | --- |
| Phiếu đề xuất | Chưa là tài sản, đang xin mua | Tạo đề xuất | Duyệt xong thì ghi tăng |
| Trong kho | Đã ghi tăng, chưa giao cho ai | Ghi tăng, thu hồi | Cấp phát, điều chuyển, thanh lý |
| Đang sử dụng | Đang giao cho người hoặc bộ phận | Cấp phát | Thu hồi, điều chuyển, bảo trì, thanh lý |
| Điều chuyển | Đang đi giữa hai đơn vị, chờ bên nhận | Phiếu điều chuyển | Bên nhận xác nhận hoặc từ chối |
| Bảo trì | Đang bảo dưỡng hoặc sửa chữa | Phiếu bảo trì | Hoàn tất sửa chữa |
| Đã thanh lý | Ngừng sử dụng, ngừng khấu hao, giữ hồ sơ | Phiếu thanh lý hoàn tất | Không có (trạng thái cuối) |

## 6.2 Luồng duyệt nhiều cấp

Phiếu nghiệp vụ (Request) có vòng đời riêng gồm 6 trạng thái. Số cấp duyệt là tham số cấu hình, vì vậy trạng thái Chờ duyệt có thể lặp lại theo từng cấp trước khi phiếu chuyển sang Đã duyệt.

> 🖼️ **Hình 4.** Biểu đồ trạng thái của phiếu nghiệp vụ (Request)
> *(Hình vẽ không có trong file .docx gốc. Cần vẽ lại bằng PlantUML / draw.io / StarUML và đính kèm.)*

Biểu đồ hoạt động dưới đây mô tả quy trình đề xuất mua sắm với hai cấp duyệt; các làn (swimlane) tách rõ trách nhiệm của từng vai trò và của hệ thống.

> 🖼️ **Hình 5.** Biểu đồ hoạt động: từ đề xuất mua sắm đến cấp phát tài sản
> *(Hình vẽ không có trong file .docx gốc. Cần vẽ lại bằng PlantUML / draw.io / StarUML và đính kèm.)*

Số cấp duyệt thực tế được cấu hình theo từng loại phiếu. Các quy tắc thiết kế đi kèm:

- Phiếu là một máy trạng thái (state machine): chỉ cho phép các chuyển trạng thái hợp lệ, mọi chuyển khác bị từ chối ở máy chủ.
- Người duyệt từng cấp xác định theo vai trò hoặc theo trưởng bộ phận của người đề xuất; cấu hình lưu ở bảng các bước của quy trình.

- Khi người duyệt vắng mặt, cho phép ủy quyền có thời hạn; phiếu chờ quá hạn thì nhắc.
- Hai người cùng duyệt một phiếu: dùng số phiên bản (khóa lạc quan) để người đến sau nhận thông báo phiếu đã được xử lý.

- Mỗi quyết định là một bản ghi chỉ thêm, không sửa, gồm người duyệt, thời điểm, quyết định và lý do.

## 6.3 Kiểm kê bằng QR

1. Quản lý tạo đợt kiểm kê, chọn phạm vi (chi nhánh, phòng, kho); hệ thống chụp danh sách tài sản kỳ vọng ngay lúc đó.

2. Người kiểm kê mở phiên trên điện thoại và quét tem từng tài sản; mỗi lần quét ghi người quét và thời điểm.

3. Tem hỏng: tìm theo mã hoặc số sê-ri rồi đánh dấu thủ công kèm ghi chú.

4. Kết thúc phiên, hệ thống đối chiếu danh sách kỳ vọng với danh sách đã quét.

5. Quản lý xem kết quả chênh lệch, xử lý từng dòng, rồi duyệt.

6. Chỉ sau khi duyệt, hệ thống mới cập nhật vị trí hoặc trạng thái tài sản và ghi lịch sử.

| Kết quả đối chiếu | Điều kiện | Xử lý gợi ý |
| --- | --- | --- |
| Khớp | Có trong danh sách kỳ vọng và đã quét | Không cần làm gì |
| Thiếu | Có trong danh sách kỳ vọng, không quét thấy | Tìm lại, hoặc lập phiếu ghi giảm hay thanh lý |
| Thừa | Quét thấy nhưng không có trong phạm vi hoặc chưa có hồ sơ | Kiểm tra, bổ sung hồ sơ hoặc trả về đúng nơi |
| Sai vị trí | Quét thấy ở nơi khác với hồ sơ | Cập nhật vị trí hoặc lập phiếu điều chuyển |

## 6.4 Biểu đồ tuần tự

Ba biểu đồ tuần tự mô tả tương tác giữa người dùng, giao diện và các đối tượng dịch vụ cho ba use case lõi. Mũi tên liền là lời gọi, mũi tên nét đứt là kết quả trả về, mũi tên quay về chính nó là xử lý nội bộ; khung alt biểu diễn rẽ nhánh và khung loop biểu diễn vòng lặp.

**Duyệt phiếu nhiều cấp (UC-09)**

> 🖼️ **Hình 6.** Biểu đồ tuần tự: duyệt phiếu nhiều cấp (UC-09)
> *(Hình vẽ không có trong file .docx gốc. Cần vẽ lại bằng PlantUML / draw.io / StarUML và đính kèm.)*

RequestService kiểm tra quyền, trạng thái và số phiên bản (khóa lạc quan) trước khi ghi quyết định; nhờ đó hai người cùng duyệt một phiếu thì người đến sau nhận thông báo phiếu đã được xử lý. Việc chặn người đề xuất tự duyệt nằm ở bước kiểm tra này. Thông báo chỉ gửi sau khi giao dịch ghi dữ liệu thành công.

**Kiểm kê bằng QR (UC-16)**

> 🖼️ **Hình 7.** Biểu đồ tuần tự: kiểm kê bằng QR (UC-16)
> *(Hình vẽ không có trong file .docx gốc. Cần vẽ lại bằng PlantUML / draw.io / StarUML và đính kèm.)*

Mã QR được giải mã ngay trên trình duyệt; máy chủ so mã với danh sách kỳ vọng đã chụp khi bắt đầu đợt kiểm kê. Dữ liệu gốc của tài sản chỉ được cập nhật sau khi quản lý duyệt kết quả chênh lệch.

**Chạy khấu hao và chốt kỳ (UC-18)**

> 🖼️ **Hình 8.** Biểu đồ tuần tự: chạy khấu hao và chốt kỳ (UC-18)
> *(Hình vẽ không có trong file .docx gốc. Cần vẽ lại bằng PlantUML / draw.io / StarUML và đính kèm.)*

DepreciationService không tự tính mà gọi DepreciationMethod (mẫu Strategy, mục 9.6). Kết quả được ghi trong một giao dịch và ràng buộc duy nhất (asset_id, period) bảo đảm chạy lại cùng một kỳ không nhân đôi dữ liệu.

# 7. Kiến trúc hệ thống và công nghệ

Khuyến nghị là kiến trúc mô-đun nguyên khối (modular monolith) với một cơ sở dữ liệu quan hệ; phần công nghệ cụ thể chọn theo năng lực nhóm (mục 7.3).

## 7.1 Kiến trúc tổng thể

Biểu đồ thành phần cho thấy các mô-đun của ứng dụng máy chủ và những thành phần hạ tầng mà chúng phụ thuộc; biểu đồ triển khai cho thấy các nút chạy hệ thống.

> 🖼️ **Hình 9.** Biểu đồ thành phần của hệ thống
> *(Hình vẽ không có trong file .docx gốc. Cần vẽ lại bằng PlantUML / draw.io / StarUML và đính kèm.)*

> 🖼️ **Hình 10.** Biểu đồ triển khai
> *(Hình vẽ không có trong file .docx gốc. Cần vẽ lại bằng PlantUML / draw.io / StarUML và đính kèm.)*

Trình duyệt gọi API qua HTTPS; ứng dụng máy chủ gồm các mô-đun có ranh giới rõ và dùng chung một cơ sở dữ liệu. Mô-đun khấu hao được tách riêng vì đây là phần cần chứng minh tính đúng bằng kiểm thử đơn vị. Bộ lập lịch chạy các tác vụ nền như nhắc bảo trì và khấu hao quy mô lớn. Toàn bộ hệ thống đóng gói bằng Docker và chạy trên một máy chủ ở giai đoạn đầu.

## 7.2 Các quyết định kiến trúc

| Vấn đề | Lựa chọn | Lý do và đánh đổi |
| --- | --- | --- |
| Kiến trúc | Modular monolith thay vì microservices | Ít thành phần để triển khai và debug, giao dịch dữ liệu đơn giản; đánh đổi là khó co giãn từng mô-đun riêng, nhưng không cần ở quy mô SME |
| Dữ liệu | Cơ sở dữ liệu quan hệ | Nghiệp vụ tài sản, khấu hao cần ràng buộc và giao dịch ACID; NoSQL không phù hợp |
| Giao diện | Ứng dụng web co giãn, không làm app native | Quét QR bằng camera trình duyệt; không phải cài đặt; đánh đổi là không dùng được khi mất mạng (có thể để ở phần mở rộng) |
| Xác thực | Token có hạn dùng (JWT) kèm token làm mới, hoặc session cookie | Chọn một trong hai và giải thích trong báo cáo; session cookie đơn giản hơn nếu chỉ có một ứng dụng web |
| Tác vụ nền | Bộ lập lịch trong ứng dụng | Nhắc bảo trì, chạy khấu hao lớn; không cần hệ thống hàng đợi riêng ở giai đoạn này |
| Tệp đính kèm | Ổ đĩa máy chủ hoặc kho tương thích S3 | Lưu đường dẫn trong cơ sở dữ liệu, không lưu nội dung tệp trong bảng |
| Triển khai | Docker Compose | Cùng một cách chạy ở máy nhóm, staging và bảo vệ |

## 7.3 So sánh phương án công nghệ

| Tiêu chí | A. Node.js (NestJS) + React | B. Java (Spring Boot) + React | C. PHP (Laravel) + Vue |
| --- | --- | --- | --- |
| Ngôn ngữ toàn hệ thống | Một ngôn ngữ (TypeScript) cho cả hai phía | Java phía sau, JavaScript phía trước | PHP phía sau, JavaScript phía trước |
| Giao dịch và dữ liệu tài chính | Tốt với ORM nhưng phải tự kỷ luật về kiểu số tiền | Kiểu tĩnh chặt, quản lý giao dịch trưởng thành | Đủ dùng, cần cẩn thận với kiểu dữ liệu |
| Tốc độ phát triển ban đầu | Nhanh | Chậm hơn do nhiều cấu hình | Nhanh nhất với công cụ có sẵn (migration, queue, auth) |
| Độ khó cho nhóm sinh viên | Trung bình | Trung bình đến cao | Thấp đến trung bình |
| Phù hợp kiến thức đã học | Tùy chương trình; cần kiểm tra | Thường trùng môn đã học ở nhiều trường; cần kiểm tra | Tùy chương trình; cần kiểm tra |
| Rủi ro chính | Nhóm viết mã không có cấu trúc nếu thiếu quy ước | Thời gian dựng khung lâu, dễ sa lầy cấu hình | Dễ viết mã lộn xộn giữa giao diện và nghiệp vụ |

Lưu ý: bảng so sánh mang tính định hướng. Phiên bản framework, thư viện quét QR và mức độ phổ biến trên thị trường tuyển dụng thay đổi theo thời gian, nhóm cần kiểm chứng từ tài liệu chính thức và dữ liệu tuyển dụng hiện tại trước khi chốt.

## 7.4 Khuyến nghị

- Nếu nhóm đã thành thạo một ngôn ngữ: chọn phương án dùng ngôn ngữ đó, đừng đổi vì xu hướng.
- Nếu chưa có thế mạnh rõ: phương án A hoặc B; ưu tiên B nếu nhóm muốn rèn kiểu dữ liệu chặt và giao dịch cho phần tài chính, ưu tiên A nếu muốn đi nhanh và dùng một ngôn ngữ.

- Bất kể chọn gì: dùng cơ sở dữ liệu quan hệ, migration có phiên bản, kiểu dữ liệu thập phân chính xác cho tiền (không dùng số thực dấu phẩy động) và viết test cho khấu hao từ tuần đầu.
- Nhóm ghi quyết định chọn công nghệ dưới dạng một bản ghi ngắn (bối cảnh, lựa chọn, hệ quả) để trả lời hội đồng.

# 8. Thiết kế cơ sở dữ liệu

Cơ sở dữ liệu quan hệ xoay quanh bảng assets; mọi biến động được ghi thành dòng lịch sử riêng, không ghi đè lên hồ sơ.

Biểu đồ lớp được chia thành hai hình để dễ đọc: lớp lõi (tài sản, tổ chức, khấu hao) và lớp quy trình (phiếu, duyệt, kiểm kê, bảo trì). Số ghi ở hai đầu đường nối là bội số của quan hệ kết hợp. Hợp thành (hình thoi đặc) nghĩa là đối tượng con không tồn tại độc lập với đối tượng cha. Bốn loại phiếu kế thừa từ lớp trừu tượng Request; mỗi loại cài đặt phương thức execute() theo cách riêng (đa hình). Cách chuyển biểu đồ lớp sang cơ sở dữ liệu quan hệ:

| Cấu trúc UML | Ánh xạ sang cơ sở dữ liệu quan hệ |
| --- | --- |
| Lớp | Một bảng, tên số nhiều (Asset thành assets) |
| Kết hợp 1 - N | Khóa ngoại ở phía N (ví dụ assets.category_id) |
| Kết hợp N - N (User, Role) | Bảng trung gian (user_roles) |
| Hợp thành | Khóa ngoại bắt buộc ở bảng con; bản ghi con như AssetEvent chỉ thêm, không sửa |
| Kế thừa (Request và bốn loại phiếu) | Một bảng requests có cột type; phần riêng của từng loại đặt vào cột hoặc bảng chi tiết |
| Lớp trừu tượng, giao diện | Không có bảng; chỉ là mã nguồn. Phương pháp khấu hao lưu bằng cột depreciation_method |
| Thuộc tính kiểu Money | Kiểu thập phân cố định (DECIMAL) |
| Kiểu liệt kê (status, result) | Cột chuỗi giá trị đóng hoặc bảng tra |

ERD đầy đủ có cột, kiểu dữ liệu và khóa là phần nhóm tự vẽ (ví dụ bằng dbdiagram.io hoặc draw.io) dựa trên biểu đồ lớp và danh sách dưới đây.

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

## 8.3 Quy tắc thiết kế dữ liệu

1. Số tiền dùng kiểu thập phân cố định (ví dụ DECIMAL), tuyệt đối không dùng số thực dấu phẩy động.

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

# 9. Thiết kế khấu hao tự động

Mô-đun khấu hao là một hàm thuần túy (cùng đầu vào cho cùng kết quả), tách khỏi giao diện và cơ sở dữ liệu, để kiểm thử đơn vị bằng dữ liệu mẫu tính tay. Các tham số (hệ số, ngưỡng, quy tắc tháng bắt đầu) lấy từ bảng cấu hình, nhóm cần đối chiếu với văn bản kế toán đang có hiệu lực trước khi chốt.

## 9.1 Phương pháp hỗ trợ

| Phương pháp | Mức khấu hao | Ưu tiên |
| --- | --- | --- |
| Đường thẳng | Đều nhau mỗi tháng trong suốt thời gian sử dụng | Bắt buộc (MVP) |
| Số dư giảm dần có điều chỉnh | Giảm dần theo giá trị còn lại đầu kỳ, chuyển sang đường thẳng ở các năm cuối | Nên có |
| Theo sản lượng | Theo khối lượng sản phẩm thực tế | Ngoài phạm vi |

## 9.2 Công thức

Đường thẳng, mức khấu hao mỗi tháng:

$$KH_{tháng} = \frac{NG - GTTL}{T}$$

Dạng văn bản: `KH_tháng = (NG - GTTL) / T`

NG là nguyên giá, GTTL là giá trị thanh lý ước tính (mặc định 0), T là số tháng sử dụng hữu ích.

Số dư giảm dần, mức khấu hao năm thứ i:

$$KH_{năm,i} = GTCL_{i-1} \times \left(\frac{1}{N} \times k\right)$$

Dạng văn bản: `KH_năm_i = GTCL_(i-1) × (1/N × k)`

GTCL là giá trị còn lại đầu năm, N là số năm sử dụng, k là hệ số điều chỉnh (tra theo N; tham số cấu hình). Từ năm mà mức này nhỏ hơn GTCL chia cho số năm còn lại thì chuyển sang chia đều phần còn lại.

## 9.3 Quy tắc nghiệp vụ

1. Tháng bắt đầu: mặc định tính từ tháng sau tháng ghi tăng; tháng ngừng: tháng sau tháng ghi giảm hoặc thanh lý (tham số cấu hình).

2. Tháng cuối: mức khấu hao bằng đúng giá trị còn lại, để tổng khấu hao bằng nguyên giá trừ giá trị thanh lý, không dư số lẻ do làm tròn.

3. Làm tròn đến đồng, mọi chênh lệch dồn vào tháng cuối.

4. Thay đổi nguyên giá (nâng cấp) hoặc thời gian sử dụng: tính lại từ kỳ chưa chốt, mức mới bằng giá trị còn lại chia cho số tháng còn lại.

5. Kỳ đã chốt không bao giờ bị tính lại.

6. Chạy lại cùng một kỳ chưa chốt cho kết quả y hệt (idempotent): xóa kết quả cũ của kỳ rồi ghi lại trong một giao dịch.

7. Tài sản chưa đủ thông số hoặc dưới ngưỡng TSCĐ (công cụ dụng cụ) đi theo nhánh phân bổ riêng, không lẫn vào khấu hao.

## 9.4 Ví dụ số kiểm thử

Máy chủ nguyên giá 60.000.000 đồng, sử dụng 5 năm (60 tháng), không có giá trị thanh lý, ghi tăng ngày 15/01/2026.

Đường thẳng: khấu hao bắt đầu từ tháng 02/2026, mỗi tháng 1.000.000 đồng. Sau 12 tháng (hết tháng 01/2027): hao mòn lũy kế 12.000.000 đồng, giá trị còn lại 48.000.000 đồng.

Số dư giảm dần, giả sử k = 2,0 (tỷ lệ 40% mỗi năm), tính theo năm sử dụng (đơn vị đồng):

| Năm | GTCL đầu năm | Khấu hao năm | GTCL cuối năm | Ghi chú |
| --- | --- | --- | --- | --- |
| 1 | 60.000.000 | 24.000.000 | 36.000.000 | 40% × 60.000.000 |
| 2 | 36.000.000 | 14.400.000 | 21.600.000 | 40% × 36.000.000 |
| 3 | 21.600.000 | 8.640.000 | 12.960.000 | 40% × 21.600.000 |
| 4 | 12.960.000 | 6.480.000 | 6.480.000 | 40% = 5.184.000 nhỏ hơn 12.960.000 / 2 = 6.480.000, chuyển sang đường thẳng |
| 5 | 6.480.000 | 6.480.000 | 0 | Năm cuối khấu hao hết giá trị còn lại |

Tổng khấu hao 5 năm: 24.000.000 + 14.400.000 + 8.640.000 + 6.480.000 + 6.480.000 = 60.000.000 đồng, khớp nguyên giá. Đây là bộ test case đầu tiên cho mô-đun; nhóm nên bổ sung ca tháng cuối, ca thanh lý giữa kỳ và ca nâng cấp tài sản.

## 9.5 Lưu ý cho nhóm

- Hệ số k, ngưỡng nguyên giá và thời gian khấu hao theo nhóm tài sản phải lấy từ văn bản của Bộ Tài chính đang hiệu lực. Mình không khẳng định giá trị cụ thể ở đây vì quy định đã được cập nhật; nhóm tự tra và ghi nguồn trong báo cáo.
- Ví dụ trên chỉ nhằm chứng minh logic thuật toán, không phải hướng dẫn hạch toán thực tế.

- Phần cài đặt thuật toán để nhóm tự viết; GVHD có thể yêu cầu nhóm giải thích vì sao chọn quy tắc làm tròn dồn vào tháng cuối.

## 9.6 Mẫu Strategy cho phương pháp khấu hao

Mỗi phương pháp khấu hao là một lớp cài đặt giao diện DepreciationMethod (xem biểu đồ lớp lõi ở mục 8.1). DepreciationRun chỉ biết giao diện này, nên thêm phương pháp mới (ví dụ theo sản lượng) chỉ cần thêm một lớp và một giá trị cấu hình, không sửa luồng chạy kỳ. Cách làm này theo nguyên lý mở - đóng (Open/Closed) và đáp ứng yêu cầu NFR-10. Mỗi lớp được kiểm thử đơn vị độc lập bằng bộ dữ liệu ở mục 9.4.

# 10. Thiết kế API và giao diện

Giao diện web gọi REST API qua JSON; điện thoại dùng chính giao diện web co giãn (responsive) và camera trình duyệt để quét QR.

## 10.1 Quy ước API

- Tiền tố /api/v1, tài nguyên viết số nhiều, dùng đúng phương thức HTTP (GET, POST, PUT, PATCH, DELETE).
- Danh sách có phân trang và lọc: ?page=1&size=20&q=...&branchId=....

- Lỗi trả về thống nhất gồm mã lỗi, thông điệp, chi tiết từng trường.
- Hành động nghiệp vụ có trạng thái đặt thành endpoint riêng dạng động từ, ví dụ POST /requests/{id}/approve.

- Tài liệu hóa bằng OpenAPI (Swagger) để nhóm làm giao diện và kiểm thử dùng chung.

## 10.2 Các endpoint chính

| Nhóm | Endpoint | Mục đích |
| --- | --- | --- |
| Xác thực | POST /auth/login, POST /auth/refresh | Đăng nhập, làm mới token |
| Tài sản | GET/POST /assets, GET/PUT /assets/{id}, GET /assets/{id}/history | Hồ sơ và lịch sử |
| QR | GET /assets/{id}/qr, POST /labels/print | Sinh và in tem |
| Phiếu | POST /requests, POST /requests/{id}/submit, /approve, /reject, /return | Tạo phiếu và duyệt |
| Vòng đời | POST /assignments, /transfers, /disposals | Cấp phát, điều chuyển, thanh lý |
| Kiểm kê | POST /stocktakes, POST /stocktakes/{id}/scan, POST /stocktakes/{id}/close | Phiên kiểm kê |
| Khấu hao | POST /depreciation/runs, GET /depreciation/runs/{id}, POST /depreciation/runs/{id}/lock | Chạy, xem, chốt kỳ |
| Bảo trì | GET/POST /maintenance-plans, POST /maintenance-orders | Lịch và phiếu |
| Báo cáo | GET /reports/{code}, GET /dashboard | Báo cáo, dashboard |
| Quản trị | /users, /roles, /branches, /departments, /settings, /audit-logs | Danh mục và cấu hình |

## 10.3 Danh sách màn hình

| Nhóm | Màn hình | Tác nhân chính |
| --- | --- | --- |
| Chung | Đăng nhập; trang chủ theo vai trò; thông báo | Tất cả |
| Tài sản | Danh sách (bộ lọc, tìm kiếm); chi tiết với các tab Thông tin, Lịch sử, Bảo trì, Khấu hao, Tệp; biểu mẫu thêm, sửa; nhập Excel | Quản lý tài sản |
| Phiếu | Tạo đề xuất; hộp phiếu chờ duyệt; chi tiết phiếu với dòng thời gian duyệt | Mọi vai trò |
| Vòng đời | Cấp phát, thu hồi; điều chuyển; thanh lý | Quản lý tài sản |
| QR và kiểm kê | In tem; quét tra cứu (di động); phiên kiểm kê (di động); kết quả chênh lệch | Quản lý, người kiểm kê |
| Khấu hao | Thông số khấu hao; chạy kỳ; bảng kết quả; chốt kỳ | Kế toán |
| Bảo trì | Lịch bảo trì; phiếu sửa chữa | Kỹ thuật viên |
| Báo cáo | Dashboard; báo cáo theo bộ phận, loại, vị trí; tài sản sắp hết hạn | Quản lý, Giám đốc |
| Quản trị | Người dùng, vai trò; cơ cấu tổ chức; danh mục; cấu hình; nhật ký | Quản trị |

## 10.4 Nguyên tắc thiết kế giao diện

1. Màn hình quét QR dùng nút lớn, phản hồi bằng rung hoặc âm thanh, hoạt động tốt trên một tay.

2. Phiếu luôn hiển thị trạng thái hiện tại và bước tiếp theo ở đầu trang.

3. Thao tác không thể hoàn tác (chốt kỳ, thanh lý) có hộp xác nhận nêu rõ hậu quả.

4. Nhóm vẽ wireframe cho tối thiểu 6 màn hình lõi (danh sách tài sản, chi tiết tài sản, hộp phiếu chờ duyệt, quét kiểm kê, chạy khấu hao, dashboard) bằng công cụ thiết kế và đính kèm vào báo cáo; đây là phần nhóm tự thực hiện.

# 11. Phân quyền và bảo mật

Hệ thống dùng RBAC kết hợp phạm vi dữ liệu: quyền cho biết được làm gì, phạm vi cho biết được làm trên dữ liệu nào (chi nhánh, phòng ban). Mọi kiểm tra được thực hiện ở máy chủ.

## 11.1 Ma trận phân quyền (rút gọn)

Ký hiệu: X = toàn quyền, R = chỉ xem, A = duyệt, O = chỉ dữ liệu của mình hoặc bộ phận mình, trống = không có.

| Chức năng | Quản trị | Quản lý TS | Kế toán | Trưởng BP | Giám đốc | Nhân viên | Kỹ thuật |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Người dùng, phân quyền, cấu hình | X |  |  |  |  |  |  |
| Hồ sơ tài sản | R | X | R | R (BP) | R | R (của mình) | R |
| Đề xuất mua sắm |  | X | R | X (BP), A | A | X (của mình) |  |
| Cấp phát, điều chuyển |  | X | R | A | A | Xác nhận nhận |  |
| Thanh lý |  | X | R |  | A |  |  |
| Quét QR, kiểm kê |  | X | R |  |  | R |  |
| Khấu hao, chốt kỳ |  | R | X |  | R |  |  |
| Bảo trì, sửa chữa |  | X | R |  |  | Báo hỏng | X |
| Báo cáo, dashboard | R | X | X | R (BP) | X |  |  |
| Nhật ký hoạt động | X |  | R |  | R |  |  |

## 11.2 Các biện pháp bảo mật

| Nhóm | Biện pháp |
| --- | --- |
| Xác thực | Băm mật khẩu bằng bcrypt hoặc Argon2; chính sách độ dài tối thiểu; khóa tạm sau nhiều lần sai; token có hạn dùng và cơ chế làm mới |
| Phân quyền | Kiểm tra quyền và phạm vi chi nhánh ở tầng dịch vụ cho mọi API; chống truy cập đối tượng trái phép (IDOR) bằng cách luôn lọc theo phạm vi của người dùng |
| Dữ liệu | Truy vấn có tham số (chống SQL injection); mã hóa đầu ra (chống XSS); CSRF token nếu dùng cookie; giới hạn kích thước và loại file tải lên |
| Truyền tải | HTTPS bắt buộc; không ghi mật khẩu, token vào log |
| Toàn vẹn | Xóa mềm (soft delete) cho dữ liệu nghiệp vụ; bản ghi duyệt và khấu hao đã chốt chỉ thêm, không sửa; audit log ghi người, hành động, thời điểm, giá trị trước và sau |
| Vận hành | Biến môi trường cho bí mật; sao lưu hàng ngày và thử khôi phục; cập nhật thư viện, quét lỗ hổng phụ thuộc |
| Mã QR | QR chỉ chứa định danh hoặc đường dẫn, không chứa dữ liệu nhạy cảm; xem chi tiết vẫn yêu cầu đăng nhập, khách quét chỉ thấy thông tin tối thiểu |

---

