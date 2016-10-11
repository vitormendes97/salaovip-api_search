function teste(){
  var value = $('#sistema').val();
  if(value==="outros"){
    $('#sistema_outro').css('display','block');
    $('#sistema_outro').css('margin-left','5px');
    $('#btn-submit').addClass("btn-submir-behavior");
    $('#limpar-form').addClass("btn-limpar-behavior");
  }
  else{
    $('#limpar-form').removeClass("btn-limpar-behavior");
    $('#sistema_outro').css('display','none');
    $('#btn-submit').removeClass("btn-submir-behavior");
  }
}
