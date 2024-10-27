// models/Comment.js
const db = require("../database/") // Conexão com o banco de dados

class Comment {
    constructor(content, user_id, item_id) {
        this.content = content;
        this.user_id = user_id;
        this.item_id = item_id;
    }

    // Método para salvar um novo comentário no banco de dados
    async save() {
        const result = await db.query(
            'INSERT INTO comments (content, user_id, item_id) VALUES ($1, $2, $3) RETURNING *',
            [this.content, this.user_id, this.item_id]
        );
        return result.rows[0];
    }

    // Método para buscar todos os comentários relacionados a um item específico
    static async fetchByItemId(item_id) {
        const result = await db.query(
            'SELECT * FROM comments WHERE item_id = $1 ORDER BY created_at DESC',
            [item_id]
        );
        return result.rows;
    }
}

module.exports = Comment;
