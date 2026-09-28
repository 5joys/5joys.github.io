import { useEffect, useState } from "react";
import { useLms } from "../../context/LmsContext";

import {
  getUser,
  updateUserRole,
} from "../../services/lms/userService";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getSensitiveEmployee,
  updateSensitiveEmployee,
  exportEmployees,
} from "../../services/lms/employeeService";

import {
  getLeaveBalance,
  updateLeaveBalance,
} from "../../services/lms/leaveBalanceService";

import LeaveBalanceForm from "../../components/lms/LeaveBalanceForm";
import EmployeeForm from "../../components/lms/EmployeeForm";
import EmployeeDetails from "../../components/lms/EmployeeDetails";
import GovernmentIdForm from "../../components/lms/GovernmentIdForm";

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [storeFilter, setStoreFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [viewEmployee, setViewEmployee] = useState(null);

  const [sensitiveEmployee, setSensitiveEmployee] = useState(null);
  const [sensitiveLoading, setSensitiveLoading] = useState(false);

  const [showGovernmentIdForm, setShowGovernmentIdForm] = useState(false);

  const [leaveBalance, setLeaveBalance] = useState(null);
  const [leaveBalanceLoading, setLeaveBalanceLoading] = useState(false);

  const [showLeaveBalanceForm, setShowLeaveBalanceForm] = useState(false);
  const [formError, setFormError] = useState("");
  const { currentUser } = useLms();

  const isAdmin = currentUser?.role === "ADMIN";
  const [userAccount, setUserAccount] = useState(null);
  const [userAccountLoading, setUserAccountLoading] = useState(false);

  const stores = [
    ...new Set(
      employees
        .map((employee) => employee.storeAssignment)
        .filter(Boolean)
    ),
  ].sort();

  useEffect(() => {
    async function loadEmployees() {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        setError("Failed to load employees.");
      } finally {
        setLoading(false);
      }
    }

    loadEmployees();
  }, []);

  const handleExportExcel = async () => {
    try {
      const file = await exportEmployees();

      const url =
        window.URL.createObjectURL(file);

      const link =
        document.createElement("a");

      link.href = url;
      link.download = "Employees.xlsx";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);

      setError(
        "Failed to export employees."
      );
    }
  };

  const handleViewLeaveBalance = async () => {
    if (!viewEmployee) return;

    setLeaveBalanceLoading(true);
    setError("");

    try {
      const data = await getLeaveBalance(
        viewEmployee.employeeNumber
      );

      setLeaveBalance(data);
    } catch (error) {
      setError("Failed to load leave balance.");
    } finally {
      setLeaveBalanceLoading(false);
    }
  };

  const handleSaveLeaveBalance = async (data) => {
    if (!viewEmployee) return;

    try {
      const updatedBalance =
        await updateLeaveBalance(
          viewEmployee.employeeNumber,
          data
        );

      setLeaveBalance(updatedBalance);
      setShowLeaveBalanceForm(false);
    } catch (error) {
      setError("Failed to update leave balance.");
    }
  };

  const handleSaveEmployee = async (employee) => {
    try {
      setFormError("");

      if (selectedEmployee) {
        const updatedEmployee = await updateEmployee(
          selectedEmployee.employeeNumber,
          employee
        );

        setEmployees((prev) =>
          prev.map((emp) =>
            emp.employeeNumber === selectedEmployee.employeeNumber
              ? updatedEmployee
              : emp
          )
        );
      } else {
        const createdEmployee = await createEmployee(employee);

        setEmployees((prev) => [
          ...prev,
          createdEmployee,
        ]);
      }

      setShowForm(false);
      setSelectedEmployee(null);
    } catch (error) {
      setFormError(error.message);
    }
  };

  const handleDeleteEmployee = async (employee) => {
    const confirmed = window.confirm(
      `Delete ${employee.employeeName}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteEmployee(employee.employeeNumber);

      setEmployees((prev) =>
        prev.filter(
          (emp) => emp.employeeNumber !== employee.employeeNumber
        )
      );
    } catch (error) {
      setError("Failed to delete employee.");
    }
  };

  const handleViewSensitive = async () => {
    if (!viewEmployee) return;

    setSensitiveLoading(true);
    setError("");

    try {
      const data = await getSensitiveEmployee(
        viewEmployee.employeeNumber
      );

      setSensitiveEmployee(data);
    } catch (error) {
      setError("Failed to load sensitive employee information.");
    } finally {
      setSensitiveLoading(false);
    }
  };

  const handleSaveSensitive = async (sensitiveData) => {
    if (!viewEmployee) return;

    try {
      const updatedSensitiveEmployee =
        await updateSensitiveEmployee(
          viewEmployee.employeeNumber,
          sensitiveData
        );

      setSensitiveEmployee(updatedSensitiveEmployee);
      setShowGovernmentIdForm(false);
    } catch (error) {
      setError(
        "Failed to update government identification."
      );
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      employee.employeeNumber
        .toLowerCase()
        .includes(search) ||
      employee.employeeName
        .toLowerCase()
        .includes(search);

    const matchesStore =
      storeFilter === "ALL" ||
      employee.storeAssignment === storeFilter;

    return matchesSearch && matchesStore;
  });

  const employeesPerPage = 10;

  const totalPages = Math.ceil(
    filteredEmployees.length / employeesPerPage
  );

  const startIndex =
    (currentPage - 1) * employeesPerPage;

  const paginatedEmployees =
    filteredEmployees.slice(
      startIndex,
      startIndex + employeesPerPage
    );

  const handleViewUserAccount = async () => {
    if (!viewEmployee || !isAdmin) return;

    setUserAccountLoading(true);
    setError("");

    try {
      const data = await getUser(
        viewEmployee.employeeNumber
      );

      setUserAccount(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setUserAccountLoading(false);
    }
  };

  const handleUpdateRole = async (role) => {
    if (!viewEmployee || !isAdmin) return;

    const confirmed = window.confirm(
      `Change ${viewEmployee.employeeName}'s system role from ${userAccount.role} to ${role}?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await updateUserRole(
        viewEmployee.employeeNumber,
        role
      );

      setUserAccount((prev) => ({
        ...prev,
        role,
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="fj-display text-2xl font-semibold">
          Employees
        </h1>

        <div className="flex gap-2">
          <button
            className="fj-btn-secondary"
            onClick={handleExportExcel}
            disabled={employees.length === 0}
          >
            Export to Excel
          </button>

          <button
            className="fj-btn-primary"
            onClick={() => {
              setSelectedEmployee(null);
              setFormError("");
              setShowForm(true);
            }}
          >
            + Add Employee
          </button>
        </div>
      </div>

      <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>
        Directory of employees and their information.
      </p>

      <div className="lms-table-wrap fj-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <input
            type="text"
            className="lms-field-input"
            placeholder="Search by employee number or name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

          <select
            className="lms-field-input"
            value={storeFilter}
            onChange={(e) => {
              setStoreFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Stores</option>

            {stores.map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            Loading employees...
          </p>
        )}

        {error && (
          <p className="text-sm" style={{ color: "var(--red)" }}>
            {error}
          </p>
        )}
        <table className="lms-table">
          <thead>
            <tr>
              <th>Employee Number</th>
              <th>Employee</th>
              <th>Store Assignment</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.map((emp) => {
              return (
                <tr key={emp.employeeNumber}>
                  <td style={{ fontWeight: 700 }}>{emp.employeeNumber}</td>
                  <td>{emp.employeeName}</td>
                  <td>{emp.storeAssignment}</td>
                  <td>{emp.position}</td>
                  <td>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <button
                        className="fj-btn-secondary text-sm"
                        onClick={() => {
                          setViewEmployee(emp);
                          setLeaveBalance(null);
                          setSensitiveEmployee(null);
                          setUserAccount(null);
                          setError("");
                        }}
                      >
                        View
                      </button>

                      <button
                        className="fj-btn-secondary text-sm"
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setFormError("");
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="fj-btn-secondary text-sm"
                        onClick={() => {
                          handleDeleteEmployee(emp);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span
          className="text-sm"
          style={{ color: "var(--ink-soft)" }}
        >
          Page {currentPage} of {totalPages || 1}
        </span>

        <div className="flex gap-2">
          <button
            className="fj-btn-secondary text-sm"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((prev) => prev - 1)
            }
          >
            Previous
          </button>

          <button
            className="fj-btn-secondary text-sm"
            disabled={
              currentPage === totalPages ||
              totalPages === 0
            }
            onClick={() =>
              setCurrentPage((prev) => prev + 1)
            }
          >
            Next
          </button>
        </div>
      </div>

      {showForm && (
        <EmployeeForm
          employee={selectedEmployee}
          storeAssignments={stores}
          error={formError}
          onCancel={() => {
            setShowForm(false);
            setSelectedEmployee(null);
            setFormError("");
          }}
          onSubmit={handleSaveEmployee}
        />
      )}

      {viewEmployee && (
        <EmployeeDetails
          employee={viewEmployee}

          userAccount={userAccount}
          userAccountLoading={userAccountLoading}
          isAdmin={isAdmin}

          onViewUserAccount={handleViewUserAccount}
          onUpdateRole={handleUpdateRole}

          sensitiveEmployee={sensitiveEmployee}
          sensitiveLoading={sensitiveLoading}

          leaveBalance={leaveBalance}
          leaveBalanceLoading={leaveBalanceLoading}

          onClose={() => {
            setViewEmployee(null);
            setSensitiveEmployee(null);
            setLeaveBalance(null);
            setUserAccount(null);
          }}

          onViewSensitive={handleViewSensitive}

          onViewLeaveBalance={handleViewLeaveBalance}

          onEditSensitive={() =>
            setShowGovernmentIdForm(true)
          }

          onEditLeaveBalance={() =>
            setShowLeaveBalanceForm(true)
          }
        />
      )}

      {showGovernmentIdForm && (
        <GovernmentIdForm
          employee={viewEmployee}
          sensitiveEmployee={sensitiveEmployee}
          onCancel={() => setShowGovernmentIdForm(false)}
          onSubmit={handleSaveSensitive}
        />
      )}

      {showLeaveBalanceForm && (
        <LeaveBalanceForm
          employee={viewEmployee}
          leaveBalance={leaveBalance}
          onCancel={() =>
            setShowLeaveBalanceForm(false)
          }
          onSubmit={handleSaveLeaveBalance}
        />
      )}

    </div>
  );
}

export default EmployeesPage;
