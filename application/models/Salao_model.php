<?php

  class Salao_model extends CI_Model {

    public $nome;
    public $telefone;
    public $responsavel;
    public $salaovip_id;
    public $datacad;
    public $endereco;
    public $origem;
    public $latitude;
    public $longitude;
    public $numero;
    public $bairro;

    public function __construct(){
        parent::__construct();
    }

    public function getLatLngFROMsaloes(){
        $this->load->database();
        $sucesso = true;
        $erro = '001';

        $this->db->select('lat,lng');
        $this->db->from('informacao');
        $this->db->where('lat !=', '');
        $this->db->where('lng !=', '');
        $query = $this->db->get();
        if(count($query->result() == 0)){
            $sucesso = false;
        }

        return array($sucesso,$erro,$query->result());


    }


    public function getBasicInfos(){
        $this->load->database();
        $sucesso = true;
        $erro = '001';

        $this->db->select('endereco,lat,lng,info_id,nome,origem,marker');
        $this->db->from('informacao');
        $this->db->where('lat !=', '');
        $this->db->where('lng !=', '');
        $this->db->where('endereco !=', null);
        // $this->db->limit(300);
        $query = $this->db->get();
        if(count($query->result() == 0)){
            $sucesso = false;
        }

        return array($sucesso,$erro,$query->result());


    }

    public function saloesNearBy($latitude,$longitude){

        $sucesso = true;
        $erro = 001;

       if($latitude == null){

          $erro = 404;
          $sucesso = false;

          return array
          (
            $sucesso,
            $erro
          );
       }

       if($longitude == null){

         $erro = 404;
         $sucesso = false;

         return array
         (
          $sucesso,
          $erro
         );
       }

       $this->load->database();
      $sql = (          'SELECT
	*
FROM
	(
		SELECT
			*, 111.045 * DEGREES(
				ACOS(
					COS(RADIANS(latpoint)) * COS(RADIANS(lat)) * COS(
						RADIANS(longpoint) - RADIANS(lng)
					) + SIN(RADIANS(latpoint)) * SIN(RADIANS(lat))
				)
			) AS distance_in_km
		FROM
			informacao i
		JOIN (
			SELECT
				? AS latpoint,
				? AS longpoint,
				2 AS radius,
				111.045 AS distance_unit
		) AS p ON 1 = 1
		WHERE
			i.lat BETWEEN p.latpoint - (p.radius / p.distance_unit)
		AND p.latpoint + (p.radius / p.distance_unit)
		AND i.lng BETWEEN p.longpoint - (
			p.radius / (
				p.distance_unit * COS(RADIANS(p.latpoint))
			)
		)
		AND p.longpoint + (
			p.radius / (
				p.distance_unit * COS(RADIANS(p.latpoint))
			)
		)
		ORDER BY
			distance_in_km ASC
	) tb
WHERE
	tb.distance_in_km <= 3
ORDER BY
	tb.distance_in_km ASC'
           );


    $query = $this->db->query($sql,array($latitude,$longitude));

    if(count($query->result()) > 0 )
    {
      $sucesso = true;
      return array($sucesso,$erro,$query->result());
    }


}




    public function insert($salao){

      $this->load->database();

      if($salao['sistema'] == 'outros')
      {
        $salao['sistema'] = ".".$salao['sistema_outro'];
      }

      $this->db->set('nome', $salao['salaonome']);
      $this->db->set('endereco', $salao['endereco']);
      $this->db->set('numero' , $salao['numero']);
      $this->db->set('lat', $salao['latitude']);
      $this->db->set('lng', $salao['longitude']);
      $this->db->set('sistema', $salao['sistema']);
      $this->db->set('tel', $salao['telefone']);
      $this->db->set('cel', $salao['celular']);
      $this->db->set('responsavel', $salao['responsavel']);
      $this->db->set('url', $salao['url']);
      $this->db->set('origem', 'SalãoVIP');
      $this->db->set('marker', $salao['marker']);
      $this->db->set('bairro', $salao['bairro']);
      $this->db->set('cidade' , $salao['cidade']);
      $this->db->set('estado' , $salao['estado']);
      $this->db->set('cep' , $salao['cep']);
      // $this->db->set('estado' , $salao['estado']);
      $query = $this->db->insert('informacao');

        return $query;
    }


    public function update($salao){

      if($salao['sistema'] == 'outros')
      {
        $salao['sistema'] = ".".$salao['sistema_outro'];
      }

      $this->load->database();

      $this->db->set('nome', $salao['salaonome']);
      $this->db->set('endereco', $salao['endereco']);
      $this->db->set('numero' , $salao['numero']);
      $this->db->set('lat', $salao['latitude']);
      $this->db->set('lng', $salao['longitude']);
      $this->db->set('sistema', $salao['sistema']);
      $this->db->set('tel', $salao['telefone']);
      $this->db->set('cel', $salao['celular']);
      $this->db->set('responsavel', $salao['responsavel']);
      $this->db->set('url', $salao['url']);
      $this->db->set('origem', 'SalãoVIP');
      $this->db->set('marker', $salao['marker']);
      $this->db->set('bairro', $salao['bairro']);
      $this->db->set('cidade' , $salao['cidade']);
      $this->db->set('estado' , $salao['estado']);
      $this->db->set('cep' , $salao['cep']);
      $this->db->where('info_id', $salao['id_salao']);

      $query = $this->db->update('informacao');

      return $query;
    }

    public function getMarkerColor($sistema){

      $marker;


          switch ($sistema) {
            case 'svip':
              $marker = '/public/img/markers/svip.png';
              $sistema = 'SalãoVIP';
              return array(
                              "marker" => $marker,
                              "sistema" => $sistema
                          );
              break;
            case 'graces':
              $marker = '/public/img/markers/graces.png';
              $sistema = 'Graces';
              return array(
                              "marker" => $marker,
                              "sistema" => $sistema
                          );
            break;

            case 'teles':
              $marker = '/public/img/markers/telles.png';
              $sistema = 'Teles';
              return array(
                              "marker" => $marker,
                              "sistema" => $sistema
                          );
              break;

            case 'square':
              $marker = '/public/img/markers/square.png';
              $sistema = 'Square';
              return array(
                              "marker" => $marker,
                              "sistema" => $sistema
                          );
              break;

            case 'az':
              $marker = '/public/img/markers/az.png';
              $sistema = 'AZ';
              return array(
                              "marker" => $marker,
                              "sistema" => $sistema
                          );
              break;

            case 'bdate':
              $marker = '/public/img/markers/beautydate.png';
              $sistema = 'Beauty Date';
              return array(
                              "marker" => $marker,
                              "sistema" => $sistema
                          );
              break;

            case 'sa':
              $marker = '/public/img/markers/superagendador.png';
              $sistema = 'Super Agendador';
              return array(
                              "marker" => $marker,
                              "sistema" => $sistema
                          );
              break;

            case 'trinks':
            $marker = '/public/img/markers/trinks.png';
            $sistema = 'Trinks';
            return array(
                            "marker" => $marker,
                            "sistema" => $sistema
                        );
            break;

            case 'outros':
              $marker = '/public/img/markers/others.png';
              $sistema = "outros";
              return array(
                              "marker" => $marker,
                              "sistema" => $sistema
                          );
              break;

              case 'desconhecido':
                $marker = '/public/img/markers/desc.png';
                $sistema = 'Desconhecido';
                return array(
                                "marker" => $marker,
                                "sistema" => $sistema
                            );
                break;

            default:
                $marker = '/public/img/markers/desc.png';
                $sistema = 'Desconhecido';
                return array(
                                "marker" => $marker,
                                "sistema" => $sistema
                            );

              break;
        }
       return $marker;
    }

}
