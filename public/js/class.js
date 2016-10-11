var infoWindow = function() {
    var _self = this;
    var infoWindow;

    _self.setConteudo = function(conteudo) {
        _self.conteudo.setContent(conteudo);
    }
    _self.createInfoWindow = function() {
        _self.infoWindow = new google.maps.InfoWindow();
        return _self.infoWindow;
    }
}

// FIM CLASSE INFO WINDOW

var Marker = function(markerLocation, newtitle) {

    this.location = markerLocation;
    this.title = newtitle;
    var _self = this;
    var icon;
    var marker;


    _self.setLocation = function(location) {
        _self.location = location;
        return _self.location;
    }

    _self.getLocation = function() {
        return _self.location;
    }

    _self.setTitle = function(newtitle) {
        _self.title = newtitle;
        return _self.title;
    }

    _self.getTitle = function() {
        return _self.title;
    }

    _self.setIcon = function(iconType) {
        _self.icon = iconType;
    }

    _self.getIcon = function() {
        return _self.icon;
    }

    _self.createMarker = function(mapa) {
        _self.marker = new google.maps.Marker({
            map: mapa,
            icon: icon,
            position: _self.location,
            title: _self.title
        });
        return _self.marker;
    }

}
