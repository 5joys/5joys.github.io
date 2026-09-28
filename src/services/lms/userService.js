import {
  get,
  put,
} from "./apiClient";

export function getUser(employeeNumber) {
  return get(
    `/users/${encodeURIComponent(employeeNumber)}`
  );
}

export function updateUserRole(
  employeeNumber,
  role
) {
  return put(
    `/users/${encodeURIComponent(employeeNumber)}/role`,
    { role }
  );
}