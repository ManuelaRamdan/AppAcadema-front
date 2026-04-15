import React, { useEffect, useState } from 'react';
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";

const SECCIONES = [
    { id: "usuarios", nombre: "Usuarios" },
    { id: "alumnos", nombre: "Alumnos" },
    { id: "cursos", nombre: "Cursos" },
    { id: "materias", nombre: "Materias" },
    { id: "profesores", nombre: "Profesores" },
    { id: "padres", nombre: "Padres" }
];

const renderContent = (seccion) => {
    switch (seccion) {
        case "usuarios":
            return <p>Panel de Usuarios (próximamente)</p>;
        case "materias":
            return <p>Panel de Usuarios (próximamente)</p>;
        case "cursos":
            return <p>Panel de Usuarios (próximamente)</p>;
        case "profesores":
            return <p>Panel de Usuarios (próximamente)</p>;
        case "alumnos":
            return <p>Panel de Usuarios (próximamente)</p>;

        case "padres":
            return <p>Panel de Usuarios (próximamente)</p>;
        default: return <p>Seleccioná una sección</p>;
    }
}



export default function AdminPanel() {
    const { logout, user } = useAuth();
    const [seccionSeleccionada, setSeccionSeleccionada] = useState("usuarios");
    const [error, setError] = useState(null);


    const [menuAbierto, setMenuAbierto] = useState(false);
    const seleccionarSeccion = (id) => {
        setSeccionSeleccionada(id);
        setMenuAbierto(false);
    };


    if (error) return <p className="error">{error}</p>;

    return (
        <>
            <div className="flex flex-col md:flex-row min-h-screen bg-color1">
                <header className="md:hidden p-4 w-full flex items-center">
                    <button onClick={() => setMenuAbierto(!menuAbierto)}
                        className="bg-color5 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </header>

                {menuAbierto && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
                        onClick={() => setMenuAbierto(false)}
                    />
                )}

                <aside className={`fixed top-0 left-0 h-full w-64 transition-transform duration-300 ease-in-out md:translate-x-0 bg-color5 text-white p-6 z-30 flex flex-col justify-between shadow-2xl ${menuAbierto ? "translate-x-0" : "-translate-x-full"}`}>
                    <div>

                        <h2 className="text-xl font-bold text-center mb-8 text-color1">Panel admin</h2>



                        <div className="space-y-2 mt-6 overflow-y-auto flex-1 mb-4 max-h-[60vh] md:max-h-none pr-2">

                            {SECCIONES.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => seleccionarSeccion(s.id)}
                                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all text-left ${seccionSeleccionada === s.id
                                        ? "bg-color2 text-color5 shadow-md"
                                        : "hover:bg-slate-800 text-slate-300"
                                        }`}
                                >
                                    {s.nombre}
                                </button>
                            )

                            )}

                        </div>
                    </div>
                    <button onClick={logout}
                        className="bg-color3 hover:bg-opacity-90 text-black py-2 px-4 rounded-lg font-bold transition-all w-full"
                    >Cerrar Sesión</button>
                </aside>

                <main className="flex-1 md:ml-64 p-4 md:p-8 w-full overflow-x-hidden"
                    key={seccionSeleccionada}>
                    <div className="max-w-6xl mx-auto">

                        {renderContent(seccionSeleccionada)}
                    </div>
                </main>


            </div>

        </>
    );
}