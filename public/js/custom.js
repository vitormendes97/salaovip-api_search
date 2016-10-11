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

        getSaloesGoogleAPI(lat, lng);
        saloesNearBy(lat, lng);

        // getSaloesClientes();


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
    // Variável de Controle na rotina InputContent
    var content_type;

    $.ajax({
        type: "GET",
        url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + long + '&radius=2300&types=beauty_salon&key=AIzaSyAuvuPcBcajGcY01Yb8-JAKrRFhOslaoQk',
        success: function(saloes) {

            for (var i = 0; i < saloes.results.length; i++) {
                var salao = saloes.results[i];
                // saloesLatLng.push(saloes.results[i]);
                latitude = Number(saloes.results[i].geometry.location.lat);
                longitude = Number(saloes.results[i].geometry.location.lng);
                var myLatLng = {
                    lat: latitude,
                    lng: longitude
                };

                content_type = Object.keys(salao)[3];

                marker = new Marker(myLatLng, 'Google');
                marker = marker.createMarker(map);

                marker.setIcon( base_url('public/img/markers/desc.png'));

                var infowindow = new infoWindow();
                infowindow = infowindow.createInfoWindow();

                // var content = '<p style:font-size:20px;>' + salao.name + '</p>' + '<br>' + 'Origem : Google';
                var content = '<div><strong>' + salao.name + '</strong>' + '<p>' + salao.vicinity + '</p> <p>Origem Google</p>';
                createWindow(marker, infowindow, content);

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
            // console.log(saloes);
            for (var i = 0; i < saloes.length; i++) {
                var salao = saloes[i];
                console.log(base_url(salao.marker));

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
                createWindow(marker, infowindow, content);

            }
        }

    });
}

function saloesNearBy(lat, lng) {

    var saloes;
    var marker;
    var content_type;
    $.ajax({
        type: "GET",
        data: {
            latitude: lat,
            longitude: lng
        },
        url: base_url("home/saloes/nearby"),
        success: function(data) {

            var saloes = JSON.parse(data);
            // console.log(saloes);
            for (var i = 0; i < saloes.length; i++) {
                var salao = saloes[i];

                var myLatLng = {
                    lat: Number(salao.lat),
                    lng: Number(salao.lng)
                };

                 content_type = Object.keys(salao)[1];

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

    // if(typeof($("#sistema [value='"+salao.sistema.charAt(0)+"']")) === "." ){
    if(salao.sistema.charAt(0) === '.'){

      // $('#sistema').removeAttr('selected');
      // $('#sistema_outro').css('display','block');
      // $('#sistema_outro').css('margin-left','5px');
      // $('#btn-submit').css('margin-top','20px');
      // $("#sistema [value='outros']").attr('selected','selected');
      // $('#sistema_outro').val(salao.sistema);
      // $('#btn-submit').addClass("btn-submir-behavior");

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
