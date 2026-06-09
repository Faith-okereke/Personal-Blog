import React, { useRef, useEffect, useState } from "react";
import { 
  Bold, Italic, Heading1, Heading2, List, Link2, Quote, Code2, 
  RefreshCw, Eraser, FileCode, Eye, Edit3
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"visual" | "html">("visual");
  const [htmlInput, setHtmlInput] = useState(value);

  // Sync editor content with initial/reset values safely without breaking cursor position
  useEffect(() => {
    if (contentRef.current) {
      if (contentRef.current.innerHTML !== value) {
        contentRef.current.innerHTML = value || "<p><br></p>";
      }
    }
    setHtmlInput(value);
  }, [value]);

  const handleVisualInput = () => {
    if (contentRef.current) {
      const html = contentRef.current.innerHTML;
      setHtmlInput(html);
      onChange(html);
    }
  };

  const handleHtmlInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setHtmlInput(val);
    onChange(val);
    
    // Sync the editable div in background
    if (contentRef.current) {
      contentRef.current.innerHTML = val;
    }
  };

  const executeCommand = (command: string, argument: string = "") => {
    document.execCommand(command, false, argument);
    handleVisualInput();
    if (contentRef.current) {
      contentRef.current.focus();
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const clearFormatting = () => {
    executeCommand("removeFormat");
  };

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden focus-within:border-zinc-700 transition-colors">
      
      {/* Tab Select & Toolbar Header */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 bg-zinc-900/40 border-b border-zinc-800 gap-2">
        
        {/* Visual / HTML Switcher */}
        <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("visual")}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-colors font-mono cursor-pointer ${
              activeTab === "visual"
                ? "bg-zinc-800 text-white font-medium"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-500" />
            <span>Visual</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              setActiveTab("html");
              // Ensure htmlInput syncs
              if (contentRef.current) {
                setHtmlInput(contentRef.current.innerHTML);
              }
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-colors font-mono cursor-pointer ${
              activeTab === "html"
                ? "bg-zinc-800 text-white font-medium"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-blue-500" />
            <span>HTML Code</span>
          </button>
        </div>

        {/* Formatting Buttons toolbar - only visible in visual mode */}
        {activeTab === "visual" && (
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => executeCommand("bold")}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("italic")}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <span className="w-px h-4 bg-zinc-800 mx-1"></span>
            
            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "<h2>")}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors text-xs font-mono font-semibold"
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "<h3>")}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors text-xs font-mono font-semibold"
              title="Heading 3"
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "<p>")}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors text-xs font-mono"
              title="Normal Paragraph"
            >
              P
            </button>
            <span className="w-px h-4 bg-zinc-800 mx-1"></span>

            <button
              type="button"
              onClick={() => executeCommand("insertUnorderedList")}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "<blockquote>")}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
              title="Blockquote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={insertLink}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
              title="Insert Link"
            >
              <Link2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={clearFormatting}
              className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
              title="Clear Formatting"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Editing Area */}
      <div className="relative min-h-[320px] bg-zinc-950 flex flex-col">
        {activeTab === "visual" ? (
          <div
            ref={contentRef}
            contentEditable
            onInput={handleVisualInput}
            className="flex-1 w-full p-4 text-zinc-300 font-sans leading-relaxed focus:outline-none overflow-y-auto max-w-none prose prose-invert prose-blue prose-sm"
            style={{ minHeight: "320px" }}
          />
        ) : (
          <textarea
            value={htmlInput}
            onChange={handleHtmlInputChange}
            placeholder="<h2>Post Heading</h2><p>Write your HTML content...</p>"
            className="flex-1 w-full p-4 font-mono text-xs text-zinc-300 leading-relaxed bg-zinc-950 border-0 outline-none focus:ring-0 focus:outline-none resize-y min-h-[320px]"
          />
        )}
      </div>

      {/* Live Preview Toggle footer */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/30 border-t border-zinc-950 text-[10px] text-zinc-500 font-mono">
        <span>
          {activeTab === "visual" ? "Visual WYSIWYG Editor Active" : "Direct HTML Mode Active"}
        </span>
        <span className="flex items-center space-x-1 text-[10px] text-zinc-600">
          <Code2 className="w-3 h-3" />
          <span>HTML formatted body</span>
        </span>
      </div>
    </div>
  );
}
