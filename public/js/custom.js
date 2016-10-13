//Variável global
//Coordenadas do SalãoVIP
var LatLng = {
    lat: -23.559576,
    lng: -46.653085
};
// latitude e longitude vindas do google maps.
var lat;
var lng;
//Mapa global
var map;
//Marker que está posicionado ao abrir o mapa
var markerInicial;


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: LatLng,
        zoom: 13
    });

    //Criando marker inicial (Originalmente setado coordenadas do SalãoVIP)
    markerInicial = new Marker(LatLng, 'SalãoVIP');
    markerInicial = markerInicial.createMarker(map);
    markerInicial.setIcon(base_url('public/img/markers/neutro.png'));
    //Criando janela ao clicar no marker
    var infowindow = new infoWindow();
    infowindow = infowindow.createInfoWindow();
    infowindow.setContent('Base SalãoVIP');





    var input = /** @type {!HTMLInputElement} */ (
        document.getElementById('pac-input'));

    var types = document.getElementById('type-selector');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    // Marker que vai aparecer quando for setado o endereço
    var marker = new google.maps.Marker({
        map: map,
        title: "SalaoVIP",
        anchorPoint: new google.maps.Point(0, -29),
    });
    autocomplete.addListener('place_changed', function() {

        var place = autocomplete.getPlace();

        lat = place.geometry.location.lat(function(lat) {});
        lng = place.geometry.location.lng(function(lng) {});

        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }


        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(20);

        }
        // Marker que vai aparecer quando for setado o endereço
        //URL : Usado para setar o icone do marker
        marker.setIcon( /** @type {google.maps.Icon} */ ({
            url: base_url('public/img/markers/neutro.png'),
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }));
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong>' + '<p>' + address + '</p> <p>Origem Google</p>');
        infowindow.open(map, marker);


        saloesNearBy(lat, lng);
        getSaloesGoogleAPI(lat, lng);

    });

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    function setupClickListener(id, types) {
        var radioButton = document.getElementById(id);
        radioButton.addEventListener('click', function() {
        autocomplete.setTypes(types);
        });
    }

    setupClickListener('changetype-all', []);
    setupClickListener('changetype-address', ['address']);
    setupClickListener('changetype-establishment', ['establishment']);
    setupClickListener('changetype-geocode', ['geocode']);





}

//=============================================================================================================================================================


function getSaloesGoogleAPI(lat, long) {
    //Retorna de acordo com uma geolocalização determinada por input todos os salões num raio de 5km.
    var marker;


    $.ajax({
        type: "GET",
        url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + long + '&radius=2000&types=beauty_salon&key=AIzaSyAuvuPcBcajGcY01Yb8-JAKrRFhOslaoQk',
        success: function(saloes) {

            for (var i = 0; i < saloes.results.length; i++) {
                var salao = saloes.results[i];

                // latitude = Number(saloes.results[i].geometry.location.lat);
                // longitude = Number(saloes.results[i].geometry.location.lng);


                salao = padronizarSaloesGoogle(salao);

                var myLatLng = {
                    lat: salao[0].lat,
                    lng: salao[0].lng
                };

                marker = new Marker(myLatLng, 'Google');
                checarDuplicados(marker,map,salao);

            }


        }

    });
}

function getSaloesClientes() {
    //Busca  endereço, latitude e longitude dos clientes cadastrados na DB.
    var saloes;
    var marker;





    $.ajax({
        type: "GET",
        url: base_url("home/saloes/basicinfo"),
        success: function(data) {

            var saloes = JSON.parse(data);

            for (var i = 0; i < saloes.length; i++) {
                var salao = saloes[i];


                var myLatLng = {
                    lat: Number(salao.lat),
                    lng: Number(salao.lng)
                };

                var infowindow = new infoWindow();
                infowindow = infowindow.createInfoWindow();


                marker = new Marker(myLatLng, 'SalãoVIP');
                marker = marker.createMarker(map);
                marker.setIcon(salao.marker);

                var content = '<div><strong>' + salao.nome + '</strong>' + '<p>' + salao.endereco + '</p> <p> Origem : ' + salao.origem + '</p>'
                    // var content = '<p style:font-size:20px;>' + salao.nome + '</p>' + '<br>' + 'Origem : ' + salao.origem;
                createWindow(marker, infowindow, content,salao);

            }
        }

    });
}

function saloesNearBy(lat, lng) {

    var saloes;
    var marker;

    $.ajax({
        type: "GET",
        data: {
            latitude: lat,
            longitude: lng
        },
        url: base_url("home/saloes/nearby"),
        success: function(data) {

            var saloes = JSON.parse(data);

            for (var i = 0; i < saloes.length; i++) {
                var salao = saloes[i];

                var myLatLng = {
                    lat: Number(salao.lat),
                    lng: Number(salao.lng)
                };

                var infowindow = new infoWindow();
                infowindow = infowindow.createInfoWindow();


                var marker = new Marker(myLatLng, 'SalãoVIP');
                marker = marker.createMarker(map);
                marker.setIcon(base_url(salao.marker));

                if(salao.endereco === null){
                  salao.endereco = 'Endereço não especificado';
                }

                var content = '<div><strong>' + salao.nome + '</strong>' + '<p>' + salao.endereco + '</p> <p> Origem : ' + salao.origem + '</p>'
                    // var content = '<p style:font-size:20px;>' + salao.nome + '</p>' + '<br>' + 'Origem : ' + salao.origem;
                createWindow(marker, infowindow, content, salao);

            }

        }


    });

}


// Essa função ativa o evento de clicar em um infowindow e junto com ela , pega todos os attributos
// do salao que vem como parâmetro e passa para a função setInputContent.
function createWindow(marker, infowindow, content,salao) {

    google.maps.event.addListener(marker, 'click', function() {

        infowindow.setContent(content);
        infowindow.open(this.getMap(), marker);
        setInputContent(salao);

        $('#btn-submit').val('Atualizar');
        $('input[name=id_salao]').val(salao.info_id);
    });

}

function setInputContent(salao){

    $('#id_salao').val(salao.info_id);
    $('input[name=salaonome]').val(salao.nome);
    $('input[name=endereco]').val(salao.endereco);
    $('input[name=numero]').val(salao.numero);
    $('input[name=estado]').val(salao.estado);
    $('input[name=bairro]').val(salao.bairro);
    $('input[name=cidade]').val(salao.cidade);
    $('input[name=latitude]').val(salao.lat);
    $('input[name=longitude]').val(salao.lng);
    $('input[name=responsavel]').val(salao.responsavel);
    $('input[name=url]').val(salao.url);
    $('input[name=telefone]').val(salao.tel);
    $('input[name=celular]').val(salao.cel);
    $('input[name=cep]').val(salao.cep);


    if(salao.sistema.charAt(0) === '.'){

      $('#sistema').val('outros');
      teste();
      var sistema = salao.sistema.length;
      sistema = salao.sistema.substring(1,sistema);
      $('#sistema_outro').val(sistema);
    }
    else{

      $("#sistema option:contains("+salao.sistema+")").removeAttr('selected','selected');
      $("#sistema option:contains("+salao.sistema+")").attr('selected','selected');
      $('#sistema_outro').css('display','none');
      $('#btn-submit').removeClass("btn-submir-behavior");
      $('#limpar-form').removeClass("btn-limpar-behavior");

    }

}

function reload(){
  location.reload();
}


function padronizarSaloesGoogle(salao_google){

    var endereco = salao_google.vicinity.split(",")[0];
    var numero_etapa1 = salao_google.vicinity.split(",")[1];
    var numero;
    var bairro;
    var cidade = salao_google.vicinity.split(",")[2];
    var saloes  = [];

    try{

        numero = numero_etapa1.split("-")[0];
        bairro = numero_etapa1.split("-")[1];
    }
    catch(err){
        numero = numero_etapa1;

    }

    var salao =  {
        "id" : "google",
        "endereco" : endereco,
        "numero" : numero,
        "bairro" : bairro,
        "cidade" : cidade,
        "lat" : Number(salao_google.geometry.location.lat),
        "lng" : Number(salao_google.geometry.location.lng),
        "nome" : salao_google.name,
        "origem" : "Google",
        "marker" : "/public/img/markers/desc.png",
        "cep" : "",
        "responsavel" : "",
        "tel" : "",
        "cel" : "" ,
        "sistema" : "Desconhecido",
        "full_address" : salao_google.vicinity

    };


    saloes.push(salao);

    return saloes; //Sempre vai retornar um array na posição 0 pois sempre que passa pelo método ele instancia um var saloes novo. (Refatorar isso)

}

  // Essa função compara as lats e lngs do google e do banco. Se houver informação igual entre ambos, a informação do google é excluida
function checarDuplicados(marker,map,salao){

  if( map.getBounds().contains(marker.getLocation())){
      marker = null;
      salao = null;

  }
  else{

    marker = marker.createMarker(map);
    marker.setIcon( base_url(salao[0].marker));

    var infowindow = new infoWindow();
    infowindow = infowindow.createInfoWindow();

    var content = '<div><strong>' + salao[0].nome + '</strong>' + '<p>' + salao[0].full_address + '</p> <p>Origem Google</p>';
    createWindow(marker, infowindow, content,salao[0]);
  }

}
