<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Api extends CI_Controller {



  public function __construct()
        {
                //Construct it's parent
            parent::__construct();

    }


	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */
	public function main()
	{
		$this->load->model('Salao_model');

		list($sucesso,$erro,$s) = $this->Salao_model->getLatLngFROMsaloes();

		$salaoJson = array();
		$salaoJson['saloes'] = $s;

		echo json_encode($salaoJson);

	}

	public function BasicInfoSalaoDB()
	{
    	$this->load->model('Salao_model');

    	list($sucesso,$erro,$saloes) = $this->Salao_model->getBasicInfos();

		$salaoJson = array();
		$salaoJson['saloes'] = $saloes;

    	echo json_encode($salaoJson['saloes']);
	}

  public function Nearby()
  {

    $this->load->model('Salao_model');
    $latitude = $this->input->get('latitude');
    $longitude = $this->input->get('longitude');

    list($sucesso,$erro,$saloes) = $this->Salao_model->saloesNearBy($latitude,$longitude);

    $salaoJson = array();
    $salaoJson['saloes'] = $saloes;
    $salaoJson['sucesso'] = $sucesso;
    $salaoJson['erro'] = $erro;
      
    echo json_encode($salaoJson['saloes'], JSON_UNESCAPED_UNICODE);


  }
}