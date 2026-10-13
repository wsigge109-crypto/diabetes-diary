export default function AuthLayout({ heading, text, children }) {
  return (
    <div className="auth">
      <aside className="auth__side">
        <h1>{heading}</h1>
        <p>{text}</p>
        <svg className="auth__wave" viewBox="0 0 160 40" aria-hidden="true">
          <polyline
            points="0,34 20,22 34,30 52,12 70,24 88,16 106,26 124,14 140,22 160,18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </aside>
      <main className="auth__main">
        <div className="auth__form">{children}</div>
      </main>
    </div>
  );
}
