const kinveyAppID = 'kid_Bk_0BMN4x';
const kinveyAppSecret = 'aae74caf18054b2490dbc13e8e0c7be5';
const kinveyServiceBaseUrl = 'https://baas.kinvey.com/';


function showView(viewId) {
    $("main > section").hide();

    $("#" + viewId).show();
}

function showHideNavigationLinks() {
    let loggedIn = sessionStorage.authToken != null;
    if(loggedIn){
        $("#linkLogin").hide();
        $("#linkRegister").hide();
        $("#linkListBooks").show();
        $("#linkCreateBook").show();
        $("#linkLogout").show();
    } else {
        $("#linkLogin").show();
        $("#linkRegister").show();
        $("#linkListBooks").hide();
        $("#linkCreateBook").hide();
        $("#linkLogout").hide();
    }
}

function showHomeView() {
    showView('viewHome');
}

function showLoginView() {
    showView('viewLogin');
}

function login() {
    let authBase64 = btoa(kinveyAppID + ":" + kinveyAppSecret);
    let loginUrl = kinveyServiceBaseUrl + "user/" + kinveyAppID + "/login";
    let loginData = {
        username: $("#loginUser").val(),
        password: $("#loginPass").val(),
    };
    $.ajax({
        method: "POST",
        url: loginUrl,
        data: loginData,
        headers: { "Authorization": "Basic " + authBase64},
        success: loginSuccess,
        error: showAjaxError
    });
    function loginSuccess(data, status) {
        sessionStorage.authToken = data._kmd.authtoken;
        showListBooksView();
        showHideNavigationLinks();
        showInfo("Login successfull");
    }
}

function showInfo(messageText) {
    $("#infoBox").text(messageText).show().delay(3000).fadeOut();
}

function showAjaxError(data, status) {
    let  errorMsg = "Error: " + JSON.stringify(data);
    $('#errorBox').text(errorMsg).show();
}


function showRegisterView() {
    showView('viewRegister');
}

function register() {
    
}

function showListBooksView() {
    showView('viewListBooks');
}

function showCreateBookView() {
    showView('viewCreateBook');
}

function createBook() {

}

function logout() {
    sessionStorage.clear();
    showHomeView();
    showHideNavigationLinks();
}

$(function () {
    $("#linkHome").click(showHomeView);
    $("#linkLogin").click(showLoginView);
    $("#linkRegister").click(showRegisterView);
    $("#linkListBooks").click(showListBooksView);
    $("#linkCreateBook").click(showCreateBookView);
    $("#linkLogout").click(logout);

    $("#buttonLogin").click(login);
    $("#buttonRegister").click(register);
    $("#buttonCreateBook").click(createBook);

    showHomeView();
    showHideNavigationLinks();
});