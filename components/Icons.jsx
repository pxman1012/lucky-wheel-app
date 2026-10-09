const base = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
};

export const SunIcon = (p) => (
    <svg {...base} {...p}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
);

export const MoonIcon = (p) => (
    <svg {...base} {...p}>
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
);

export const VolumeIcon = (p) => (
    <svg {...base} {...p}>
        <path d="M11 5 6 9H3v6h3l5 4V5z" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
);

export const VolumeOffIcon = (p) => (
    <svg {...base} {...p}>
        <path d="M11 5 6 9H3v6h3l5 4V5z" />
        <path d="m22 9-6 6M16 9l6 6" />
    </svg>
);

export const PlusIcon = (p) => (
    <svg {...base} {...p}>
        <path d="M12 5v14M5 12h14" />
    </svg>
);

export const CloseIcon = (p) => (
    <svg {...base} {...p}>
        <path d="M6 6l12 12M18 6 6 18" />
    </svg>
);

export const PencilIcon = (p) => (
    <svg {...base} {...p}>
        <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4zM13.5 6.5l4 4" />
    </svg>
);

export const TrashIcon = (p) => (
    <svg {...base} {...p}>
        <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6" />
    </svg>
);

export const ImageIcon = (p) => (
    <svg {...base} {...p}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="9" cy="9" r="1.8" />
        <path d="m21 15-5-5L5 21" />
    </svg>
);