

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
        setMateriaSelecccionada(m);
        setAlumnos(m.alumnos || []);
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
            <div className="flex min-h-screen bg-color1">
                <aside className="w-64 bg-color5 text-white flex flex-col justify-between p-4 fixed h-full z-10">
                    <div>

                        <h2 className="text-xl font-bold text-center mb-8 text-color1">Mis materias</h2>

                        <input
                            type="text"
                            placeholder="Buscar materia"
                            value={filtroMateria}
                            onChange={(e) => setFiltroMateria(e.target.value)}
                            className="w-full p-3 rounded-xl border border-color2 focus:ring-2 focus:ring-color3 outline-none transition-all shadow-soft text-color5 text-sm"
                        />

                        <div className="space-y-2 mt-6">

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

                <main className="flex-1 ml-64 p-8">
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