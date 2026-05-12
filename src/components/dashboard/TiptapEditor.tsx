"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, Type, ListOrdered } from "lucide-react";
import { useEffect } from 'react';

export default function TiptapEditor({ onUpdate }: { onUpdate: (editor: any) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none min-h-[400px] max-w-none text-gray-600',
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate(editor);
    },
  });

  useEffect(() => {
    if (editor) {
      onUpdate(editor);
    }
  }, [editor, onUpdate]);

  if (!editor) return null;

  const btnClass = (active: boolean) => 
    `p-1.5 rounded transition-all ${active ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:bg-gray-100'}`;

  return (
    <div className="w-full">
      <div className="flex items-center gap-0.5 mb-4 sticky top-0 bg-white/80 backdrop-blur-sm z-10 py-1 font-sans">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}>
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}>
          <Italic className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-3 bg-gray-200 mx-1" />
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}>
          <Type className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}>
          <List className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}>
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
      </div>

      <EditorContent editor={editor} className="cursor-text text-sm leading-relaxed" />
    </div>
  );
}