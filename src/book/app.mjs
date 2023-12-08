export const bookListView = (request, response) => {
    response.render("book/list.ejs");
};
export const bookDetailView = async (request, response) => {
    response.render("book/detail.ejs");
};
