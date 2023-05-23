export function AuthLayout({ children } : { children: React.ReactNode }) {
    return (
        <div className="container">
            <div className="side-bar">{children}</div>
            <div className="front-cover"></div>
        </div>
    )
}