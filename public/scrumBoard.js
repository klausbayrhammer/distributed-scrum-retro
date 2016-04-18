fetch(`/api/board/${window.boardId}/card`).then(res => {
    res.json().then(listCards);
});

function listCards(cards) {
    _.each(cards, (card) => {
        $(".board").append(`<p>${card.title}<button class="del-card" data-id="${card._id}">Del</button></p>`);
    });
    $('.del-card').click((e) => {
        const cardId = e.target.dataset.id;
        fetch(`/api/board/${window.boardId}/card/${cardId}`, {method: 'DELETE'}).then((res) => {
            console.log('Deleting card successful')
        });
    })
}
$(function () {
    $('#addCard').click(() => {
        const title = $('#newCardTitle').val();
        fetch(`/api/board/${window.boardId}/card?title=${title}&category=good`, {method:'PUT'}).then(() => {
            console.log('succefully added card');
        });
    });
});
