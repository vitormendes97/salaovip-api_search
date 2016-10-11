<!DOCTYPE html>
<html>
   <body>
      <div class="row">
        <input id="pac-input" class="controls" type="text"
         placeholder="Digite um endereço">
     <div id="type-selector" class="controls">
       <label for="changetype-all">Todos</label>
       <input type="radio" name="type" id="changetype-all" checked="checked">


       <input type="radio" name="type" id="changetype-establishment">
       <label for="changetype-establishment">Estabelecimentos</label>


       <input type="radio" name="type" id="changetype-address">
       <label for="changetype-address">Endereços</label>

     </div>

         <div class="col-md-6" style="padding:0px;position: relative;overflow: hidden;">
            <div id="map" style="height: 100%; position: relative;">
               </div>


            <div class="col-md-12" id="systems_colors" style="
               position: absolute;
               background: #fff;
               bottom: 0px;
               box-shadow: 0px 0px 4px #000;
               padding: 10px 20px;
               width: 100%;
               left:0px;
               ">
               <ul class="legenda">
                  <li><span class="boxL" style="background: #c5a154;"></span>SalãoVIP</li>
                  <li style="color:#;"><span class="boxL" style="background: red;"></span>Graces</li>
                  <li><span class="boxL" style="background: #ffff00;"></span>Teles</li>
                  <li><span class="boxL" style="background: #ffff66;"></span>Square</li>
                  <li><span class="boxL" style="background: #336699;"></span>AZ</li>
                  <li><span class="boxL" style="background: #33ccff;"></span>Beauty Date</li>
                  <li><span class="boxL" style="background: #00cc66;"></span>Super Agendador</li>
                  <li><span class="boxL" style="background: #ff0066;"></span>Trinks</li>
                  <li><span class="boxL" style="background: black;"></span>Outros Sistemas</li>
                  <li><span class="boxL" style="background: gray;"></span>Desconhecidos</li>
               </ul>
            </div>
         </div>
         <div class="col-md-6 content">
            <h1>Cadastro de Salões</h1>
            <hr>
            <form action="<?php echo base_url('salao/cadastrar') ?>" method="post">
               <div class="col-md-6">
                  <div class="input-group input-left">
                     <div class="input-group-btn">
                     </div>
                     <label for="salaonome">Nome do Salão</label>
                     <input type="text" name="salaonome" class="form-control" aria-label="...">
                     <br><br><br><br>
                     <label for="endereco">Endereço</label>
                     <input type="text" name="endereco" class="form-control" aria-label="...">
                     <br><br><br><br>
                     <label for="numero">Número do estabelecimento</label>
                     <input type="text" name="numero" class="form-control" aria-label="...">
                     <br><br><br><br>
                     <label for="bairro">Bairro</label>
                     <input type="text" name="bairro" class="form-control" aria-label="...">
                     <br><br><br><br>
                     <label for="telefone">Telefone</label>
                     <input type="text" class="form-control" name="telefone" aria-label="..." style="width:100%;">
                     <br><br><br><br>
                     <label for="latitude">Latitude</label>
                     <input type="text" class="form-control" name="latitude" aria-label="..." style="width:100%;margin-top:10px;">
                     <br><br><br><br>
                     <select name="sistema" onchange="teste()" id="sistema" style="margin-left:-14px;">
                        <option value="#">Sistema</option>
                        <option value="svip">SalãoVIP</option>
                        <option value="graces">Graces</option>
                        <option value="teles">Teles</option>
                        <option value="square">Square</option>
                        <option value="az">AZ</option>
                        <option value="bdate">Beauty Date</option>
                        <option value="sa">Super Agendador</option>
                        <option value="trinks">Trinks</option>
                        <option value="outros">Outros</option>
                        <option value="desconhecido">Desconhecido</option>
                     </select>
                     <br><br>
                     <input type="text" placeholder="Digite aqui o sistema" class="form-control" aria-label="..." name="sistema_outro" id="sistema_outro">
                  </div>
                  <input type="submit" value="Cadastrar" id="btn-submit" style="margin-left:93px;">
               </div>
               <div class="col-md-6 input-right" style="width:296.67px;height:460px;">
                  <label for="responsavel">Responsável</label>
                  <input type="text" name="responsavel" class="form-control" aria-label="...">
                  <br>
                  <label for="cep">Cep</label>
                  <input type="text" class="form-control" name="cep" arial-label="..." style="width:100%;margin-top:3px;">
                  <br>
                  <label for="cidade">Cidade</label>
                  <input type="text" name="cidade" class="form-control" aria-label="...">
                  <br>
                  <label for="estado">Estado</label>
                  <input type="text" name="estado" class="form-control" aria-label="..." placeholder="Ex : SP, RJ , PR">
                  <br>
                  <label for="celular">Celular</label>
                  <input type="text" class="form-control" name="celular" aria-label="..." style="width:100%;margin-top:3px;">
                  <br>
                  <label for="longitude">Longitude</label>
                  <input type="text" class="form-control" name="longitude" aria-label="..." style="width:100%;margin-top:5px;">
                  <br><br><br>
                  <label for="url" style="position:relative; bottom:44px;">URL</label>
                  <input type="text" name="url" class="form-control" aria-label="..." placeholder="http://site.com.br" style="position:relative; bottom:41px;">
                  <button type="button" onclick="reload()" id="limpar-form" style="padding:10px;"><i class="fa fa-retweet" aria-hidden="true" style="padding-right:4px;"></i>Limpar</button>
               </div>
               <input type="hidden" name="id_salao">
               <div class="row">
               </div>
            </form>
         </div>
      </div>
      <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAqFOCPC6PPodbDty4fT0X9zSyyPL6OEcM&signed_in=true&libraries=places&callback=initMap" async defer></script>
      <script type="text/javascript">
         
         function base_url(parametro){
            return '<?php echo base_url() ?>'+parametro;
         }

      </script>

   </body>
</html>
