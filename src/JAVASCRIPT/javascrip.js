
function abrirmodal(){
    new bootstrap.Modal("#exampleModal").show();
}

/* ULTIMOS PEDIDOS */

document.addEventListener('DOMContentLoaded', function() {
    fetch('https:/')  // Substitua pela URL correta da API
        .then(response => response.json())
        .then(data => {
            const orderPedido = document.getElementById('order-pedido');
            orderPedido.innerHTML = '';  // Limpa o conteúdo atual

            data.forEach(pedido => {
                const pedidoItem = document.createElement('ul');
                pedidoItem.className = 'pedido-list';
                pedidoItem.innerHTML = `
                    <li class="status-img pedido">
                        <img src="../img/${pedido.status}.png" alt="Status" id="status-img-${pedido.id}">
                    </li>
                    <li class="pedido">${new Date(pedido.data).toLocaleTimeString()}</li>
                    <li class="pedido">${new Date(pedido.data).toLocaleDateString()}</li>
                    <li class="pedido">${pedido.bairro}</li>
                    <li class="pedido-direita">
                        <ul class="pedido-list">
                            <li class="pedido">${pedido.cliente}</li>
                            <li class="pedido">${pedido.id}</li>
                        </ul>
                    </li>
                `;
                orderPedido.appendChild(pedidoItem);
            });
        })
        .catch(error => console.error('Erro ao buscar pedidos:', error));
});

// Dados dos pedidos (simulando uma resposta da API)
/* const pedidos = [
    { id: 1, status: "novopedido", data: "", bairro: "", cliente: "" },
    { id: 2, status: "preparando", data: "2023-10-01T15:00:00.000Z", bairro: "Vila Madalena", cliente: "Maria Oliveira" },
    { id: 3, status: "pronto", data: "2023-10-01T15:30:00.000Z", bairro: "Moema", cliente: "Carlos Souza" }
]; */

// Função para atualizar as imagens de status
function atualizarStatus() {
    pedidos.forEach(pedido => {
        const imgElement = document.getElementById(`status-img-${pedido.id}`);
        if (imgElement) {
            imgElement.src = `../img/${pedido.status}.png`;  // Troca a imagem com base no status
            imgElement.alt = `Status: ${pedido.status}`;
        }
    });
}

// Executa a função ao carregar a página
window.onload = atualizarStatus;