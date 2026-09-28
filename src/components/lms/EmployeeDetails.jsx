import { useEffect, useState } from "react";

function EmployeeDetails({
  employee,

  userAccount,
  userAccountLoading,
  isAdmin,
  onViewUserAccount,
  onUpdateRole,

  sensitiveEmployee,
  sensitiveLoading,

  leaveBalance,
  leaveBalanceLoading,

  onClose,
  onViewSensitive,
  onViewLeaveBalance,
  onEditSensitive,
  onEditLeaveBalance,
}) {

  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    if (userAccount) {
      setSelectedRole(userAccount.role);
    }
  }, [userAccount]);

  if (!employee) return null;

  return (
    <div
      className="lms-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="lms-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="fj-display text-xl font-semibold">
              {employee.employeeName}
            </h2>

            <p
              className="text-sm"
              style={{ color: "var(--ink-soft)" }}
            >
              Employee #{employee.employeeNumber}
            </p>
          </div>

          <button
            type="button"
            className="fj-btn-secondary text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {/* Personal Information */}
        <section className="mb-6">
          <h3 className="fj-display font-semibold mb-3">
            Personal Information
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="lms-field-label">Birthday</p>
              <p>{employee.birthday || "—"}</p>
            </div>

            <div>
              <p className="lms-field-label">Sex</p>
              <p>{employee.sex || "—"}</p>
            </div>

            <div className="col-span-2">
              <p className="lms-field-label">Address</p>
              <p>{employee.address || "—"}</p>
            </div>
          </div>
        </section>

        {/* Employment Information */}
        <section className="mb-6">
          <h3 className="fj-display font-semibold mb-3">
            Employment Information
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="lms-field-label">Hiring Date</p>
              <p>{employee.hiringDate || "—"}</p>
            </div>

            <div>
              <p className="lms-field-label">Employment Status</p>
              <p>{employee.employmentStatus || "—"}</p>
            </div>

            <div>
              <p className="lms-field-label">Store Assignment</p>
              <p>{employee.storeAssignment || "—"}</p>
            </div>

            <div>
              <p className="lms-field-label">Position</p>
              <p>{employee.position || "—"}</p>
            </div>

            <div className="col-span-2">
              <p className="lms-field-label">
                Manager Appointment Date
              </p>
              <p>{employee.managerAppointmentDate || "—"}</p>
            </div>
          </div>
        </section>

        {/* Leave Balance */}
        <section className="mb-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="fj-display font-semibold">
                Leave Balance
              </h3>

              <p
                className="text-xs"
                style={{ color: "var(--ink-soft)" }}
              >
                Employee leave credits and usage
              </p>
            </div>

            {leaveBalance && (
              <button
                type="button"
                className="fj-btn-secondary text-sm"
                onClick={onEditLeaveBalance}
              >
                Edit
              </button>
            )}
          </div>

          {!leaveBalance && !leaveBalanceLoading && (
            <button
              type="button"
              className="fj-btn-secondary text-sm"
              onClick={onViewLeaveBalance}
            >
              View Leave Balance
            </button>
          )}

          {leaveBalanceLoading && (
            <p
              className="text-sm"
              style={{ color: "var(--ink-soft)" }}
            >
              Loading leave balance...
            </p>
          )}

          {leaveBalance && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="lms-field-label">
                  Vacation
                </p>
                <p>
                  {leaveBalance.vacationRemaining} remaining
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--ink-soft)" }}
                >
                  {leaveBalance.vacationCredit} credit ·{" "}
                  {leaveBalance.vacationUsed} used
                </p>
              </div>

              <div>
                <p className="lms-field-label">
                  Sick
                </p>
                <p>
                  {leaveBalance.sickRemaining} remaining
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--ink-soft)" }}
                >
                  {leaveBalance.sickCredit} credit ·{" "}
                  {leaveBalance.sickUsed} used
                </p>
              </div>

              <div>
                <p className="lms-field-label">
                  Solo Parent
                </p>
                <p>
                  {leaveBalance.soloParentRemaining} remaining
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--ink-soft)" }}
                >
                  {leaveBalance.soloParentCredit} credit ·{" "}
                  {leaveBalance.soloParentUsed} used
                </p>
              </div>

              <div>
                <p className="lms-field-label">
                  Maternal / Paternal
                </p>
                <p>
                  {leaveBalance.maternalPaternalRemaining} remaining
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--ink-soft)" }}
                >
                  {leaveBalance.maternalPaternalCredit} credit ·{" "}
                  {leaveBalance.maternalPaternalUsed} used
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Sensitive Information */}
        <section className="mb-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="fj-display font-semibold">
                Government Identification
              </h3>

              <p
                className="text-xs"
                style={{ color: "var(--ink-soft)" }}
              >
                Restricted HR information
              </p>
            </div>

            {sensitiveEmployee && (
              <button
                type="button"
                className="fj-btn-secondary text-sm"
                onClick={onEditSensitive}
              >
                Edit
              </button>
            )}
          </div>

          {!sensitiveEmployee && !sensitiveLoading && (
            <button
              type="button"
              className="fj-btn-secondary text-sm"
              onClick={onViewSensitive}
            >
              View Sensitive Information
            </button>
          )}

          {sensitiveLoading && (
            <p
              className="text-sm"
              style={{ color: "var(--ink-soft)" }}
            >
              Loading sensitive information...
            </p>
          )}

          {sensitiveEmployee && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="lms-field-label">SSS Number</p>
                <p>{sensitiveEmployee.sssNumber || "—"}</p>
              </div>

              <div>
                <p className="lms-field-label">Pag-IBIG Number</p>
                <p>{sensitiveEmployee.pagibigNumber || "—"}</p>
              </div>

              <div>
                <p className="lms-field-label">PhilHealth Number</p>
                <p>{sensitiveEmployee.philhealthNumber || "—"}</p>
              </div>

              <div>
                <p className="lms-field-label">TIN</p>
                <p>{sensitiveEmployee.tinNumber || "—"}</p>
              </div>
            </div>
          )}
        </section>

        {/* Account & Permissions */}
        {isAdmin && (
          <section className="mb-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="fj-display font-semibold">
                  Account & Permissions
                </h3>

                <p
                  className="text-xs"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Administrative account access
                </p>
              </div>
            </div>

            {!userAccount && !userAccountLoading && (
              <button
                type="button"
                className="fj-btn-secondary text-sm"
                onClick={onViewUserAccount}
              >
                View Account
              </button>
            )}

            {userAccountLoading && (
              <p
                className="text-sm"
                style={{ color: "var(--ink-soft)" }}
              >
                Loading account...
              </p>
            )}

            {userAccount && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="lms-field-label">
                    System Role
                  </p>

                  <select
                    className="lms-field-input"
                    value={selectedRole}
                    onChange={(e) =>
                      setSelectedRole(e.target.value)
                    }
                  >
                    <option value="EMPLOYEE">
                      Employee
                    </option>

                    <option value="HR">
                      HR
                    </option>

                    <option value="ADMIN">
                      Admin
                    </option>
                  </select>
                </div>

                <div>
                  <p className="lms-field-label">
                    Account Status
                  </p>

                  <p>
                    {userAccount.enabled
                      ? "Enabled"
                      : "Disabled"}
                  </p>
                </div>

                <div className="col-span-2">
                  <button
                    type="button"
                    className="fj-btn-primary text-sm"
                    disabled={
                      selectedRole === userAccount.role
                    }
                    onClick={() =>
                      onUpdateRole(selectedRole)
                    }
                  >
                    Update Role
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default EmployeeDetails;
