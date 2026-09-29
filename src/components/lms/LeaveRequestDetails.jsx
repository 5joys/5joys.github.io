import React, { useState } from "react";
import LeaveStatusBadge from "./LeaveStatusBadge";

function Row({ label, value }) {
  return (
    <div className="py-2.5 border-b" style={{ borderColor: "var(--line)" }}>
      <div className="text-xs font-extrabold uppercase tracking-wider" style={{ color: "var(--cyan-deep)" }}>
        {label}
      </div>
      <div className="text-sm mt-0.5">{value}</div>
    </div>
  );
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/**
 * HR-only review panel. onApprove()/onReject(reason) are only wired up
 * when the request is still PENDING — already-decided requests render
 * as a read-only summary.
 */
function LeaveRequestDetails({ request, remainingBalance, onClose, onApprove, onReject }) {
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const isPending = request.status === "PENDING";

  const dateRange =
    request.startDate === request.endDate
      ? formatDate(request.startDate)
      : `${formatDate(request.startDate)} – ${formatDate(request.endDate)}`;

  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    onReject(request.id, rejectionReason.trim());
  };

  return (
    <div className="lms-modal-backdrop" onClick={onClose}>
      <div className="lms-modal" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <h2 className="fj-display text-xl font-semibold">Leave Request</h2>
          <LeaveStatusBadge status={request.status} />
        </div>

        <Row label="Employee" value={request.employeeName} />
        <Row label="Store Assignment" value={request.storeAssignment } />
        <Row label="Leave Type" value={request.leaveType} />
        <Row label="Date" value={dateRange} />
        <Row label="Duration" value={`${request.days} ${request.days === 1 ? "day" : "days"}`} />
        <Row label="Reason" value={request.reason || "—"} />
        {remainingBalance != null && (
          <Row label="Remaining Leave Balance" value={`${remainingBalance} days`} />
        )}
        <Row label="Submitted" value={formatDate(request.submittedOn)} />

        {request.status === "REJECTED" && request.rejectionReason && (
          <Row label="Rejection Reason" value={request.rejectionReason} />
        )}

        {isPending && (
          <div className="mt-5">
            <p className="text-xs font-extrabold uppercase tracking-wider mb-2" style={{ color: "var(--ink-soft)" }}>
              HR Decision
            </p>

            {rejecting && (
              <div className="mb-3">
                <label className="lms-field-label" htmlFor="rejectionReason">Rejection Reason</label>
                <textarea
                  id="rejectionReason"
                  className="lms-field-input"
                  rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Let the employee know why this was rejected"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {!rejecting ? (
                <>
                  <button
                    onClick={() => setRejecting(true)}
                    className="fj-btn-secondary text-sm py-2 px-4"
                    style={{ borderColor: "var(--red-deep)", color: "var(--red-deep)" }}
                  >
                    Reject
                  </button>
                  <button onClick={() => onApprove(request.id)} className="fj-btn-primary text-sm py-2 px-4">
                    Approve
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setRejecting(false)} className="fj-btn-secondary text-sm py-2 px-4">
                    Back
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={!rejectionReason.trim()}
                    className="fj-btn-primary text-sm py-2 px-4"
                    style={{ background: "var(--red-deep)", borderColor: "var(--red-deep)", opacity: rejectionReason.trim() ? 1 : 0.5 }}
                  >
                    Confirm Rejection
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-5 pt-4 border-t" style={{ borderColor: "var(--line)" }}>
          <button onClick={onClose} className="text-sm fj-link">Close</button>
        </div>
      </div>
    </div>
  );
}

export default LeaveRequestDetails;
