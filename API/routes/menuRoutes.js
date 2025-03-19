const express = require('express');
const router = express.Router();
const { getMenu, addPizza } = require('../controllers/menuController');
const db = require('../db');


router.get('/', getMenu);

router.post('/', addPizza);


router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nome, preco } = req.body;

    const query = 'UPDATE menu SET nome = ?, preco = ? WHERE id = ?';
    db.query(query, [nome, preco, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item não encontrado.' });
        }

        res.status(200).json({ message: 'Item atualizado com sucesso.' });
    });
});

// Rota para deletar um item do menu
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM menu WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item não encontrado.' });
        }

        res.status(200).json({ message: 'Item removido com sucesso.' });
    });
});

module.exports = router;