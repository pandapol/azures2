<!DOCTYPE html>
<html>
<head>
	<title>Submission Azure 2</title>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link rel="stylesheet" href="//cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
    <script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
</head>
<body style="margin: 0; overflow: hidden; background-image: url(bg.jpg); background-size: cover; background-color: #173f5f; color: white">
    <div id="uploadHeader">
        <h2 style="padding: 0.5em 1em 0.5em 1em; margin: 0;" >Azure Blob & Cognitive Service</h2>
        <div id="uploadDialog" title="Upload Gambar">
            <form action="/azureBlob.php" id="upload" method="post" enctype="multipart/form-data" style="width: 100%; display: inline-flex; align-items: center; justify-content: space-between;">
                <input type="hidden" name="action" value="upload">
                <input type="hidden" id="urlFormat" name="format" value="url">
                <b><a id="labelUrl"></a></b>
                <input type="file" id="imageUrl" name="imageUrl" size="30" required="true" accept=".jpeg,.jpg,.gif,.png,.bmp">
            </form>
        </div>
        <div id="dialogProgress" title="Upload Gambar">
            <div class="progressLabel">Mengupload gambar...</div>
            <div id="progressbar"></div>
        </div>
    </div>
    <div id="content" style="width:100%; height:100%;">
        <div id="mainHeader" style="width:100%;height: 100%">
        	<div style="width: 100%; height: 100%; display: inline-flex; align-items: center; padding: 5px 20px 5px 20px; border-bottom: 1px solid #acacac; border-top: 1px solid #acacac;">
                <a id="simpleButton" style="height: 50%;" class="addFileUrl"><b>Upload Gambar dari URL</b></a>&nbsp&nbsp&nbsp&nbsp
                <a id="simpleButton" style="height: 50%;" class="addFileLocal"><b>Upload Gambar dari Komputer</b></a><br>
            </div>
            <table id="tableImage">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Nama File</th>
                        <th>Tanggal Dimodifikasi</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
    <div id="dialogImage" title="Analisa Gambar" style="overflow: hidden;">
        <div class="view" style="display: none; width: 100%; height: 100%; flex-flow: column;">
            <div id="viewProgress" style="display: none; width: 100%; height: 20px;"></div>
            <div id="gambar" style="width: 100%; height: 100%; background-size: 100% 100%; background-repeat: no-repeat;"></div>
        </div>
        <div class="analyze" style="display: none; width: 100%; height: 100%; flex-flow: column;">
            <div id="analyzeProgress" style="display: none; width: 100%; height: 20px;"></div><br>
            <h4 id="fileName" style="margin: 0 0 10px 0"></h4>
            <div id="gambar" style="width: 100%; height: 100%; background-size: 100% 100%; background-repeat: no-repeat;"></div>
            <p id="analyzeResult" style="margin: 10px 0 0 0">Menganalisa gambar..</p>
        </div>
    </div>
    <script src="backend.js"></script>
</body>
<style type="text/css">
    .row {
        width: 100%;
        height: 100%;
    }

    #simpleButton {
        align-self: center;
        height: 1.2em;
        text-decoration: none;
        color: white;
        border-bottom: 1px dashed white;
        font-family: monospace;
        font-size: 1em;
        cursor: pointer;
    }

    table.dataTable tbody tr{
        background-color: unset;
    }

    #tableImage_info {
        color: unset;
        padding-left: 1em;
    }

    table.dataTable thead th, table.dataTable thead td, table.dataTable.no-footer{
        border-bottom: 1px solid #acacac;
    }

    #simpleButton:hover {
        border-bottom: 2px solid white;
    }

    #footerButton {
        align-self: center;
        height: 1.2em;
        text-decoration: none;
        color: #212121;
        border-bottom: 1px dashed #212121;
        font-family: monospace;
        font-size: 1em;
        cursor: pointer;
    }

    #footerButton:hover {
        border-bottom: 2px solid #212121;
    }

    hr {
        margin: 0;
    }
</style>
<footer style="display: flex; justify-content: center; align-content: center; overflow: hidden; margin: 0; position: absolute; bottom: 0; width: 100%; height: 3rem; border-top: 1px solid #acacac;">
    <a id="simpleButton" href="https://marfgold1.blogspot.com">About</a>&emsp;
    <a id="simpleButton" href="https://github.com/marfgold1/azures2">GitHub</a>
</footer>
</html>