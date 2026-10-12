import styles from "./SeoContent.module.css";

const FAQ = [
    {
        q: "Vòng quay may mắn này có miễn phí không?",
        a: "Có. Bạn dùng hoàn toàn miễn phí, không cần đăng ký hay đăng nhập.",
    },
    {
        q: "Kết quả có thật sự ngẫu nhiên không?",
        a: "Kết quả được bốc ngẫu nhiên ngay trên trình duyệt của bạn. Mặc định mọi ô có cơ hội như nhau; khi bật chế độ Nâng cao, ô có trọng số lớn hơn sẽ to hơn và có xác suất cao hơn, đúng theo tỉ lệ hiển thị trên vòng quay.",
    },
    {
        q: "Danh sách của tôi được lưu ở đâu?",
        a: "Danh sách, mẫu đã lưu và lịch sử được lưu ngay trên thiết bị của bạn (trong trình duyệt), không gửi lên máy chủ. Vì vậy đổi máy hoặc xoá dữ liệu trình duyệt thì sẽ mất; muốn mang sang máy khác hãy dùng nút Chia sẻ.",
    },
    {
        q: "Làm sao để chia sẻ vòng quay cho bạn bè?",
        a: "Vào mục Mẫu bên dưới danh sách, bấm Chia sẻ để lấy link. Người nhận mở link là có ngay danh sách đó. Ảnh bạn tự tải lên không đi kèm trong link.",
    },
    {
        q: "Có dùng được khi mất mạng không?",
        a: "Sau khi đã mở trang một lần, ứng dụng có thể chạy lại khi không có mạng. Bạn cũng có thể cài lên màn hình chính điện thoại như một ứng dụng.",
    },
    {
        q: "Tôi có thêm ảnh cho từng lựa chọn được không?",
        a: "Được. Mỗi lựa chọn có thể kèm một ảnh (không bắt buộc), bạn tự cắt và căn ảnh. Trên vòng quay có thể hiển thị chữ, hình hoặc cả hai.",
    },
];

/**
 * Nội dung văn bản cho người đọc và công cụ tìm kiếm.
 * Là server component nên có sẵn trong HTML gửi về, không phụ thuộc JavaScript.
 */
export default function SeoContent() {
    return (
        <section className={styles.wrap} aria-labelledby="seo-title">
            <div className={styles.inner}>
                <h2 id="seo-title" className={styles.h2}>
                    Vòng quay may mắn online: quay ngẫu nhiên để chọn nhanh
                </h2>
                <p>
                    Đây là công cụ vòng quay may mắn online giúp bạn chọn ngẫu nhiên một trong nhiều
                    lựa chọn chỉ với một lần bấm. Hợp để quyết định hôm nay ăn gì, ai trả tiền, ai
                    làm việc trước, hay chọn đội để chơi PES cùng bạn bè, mà không phải cãi nhau.
                </p>

                <h2 className={styles.h2}>Cách dùng</h2>
                <ol className={styles.list}>
                    <li>Nhập các lựa chọn vào ô nhập rồi nhấn Enter (dán nhiều dòng sẽ thêm nhiều mục cùng lúc).</li>
                    <li>Hoặc chọn một mẫu có sẵn như Ăn gì?, Ai trả tiền?, Có / Không, PES: CLB, PES: ĐTQG.</li>
                    <li>Bấm nút QUAY ở giữa vòng (hoặc bấm vào vòng) và chờ kim dừng.</li>
                    <li>Muốn bốc thăm lần lượt thì bấm &quot;Loại bỏ mục này&quot; rồi quay tiếp.</li>
                </ol>

                <h2 className={styles.h2}>Tính năng</h2>
                <ul className={styles.list}>
                    <li>Tự tạo danh sách, sửa tên ngay tại chỗ, có nút hoàn tác khi lỡ xoá.</li>
                    <li>Thêm hình cho từng lựa chọn; hiển thị chữ, hình hoặc cả hai trên vòng quay.</li>
                    <li>Chế độ Nâng cao: chỉnh trọng số để đổi xác suất của từng ô.</li>
                    <li>Lưu tối đa 12 mẫu của riêng bạn và chia sẻ cho bạn bè bằng link.</li>
                    <li>Giao diện sáng / tối, có âm thanh (tắt được), chạy tốt trên điện thoại và máy tính.</li>
                    <li>Cài được như ứng dụng (PWA) và mở lại khi mất mạng.</li>
                </ul>

                <h2 className={styles.h2}>Câu hỏi thường gặp</h2>
                <div className={styles.faq}>
                    {FAQ.map(({ q, a }) => (
                        <details key={q} className={styles.item}>
                            <summary className={styles.summary}>{q}</summary>
                            <p className={styles.answer}>{a}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
