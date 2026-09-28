import { useState } from "react";

function LeaveBalanceForm({
  employee,
  leaveBalance,
  onCancel,
  onSubmit,
}) {
  const [vacationCredit, setVacationCredit] = useState(
    leaveBalance?.vacationCredit ?? 0
  );

  const [sickCredit, setSickCredit] = useState(
    leaveBalance?.sickCredit ?? 0
  );

  const [soloParentCredit, setSoloParentCredit] = useState(
    leaveBalance?.soloParentCredit ?? 0
  );

  const [maternalPaternalCredit, setMaternalPaternalCredit] = useState(
    leaveBalance?.maternalPaternalCredit ?? 0
  );

  const [vacationUsed, setVacationUsed] = useState(
    leaveBalance?.vacationUsed ?? 0
  );

  const [sickUsed, setSickUsed] = useState(
    leaveBalance?.sickUsed ?? 0
  );

  const [soloParentUsed, setSoloParentUsed] = useState(
    leaveBalance?.soloParentUsed ?? 0
  );

  const [maternalPaternalUsed, setMaternalPaternalUsed] = useState(
    leaveBalance?.maternalPaternalUsed ?? 0
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      vacationCredit: Number(vacationCredit),
      vacationUsed: Number(vacationUsed),

      sickCredit: Number(sickCredit),
      sickUsed: Number(sickUsed),

      soloParentCredit: Number(soloParentCredit),
      soloParentUsed: Number(soloParentUsed),

      maternalPaternalCredit: Number(
        maternalPaternalCredit
      ),
      maternalPaternalUsed: Number(
        maternalPaternalUsed
      ),
    });
  };

  return (
    <div
      className="lms-modal-backdrop"
      onClick={onCancel}
    >
      <div
        className="lms-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="fj-display text-xl font-semibold mb-2">
          Edit Leave Balance
        </h2>

        <p
          className="text-sm mb-5"
          style={{ color: "var(--ink-soft)" }}
        >
          {employee?.employeeName} (
          {employee?.employeeNumber})
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="lms-field-label">
              Vacation Leave
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span
                  className="text-xs"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Credit
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className="lms-field-input"
                  value={vacationCredit}
                  onChange={(e) =>
                    setVacationCredit(e.target.value)
                  }
                  required
                />
              </div>

              <div>
                <span
                  className="text-xs"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Used
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className="lms-field-input"
                  value={vacationUsed}
                  onChange={(e) =>
                    setVacationUsed(e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--ink-soft)" }}
            >
              Remaining:{" "}
              {Number(vacationCredit) - Number(vacationUsed)} days
            </p>
          </div>

          <div>
            <label className="lms-field-label">
              Sick Leave
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span
                  className="text-xs"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Credit
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className="lms-field-input"
                  value={sickCredit}
                  onChange={(e) =>
                    setSickCredit(e.target.value)
                  }
                  required
                />
              </div>

              <div>
                <span
                  className="text-xs"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Used
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className="lms-field-input"
                  value={sickUsed}
                  onChange={(e) =>
                    setSickUsed(e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--ink-soft)" }}
            >
              Remaining:{" "}
              {Number(sickCredit) - Number(sickUsed)} days
            </p>
          </div>

          <div>
            <label className="lms-field-label">
              Solo Parent Leave
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span
                  className="text-xs"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Credit
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className="lms-field-input"
                  value={soloParentCredit}
                  onChange={(e) =>
                    setSoloParentCredit(e.target.value)
                  }
                  required
                />
              </div>

              <div>
                <span
                  className="text-xs"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Used
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className="lms-field-input"
                  value={soloParentUsed}
                  onChange={(e) =>
                    setSoloParentUsed(e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--ink-soft)" }}
            >
              Remaining:{" "}
              {Number(soloParentCredit) - Number(soloParentUsed)} days
            </p>
          </div>

          <div>
            <label className="lms-field-label">
              Maternal / Paternal Leave
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span
                  className="text-xs"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Credit
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className="lms-field-input"
                  value={maternalPaternalCredit}
                  onChange={(e) =>
                    setMaternalPaternalCredit(e.target.value)
                  }
                  required
                />
              </div>

              <div>
                <span
                  className="text-xs"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Used
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className="lms-field-input"
                  value={maternalPaternalUsed}
                  onChange={(e) =>
                    setMaternalPaternalUsed(e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--ink-soft)" }}
            >
              Remaining:{" "}
              {Number(maternalPaternalCredit) - Number(maternalPaternalUsed)} days
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="fj-btn-secondary text-sm py-2 px-4"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="fj-btn-primary text-sm py-2 px-4"
            >
              Save Leave Balance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LeaveBalanceForm;