const pool = require("../database/");

// Função para obter todas as classificações
async function getClassifications() {
    try {
        return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
    } catch (error) {
        console.error("Error fetching classifications:", error);
        throw error; // Propaga o erro
    }
}

// Função para obter itens do inventário por classificação
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
             JOIN public.classification AS c 
             ON i.classification_id = c.classification_id 
             WHERE i.classification_id = $1`,
            [classification_id]
        );
        return data.rows; // Retorna as linhas do resultado da consulta
    } catch (error) {
        console.error("getInventoryByClassificationId error: " + error);
        throw error; // Propaga o erro
    }
}

// Função para obter veículo por ID
const getVehicleById = async (vehicleId) => {
    try {
        const query = "SELECT * FROM public.inventory WHERE inv_id = $1"; // Use $1 para PostgreSQL
        const result = await pool.query(query, [vehicleId]); // Corrigido: use vehicleId aqui
        return result.rows[0]; // Retorna o primeiro registro (veículo específico)
    } catch (error) {
        console.error("Database query error:", error);
        throw error; // Propaga o erro
    }
};

// Exportar funções
module.exports = { getClassifications, getInventoryByClassificationId, getVehicleById };
