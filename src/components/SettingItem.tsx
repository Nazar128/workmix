"use client";

interface SettingItemProps {
    label: string;
    description: string;
    value: any;
    type: "switch" | "number" | "text";
    onUpdate: (newValue: any) => void;
    loading?: boolean;
}

export default function SettingItem ({ label, description, value, type, onUpdate, loading}: SettingItemProps) {
    return (
        <div className="flex items-center justify-between p-4">
            <div className="flex-1 pr-4">
                <h3 className="text-md text-gray-400">{label}</h3>
                <p className="text-sm text-gray-600 mt-2">{description}</p>
            </div>

            <div className="flex items-center gap-3">
                {type === "switch" && (
                    <input type="checkbox" checked={value} onChange={(e) => onUpdate(e.target.checked)} disabled={loading} className="w-10 h-10 bg-purple-700 rounded-full" />
                )}

                {type === "number" && (
                    <input type="number" value={value} onChange={(e) => onUpdate(parseInt(e.target.value))} disabled={loading} className="w-20 p-2  bg-black/20 border border-white/10" />
                )}

                {type === "text" && (
                    <textarea value={value} onChange={(e) => onUpdate(e.target.value)} disabled={loading} className="w-64 p-2 bg-black/20 border border-white/10" />
                )}
            </div>
        </div>
    )
}