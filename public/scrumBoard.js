fetch(`/api/board/${window.boardId}/card`).then(res => {
    res.json().then(listCards);
});

function listCards(cards) {
    _.each(cards, appendCard);
}

function appendCard(card) {
    $(".board").append(`<p data-id="${card._id}"><input class="card-text" type="text" value="${card.title}"/><button class="del-card" data-id="${card._id}">Del</button></p>`);
    $(".card-text").off('change');
    $(".card-text").change(e => {
        const cardId = e.target.parentNode.dataset.id
        fetch(`/api/board/${window.boardId}/card/${cardId}`, {
            method: 'POST', headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title: e.target.value})
        });
    });
    $('.del-card').click((e) => {
        const cardId = e.target.dataset.id;
        fetch(`/api/board/${window.boardId}/card/${cardId}`, {method: 'DELETE'})
    })
}


$(function () {
    $('#addCard').click(() => {
        const title = $('#newCardTitle').val();
        fetch(`/api/board/${window.boardId}/card?title=${title}&category=good`, {method: 'PUT'}).catch(err => console.log(err))
    });
});

const socket = io.connect('http://localhost:3000');
socket.on('new card', function (data) {
    appendCard(data);
});
socket.on('delete card', (data) => {
    deleteCard(data._id);
})

function deleteCard(cardId) {
    $(`p[data-id="${cardId}"]`).remove();
}