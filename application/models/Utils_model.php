<?php

class Utils_model extends CI_Model {
    
        public function __construct(){
            parent::__construct();
        }
    
        public function encode_array_utf8($array){
            foreach ($array as $key => $value) {
                utf8_encode($key);
            }

            return $array;
        }
    }
