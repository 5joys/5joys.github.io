import { useState } from "react";

function EmployeeForm({
  employee,
  storeAssignments = [],
  error,
  onCancel,
  onSubmit,
}) {
  const [employeeNumber, setEmployeeNumber] = useState(employee?.employeeNumber || "");
  const [employeeName, setEmployeeName] = useState(employee?.employeeName || "");
  const [hiringDate, setHiringDate] = useState(employee?.hiringDate || "");
  const [address, setAddress] = useState(employee?.address || "");
  const [storeAssignment, setStoreAssignment] = useState(employee?.storeAssignment || "");
  const [birthday, setBirthday] = useState(employee?.birthday || "");
  const [position, setPosition] = useState(employee?.position || "");
  const [managerAppointmentDate, setManagerAppointmentDate] = useState(employee?.managerAppointmentDate || "");
  const [employmentStatus, setEmploymentStatus] = useState(employee?.employmentStatus || "ACTIVE");
  const [sex, setSex] = useState(employee?.sex || "");
  const [isNewStore, setIsNewStore] = useState(false);
  const availableStores = [
    ...new Set([
      ...storeAssignments,
      employee?.storeAssignment,
    ].filter(Boolean)),
  ].sort();

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      employeeNumber,
      employeeName,
      hiringDate,
      address,
      storeAssignment,
      birthday,
      position,
      managerAppointmentDate,
      employmentStatus,
      sex,
    });
  };

  return (
    <div className="lms-modal-backdrop" onClick={onCancel}>
      <div
        className="lms-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="fj-display text-xl font-semibold mb-4">
          {employee ? "Edit Employee" : "Add Employee"}
        </h2>

        {error && (
          <p
            className="text-sm mb-4"
            style={{ color: "var(--red)" }}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="lms-field-label">
              Employee Number
            </label>

            <input
              className="lms-field-input"
              value={employeeNumber}
              onChange={(e) => setEmployeeNumber(e.target.value)}
              disabled={!!employee}
              placeholder="e.g. 1001-0007"
              required
            />
          </div>

          <div>
            <label className="lms-field-label">
              Employee Name
            </label>

            <input
              className="lms-field-input"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="Last Name, First Name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="lms-field-label">
                Hiring Date
              </label>

              <input
                type="date"
                className="lms-field-input"
                value={hiringDate}
                onChange={(e) => setHiringDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="lms-field-label">
                Birthday
              </label>

              <input
                type="date"
                className="lms-field-input"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="lms-field-label">
              Address
            </label>

            <input
              className="lms-field-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="lms-field-label">
              Store Assignment
            </label>

            <select
              className="lms-field-input"
              value={isNewStore ? "__new__" : storeAssignment}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "__new__") {
                  setIsNewStore(true);
                  setStoreAssignment("");
                } else {
                  setIsNewStore(false);
                  setStoreAssignment(value);
                }
              }}
              required
            >
              <option value="">Select store</option>

              {availableStores.map((store) => (
                <option key={store} value={store}>
                  {store}
                </option>
              ))}

              <option value="__new__">
                + Add New Store
              </option>
            </select>

            {isNewStore && (
              <div className="mt-3">
                <label className="lms-field-label">
                  New Store Name
                </label>

                <input
                  type="text"
                  className="lms-field-input"
                  value={storeAssignment}
                  onChange={(e) =>
                    setStoreAssignment(e.target.value)
                  }
                  placeholder="Enter store name"
                  required
                />
              </div>
            )}
          </div>

          <div>
            <label className="lms-field-label">
              Position
            </label>

            <input
              className="lms-field-input"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>

          <div>
            <label className="lms-field-label">
              Manager Appointment Date
            </label>

            <input
              type="date"
              className="lms-field-input"
              value={managerAppointmentDate}
              onChange={(e) =>
                setManagerAppointmentDate(e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="lms-field-label">
                Employment Status
              </label>

              <select
                className="lms-field-input"
                value={employmentStatus}
                onChange={(e) =>
                  setEmploymentStatus(e.target.value)
                }
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div>
              <label className="lms-field-label">
                Sex
              </label>

              <select
                className="lms-field-input"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
              >
                <option value="">Select</option>
                <option value="M">M</option>
                <option value="F">F</option>
              </select>
            </div>
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
              {employee ? "Save Changes" : "Add Employee"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EmployeeForm;