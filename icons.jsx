// icons.jsx — Inline SVG icon set. Stroke-based, lucide-flavored.
// Each is a thin wrapper around a path; size/color via props.

const I = ({ children, size = 14, className = '', stroke = 1.6, fill = 'none' }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const Icon = {
  Home:        (p) => <I {...p}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></I>,
  Pipeline:    (p) => <I {...p}><path d="M3 7h18" /><path d="M5 12h14" /><path d="M8 17h8" /></I>,
  Inbox:       (p) => <I {...p}><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.5 5h13l3.5 7v8a2 2 0 0 1-2 2h-16a2 2 0 0 1-2-2v-8z" /></I>,
  Users:       (p) => <I {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></I>,
  Book:        (p) => <I {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></I>,
  Settings:    (p) => <I {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></I>,
  Search:      (p) => <I {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></I>,
  Bell:        (p) => <I {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></I>,
  Plus:        (p) => <I {...p}><path d="M12 5v14M5 12h14" /></I>,
  Filter:      (p) => <I {...p}><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></I>,
  Check:       (p) => <I {...p}><path d="M20 6 9 17l-5-5" /></I>,
  X:           (p) => <I {...p}><path d="M18 6 6 18M6 6l12 12" /></I>,
  Edit:        (p) => <I {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></I>,
  Sparkles:    (p) => <I {...p}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></I>,
  Send:        (p) => <I {...p}><path d="m22 2-7 20-4-9-9-4 20-7z" /></I>,
  Chevron:     (p) => <I {...p}><path d="m9 18 6-6-6-6" /></I>,
  ChevronDown: (p) => <I {...p}><path d="m6 9 6 6 6-6" /></I>,
  ChevronLeft: (p) => <I {...p}><path d="m15 18-6-6 6-6" /></I>,
  Clock:       (p) => <I {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></I>,
  Calendar:    (p) => <I {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></I>,
  Flag:        (p) => <I {...p}><path d="M4 22V4" /><path d="M4 4h13l-2 4 2 4H4" /></I>,
  AlertTriangle:(p)=> <I {...p}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4M12 17h.01" /></I>,
  Dollar:      (p) => <I {...p}><path d="M12 2v20M17 5H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H7" /></I>,
  Building:    (p) => <I {...p}><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01" /></I>,
  FileText:    (p) => <I {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 13h6M9 17h6" /></I>,
  CheckCircle: (p) => <I {...p}><circle cx="12" cy="12" r="9" /><path d="m9 12 2 2 4-4" /></I>,
  XCircle:     (p) => <I {...p}><circle cx="12" cy="12" r="9" /><path d="m15 9-6 6M9 9l6 6" /></I>,
  Circle:      (p) => <I {...p}><circle cx="12" cy="12" r="9" /></I>,
  Dot:         (p) => <I {...p}><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" /></I>,
  Layers:      (p) => <I {...p}><path d="m12 2 10 6-10 6L2 8l10-6z" /><path d="m2 14 10 6 10-6" /></I>,
  GitBranch:   (p) => <I {...p}><circle cx="6" cy="6" r="2" /><circle cx="18" cy="18" r="2" /><circle cx="6" cy="18" r="2" /><path d="M18 6V14a4 4 0 0 1-4 4H8" /></I>,
  Zap:         (p) => <I {...p}><path d="M13 2 3 14h8l-1 8 10-12h-8l1-8z" /></I>,
  Activity:    (p) => <I {...p}><path d="M22 12h-4l-3 9-6-18-3 9H2" /></I>,
  Map:         (p) => <I {...p}><path d="M3 6v15l6-3 6 3 6-3V3l-6 3-6-3-6 3z" /><path d="M9 3v15M15 6v15" /></I>,
  Link:        (p) => <I {...p}><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></I>,
  ArrowRight:  (p) => <I {...p}><path d="M5 12h14M13 6l6 6-6 6" /></I>,
  ArrowLeft:   (p) => <I {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></I>,
  Lock:        (p) => <I {...p}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></I>,
  Refresh:     (p) => <I {...p}><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></I>,
  Brain:       (p) => <I {...p}><path d="M9 4a2.5 2.5 0 0 0-2.5 2.5A2.5 2.5 0 0 0 4 9v.5A2.5 2.5 0 0 0 6.5 12 2.5 2.5 0 0 0 4 14.5v.5a2.5 2.5 0 0 0 2.5 2.5A2.5 2.5 0 0 0 9 20a2 2 0 0 0 4 0V4a2 2 0 0 0-4 0z" /><path d="M15 4a2.5 2.5 0 0 1 2.5 2.5A2.5 2.5 0 0 1 20 9v.5a2.5 2.5 0 0 1-2.5 2.5A2.5 2.5 0 0 1 20 14.5v.5a2.5 2.5 0 0 1-2.5 2.5A2.5 2.5 0 0 1 15 20" /></I>,
  ListChecks:  (p) => <I {...p}><path d="m3 7 2 2 4-4" /><path d="m3 17 2 2 4-4" /><path d="M13 6h8M13 12h8M13 18h8" /></I>,
  Folder:      (p) => <I {...p}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></I>,
  Star:        (p) => <I {...p}><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></I>,
  Sliders:     (p) => <I {...p}><path d="M4 21V14M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></I>,
  Eye:         (p) => <I {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></I>,
  ExternalLink:(p) => <I {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6" /><path d="M10 14 21 3" /></I>,
};

window.Icon = Icon;
