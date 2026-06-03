"use client";

interface SegmentOption {
    label: string;
    value: any;
}

interface SettingItemProps {
    label: string;
    description: string;
    value: any;
    type: "switch" | "number" | "text" | "segments";
    onUpdate: (newValue: any) => void;
    loading?: boolean;
    options?: SegmentOption[]; 
}

export default function SettingItem ({ label, description, value, type, onUpdate, loading, options= []}: SettingItemProps) {
    return (
        <div className="flex items-center justify-between p-2 md:p-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md">
            <div className="flex-1 pr-4">
                <h3 className="text-sm md:text-md text-gray-400">{label}</h3>
                <p className="text-xs md:text-sm text-gray-600 mt-2">{description}</p>
            </div>

            <div className="flex items-center gap-3">
                {type === "switch" && (
                    <input type="checkbox" checked={value} onChange={(e) => onUpdate(e.target.checked)} disabled={loading} className="w-6 h-6 not-odd:md:w-10 md:h-10 bg-purple-700 rounded-full" />
                )}

                {type === "number" && (
                    <input type="number" value={value} onChange={(e) => onUpdate(parseInt(e.target.value))} disabled={loading} className="w-20 p-1 md:p-2  bg-black/20 border border-white/10" />
                )}

                {type === "text" && (
                    <textarea value={value} onChange={(e) => onUpdate(e.target.value)} disabled={loading} className="w-64  p-1 md:p-2 bg-black/20 border border-white/10" />
                )}
                {type === "segments" && (
                    <div className="inline-flex rounded-lg bg-purple-700 p-1 border border-white/10">
                        {options.map((option) => {
                            const isSelected = value === option.value;
                            return(
                                <button key={option.value} type="button" disabled={loading} onClick={() => onUpdate(option.value)} className={`px-1 md:px-4 py-0.5 md:py-2 text-xs md:text-sm font-medium rounded-md transition-all duration-200 
                                    ${isSelected ? 'bg-purple-600 text-white text-sm md:text-md' : ' text-gray-400 hover:bg-white/10'}`}>{option.label}</button>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}