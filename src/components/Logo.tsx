export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="4" fill="#2563EB"/>
        <path d="M6 8h4l3 8 3-8h4v16h-4v-9l-3 9-3-9v9H6V8z" fill="white"/>
        <path d="M22 16l4-4v8l-4-4z" fill="white"/>
      </svg>
      <span className="text-lg font-semibold text-text hidden sm:inline">
        Markdown to Whatever
      </span>
    </div>
  );
}
