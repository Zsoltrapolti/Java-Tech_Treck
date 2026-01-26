// // File: frontend/src/pages/admin/UsersPage.tsx
// import { useEffect, useState } from "react";
// import { fetchUsers, deleteUser } from "../../api/backend";
// import {
//     PageContainer,
//     PageHeader,
//     TableContainer,
//     StyledTable,
//     DeleteButton,
// } from "../../ui/Common.styles";
//
// export type UserType = {
//     id: number;
//     username: string;
//     email?: string;
//     role: "USER" | "EMPLOYEE" | "ADMIN";
//     createdAt?: string;
// };
//
// export default function UsersPage() {
//     const [users, setUsers] = useState<UserType[]>([]);
//
//     useEffect(() => {
//         loadUsers();
//     }, []);
//
//     async function loadUsers() {
//         try {
//             const data = await fetchUsers();
//             setUsers(data);
//         } catch (error) {
//             console.error("Failed to load users:", error);
//         }
//     }
//
//     async function handleDelete(userId: number) {
//         if (!confirm("Are you sure you want to delete this user?")) {
//             return;
//         }
//
//         try {
//             await deleteUser(userId);
//             await loadUsers();
//         } catch (error) {
//             console.error("Failed to delete user:", error);
//         }
//     }
//
//     return (
//         <PageContainer>
//             <PageHeader>
//                 <h1>User Accounts</h1>
//             </PageHeader>
//
//             <TableContainer>
//                 <StyledTable>
//                     <thead>
//                     <tr>
//                         <th>ID</th>
//                         <th>Username</th>
//                         <th>Email</th>
//                         <th>Role</th>
//                         <th>Created At</th>
//                         <th>Actions</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {users.map((user) => (
//                         <tr key={user.id}>
//                             <td>{user.id}</td>
//                             <td>{user.username}</td>
//                             <td>{user.email || "-"}</td>
//                             <td>
//                                     <span style={{
//                                         padding: "4px 8px",
//                                         borderRadius: "4px",
//                                         backgroundColor:
//                                             user.role === "ADMIN" ? "#d4edda" :
//                                                 user.role === "EMPLOYEE" ? "#d1ecf1" : "#fff3cd",
//                                         color:
//                                             user.role === "ADMIN" ? "#155724" :
//                                                 user.role === "EMPLOYEE" ? "#0c5460" : "#856404"
//                                     }}>
//                                         {user.role}
//                                     </span>
//                             </td>
//                             <td>
//                                 {user.createdAt
//                                     ? new Date(user.createdAt).toLocaleDateString()
//                                     : "-"}
//                             </td>
//                             <td>
//                                 <DeleteButton onClick={() => handleDelete(user.id)}>
//                                     Delete
//                                 </DeleteButton>
//                             </td>
//                         </tr>
//                     ))}
//                     </tbody>
//                 </StyledTable>
//             </TableContainer>
//         </PageContainer>
//     );
// }