import React, { useEffect, useState } from 'react';

import AlumnoInfo from "../components/AlumnoInfo";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { getHijosPadre, getAlumnoById } from "../services/padreService";

export default function PadrePanel() {
    const { logout } = useAuth();

    const [hijos, setHijos] = useState([]);
    const [alumno, setAlumno] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hijoSeleccionado, setHijoSeleccionado] = useState(null);
    const [menuAbierto, setMenuAbierto] = useState(false);



    const cargar = async () => {
        try {
            const res = await getHijosPadre();
            setHijos(res.data.hijos);

            if (res.data.hijos.length > 0) {
                seleccionarHijo(res.data.hijos[0].id);
            }

        } catch {
            setError("No se pudieron cargar los hijos");
        } finally {
            setLoading(false);
        }
    }

    const seleccionarHijo = async (id) => {
        try {
            setLoading(true);
            setHijoSeleccionado(id);
            const res = await getAlumnoById(id);
            setAlumno(res.data);
            setMenuAbierto(false);
        } catch {
            setError("No se pudieron cargar los hijos");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { cargar(); }, []);

    if (loading && !alumno) return <Loading fullScreen />;
    if (error) return <p>{error}</p>;


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

                        <h2 className="text-xl font-bold text-center mb-8 text-color1">Mis hijos</h2>
                        <div className="flex flex-col gap-3 overflow-y-auto">

                            {hijos.map((h) => (
                                <button
                                    key={h.id}
                                    onClick={() => seleccionarHijo(h.id)}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold text-left transition-all ${hijoSeleccionado === h.id
                                        ? "bg-color2 text-color5"
                                        : "hover:bg-slate-800 text-slate-300"
                                        }`}

                                >
                                    {h.nombre}
                                </button>
                            ))}

                        </div>
                    </div>
                    <button onClick={logout}
                        className="bg-color3 hover:bg-opacity-90 text-white py-2 px-4 rounded-lg font-bold transition-all w-full"
                    >Cerrar Sesión</button>
                </aside>

                <main className="flex-1 md:ml-64 p-4 md:p-8 w-full overflow-x-hidden">
                    <div className="max-w-6xl mx-auto">

                        {loading ? (
                            <Loading />
                        ) : alumno ? (
                            <AlumnoInfo alumno={alumno} />
                        ) : (
                            <p className="text-color5">No se encontró información del alumno.</p>
                        )}
                    </div>
                </main>


            </div>

        </>
    );
}