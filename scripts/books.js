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
    let errorMsg = ' ';
    if(typeof(data.readyState) != 'undefined' && data.readyState == 0)
        errorMsg = "Network error.";
        else if(data.responseJSON && data.responseJSON.description)
            errorMsg = data.responseJSON.description;
    else
    errorMsg = "Error: " + JSON.stringify(data);
    $('#errorBox').text(errorMsg).show();
}


function showRegisterView() {
    showView('viewRegister');
}

function register() {
    let authBase64 = btoa(kinveyAppID + ":" + kinveyAppSecret);
    let loginUrl = kinveyServiceBaseUrl + "user/" + kinveyAppID + "/";
    let loginData = {
        username: $("#registerUser").val(),
        password: $("#registerPass").val(),
    };
    $.ajax({
        method: "POST",
        url: loginUrl,
        data: loginData,
        headers: { "Authorization": "Basic " + authBase64},
        success: registerSuccess,
        error: showAjaxError
    });
    function registerSuccess(data, status) {
        sessionStorage.authToken = data._kmd.authtoken;
        showListBooksView();
        showHideNavigationLinks();
        showInfo("User registered successfully.");
    }
    
}

function showListBooksView() {
    showView('viewListBooks');
    $("#books").text('Loading...');

    let booksUrl = kinveyServiceBaseUrl + "appdata/" + kinveyAppID + "/SpareIdeas";
    let authHeaders = {
        "Authorization": "Kinvey " + sessionStorage.authToken
    };
    $.ajax({
        method: "GET",
        url: booksUrl,
        headers: authHeaders,
        success: ideasLoaded,
        error: showAjaxError
    });
    function ideasLoaded(books, status) {
        showInfo("Ideas Loaded.");
        $("#books").text('');
        let ideasTable = $("<table>")
            .append($("<tr>")
                .append($('<th>Title</th>'))
                .append($('<th>Author</th>'))
                .append($('<th>Description</th>'))
            );
        for (let book of books){
            ideasTable.append($("<tr>")
                    .append($('<td></td>').text(book.title))
                    .append($('<td></td>').text(book.author))
                    .append($('<td></td>').text(book.description))

                );
        }
        $("#books").append(ideasTable);
    }
}

function showCreateBookView() {
    showView('viewCreateBook');
}

function createBook() {
    let booksUrl = kinveyServiceBaseUrl + "appdata/" + kinveyAppID + "/SpareIdeas";
    let authHeaders = {
        "Authorization": "Kinvey " + sessionStorage.authToken,
        "Content-Type": "application/json"
    };
    let ideaShared = {
        title: $("#bookTitle").val(),
        author: $("#bookAuthor").val(),
        description: $("#bookDescription").val()
    };
    $.ajax({
        method: "POST",
        url: booksUrl,
        data: JSON.stringify(ideaShared),
        headers: authHeaders,
        success: ideaSaved,
        error: showAjaxError
    });
    
    function ideaSaved(data) {
        showListBooksView();
        showInfo("Idea shared.");
    }
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

    $("#formLogin").submit(function(e){e.preventDefault(); login()});
    $("#formRegister").submit(function(e){e.preventDefault(); register()});
    $("#formCreateBook").submit(function(e){e.preventDefault(); createBook()});

    showHomeView();
    showHideNavigationLinks();

    $(document)
        .ajaxStart(function () {
            $("#loadingBox").show();
        })
        .ajaxStop(function () {
            $("#loadingBox").hide();
        });
});