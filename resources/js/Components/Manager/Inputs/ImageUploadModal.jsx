import React, { useEffect, useState, useRef, useCallback } from "react";

const csrf = () => {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : "";
};

const API = {
    list: (path) =>
        fetch(route("Manager.Finder.list", { path })).then((r) => r.json()),
    upload: (path, files) => {
        const form = new FormData();
        files.forEach((f) => form.append("files[]", f));
        form.append("path", path);
        return fetch(route("Manager.Finder.upload"), {
            method: "POST",
            headers: { "X-XSRF-TOKEN": csrf() },
            body: form,
        });
    },
    delete: (path) =>
        fetch(route("Manager.Finder.delete"), {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": csrf(),
            },
            body: JSON.stringify({ path }),
        }),
    rename: (old, name) =>
        fetch(route("Manager.Finder.rename"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": csrf(),
            },
            body: JSON.stringify({ old, new: name }),
        }),
    createFolder: (path, name) =>
        fetch(route("Manager.Finder.createFolder"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": csrf(),
            },
            body: JSON.stringify({ path, name }),
        }),
    move: (from, to) =>
        fetch(route("Manager.Finder.move"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": csrf(),
            },
            body: JSON.stringify({ from, to }),
        }),
};

const IMAGE_EXT = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"];
const isImage = (name) =>
    IMAGE_EXT.includes(name.split(".").pop().toLowerCase());

const joinPath = (...parts) =>
    parts.filter(Boolean).join("/").replace(/\/+/g, "/");

function FileIcon({ file, thumbUrl }) {
    const ext = file.name.split(".").pop().toLowerCase();
    if (file.isDir) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M2 6a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                    fill="#f59e0b"
                />
                <path d="M2 9h20" stroke="#d97706" strokeWidth="1" />
            </svg>
        );
    }
    if (thumbUrl) {
        return (
            <img
                src={thumbUrl}
                alt={file.name}
                className="w-8 h-8 object-cover rounded"
                onError={(e) => (e.target.style.display = "none")}
            />
        );
    }
    const colors = {
        pdf: "#ef4444",
        doc: "#3b82f6",
        docx: "#3b82f6",
        xls: "#22c55e",
        xlsx: "#22c55e",
        zip: "#8b5cf6",
        rar: "#8b5cf6",
        mp4: "#f97316",
        mp3: "#ec4899",
    };
    const color = colors[ext] || "#6b7280";
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-8 h-8"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6 2h9l5 5v15a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1z"
                fill={color}
                opacity=".15"
                stroke={color}
                strokeWidth="1.5"
            />
            <path d="M15 2l5 5h-5V2z" fill={color} />
            <text
                x="12"
                y="17"
                textAnchor="middle"
                fontSize="5"
                fill={color}
                fontFamily="monospace"
                fontWeight="bold"
            >
                {ext.toUpperCase().slice(0, 4)}
            </text>
        </svg>
    );
}

function ContextMenu({ x, y, file, onAction, onClose }) {
    const ref = useRef();
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) onClose();
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [onClose]);

    const items = file.isDir
        ? [
              { label: "📂 Abrir", action: "open" },
              { label: "✏️ Renomear", action: "rename" },
              { label: "🗑️ Excluir pasta", action: "delete", danger: true },
          ]
        : [
              ...(isImage(file.name)
                  ? [
                        {
                            label: "🖼️ Selecionar imagem",
                            action: "select",
                            highlight: true,
                        },
                    ]
                  : []),
              { label: "✏️ Renomear", action: "rename" },
              { label: "🗑️ Excluir arquivo", action: "delete", danger: true },
          ];

    return (
        <div
            ref={ref}
            style={{ top: y, left: x }}
            className="fixed z-[9999] bg-white border border-gray-200 rounded-xl shadow-2xl py-1.5 min-w-[180px] overflow-hidden"
        >
            <div className="px-3 py-1.5 text-xs text-gray-400 border-b border-gray-100 mb-1 truncate font-medium">
                {file.name}
            </div>
            {items.map((item) => (
                <button
                    type="button"
                    key={item.action}
                    onClick={() => {
                        onAction(item.action);
                        onClose();
                    }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2
            ${item.danger ? "text-red-500 hover:bg-red-50" : item.highlight ? "text-blue-600 font-semibold hover:bg-neutral-50" : "text-gray-700 hover:bg-gray-100"}`}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}

function DropZone({ onDrop, children, highlight, onHighlight }) {
    return (
        <div
            onDragOver={(e) => {
                e.preventDefault();
                onHighlight(true);
            }}
            onDragLeave={() => onHighlight(false)}
            onDrop={(e) => {
                e.preventDefault();
                onHighlight(false);
                onDrop(e);
            }}
            className={`h-full transition-all duration-150 ${highlight ? "ring-2 ring-inset ring-blue-400 bg-neutral-50/40" : ""}`}
        >
            {children}
        </div>
    );
}

function UrlTab({ onImageSelect }) {
    const [url, setUrl] = useState("");
    const [previewError, setPreviewError] = useState(false);

    const handleConfirm = () => {
        if (url.trim()) onImageSelect(url.trim());
    };

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
        setPreviewError(false);
    };

    const isValidUrl = url.trim().length > 0 && !previewError;

    return (
        <div className="flex flex-col gap-4 px-5 py-4 flex-1 overflow-y-auto">
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                    URL da imagem
                </label>
                <div className="flex gap-2">
                    <input
                        type="url"
                        value={url}
                        onChange={handleUrlChange}
                        placeholder="https://exemplo.com/imagem.jpg"
                        autoFocus
                        className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!isValidUrl}
                        className="px-4 py-2 text-sm text-white bg-black hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors font-medium shadow-sm"
                    >
                        Inserir
                    </button>
                </div>
            </div>

            {url.trim() && (
                <div className="flex-1 flex flex-col gap-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Pré-visualização
                    </p>
                    {previewError ? (
                        <div className="flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed border-red-200 bg-red-50 text-red-400 gap-2">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="w-8 h-8"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                />
                            </svg>
                            <p className="text-xs font-medium">
                                Não foi possível carregar a imagem
                            </p>
                            <p className="text-xs text-red-300">
                                Verifique se a URL está correta
                            </p>
                        </div>
                    ) : (
                        <div
                            className="rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden"
                            style={{ minHeight: 160 }}
                        >
                            <img
                                src={url.trim()}
                                alt="Preview"
                                className="max-w-full max-h-64 object-contain rounded-lg"
                                onError={() => setPreviewError(true)}
                            />
                        </div>
                    )}
                </div>
            )}

            {!url.trim() && (
                <div className="flex flex-col items-center justify-center flex-1 text-gray-300 gap-3 py-8">
                    <svg
                        viewBox="0 0 48 48"
                        fill="none"
                        className="w-14 h-14 opacity-40"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.19 8.688a4.5 4.5 0 011.8 4.312 5.25 5.25 0 002.625 4.612c1.062.54 1.688 1.688 1.688 2.88v.075a4.5 4.5 0 01-4.5 4.5H9a4.5 4.5 0 01-4.5-4.5v-.023A4.5 4.5 0 018.687 16.3a4.5 4.5 0 001.8-4.312A4.5 4.5 0 0113.19 8.69zM21.75 12a4.5 4.5 0 014.5 4.5v.023A4.5 4.5 0 0121.75 21H18a4.5 4.5 0 01-4.5-4.5v-.075c0-1.192.626-2.34 1.688-2.88a5.25 5.25 0 002.625-4.612 4.5 4.5 0 011.8-4.312"
                        />
                    </svg>
                    <p className="text-sm text-gray-400">
                        Cole uma URL de imagem acima
                    </p>
                </div>
            )}
        </div>
    );
}

export const ImageUploadModal = ({ onImageSelect, onClose }) => {
    const [activeTab, setActiveTab] = useState("files");
    const [files, setFiles] = useState([]);
    const [folderChain, setFolderChain] = useState([
        { id: "", name: "Início" },
    ]);
    const [loading, setLoading] = useState(false);
    const [contextMenu, setContextMenu] = useState(null);
    const [draggingFile, setDraggingFile] = useState(null);
    const [dropTarget, setDropTarget] = useState(null);
    const [dropZoneActive, setDropZoneActive] = useState(false);
    const [selected, setSelected] = useState(null);
    const fileInputRef = useRef();

    const currentPath = folderChain[folderChain.length - 1].id;

    const loadFiles = useCallback(async (path = "") => {
        setLoading(true);
        try {
            const data = await API.list(path);
            setFiles(
                data.map((f) => ({
                    id: joinPath(path, f.name),
                    name: f.name,
                    isDir: f.isDir,
                    size: f.size,
                    thumbUrl:
                        !f.isDir && isImage(f.name)
                            ? joinPath("/files", path, f.name)
                            : undefined,
                })),
            );
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === "files") {
            loadFiles(currentPath);
            setSelected(null);
        }
    }, [currentPath, loadFiles, activeTab]);

    const navigateTo = (index) => {
        setFolderChain((prev) => prev.slice(0, index + 1));
    };

    const openDir = (file) => {
        setFolderChain((prev) => [
            ...prev,
            { id: joinPath(currentPath, file.name), name: file.name },
        ]);
    };

    const handleDoubleClick = (file) => {
        if (file.isDir) openDir(file);
        else if (isImage(file.name))
            onImageSelect(joinPath("/files", currentPath, file.name));
    };

    const handleContextAction = async (action, file) => {
        const fullPath = joinPath(currentPath, file.name);
        if (action === "open") openDir(file);
        else if (action === "select")
            onImageSelect(joinPath("/files", fullPath));
        else if (action === "rename") {
            const name = prompt("Novo nome:", file.name);
            if (name && name !== file.name) {
                await API.rename(fullPath, name);
                loadFiles(currentPath);
            }
        } else if (action === "delete") {
            if (confirm(`Excluir "${file.name}"?`)) {
                await API.delete(fullPath);
                loadFiles(currentPath);
            }
        }
    };

    const handleCreateFolder = async () => {
        const name = prompt("Nome da nova pasta:");
        if (!name) return;
        await API.createFolder(currentPath, name);
        loadFiles(currentPath);
    };

    const handleUpload = async (fileList) => {
        if (!fileList.length) return;
        await API.upload(currentPath, Array.from(fileList));
        loadFiles(currentPath);
    };

    const handleFileDrop = async (e) => {
        if (e.dataTransfer.files.length) {
            await handleUpload(e.dataTransfer.files);
            return;
        }
        if (draggingFile && dropTarget && dropTarget !== draggingFile.id) {
            const from = draggingFile.id;
            const toDir = dropTarget;
            const fileName = draggingFile.name;
            await API.move(from, joinPath(toDir, fileName));
            loadFiles(currentPath);
        }
        setDraggingFile(null);
        setDropTarget(null);
    };

    const formatSize = (bytes) => {
        if (!bytes) return "";
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    };

    const dirs = files.filter((f) => f.isDir);
    const fileItems = files.filter((f) => !f.isDir);

    const tabs = [
        {
            id: "files",
            label: "Arquivos",
            icon: (
                <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3.5 h-3.5"
                >
                    <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7.414A2 2 0 0017.414 6L14 2.586A2 2 0 0012.586 2H6a2 2 0 00-2 2v-.001z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
        },
        {
            id: "url",
            label: "URL externa",
            icon: (
                <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3.5 h-3.5"
                >
                    <path
                        fillRule="evenodd"
                        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
        },
    ];

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="bg-white w-full max-w-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-down"
                style={{
                    height: "min(90vh, 640px)",
                }}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-neutral-600 rounded-xl flex items-center justify-center">
                            <svg
                                viewBox="0 0 20 20"
                                fill="white"
                                className="w-5 h-5"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900 text-sm">
                                Inserir imagem
                            </h2>
                            <p className="text-xs text-gray-400">
                                {activeTab === "files"
                                    ? `${files.length} ${files.length === 1 ? "item" : "itens"}`
                                    : "Cole a URL de qualquer imagem da web"}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                <div className="flex items-center gap-1 px-5 pt-3 pb-0 border-b border-gray-100">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-t-lg transition-all border-b-2 -mb-px
                ${
                    activeTab === tab.id
                        ? "border-blue-500 text-blue-600 bg-neutral-50/60"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "files" && (
                    <>
                        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50/60">
                            <nav className="flex items-center gap-1 flex-1 min-w-0 overflow-hidden">
                                {folderChain.map((crumb, i) => (
                                    <React.Fragment key={crumb.id}>
                                        {i > 0 && (
                                            <svg
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                className="w-3 h-3 text-gray-300 flex-shrink-0"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => navigateTo(i)}
                                            className={`text-xs px-2 py-1 rounded-lg truncate max-w-[120px] transition-colors ${i === folderChain.length - 1 ? "font-semibold text-gray-800 bg-gray-200/80" : "text-gray-500 hover:text-gray-800 hover:bg-gray-200/60"}`}
                                        >
                                            {crumb.name}
                                        </button>
                                    </React.Fragment>
                                ))}
                            </nav>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={handleCreateFolder}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-200/80 rounded-lg transition-colors"
                                >
                                    <svg
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-3.5 h-3.5"
                                    >
                                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                        <path
                                            stroke="white"
                                            strokeWidth="1.5"
                                            d="M10 10v4M8 12h4"
                                        />
                                    </svg>
                                    Nova pasta
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-black hover:bg-neutral-700 rounded-lg transition-colors font-medium shadow-sm"
                                >
                                    <svg
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-3.5 h-3.5"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Enviar arquivo
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={(e) =>
                                        handleUpload(e.target.files)
                                    }
                                />
                            </div>
                        </div>

                        <DropZone
                            onDrop={handleFileDrop}
                            highlight={dropZoneActive}
                            onHighlight={setDropZoneActive}
                        >
                            <div className="flex-1 overflow-y-auto px-3 py-2 h-full">
                                {loading ? (
                                    <div className="flex items-center justify-center h-40 text-gray-400">
                                        <svg
                                            className="animate-spin w-6 h-6"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                    </div>
                                ) : files.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-3">
                                        <svg
                                            viewBox="0 0 48 48"
                                            fill="none"
                                            className="w-16 h-16 opacity-30"
                                        >
                                            <path
                                                d="M8 40V12l10-8h22v36H8z"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M18 4v8H8"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-500">
                                                Pasta vazia
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Arraste arquivos aqui ou clique
                                                em "Enviar arquivo"
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        {dirs.length > 0 && (
                                            <div className="mb-1">
                                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 py-1.5">
                                                    Pastas
                                                </p>
                                                <div className="grid grid-cols-1 gap-0.5">
                                                    {dirs.map((file) => (
                                                        <div
                                                            key={file.id}
                                                            draggable
                                                            onDragStart={() =>
                                                                setDraggingFile(
                                                                    file,
                                                                )
                                                            }
                                                            onDragOver={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setDropTarget(
                                                                    file.id,
                                                                );
                                                            }}
                                                            onDragLeave={() =>
                                                                setDropTarget(
                                                                    null,
                                                                )
                                                            }
                                                            onDrop={async (
                                                                e,
                                                            ) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                if (
                                                                    draggingFile &&
                                                                    draggingFile.id !==
                                                                        file.id
                                                                ) {
                                                                    await API.move(
                                                                        draggingFile.id,
                                                                        joinPath(
                                                                            file.id,
                                                                            draggingFile.name,
                                                                        ),
                                                                    );
                                                                    setDraggingFile(
                                                                        null,
                                                                    );
                                                                    setDropTarget(
                                                                        null,
                                                                    );
                                                                    loadFiles(
                                                                        currentPath,
                                                                    );
                                                                } else if (
                                                                    e
                                                                        .dataTransfer
                                                                        .files
                                                                        .length
                                                                ) {
                                                                    await API.upload(
                                                                        file.id,
                                                                        Array.from(
                                                                            e
                                                                                .dataTransfer
                                                                                .files,
                                                                        ),
                                                                    );
                                                                    loadFiles(
                                                                        currentPath,
                                                                    );
                                                                }
                                                            }}
                                                            onDoubleClick={() =>
                                                                openDir(file)
                                                            }
                                                            onClick={() =>
                                                                setSelected(
                                                                    file.id,
                                                                )
                                                            }
                                                            onContextMenu={(
                                                                e,
                                                            ) => {
                                                                e.preventDefault();
                                                                setContextMenu({
                                                                    x: e.clientX,
                                                                    y: e.clientY,
                                                                    file,
                                                                });
                                                            }}
                                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all group
                                ${selected === file.id ? "bg-neutral-50 ring-1 ring-blue-200" : "hover:bg-gray-50"}
                                ${dropTarget === file.id ? "ring-2 ring-blue-400 bg-neutral-50" : ""}
                              `}
                                                        >
                                                            <FileIcon
                                                                file={file}
                                                            />
                                                            <span className="text-sm text-gray-800 font-medium truncate flex-1">
                                                                {file.name}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    openDir(
                                                                        file,
                                                                    );
                                                                }}
                                                                className="opacity-0 group-hover:opacity-100 text-xs text-blue-500 hover:text-blue-700 px-2 py-0.5 rounded-lg hover:bg-neutral-100 transition-all"
                                                            >
                                                                Abrir →
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {fileItems.length > 0 && (
                                            <div>
                                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 py-1.5">
                                                    Arquivos
                                                </p>
                                                <div className="grid grid-cols-1 gap-0.5">
                                                    {fileItems.map((file) => (
                                                        <div
                                                            key={file.id}
                                                            draggable
                                                            onDragStart={() =>
                                                                setDraggingFile(
                                                                    file,
                                                                )
                                                            }
                                                            onDoubleClick={() =>
                                                                handleDoubleClick(
                                                                    file,
                                                                )
                                                            }
                                                            onClick={() =>
                                                                setSelected(
                                                                    file.id,
                                                                )
                                                            }
                                                            onContextMenu={(
                                                                e,
                                                            ) => {
                                                                e.preventDefault();
                                                                setContextMenu({
                                                                    x: e.clientX,
                                                                    y: e.clientY,
                                                                    file,
                                                                });
                                                            }}
                                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all group
                                ${selected === file.id ? "bg-neutral-50 ring-1 ring-blue-200" : "hover:bg-gray-50"}
                              `}
                                                        >
                                                            <FileIcon
                                                                file={file}
                                                                thumbUrl={
                                                                    file.thumbUrl
                                                                }
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm text-gray-800 font-medium truncate">
                                                                    {file.name}
                                                                </p>
                                                                {file.size && (
                                                                    <p className="text-xs text-gray-400">
                                                                        {formatSize(
                                                                            file.size,
                                                                        )}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            {isImage(
                                                                file.name,
                                                            ) && (
                                                                <button
                                                                    type="button"
                                                                    onClick={(
                                                                        e,
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        onImageSelect(
                                                                            joinPath(
                                                                                "/files",
                                                                                currentPath,
                                                                                file.name,
                                                                            ),
                                                                        );
                                                                    }}
                                                                    className="opacity-0 group-hover:opacity-100 text-xs text-white bg-black hover:bg-neutral-700 px-2.5 py-1 rounded-lg transition-all shadow-sm"
                                                                >
                                                                    Selecionar
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </DropZone>

                        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                                Arraste arquivos para cá ou para pastas · Clique
                                com botão direito para opções
                            </p>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </>
                )}

                {activeTab === "url" && (
                    <>
                        <UrlTab onImageSelect={onImageSelect} />
                        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/60 flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </>
                )}
            </div>

            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    file={contextMenu.file}
                    onAction={(action) =>
                        handleContextAction(action, contextMenu.file)
                    }
                    onClose={() => setContextMenu(null)}
                />
            )}
        </div>
    );
};
