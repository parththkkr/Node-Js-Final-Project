export const currentOrderView = (request, response) => {
    response.render("order/current.ejs");
};
export const customerOrdersView = (request, response) => {
    response.render("order/orderList.ejs");
};
