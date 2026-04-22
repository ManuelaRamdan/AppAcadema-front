import { useEffect, useState } from "react";
import Loading from "../../Loading";
import { createAlumno } from "../../../services/alumnoService";
import { getAllCursos, getCursoById, getCursoByIdProfe } from "../../../services/cursoService";
import { getAllProfesores, getProfesorById } from "../../../services/profeService";


export default function CrearAlumno({ isOpen, onClose, onExito }) {

    const [nombre, setNombre] = useState("");
    const [materias, setMaterias] = useState([]);
    const [dni, setDni] = useState("");
    const [loading, setLoading] = useState(false);
    const [cursosDisponibles, setCursosDisponibles] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [hijos, setHijos] = useState([]);
    const [profeId, setProfeId] = useState("");
    const [filtroCurso, setFiltroCurso] = useState("");
    const [notificationMessage, setNotificationMessage] = useState({ type: '', message: '' });
    const [cursosFiltrados, setCursosFiltrados] = useState([]);


    const getNotificationClass = (type) => {
        const baseClass = "p-3 rounded-xl font-semibold text-sm mb-4 transition-opacity duration-300 border-l-4";
        switch (type) {
            case 'error': return `${baseClass} bg-red-100 text-red-800 border-red-600`;
            case 'warning': return `${baseClass} bg-yellow-100 text-yellow-800 border-yellow-600`;
            case 'success': return `${baseClass} bg-green-100 text-green-800 border-green-600`;
            case 'info': return `${baseClass} bg-blue-100 text-blue-800 border-blue-600`;
            default: return '';
        }
    };

    useEffect(() => {
        if (notificationMessage.message) {
            const timer = setTimeout(() => {
                setNotificationMessage({ type: '', message: '' });
            }, 3000);

            return () => clearTimeout(timer);
        };


    }, [notificationMessage]);

    useEffect(() => {
        const cargar = async () => {
            try {
                const cursos = await getAllCursos(1, 99999);
                setCursosDisponibles(cursos.data.cursos);
                setCursosFiltrados(cursos.data.cursos);
            } catch (error) {
                setNotificationMessage({ type: 'error', message: error.response.data.message });
            }
        }
        cargar();
    }, []);

    const reset = () => {
        setNombre("");
        setDni("");
        setMaterias("");
    }

    const handleGuardar = async (e) => {
        e.preventDefault();
        const data = {
            nombre,
            dni,
            materias: materias.map(id => ({ idCurso: id }))
        }
        try {
            //console.log(data);
            await createAlumno(data);
            setNotificationMessage({ type: 'success', message: 'Se guardó exitosamente' });
            reset();
            setTimeout(() => onExito(), 1500);
        } catch (err) {
            const mensaje = err?.response?.data?.error || err?.response?.data?.message || "Error al crear usuario";
            setNotificationMessage({ type: 'error', message: mensaje });
        }
    }

    const toggleMateria = (idCurso) => {
        if (materias.includes(idCurso)) {
            // ya estaba → sacarlo
            setMaterias(materias.filter(d => d !== idCurso));
        } else {
            // no estaba → agregarlo
            setMaterias([...materias, idCurso]);
        }
    }

    const filtrarCurso = async (texto) => {

        setFiltroCurso(texto);
        if (texto === "") {
            setCursosFiltrados(cursosDisponibles);
        } else if (isMongoId(texto)) {
            try {
                let res = await getCursoById(texto);
                setCursosFiltrados([res.data]);

            } catch (err) {
                try {
                    let res = await getCursoByIdProfe(texto);
                    // console.log(res.data);
                    setCursosFiltrados(res.data);
                } catch (err) {
                    setCursosFiltrados([]);
                }
            }
        } else {
            setCursosFiltrados(cursosDisponibles.filter((c) =>
                c.nombreMateria?.toLowerCase().includes(texto.toLowerCase()) ||
                c.division?.toLowerCase().includes(texto.toLowerCase()) ||
                c.profesor?.nombre?.toLowerCase().includes(texto.toLowerCase()) ||
                c.alumnos?.some((a) => a.dni?.includes(texto.toLowerCase()))
            ) || []);
        }
    }

    const isMongoId = (texto) => {
        return texto.length === 24 && /^[0-9a-fA-F]+$/.test(texto);
    }


    return isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-color5/40 backdrop-blur-sm p-4">
            <div className="bg-color1 w-full max-w-md rounded-[2rem] p-8 shadow-2xl border-4 border-white transform transition-all overflow-y-auto max-h-[90vh]">

                <h2 className="text-color5 text-2xl font-bold mb-6 text-center">Crear usuario</h2>

                {notificationMessage.message && (
                    <div className={getNotificationClass(notificationMessage.type)}>
                        {notificationMessage.message}
                    </div>
                )}

                <form onSubmit={handleGuardar} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <p className="text-color5 font-semibold text-sm ml-1">Nombre</p>
                        <input
                            className="bg-white border-2 border-color4 rounded-xl px-4 py-2 outline-none focus:border-color3 transition-colors text-color5"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-color5 font-semibold text-sm ml-1">Dni</p>
                        <input
                            className="bg-white border-2 border-color4 rounded-xl px-4 py-2 outline-none focus:border-color3 transition-colors text-color5"
                            value={dni}
                            type="number"
                            onChange={(e) => setDni(e.target.value)}
                            required
                        />
                    </div>


                    <div className="mt-2 space-y-3">
                        <p className="text-color5 font-semibold text-sm ml-1">Seleccione los cursos:</p>

                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Buscar curso (Materia, Profesor, ID de Curso o ID de Profesor)"
                                value={filtroCurso}
                                onChange={(e) => filtrarCurso(e.target.value)}
                                className="w-full p-3 rounded-xl border border-color2 focus:ring-2 focus:ring-color3 outline-none transition-all shadow-soft text-color5 text-sm"
                            />
                        </div>


                        <div className="max-h-40 overflow-y-auto bg-white/50 rounded-xl p-2 border border-color4">
                            {cursosFiltrados.map((a) => (
                                <div key={a._id} className="flex items-center gap-3 p-2 hover:bg-color2/20 rounded-lg transition-colors">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 accent-color3"
                                        checked={materias.includes(a._id)}
                                        onChange={() => toggleMateria(a._id)}
                                    />

                                    <span className="text-sm text-color5">{a.nombreMateria} ( {a.nivel}{a.division} - {a.anio}°) - <span className="font-mono text-xs">Prof: {a.profesor?.nombre || 'N/A'}</span></span>
                                </div>
                            ))}
                        </div>

                    </div>


                    <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 mt-6 justify-end">
                        <button
                            type="button"
                            className="px-6 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-lg font-semibold bg-color3 text-white hover:bg-opacity-90 transition-colors"

                        >
                            Enviar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : null;

}