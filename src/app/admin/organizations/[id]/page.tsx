import { getOrgDetail } from "@/actions/admin";
import { notFound } from "next/navigation";
import OrgDetailClient from "./OrgDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrgDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) notFound();

  try {
    const data = await getOrgDetail(id);

    if (!data || !data.org) {
      notFound();
    }

    const formattedData = {
      ...data,
      members: data.members?.map((member: any) => ({
        ...member,
        users: Array.isArray(member.users) ? member.users[0] : member.users,
      })) ?? [],
    };

    return <OrgDetailClient data={formattedData} />;
  } catch (error) {
    console.error("OrgDetail Error:", error);
    notFound();
  }
}