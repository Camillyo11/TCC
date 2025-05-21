document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/api/menu/pizzas')
        .then(res => res.json())
        .then(pizzas => {
            const container = document.getElementById('pizzas-list');
            container.innerHTML = '';
            pizzas.forEach(pizza => {
                const card = document.createElement('div');
                card.className = 'col-md-6 col-lg-4';
                card.innerHTML = `
                    <div class="card pizza-card h-100">
                        <div class="card-body">
                            <img src="${pizza.imagem}" class="card-img-top" alt="${pizza.sabor}">
                            <h5 class="card-title pizza-nome">${pizza.sabor}</h5>
                            <p class="card-text">${pizza.observacao || ''}</p>
                            <p class="pizza-preco">R$ ${pizza.preco_sabor.toFixed(2)}</p>
                            <button class="btn btn-success btn-add-carrinho" data-id="${pizza.id_pizza}">Adicionar ao carrinho</button>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
            document.querySelectorAll('.btn-add-carrinho').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const pizza = pizzas.find(p => p.id_pizza == id);
                    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
                    carrinho.push({ ...pizza, quantidade: 1 });
                    localStorage.setItem('carrinho', JSON.stringify(carrinho));
                    window.location.href = 'carrinho.html';
                });
            });
        })
        .catch(err => {
            document.getElementById('pizzas-list').innerHTML = '<p>Erro ao carregar pizzas.</p>';
        });
}); 