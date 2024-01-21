$(document).ready(function () {
  // Validação de campos Input vazios (através de Bootstrap)
  const forms = document.querySelectorAll(".needs-validation");

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
          exibirMensagemErro();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
  /*---------------------------------------------------------------------------*/
  //ENTREGA 2 - PWC

  //Criacao de copias dos cards originais
  var cloneCardCao = $(".card-cao").clone(); // Cria um clone dos cards de caes para adocao
  var cloneCardDetalhes = $(".card-detalhes").clone(); // Cria um clone do card dos detalhes
  var cloneCardCaoNovo = $(".card-cao-novo").clone(); // Cria um clone do card dos novos caes
  var cloneCardCaoFavoritos = $(".card-cao-favorito").clone(); // Cria um clone do card dos detalhes
  $(".lista-caes").html(""); //Limpa o card de exemplo da lista de caes
  $(".detalhes-cao").html("");
  $(".lista-caes-novos").html("");
  $(".lista-caes-favoritos").html("");

  // Consumir API Pet Finder
  var token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJFb1F4Y2xQV292M0hoZWZMUkZod1ZiYkR2eTgwTDJoT2xKd2RacWg2VGJXanZVNndzRSIsImp0aSI6IjQ4ZWI2MDk5MTNiZDgyM2JhNjhkODI4OTQ3YTNkZDA1ZGVkYzQ0MGNmNjRlZjI5ZDBiNGFiNzFmN2M5OTk4NmFjZGVlNmZkZWZkNmNlMWIxIiwiaWF0IjoxNzA1ODczNzk1LCJuYmYiOjE3MDU4NzM3OTUsImV4cCI6MTcwNTg3NzM5NSwic3ViIjoiIiwic2NvcGVzIjpbXX0.LWs5GfkyIZxDXBGheqPslwwH3Gegdbj7-3hfCPd1SV3bak7SiTBfpTQjSQ-crQWjIeVGkCkyXGS2_z6A8cLCbTPgASznBDtRanpNSySfszWMh3nmzmNHZ-3KOjsSkr7cyQoTJLXvmb8Sh2dzA-DmQ7CQWfppardPbc_WnkKu56ajvsYovmQ6fj37llFgueXZ9UO2Zgerl4t3OYnsEIAUYZmWVpKKO2cj5owxD5JoZ5QoXLHtuXUlXeXJo4kiAHazRkGhrKRxOTKJRqIy6vl_BGi_OA79yFnkjTWmRQnOy_6OfaEQU0ggwkHMHfFbmgVJ_cyl-xxGJDNbddgv2YnQQw";
  $.ajax({
    method: "GET",
    url: "https://api.petfinder.com/v2/animals",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + token);
    },
  }).done(function (dados_caes) {
    var caes = dados_caes.animals;

    caes.forEach(function (cao) {
      console.log(cao);
      if (cao.type == "Dog") {
        var card = cloneCardCao.clone();

        //Atribuicao do resptivo id ao card e botoes
        $(".card-cao", card).attr("id", cao.id);
        $(".botao-detalhes", card).attr("id", cao.id);
        $(".botao-favoritos", card).attr("id", cao.id);

        $(".nome-cao", card).text(cao.name);
        if (cao.description != null) {
          $(".descricao-cao", card).text(cao.description);
        } else {
          $(".descricao-cao", card).text("Não possui descrição...");
        }

        // Imagem cao
        if (
          cao.primary_photo_cropped != null &&
          cao.primary_photo_cropped.medium.length > 0
        ) {
          $("#imagem-cao", card).attr("src", cao.primary_photo_cropped.medium);
        } else {
          $("#imagem-cao", card).attr("src", "img/labrador2.jpg");
        }

        $(".lista-caes").append(card);

        var objFav = {
          Id: cao.id,
          Nome: cao.name,
          Detalhes: cao.description,
        };
        var favoritos = JSON.stringify(objFav);
        $(".botao-favoritos", card).attr(
          "onclick",
          "adicionarFavoritos(" + favoritos + ")"
        );
      }
    });

    preencherDetalhesCao(caes, cloneCardDetalhes);
    mostrarCaesnovos(caes, cloneCardCaoNovo);

    //FAVORITOS
    // Obtém a lista de favoritos do localStorage
    var favoritos = JSON.parse(localStorage.getItem("listaFavoritos")) || [];

    // Exibe os favoritos na lista
    favoritos.forEach(function (favorito) {
      if (favorito.Id != null) {
        idCao = favorito.Id;
      }

      caes.forEach(function (cao) {
        if (cao.id == idCao) {
          console.log("PASSEI AQUIQ");
          console.log(cao.id);
          var card = cloneCardCaoFavoritos.clone();

          //Atribuicao do resptivo id ao card e botoes
          $(".card-cao-favorito", card).attr("id", cao.id);
          $(".botao-detalhes-favorito", card).attr("id", cao.id);
          $(".botao-remover", card).attr("id", cao.id);



          $(".nome-cao-favorito", card).text(cao.name);
          if (cao.description != null) {
            $(".descricao-cao", card).text(cao.description);
          } else {
            $(".descricao-cao", card).text("Não possui descrição...");
          }

          if (
            cao.primary_photo_cropped != null &&
            cao.primary_photo_cropped.medium.length > 0
          ) {
            $("#imagem-cao-favorito", card).attr(
              "src",
              cao.primary_photo_cropped.medium
            );
          } else {
            $("#imagem-cao-favorito", card).attr("src", "img/labrador2.jpg");
          }
            


          $(".lista-caes-favoritos").append(card);


        }
      });
    });

    // Função para remover um favorito da lista
    
  });
});

//FUNÇÕES
function mostrarCaesnovos(caes, cloneCardCaoNovo) {
  var indice = 0;

  caes.forEach(function (cao) {
    console.log(cao);
    if (indice < 6 && cao.type == "Dog") {
      var card = cloneCardCaoNovo.clone();

      //Atribuicao do resptivo id ao card e botoes
      $(".card-cao-novo", card).attr("id", cao.id);
      $(".botao-detalhes-novo", card).attr("id", cao.id);
      $(".botao-favoritos-novo", card).attr("id", cao.id);

      $(".nome-cao-novo", card).text(cao.name);
      if (cao.description != null) {
        $(".descricao-cao", card).text(cao.description);
      } else {
        $(".descricao-cao", card).text("Não possui descrição...");
      }

      if (
        cao.primary_photo_cropped != null &&
        cao.primary_photo_cropped.medium.length > 0
      ) {
        $("#imagem-cao-novo", card).attr(
          "src",
          cao.primary_photo_cropped.medium
        );
      } else {
        $("#imagem-cao-novo", card).attr("src", "img/labrador2.jpg");
      }

      $(".lista-caes-novos").append(card);
      indice++;

      var objFav = {
        Id: cao.id,
        Nome: cao.name,
        Detalhes: cao.description,
      };
      var favoritos = JSON.stringify(objFav);
      $(".botao-favoritos", card).attr(
        "onclick",
        "adicionarFavoritos(" + favoritos + ")"
      );
    }
  });
}

//Funcao preenche os detalhes do cao com base no seu id
function preencherDetalhesCao(caes, cardDetalhes) {
  var idCao = procuraIDCao();
  console.log(idCao);

  caes.forEach(function (cao) {
    if (cao.id == idCao && cao.type == "Dog") {
      console.log(cao.name);

      //Nome do cao
      $(".nome-cao-detalhes", cardDetalhes).append(cao.name);

      // Imagem do Cão
      if (
        cao.primary_photo_cropped != null &&
        cao.primary_photo_cropped.large.length > 0
      ) {
        $(".imagem-detalhes-cao", cardDetalhes).attr(
          "src",
          cao.primary_photo_cropped.large
        );
      } else {
        $(".imagem-detalhes-cao", cardDetalhes).attr(
          "src",
          "img/labrador2.jpg"
        );
      }

      // Descrição do cão
      $(".descricao-detalhes-cao", cardDetalhes).text(cao.description);

      //Raça do cao
      if (cao.breeds.primary == null) {
        $(".nome-raca", cardDetalhes).text("O cao não possui raça...");
      } else if (cao.breeds.mixed == true) {
        $(".raca-mista", cardDetalhes).text("Sim");
        $(".nome-raca", cardDetalhes).text(
          cao.breeds.primary + " / " + cao.breeds.secondary
        );
      } else if (cao.breeds.mixed == false) {
        $(".raca-mista", cardDetalhes).text("Não");
        $(".nome-raca", cardDetalhes).text(cao.breeds.primary);
      }

      // Idade cão
      $(".idade-cao", cardDetalhes).text(cao.age);
      // Genero do cao
      $(".genero-cao", cardDetalhes).text(cao.gender);
      //Tamanho do cao
      $(".tamanho-cao", cardDetalhes).text(cao.size);

      //Cor do pelo do cao
      if (cao.colors.primary != null) {
        $(".cor-cao", cardDetalhes).text(cao.colors.primary);
      } else {
        $(".cor-cao", cardDetalhes).text("Disponivel brevemente...");
      }

      //Status do cao
      if (cao.status == "adopted") {
        $(".status-cao", cardDetalhes).text("Adotado");
      } else {
        $(".status-cao", cardDetalhes).text("Adotável");
        $(".botao-adotar", cardDetalhes).append(
          "<a style='width: 20%' href='adotar.html' class='botao-simples-2'>Adotar cão</a>"
        );
      }

      // Contatos
      if (cao.contact.email != null) {
        $(".lista-contatos", cardDetalhes).append(
          "<li> <strong>Email:</strong> <span class='email-contato'>" +
            cao.contact.email +
            "</span></li>"
        );
      }

      if (cao.contact.phone != null) {
        $(".lista-contatos", cardDetalhes).append(
          "<li> <strong>Telefone:</strong> <span class='telefone-contato'>" +
            cao.contact.phone +
            "</span></li>"
        );
      }

      if (cao.contact.address.address1 != null) {
        $(".lista-contatos", cardDetalhes).append(
          "<li> <strong>Endereço:</strong> <span class='endereco-contato'>" +
            cao.contact.address.address1 +
            ", " +
            cao.contact.address.city +
            ", " +
            cao.contact.address.state +
            ", " +
            cao.contact.address.postcode +
            ", " +
            cao.contact.address.country +
            "</span></li>"
        );
      }

      var objFav = {
        Id: cao.id,
        Nome: cao.name,
        Detalhes: cao.description,
      };

      var favoritos = JSON.stringify(objFav);
      $(".botao-favoritos", cardDetalhes).attr(
        "onclick",
        "adicionarFavoritos(" + favoritos + ")"
      );

      $(".detalhes-cao").append(cardDetalhes);
    }
  });
}

//Funcao aciona quando o user clica no vcer detalhes do cao e redireciona para a url com os parametros id do cao
function verDetalhesCao(idCao) {
  window.location.href = "detalhes-cao.html?id=" + idCao;
}

//Funcao procura id do cao na url enviada
function procuraIDCao() {
  parametrosURL = new URLSearchParams(window.location.search);
  var idCao = parametrosURL.get("id");
  return idCao;
}

// Funcao ativa o botao de favoritos
function adicionarFavoritos(caofavorito) {
  var arrayFavoritos = [];
  var storage = localStorage.getItem("listaFavoritos");

  if (storage != null) {
    arrayFavoritos = JSON.parse(storage);

    // Verifica se o objeto já está na lista de favoritos
    var existeNaLista = arrayFavoritos.some(function (item) {
      return (
        item.Nome === caofavorito.Nome && item.Detalhes === caofavorito.Detalhes
      );
    });

    if (!existeNaLista) {
      arrayFavoritos.push(caofavorito);
      var favoritos = JSON.stringify(arrayFavoritos);
      localStorage.setItem("listaFavoritos", favoritos);
      console.log(localStorage.getItem("listaFavoritos"));
    } else {
      console.log("Este item já está na lista de favoritos.");
    }
  } else {
    arrayFavoritos.push(caofavorito);
    var favoritos = JSON.stringify(arrayFavoritos);
    localStorage.setItem("listaFavoritos", favoritos);
    console.log(localStorage.getItem("listaFavoritos"));
  }
}




// Funcao mostra mensagem de erro atraves do alerta
function exibirMensagemErro() {
  alert("Erro! Preencha todos os campos corretamente.");
}

// Função para remover um objeto do localStorage com base no ID (Remover os cães)
function removerDoLocalStorage(id) {
  // Passo 1: Recupera os dados existentes do localStorage
  var listaFavoritos = JSON.parse(localStorage.getItem('listaFavoritos') || '[]');

  // Passo 2: Identifica o índice do objeto com o ID desejado
  var indiceParaRemover = listaFavoritos.findIndex(function(cao) {
      return cao.Id == id;
  });

  // Passo 3: Remove o objeto do array, se encontrado
  if (indiceParaRemover !== -1) {
      listaFavoritos.splice(indiceParaRemover, 1);

      // Passo 4: Atualiza os dados no localStorage
      localStorage.setItem('listaFavoritos', JSON.stringify(listaFavoritos));

      console.log('Item removido com sucesso.');
      location.reload();
  } else {
      console.log('Item não encontrado com o ID fornecido.');
  }

}


