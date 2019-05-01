<?php
	if($_SERVER["REQUEST_METHOD"] != "POST")
		exit;
	require_once "vendor/autoload.php";
	use MicrosoftAzure\Storage\Blob\BlobRestProxy;
	use MicrosoftAzure\Storage\Common\ServiceException;
	use MicrosoftAzure\Storage\Blob\Models\ListBlobsOptions;
	$connectionString = "DefaultEndpointsProtocol=https;AccountName=pandapolblob123;AccountKey=EqD99qP1p+CLpx52cyKZkHao/tT4/vOU2/V1F7/riM2C5kEnMABp3d9BP+WKbBF1GS1um9xT00aIWJGQOYdciA==;";
	$blobClient = BlobRestProxy::createBlobService($connectionString);
	$containerName = "pandapol123";
	if($_POST["action"] == "upload"){
		if($_POST["format"] == "url"){
			$fileToUpload = $_POST["imageUrl"];
        	$content = fopen($fileToUpload, "r");
        	if(!getimagesize($fileToUpload)){
				echo "File bukan merupakan gambar!";
				http_response_code(400);
				exit;
			}
        	$fileToUpload = basename(parse_url($fileToUpload)["path"]);
		} elseif ($_POST["format"] == "local"){
			$fileToUpload = basename($_FILES["imageUrl"]["name"]);
        	if(!getimagesize($_FILES["imageUrl"]["tmp_name"])){
				echo "File bukan merupakan gambar!";
				http_response_code(400);
				exit;
			}
			if(!move_uploaded_file($_FILES["imageUrl"]["tmp_name"], $fileToUpload)){
				echo "File gagal diupload!";
				http_response_code(500);
				exit;
			}
        	$content = fopen($fileToUpload, "r");
		} else {
			echo $_POST["format"];
			http_response_code(400);
			exit;
		}
        //Upload blob
        try{
        	$blobClient->createBlockBlob($containerName, $fileToUpload, $content);
        	echo "Berhasil!";
    		http_response_code(200);
    	} catch (ServiceException $e) {
    		$code = $e->getCode();
    		$error_message = $e->getMessage();
    		echo "Error! ".$e->getMessage()." (Code: ".$e->getCode().")";
	    	http_response_code(503);
	    	exit;
    	}
    	if ($_POST["format"] == "local"){
    		unlink($fileToUpload);
    	}
	} elseif ($_POST["action"] == "listblob") {
        $listBlobsOptions = new ListBlobsOptions();
        try{
        	if (!isset($blobs)) 
    			$blobs = new stdClass();
            $result = $blobClient->listBlobs($containerName, $listBlobsOptions);
            $allblob = $result->getBlobs();
        	$blobs->recordsTotal = count($result->getBlobs());
            $blobs->data = array();
            for($i=0; $i < $blobs->recordsTotal; $i++){
            	$bdata = array($i+1, $allblob[$i]->getName(), $allblob[$i]->getProperties()->getLastModified(), $allblob[$i]->getName());
            	array_push($blobs->data, $bdata);
            }
	    } catch (ServiceException $e) {
	    	$blobs->error = "Error! ".$e->getMessage()." (Code: ".$e->getCode().")";
	    	echo json_encode($blobs);
	    	exit;
	    }
	    echo json_encode($blobs);
	    error_log($blobs);
	}
?>
