const cards = document.querySelectorAll('.kanban-card');
const columns = document.querySelectorAll('.kanban-items');

// --- FUNÇÃO PARA SALVAR ---
function saveState() {
    const state = {};
    
    // Percorre cada coluna e anota quais IDs de cards estão dentro dela
    document.querySelectorAll('.kanban-column').forEach(column => {
        const columnId = column.id;
        const itemsInColumn = Array.from(column.querySelectorAll('.kanban-card'))
                                   .map(card => card.getAttribute('data-id'));
        state[columnId] = itemsInColumn;
    });

    localStorage.setItem('kanban-data', JSON.stringify(state));
    console.log("Posições salvas!");
}

// --- FUNÇÃO PARA CARREGAR ---
function loadState() {
    const savedData = JSON.parse(localStorage.getItem('kanban-data'));
    
    if (savedData) {
        Object.keys(savedData).forEach(columnId => {
            const columnContainer = document.querySelector(`#${columnId} .kanban-items`);
            
            savedData[columnId].forEach(cardId => {
                // Busca o card pelo ID e move ele para a coluna certa
                const card = document.querySelector(`.kanban-card[data-id="${cardId}"]`);
                if (card && columnContainer) {
                    columnContainer.appendChild(card);
                }
            });
        });
    }
}

// --- EVENTOS DE ARRASTAR (DRAG & DROP) ---
cards.forEach(card => {
    card.addEventListener('dragstart', () => card.classList.add('dragging'));
    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        saveState(); // Salva quando solta o card
    });
});

columns.forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
        column.classList.add('drag-over');
    });

    column.addEventListener('dragleave', () => column.classList.remove('drag-over'));

    column.addEventListener('drop', (e) => {
        e.preventDefault();
        column.classList.remove('drag-over');
        const draggingCard = document.querySelector('.dragging');
        if (draggingCard) {
            column.appendChild(draggingCard);
            saveState(); // Salva quando o card cai na nova coluna
        }
    });
});
// Função para mover para a ESQUERDA (ou para CIMA no mobile empilhado)
function moveLeft(btn) {
    const card = btn.closest('.kanban-card');
    const currentColumn = card.closest('.kanban-column');
    const prevColumn = currentColumn.previousElementSibling;

    if (prevColumn && prevColumn.classList.contains('kanban-column')) {
        prevColumn.querySelector('.kanban-items').appendChild(card);
        saveState(); // Reaproveita sua função de salvar
    }
}

// Função para mover para a DIREITA (ou para BAIXO no mobile empilhado)
function moveRight(btn) {
    const card = btn.closest('.kanban-card');
    const currentColumn = card.closest('.kanban-column');
    const nextColumn = currentColumn.nextElementSibling;

    if (nextColumn && nextColumn.classList.contains('kanban-column')) {
        nextColumn.querySelector('.kanban-items').appendChild(card);
        saveState(); // Reaproveita sua função de salvar
    }
}
// Executa ao abrir a página
loadState();