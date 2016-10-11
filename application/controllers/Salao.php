<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Salao extends CI_Controller {



  public function __construct()
    {
      parent::__construct();
    }

  public function cadastrar()
    {

      $success;
      $salao = array();
      $this->load->model('Salao_model');


      if(strlen($_POST['salaonome']) == 0)
      {
        $success = 204;
        $salao['response'] = $success;
        $this->load->view('/errors/response.php',$salao);
        return;
      }

      $salaoCp =  $this->Salao_model->getMarkerColor($this->input->post('sistema'));
      $salao = $_POST;
      $salao['marker'] = $salaoCp['marker'];
      $salao['sistema'] = $salaoCp['sistema'];

      if($_POST['id_salao'] != null){
        $success = $this->Salao_model->update($salao);
      }
      else{
        $success = $this->Salao_model->insert($salao);
      }

      $salao['response'] = $success;
      $this->load->view('/errors/response.php',$salao);
  }

}
