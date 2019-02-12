API CALL FROM HERER:
<?php
$response = file_get_contents('http://localhost:3000/books/search/C');
echo '<pre />';
print_r($response);