import { getAnnouncements } from "@/actions/announcements";
import AnnouncementsClient from "./AnnouncementsClient";


export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();
  return <AnnouncementsClient announcements={announcements ?? []} />;
}