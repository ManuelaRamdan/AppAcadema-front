
import api from "./api";

export const getAllUsuarios = async (page = 1, limit = 2, rol) => {

    let url = `/api/usuarios?page=${page}&limit=${limit}`;
    if (rol) {
        url += `&rol=${rol}`; 
    } 
    return api.get(url, {
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    });
};


export const getUsuarioById = async (id) => {
    return api.get(`/api/usuarios/${id}`);
};


export const createUsuario = async (usuarioData) => {
    return api.post(`/api/usuarios/register`, usuarioData);
};

