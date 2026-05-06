import { getAllUsers } from "@/actions/admin";
import AdminUsersClient from "./AdminUsersClient";

export default async function UsersPage() {
    const users = await getAllUsers();
    return <AdminUsersClient users={users as any} />
}