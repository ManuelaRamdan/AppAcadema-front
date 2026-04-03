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



    const cargar = async () => {
        try {
            const res = await getHijosPadre();
            console.log("Respuesta de la API:", res.data);
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
            <div className="flex min-h-screen bg-color1">
                <aside className="w-64 bg-color5 text-white flex flex-col justify-between p-4 fixed h-full z-10">
                    <div>

                        <h2 className="text-xl font-bold text-center mb-8 text-color1">Mis hijos</h2>
                        <div className="space-y-2">

                            {hijos.map((h) => (
                                <button
                                    key={h.id}
                                    onClick={() => seleccionarHijo(h.id)}
                                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${hijoSeleccionado === h.id
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

                <main className="flex-1 ml-64 p-8">
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