import React, { useState } from "react";
import { LEAVE_TYPES } from "../../data/lms/leaveTypes";

function computeDays(startDate, endDate) {
  if (!startDate || !endDate) {
    return 0;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  return (
    Math.round(
      (end - start) / millisecondsPerDay
    ) + 1
  );
}

function getRemainingBalance(balance, leaveType) {
  if (!balance) {
    return 0;
  }

  switch (leaveType) {
    case "VACATION":
      return Number(balance.vacationRemaining || 0);

    case "SICK":
      return Number(balance.sickRemaining || 0);

    case "SOLO_PARENT":
      return Number(balance.soloParentRemaining || 0);

    case "MATERNAL":
    case "PATERNAL":
      return Number(balance.maternalPaternalRemaining || 0);

    default:
      return 0;
  }
}

function getTodayString() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getValidationError(
  leaveType,
  startDate,
  endDate,
  days,
  remainingBalance
) {
  if (!startDate || !endDate) {
    return "";
  }

  const today = new Date(`${getTodayString()}T00:00:00`);
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (start < today) {
    return "Leave start date cannot be before today.";
  }

  if (end < start) {
    return "End date must be on or after the start date.";
  }

  const requiresAdvanceNotice =
    leaveType === "VACATION" ||
    leaveType === "MATERNAL" ||
    leaveType === "PATERNAL";

  if (requiresAdvanceNotice) {
    const minimumStartDate = new Date(today);

    minimumStartDate.setDate(
      minimumStartDate.getDate() + 5
    );

    if (start < minimumStartDate) {
      return `${leaveType} leave must be filed at least 5 days in advance.`;
    }
  }

  if (days > remainingBalance) {
    return `You only have ${remainingBalance} day${
      remainingBalance === 1 ? "" : "s"
    } remaining for ${leaveType}.`;
  }

  return "";
}

function LeaveRequestForm({ balance, onCancel, onSubmit }) {
  const [leaveType, setLeaveType] = useState(LEAVE_TYPES[0]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const days = computeDays(startDate, endDate);

  const remainingBalance = getRemainingBalance(balance, leaveType);

  const validationError = getValidationError(
    leaveType,
    startDate,
    endDate,
    days,
    remainingBalance
  );

  const isReady =
    startDate &&
    endDate &&
    !validationError &&
    !error;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!startDate || !endDate) {
      setError("Please select a start and end date.");
      return;
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await onSubmit({
        leaveType,
        startDate,
        endDate,
        reason,
      });
    } catch (error) {
      setError(
        error.message ||
        "Failed to submit leave request."
      );
    }
  };

  const today = getTodayString();

  return (
    <div className="lms-modal-backdrop" onClick={onCancel}>
      <div className="lms-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="fj-display text-xl font-semibold mb-4">Request Leave</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="lms-field-label" htmlFor="leaveType">Leave Type</label>
            <select
              id="leaveType"
              className="lms-field-input"
              value={leaveType}
              onChange={(e) => {
                setLeaveType(e.target.value);
                setError("");
              }}
            >
              {LEAVE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="lms-field-label" htmlFor="startDate">Start Date</label>
              <input
                id="startDate"
                type="date"
                className="lms-field-input"
                value={startDate}
                min={today}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setError("");
                }}
              />
            </div>
            <div>
              <label className="lms-field-label" htmlFor="endDate">End Date</label>
              <input
                id="endDate"
                type="date"
                className="lms-field-input"
                value={endDate}
                min={startDate || today}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setError("");
                }}
              />
            </div>
          </div>

          <div className="fj-card p-3 flex items-center justify-between text-sm">
            <span style={{ color: "var(--ink-soft)" }}>Duration</span>
            <span className="fj-display font-semibold">{days > 0 ? `${days} day${days === 1 ? "" : "s"}` : "—"}</span>
          </div>

          <div>
            <label className="lms-field-label" htmlFor="reason">Reason</label>
            <textarea
              id="reason"
              className="lms-field-input"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe the reason for this leave"
            />
          </div>

          <div className="fj-card p-3 flex items-center justify-between text-sm" style={{ background: "var(--paper)" }}>
            <span style={{ color: "var(--ink-soft)" }}>Remaining Balance</span>
            <span className="fj-display font-semibold">{remainingBalance} days</span>
          </div>

          {validationError && (
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--red-deep)" }}
            >
              {validationError}
            </p>
          )}

          {isReady && (
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--cyan-deep)" }}
            >
              ✓ Ready to submit
            </p>
          )}

          {error && error !== validationError && (
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--red-deep)" }}
            >
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="fj-btn-secondary text-sm py-2 px-4">
              Cancel
            </button>
            <button type="submit" className="fj-btn-primary text-sm py-2 px-4">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LeaveRequestForm;
