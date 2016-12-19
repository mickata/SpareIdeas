function showView(viewId) {
    $("main > section").hide();

    $("#" + viewId).show();
}

function showHomeView() {
    showView('viewHome');
}

function showLoginView() {
    showView('viewLogin');
}

function showRegisterView() {
    showView('viewRegister');
}

function showListBooksView() {
    showView('viewListBooks');
}

function showCreateBookView() {
    showView('viewCreateBook');
}

function logout() {
    alert('logout');
    showHomeView();
}



$(function () {
    $("#linkHome").click(showHomeView);
    $("#linkLogin").click(showLoginView);
    $("#linkRegister").click(showRegisterView);
    $("#linkListBooks").click(showListBooksView);
    $("#linkCreateBook").click(showCreateBookView);
    $("#linkLogout").click(logout);
});