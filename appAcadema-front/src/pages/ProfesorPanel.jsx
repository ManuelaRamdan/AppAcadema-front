

import React, { useEffect, useState } from 'react';

import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { profeGetMiInfo } from "../services/profeService";

import AlumnoMateria from '../components/Alumno/AlumnoMateria';

export default function ProfesorPanel() {
    const { logout, user } = useAuth();

    const [materias, setMaterias] = useState([]);
    const [alumnos, setAlumnos] = useState([]);
    const [profesor, setProfesor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [materiaSelecccionada, setMateriaSelecccionada] = useState(null);
    const [menuAbierto, setMenuAbierto] = useState(false);

    const [filtroMateria, setFiltroMateria] = useState("");


    const cargar = async () => {
        try {
            setLoading(true);
            const res = await profeGetMiInfo();
            setProfesor(res.data);

            const materiasDictadas = res.data.materiasDictadas || [];
            setMaterias(materiasDictadas);

            if (materiasDictadas.length > 0) {
                const primeraMat = materiasDictadas[0];
                setMateriaSelecccionada(primeraMat);
                setAlumnos(primeraMat.alumnos || []);
            }


        } catch {
            setError("No se pudieron cargar las materias del profesor");
        } finally {
            setLoading(false);
        }
    }

    const seleccionarMateria = (m) => {
        try {
            setLoading(true);
            setMateriaSelecccionada(m);
            setAlumnos(m.alumnos || []);
            setMenuAbierto(false);
        } catch {
            setError("No se pudieron cargar la materia");
        } finally {
            setLoading(false);

        }
    }





    useEffect(() => {

        cargar();

    }, [user]);


    if (loading) return <Loading fullScreen />;
    if (error) return <p className="error">{error}</p>;


    const materiasFiltradas = materias.filter((m) =>
        `${m.nombreMateria} ${m.nivel}${m.division} ${m.anio}`
            .toLowerCase()
            .includes(filtroMateria.toLowerCase())

    ) || [];

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

                        <h2 className="text-xl font-bold text-center mb-8 text-color1">Mis materias</h2>

                        <input
                            type="text"
                            placeholder="Buscar materia"
                            value={filtroMateria}
                            onChange={(e) => setFiltroMateria(e.target.value)}
                            className="w-full p-3 rounded-xl border border-color2 focus:ring-2 focus:ring-color3 outline-none transition-all shadow-soft text-color5 text-sm"
                        />

                        <div className="space-y-2 mt-6 overflow-y-auto flex-1 mb-4 max-h-[60vh] md:max-h-[calc(100vh-250px)] pr-2">

                            {materiasFiltradas.length === 0 && (
                                <p className="text-center py-10 text-gray-500 font-medium">No se encontraron materias.</p>
                            )}

                            {materiasFiltradas.map((m) => (
                                <button
                                    key={m._id}
                                    onClick={() => seleccionarMateria(m)}
                                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all text-left ${materiaSelecccionada?._id === m._id
                                        ? "bg-color2 text-color5 shadow-md"
                                        : "hover:bg-slate-800 text-slate-300"
                                        }`}
                                >
                                    {m.nombreMateria} {m.nivel} {m.division} {m.anio}
                                </button>

                            ))

                            }

                        </div>
                    </div>
                    <button onClick={logout}
                        className="bg-color3 hover:bg-opacity-90 text-black py-2 px-4 rounded-lg font-bold transition-all w-full"
                    >Cerrar Sesión</button>
                </aside>

                <main className="flex-1 md:ml-64 p-4 md:p-8 w-full overflow-x-hidden">
                    <div className="max-w-6xl mx-auto">

                        {loading ? (
                            <Loading />
                        ) : materiaSelecccionada ? (


                            <AlumnoMateria
                                key={profesor._id}
                                materiaSeleccionada={materiaSelecccionada}
                                profesor={profesor}
                            />

                        ) : (
                            <p className="text-color5">No se encontró información del la materia.</p>
                        )}
                    </div>
                </main>


            </div>

        </>
    );
}