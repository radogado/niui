<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<?php 

// Flood protection

	session_start();
	if(isset($_SESSION['ip']) && $_SESSION['last_post'] + 9 > time()) die('too early ---error---');
	
	$_SESSION['last_post'] = time();
	$_SESSION['ip'] = $_SERVER['REMOTE_ADDR'];

// Original code from http://www.phpmind.com/blog/author/admin/

	// Initialize the $query_string variable for later use
	$query_string = "";
	// If there are POST variables
	if ($_POST) {

		// Initialize the $kv array for later use
		$kv = array();
	
		// For each POST variable as $name_of_input_field => $value_of_input_field
		foreach ($_POST as $key => $value) {
	
			$key = str_replace('_', '.', $key); // Fix field names containing "."
	
			//Set array element for each POST variable
			$kv[] = stripslashes($key)."=". stripslashes($value);
	
		}
	
		//	Create a query string with join function separted by &
		$query_string = join("&", $kv);
		
	}

	$split_query = split('&targetformurl=', $query_string, 2); // Separate form data from form URI
	
	$url = str_replace("&","&amp;",$split_query[1]); // Fix URI containing "&"
	
	//Check to see if cURL is installed ...
	if (!function_exists('curl_init')){
		die('Sorry cURL is not installed!');
	}
	
	//Open cURL connection
	$ch = curl_init();

	//Set the url, number of POST vars, POST data
	curl_setopt($ch, CURLOPT_URL, urldecode($url) );
	curl_setopt($ch, CURLOPT_POST, count($kv) );
	curl_setopt($ch, CURLOPT_POSTFIELDS, str_replace('%3D','=',urlencode($split_query[0])) );
	
	//Set some settings that make it all work  
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, array( 'Content-Type: application/x-www-form-urlencoded; charset=utf-8', ));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, FALSE);
	// curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
	
	//Execute PHP cURL
	$result = curl_exec($ch);
	$err = curl_error($ch);

	//close cURL connection
	curl_close($ch);

	if($result === false) {

	    echo '---error---';

	} else {
		
		echo $result;
		
	}

?>
