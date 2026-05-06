import { getAllOrganizations } from "@/actions/admin";
import AdminDashboardClient from "./AdminDashboardClient";



export default async function AdminPage() {
    const organizations = await getAllOrganizations();
    return <AdminDashboardClient orgs={organizations} />
}