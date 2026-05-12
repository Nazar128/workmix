import { Calendar, MoreVertical, StickyNote } from "lucide-react";
import { EditProjectModal } from "./EditProjectModal";
import { deleteProject } from "@/actions/projects";

export default function PersonalProjectCard({ project }: { project: any }) {
    return (
        <div className="group relative bg-white/70 backdrop-blur-md border border-purple-800 rounded-2xl p-5">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                    <StickyNote className="w-5 h-5 text-purple-600" />
                </div>
                <button className="text-gray-400 hover:text-gray-700">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            <h3 className="font-bold text-gray-800 text-lg mb-1">{project.name}</h3>
            <p>{project.description || "açıklama bulunmuyor..."}</p>

            <div className="flex justify-between items-center pt-4 border-t border-purple-700">
                <div className="flex items-center gap-1.5 text-md">
                    <Calendar className="w-4 h-4" />
                    {project.start_date ? new Date(project.start_date).toLocaleDateString() : "Tarih yok"}
                </div>

                <button className="flex items-center gap-1 text-xs font-medium text-purple-400">
                    Notlar
                </button>

                <EditProjectModal project={project} />
                <form action={deleteProject.bind(null, project.id)}>
                    <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-medium">
                        Sil
                    </button>
                </form>

            </div>
        </div>
    )
}