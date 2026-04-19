import { useEffect, useState } from "react";
import Loading from "../../Loading";
import { createUsuario, getAllUsuarios } from "../../../services/usuarioService";
import { getAllAlumnos } from "../../../services/alumnoService";
import { getAllProfesores, getProfesorById } from "../../../services/profeService";


export default function CrearUsuario({ isOpen, onClose, onExito }) {

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("");
    const [loading, setLoading] = useState(false);
    const [alumnos, setAlumnos] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [hijos, setHijos] = useState([]);
    const [profeId, setProfeId] = useState("");
    const [filtroAlumno, setFiltroAlumno] = useState("");
    const [filtroProfe, setFiltroProfe] = useState("");
    const [notificationMessage, setNotificationMessage] = useState({ type: '', message: '' });
    const [profesFiltrados, setProfesoresFiltrados] = useState([]); 
    
   


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
                const alumnos = await getAllAlumnos(1, 99999);
                setAlumnos(alumnos.data.alumnos);

                const prof = await getAllProfesores(1, 99999);
                setProfesores(prof.data.profesores);

                const usuarios = await getAllUsuarios(1, 99999);
                setUsuarios(usuarios.data.usuarios);
            } catch (error) {
                setNotificationMessage({ type: 'error', message: error.response.data.message });
            }
        }
        cargar();
    }, []);

    const reset = () => {
        setNombre("");
        setEmail("");
        setPassword("");
        setRol("");
        setHijos([]);
        setProfeId("");
        setFiltroAlumno("");
    }

    const handleGuardar = async (e) => {
        e.preventDefault();
        const data = {
            nombre,
            email,
            password,
            rol,
            hijos: rol === "padre" ? hijos.map(dni => ({ dni })) : [],
            profesorId: rol === "profesor" ? profeId : null,
        }
        try {
            console.log(data);
            await createUsuario(data);
            setNotificationMessage({ type: 'success', message: 'Se guardó exitosamente' });
            reset();
            setTimeout(() => onExito(), 1500);
        } catch (err) {
            const mensaje = err?.response?.data?.error || err?.response?.data?.message || "Error al crear usuario";
            setNotificationMessage({ type: 'error', message: mensaje });
        }
    }

    const toggleHijo = (dni) => {
        if (hijos.includes(dni)) {
            // ya estaba → sacarlo
            setHijos(hijos.filter(d => d !== dni));
        } else {
            // no estaba → agregarlo
            setHijos([...hijos, dni]);
        }
    }



    const todasLosDniHijosAsignados = usuarios.flatMap(c => c.hijos.map(h => h.dni));

    const alumnosNoAsignados = alumnos.filter((a) => (
        !todasLosDniHijosAsignados.includes(a.dni)
    ));

    const alumnosFiltrados = alumnosNoAsignados.filter((m) =>
        m.dni?.toLowerCase().includes(filtroAlumno.toLowerCase()) ||
        m.nombre?.toLowerCase().includes(filtroAlumno.toLowerCase())

    ) || [];

    const todasLosProfesAsignados = usuarios.flatMap(c => c.profesorId);

    const profesNoAsignados = profesores.filter((a) => (
        !todasLosProfesAsignados.includes(a._id)
    ));

    useEffect(() => {
        if (rol === 'profesor') {
            setProfesoresFiltrados(profesNoAsignados);
        }
    }, [rol]);

    const filtrarProfe = async (texto) => {

        setFiltroProfe(texto);
        if (texto === "") {
            setProfesoresFiltrados(profesNoAsignados);
        } else if (isMongoId(texto)) {
            try {
                let res = await getProfesorById(texto);
                setProfesoresFiltrados([res.data]);

            } catch (err) {

                setProfesoresFiltrados([]);

            }
        } else {
            setProfesoresFiltrados(profesNoAsignados.filter((p) =>
                p.nombre?.toLowerCase().includes(texto.toLowerCase()) ||
                p.email?.toLowerCase().includes(texto.toLowerCase())
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
                        <p className="text-color5 font-semibold text-sm ml-1">Email</p>
                        <input
                            className="bg-white border-2 border-color4 rounded-xl px-4 py-2 outline-none focus:border-color3 transition-colors text-color5"
                            value={email}
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-color5 font-semibold text-sm ml-1">Contraseña</p>
                        <input
                            className="bg-white border-2 border-color4 rounded-xl px-4 py-2 outline-none focus:border-color3 transition-colors text-color5"
                            value={password}
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-color5 font-semibold text-sm ml-1">Rol</p>
                        <select
                            className="bg-white border-2 border-color4 rounded-xl px-4 py-2 outline-none focus:border-color3 transition-colors text-color5"
                            value={rol}
                            onChange={(e) => setRol(e.target.value)}
                            required
                        >
                            <option value="">Seleccione...</option>
                            <option value="padre">Padre</option>
                            <option value="profesor">Profesor</option>
                            <option value="administrador">Administrador</option>
                        </select>
                    </div>

                    {rol === 'padre' && (
                        <div className="mt-2 space-y-3">
                            <p className="text-color5 font-semibold text-sm ml-1">Seleccione los alumnos:</p>

                            <input
                                type="text"
                                placeholder="Buscar alumno (dni y apellido)"
                                value={filtroAlumno}
                                onChange={(e) => setFiltroAlumno(e.target.value)}
                                className="w-full p-3 rounded-xl border border-color2 focus:ring-2 focus:ring-color3 outline-none transition-all shadow-soft text-color5 text-sm"
                            />

                            {alumnosNoAsignados.length > 0 ? (
                                <div className="max-h-40 overflow-y-auto bg-white/50 rounded-xl p-2 border border-color4">
                                    {alumnosFiltrados.map((a) => (
                                        <div key={a.dni} className="flex items-center gap-3 p-2 hover:bg-color2/20 rounded-lg transition-colors">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 accent-color3"
                                                checked={hijos.includes(a.dni)}
                                                onChange={() => toggleHijo(a.dni)}
                                            />
                                            <span className="text-sm text-color5">{a.nombre} - <span className="font-mono text-xs">{a.dni}</span></span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded-lg text-center">No hay alumnos disponibles.</p>
                            )}
                        </div>
                    )}
                    {rol === 'profesor' && (
                        <div className="mt-2 space-y-3">
                            <p className="text-color5 font-semibold text-sm ml-1">Seleccione los profesores:</p>

                            <input
                                type="text"
                                placeholder="Buscar profesor (nombre o Id)"
                                value={filtroProfe}
                                onChange={(e) => filtrarProfe(e.target.value)}
                                className="w-full p-3 rounded-xl border border-color2 focus:ring-2 focus:ring-color3 outline-none transition-all shadow-soft text-color5 text-sm"
                            />

                            {profesNoAsignados.length > 0 ? (
                                <div className="max-h-40 overflow-y-auto bg-white/50 rounded-xl p-2 border border-color4">
                                    <select
                                        className="bg-white border-2 border-color4 rounded-xl px-4 py-2 outline-none focus:border-color3 transition-colors text-color5"
                                        value={profeId}
                                        onChange={(e) => setProfeId(e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccione...</option>
                                        {profesFiltrados.map((a) => (
                                                <option key={a._id} value={a._id}>{a.nombre}</option>
                                                
                                            
                                        ))}

                                    </select>

                                </div>
                            ) : (
                                <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded-lg text-center">No hay profesores disponibles.</p>
                            )}
                        </div>
                    )}

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