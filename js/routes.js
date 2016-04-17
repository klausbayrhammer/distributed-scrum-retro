module.exports = function (app) {
    app.get('/', (req, res) => {
        const newBoardId = Math.random().toString(36).substring(7);
        res.redirect(`board/${newBoardId}`);
    });

    app.get('board/:boardId', (req, res) => {
        res.render('board',
            {boardId: req.params.boardId}
        )
    });
};
