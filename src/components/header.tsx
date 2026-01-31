import Link from "next/link";

export function Header() {
    return (
        <header className="bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">
                        Horta Fácil
                    </span>
                </Link>
                <nav className="flex items-center gap-6 text-sm">
                    <Link href="/" className="text-gray-700 hover:text-primary">
                        Início
                    </Link>
                    <Link
                        href="/calculator"
                        className="text-gray-700 hover:text-primary"
                    >
                        Calculadora
                    </Link>
                    <Link
                        href="/dashboard"
                        className="text-gray-700 hover:text-primary"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/pricing"
                        className="text-gray-700 hover:text-primary"
                    >
                        Planos
                    </Link>
                    <Link
                        href="/login"
                        className="rounded-md bg-primary px-3 py-2 text-white hover:bg-primary-dark"
                    >
                        Entrar
                    </Link>
                </nav>
            </div>
        </header>
    );
}
