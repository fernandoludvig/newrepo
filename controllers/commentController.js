// controllers/CommentController.js
const Comment = require("../models/comment");

class CommentController {
    // Método para criar um novo comentário
    static async createComment(req, res) {
        try {
            const { content, user_id, item_id } = req.body;
            const comment = new Comment(content, user_id, item_id);
            const savedComment = await comment.save();
            res.redirect(`/inv/detail/${item_id}`); // Redirect after saving
        } catch (error) {
            console.error('Error saving comment:', error);
            res.redirect(`/inv/detail/${item_id}?error=Could not save comment`); // Redirect with error
        }
    }

    // Método para obter todos os comentários para um item específico
    static async getCommentsByItemId(req, res) {
        try {
            const { item_id } = req.params;
            const comments = await Comment.fetchByItemId(item_id);
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ error: 'Falha ao recuperar comentários' });
        }
    }
}

// Exportando a classe CommentController
module.exports = CommentController;
