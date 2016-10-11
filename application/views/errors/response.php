<?php
  if($response > 0){
    echo "<p>Registro cadastrado com sucesso. Aguarde enquanto recarregamos a página</p>";
    redirect('');
  }
  else{
    echo "Falha ao tentar cadastrar o registro. Contate o criador da página";
    redirect('');
  }
?>
