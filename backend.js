var dialog, form, dialogProgress, progressbar, dialogImage, progressLabel, datas, viewProgress, analyzeProgress;
var blobs = [];
$(function(){
    dialog = $("#uploadDialog").dialog({
        autoOpen: false,
        modal: true,
        height: 150,
        width: 400,
        resizable: false,
        draggable: false,
        buttons: {
            "Upload Image": uploadImage,
            Cancel: function(){
                dialog.dialog("close")
            }
        }
    });
    dialogProgress = $("#dialogProgress").dialog({
        autoOpen: false,
        closeOnEscape: false,
        modal: true,
        resizable: false,
        draggable: false,
        buttons: {}
    });
    dialogImage = $("#dialogImage").dialog({
        autoOpen: false,
        modal: true,
        height: 500,
        width: 500,
        closeOnEscape: false,
        buttons:{
            Tutup: function(){
                dialogImage.dialog("close");
                currentClass.css("display", "none");
            }
        }
    });
    progressLabel = $('.progressLabel');
    progressbar = $("#progressbar").progressbar({
        value: false,
        complete: function(){
            dialogProgress.dialog("option", "buttons", {
                Tutup: function(){
                    dialogProgress.dialog("close")
                }
            });
        }
    });
    viewProgress = $("#viewProgress").progressbar({
        value: false,
        complete: function(){
            viewProgress.css("display", "none");
            dialogImage.dialog("option", "buttons", {
                Tutup: function(){
                    dialogImage.dialog("close")
                }
            });
        }
    });
    analyzeProgress = $("#analyzeProgress").progressbar({
        value: false,
        complete: function(){
            analyzeProgress.css("display", "none");
            dialogImage.dialog("option", "buttons", {
                Tutup: function(){dialogImage.dialog("close")}
            });
        }
    });
    form = dialog.find("form");
    $(".addFileUrl").on("click", function() {
        dialog.dialog("open");
        form.find("#labelUrl").html("URL");
        form.find("#imageUrl").prop("type", "url");
        form.find("#urlFormat").val("url");
    });
    $(".addFileLocal").on("click", function() {
        dialog.dialog("open");
        form.find("#labelUrl").html("File");
        form.find("#imageUrl").prop("type", "file");
        form.find("#urlFormat").val("local");
    });
});

function uploadImage(){
    dialog.dialog("close");
    dialogProgress.dialog("option", "buttons", {});
    progressLabel.text("Mengupload gambar...");
    progressbar.progressbar("value", false);
    var fdatas = new FormData(form[0]);
    dialogProgress.dialog("open");
    $.ajax({
        url: 'azureBlob.php',
        type: 'POST',
        data: fdatas,
        processData: false,
        contentType: false
    }).done(function(data, statusText, xhr){
        progressbar.progressbar("value", 100);
        progressLabel.text(data);
        if(xhr.status == 200)
            loadBlobList();
    }).fail(function(xhr, status, error){
        progressbar.progressbar("value", 100);
        progressLabel.text('Error! ' + xhr.responseText + ' (Kode: ' + xhr.status + ')');
    });
}

const container = "https://marfgold1.blob.core.windows.net/images/";
var currentClass, imageView;
function viewImage(blobIdx){
    var imgurl = container + blobs[blobIdx];
    $("#ui-id-3").text("Lihat Gambar");
    dialogImage.dialog("option", "buttons", {});
    viewProgress.css("display", "unset");
    viewProgress.progressbar("value", false);
    if(currentClass!=null)
        currentClass.css("display", "none");
    currentClass = dialogImage.find(".view");
    imageView = currentClass.find("#gambar");
    imageView.css("visible", "none");
    $('<img/>').attr('src', imgurl).on('load', function() {
        $(this).remove();
        imageView.css("background-image", "url('" + imgurl + "')");
        viewProgress.progressbar("value", 100);
        imageView.css("visible", "unset");
    });
    currentClass.css("display", "flex");
    dialogImage.dialog("open");
}

var analyzeResult;
function analyzeImage(blobIdx){
    var imgurl = container + blobs[blobIdx];
    $("#ui-id-3").text("Analisa Gambar");
    dialogImage.dialog("option", "buttons", {});
    analyzeProgress.css("display", "flex");
    analyzeProgress.progressbar("value", false);
    if(currentClass!=null)
        currentClass.css("display", "none");
    currentClass = dialogImage.find(".analyze");
    imageView = currentClass.find("#gambar");
    imageView.css("visible", "none");
    currentClass.find("#fileName").text("Analisa untuk gambar " + blobs[blobIdx]);
    analyzeResult = currentClass.find("#analyzeResult");
    analyzeResult.text("Menganalisa gambar...");
    $('<img/>').attr('src', imgurl).on('load', function() {
        $(this).remove();
        imageView.css("background-image", "url('" + imgurl + "')");
        imageView.css("visible", "unset");
        analisaGambar(imgurl);
    });
    currentClass.css("display", "flex");
    dialogImage.dialog("open");
}

function analisaGambar(urlPath){
    var subscriptionKey = "bd4f483114c3415ea81a9f17b840ad90";
    var uriBase = "https://southeastasia.api.cognitive.microsoft.com/vision/v2.0/analyze";
    var sourceImageUrl = urlPath;
    var params = {
        "visualFeatures": "Description",
        "details": "",
        "language": "en",
    };

    // Make the REST API call.
    $.ajax({
        url: uriBase + "?" + $.param(params),

        // Request headers.
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader(
                "Ocp-Apim-Subscription-Key", subscriptionKey);
        },

        type: "POST",

        // Request body.
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })

    .done(function(data) {
        if(data.description.captions.length > 0)
            analyzeResult.text(data.description.captions[0].text);
        else
            analyzeResult.text("Tidak ada hasil analisa yang tersedia.");
        analyzeProgress.progressbar("value", 100);
    })

    .fail(function(jqXHR, textStatus, errorThrown) {
        var errorString = (errorThrown === "") ? "Error. " :
        errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" :
        jQuery.parseJSON(jqXHR.responseText).message;
        analyzeResult.text(errorString + "\n\nAsk web administrator for fix.");
        analyzeProgress.progressbar("value", 100);
    });
}

function loadBlobList(){
    blobs = [];
    datas.ajax.reload(null, false);
}

var months = new Array("Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember");
var days = new Array("Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu");
window.onload = function(){
    /*datas = $("#tableImage").DataTable({
        paging: false,
        searching: false,
        columnDefs: [
            {
                targets: -2,
                render: function ( data, type, row, meta ) {
                    var tgl = new Date(data.date);
                    return days[tgl.getDay()] + ", " + tgl.getDate()+ " " + months[tgl.getMonth()] + " " + tgl.getFullYear();
                }
            },
            {   
                targets: -1,
                render: function ( data, type, row, meta ) {
                    return '<div style="width:100%; height:100%; display: inline-flex; justify-content: center;"><a onclick="analyzeImage(\'' + data + '\')" id="simpleButton">Analisa</a>&emsp;<a onclick="viewImage(\'' + data + '\')" id="simpleButton">Lihat Gambar</a>&emsp;<a onclick="viewImage(\'' + data + '\')" id="simpleButton">Ubah</a></div>';
                }
            }
        ],
        data: [[1,"02-cat-training-NationalGeographic_1484324.jpg",{"date":"2019-04-04 08:20:13.000000","timezone_type":2,"timezone":"GMT"},"https:\/\/marfgold1.blob.core.windows.net\/images\/02-cat-training-NationalGeographic_1484324.jpg"],[2,"5 - Screenshot webapp.JPG",{"date":"2019-04-04 08:18:06.000000","timezone_type":2,"timezone":"GMT"},"https:\/\/marfgold1.blob.core.windows.net\/images\/5 - Screenshot webapp.JPG"]]
    });*/
    datas = $("#tableImage").DataTable({
        paging: false,
        searching: false,
        ajax: {
            url: 'azureBlob.php',
            type: 'POST',
            data: {action: 'listblob'}
        },
        columnDefs: [
            {
                targets: -2,
                render: function ( data, type, row, meta ) {
                    var tgl = new Date(data.date);
                    return days[tgl.getDay()] + ", " + tgl.getDate()+ " " + months[tgl.getMonth()] + " " + tgl.getFullYear();
                }
            },
            {   
                targets: -1,
                render: function ( data, type, row, meta ) {
                    blobs.push(data);
                    var idx = blobs.length-1;
                    return '<div style="width:100%; height:100%; display: inline-flex; justify-content: center;"><a onclick="analyzeImage(' + idx + ')" id="simpleButton">Analisa</a>&emsp;<a onclick="viewImage(' + idx + ')" id="simpleButton">Lihat Gambar</a></div>';
                }
            }
        ]
    });
};