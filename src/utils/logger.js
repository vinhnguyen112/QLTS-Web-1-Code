const db = require("../config/db");

/**
 * Ghi 1 sự kiện biến động vào lịch sử tài sản (Đơn giản, chuẩn xác, gọi 1 dòng duy nhất)
 * @param {number|string} assetId - ID tài sản
 * @param {string} eventType - Loại sự kiện (ASSIGN, RECALL, INITIAL_IMPORT, MAINTENANCE_START, MAINTENANCE_END, DISPOSAL, TRANSFER)
 * @param {string} note - Ghi chú tóm tắt hành động
 * @param {number} userId - ID người thực hiện
 */
async function recordEvent(assetId, eventType, note = "", userId = 315) {
  if (!assetId) return;
  try {
    await db.query(
      `INSERT INTO asset_events (asset_id, event_type, performed_by, performed_at, note)
       VALUES (?, ?, ?, NOW(), ?)`,
      [assetId, eventType, userId || 315, note || ""]
    );
  } catch (err) {
    console.error("Lỗi recordEvent:", err.message);
  }
}

module.exports = {
  recordEvent,
};
