const db = require("../config/db");

// Ghi lịch sử biến động tài sản vào bảng asset_events
async function recordEvent(assetId, eventType, note = "", userId = null) {
  if (!assetId) return;
  try {
    const validUserId = userId || 315;
    await db.query(
      `INSERT INTO asset_events (asset_id, event_type, performed_by, performed_at, note)
       VALUES (?, ?, ?, NOW(), ?)`,
      [assetId, eventType, validUserId, note || ""]
    );
  } catch (err) {
    console.error("Lỗi recordEvent:", err.message);
  }
}

module.exports = {
  recordEvent,
};
