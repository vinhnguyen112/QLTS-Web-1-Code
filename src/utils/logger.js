const db = require("../config/db");

/**
 * Ghi nhận biến động vòng đời tài sản vào bảng asset_events
 */
async function logAssetEvent(connectionOrDb, {
  asset_id,
  event_type,
  from_org_unit_id = null,
  to_org_unit_id = null,
  from_assignee_id = null,
  to_assignee_id = null,
  request_id = null,
  performed_by,
  note = null,
}) {
  const conn = connectionOrDb || db;
  try {
    await conn.query(
      `
      INSERT INTO asset_events (
        asset_id, event_type, from_org_unit_id, to_org_unit_id,
        from_assignee_id, to_assignee_id, request_id, performed_by, performed_at, note
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `,
      [
        asset_id,
        event_type,
        from_org_unit_id,
        to_org_unit_id,
        from_assignee_id,
        to_assignee_id,
        request_id,
        performed_by,
        note,
      ]
    );
  } catch (err) {
    console.error("Lỗi logAssetEvent:", err.message);
  }
}

/**
 * Ghi nhận nhật ký kiểm toán hệ thống vào bảng audit_logs
 */
async function logAudit(connectionOrDb, {
  actor_id = null,
  action,
  entity,
  entity_id,
  before = null,
  after = null,
  ip_address = "127.0.0.1",
  user_agent = "",
}) {
  const conn = connectionOrDb || db;
  try {
    await conn.query(
      `
      INSERT INTO audit_logs (
        actor_id, action, entity, entity_id, \`before\`, \`after\`, ip_address, user_agent, performed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `,
      [
        actor_id,
        action,
        entity,
        String(entity_id),
        before ? JSON.stringify(before) : null,
        after ? JSON.stringify(after) : null,
        ip_address,
        user_agent,
      ]
    );
  } catch (err) {
    console.error("Lỗi logAudit:", err.message);
  }
}

module.exports = {
  logAssetEvent,
  logAudit,
};
