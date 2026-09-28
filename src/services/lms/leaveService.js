import {
    get,
    put,
    post,
    postFile,
} from "./apiClient";

export function archiveLeaveRequests() {
  return postFile(
    "/leave-requests/archive",
    {}
  );
}

export function getAllLeaveRequests() {
    return get("/leave-requests/all");
}

export function filterLeaveRequests(
    requests,
    employees,
    {
        status,
        leaveType,
        storeAssignment,
    }
) {
    return requests.filter((request) => {

        const matchesStatus =
            status === "ALL" ||
            request.status === status;

        const matchesLeaveType =
            leaveType === "ALL" ||
            request.leaveType === leaveType;

        const employee =
            employees.find(
                (employee) =>
                    employee.employeeNumber ===
                    request.employeeNumber
            );

        const matchesStore =
            storeAssignment === "ALL" ||
            employee?.storeAssignment ===
                storeAssignment;

        return (
            matchesStatus &&
            matchesLeaveType &&
            matchesStore
        );
    });
}

export function getHRSummary(requests) {
    const currentMonth =
        new Date().getMonth();

    const currentYear =
        new Date().getFullYear();

    const approvedThisMonth =
        requests.filter((request) => {

            if (request.status !== "APPROVED") {
                return false;
            }

            if (!request.decidedOn) {
                return false;
            }

            const date =
                new Date(request.decidedOn);

            return (
                date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear
            );
        }).length;

    const rejectedThisMonth =
        requests.filter((request) => {

            if (request.status !== "REJECTED") {
                return false;
            }

            if (!request.decidedOn) {
                return false;
            }

            const date =
                new Date(request.decidedOn);

            return (
                date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear
            );
        }).length;

    const pending =
        requests.filter(
            (request) =>
                request.status === "PENDING"
        ).length;

    return {
        pending,
        approvedThisMonth,
        rejectedThisMonth,
        total: requests.length,
    };
}

export async function getLeaveBalance(
    employeeNumber
) {
    return get(
        `/leave-balances/${encodeURIComponent(
            employeeNumber
        )}`
    );
}

export function updateLeaveBalance(
  employeeNumber,
  request
) {
  return put(
    `/leave-balances/${encodeURIComponent(
      employeeNumber
    )}`,
    request
  );
}

export function approveLeaveRequest(id) {
    return put(
        `/leave-requests/${id}/approve`,
        {}
    );
}

export function rejectLeaveRequest(id, rejectionReason) {
    return put(
        `/leave-requests/${id}/reject`,
        {
            rejectionReason,
        }
    );
}

export function getRequestsForEmployee(employeeNumber) {
    return get(
        `/leave-requests?employeeNumber=${encodeURIComponent(
            employeeNumber
        )}`
    );
}

export function createLeaveRequest(
    employeeNumber,
    request
) {
    return post(
        `/leave-requests?employeeNumber=${encodeURIComponent(
            employeeNumber
        )}`,
        request
    );
}