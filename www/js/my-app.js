// Initialize app
var myApp = new Framework7();
var url = "https://knote-api.herokuapp.com"


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
var auth;
var svtags;
var idnote;
var datenote;
// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
     domCache: true

});

/*if user not logged show up login-screen*/
if (localStorage.getItem('token') === null) {
  myApp.popup(".popup-login");
}else{
 auth  = "Token "+localStorage.getItem('token');
};

$$(document).on('DOMContentLoaded', function(){

  addNotes();
  addTags();


});


/*fill tags by user*/
$('#openmenu').on('click',function(){

  addTags();

});

var Test = function(){
  console.log("ima good thing working right");
};

var addTags = function(){
  $.ajax({
    type: "GET",
    url: url+"/nota/etiquetas/",
    headers: {"Authorization": auth},
    dataType: "json"
  }).done(function(response) {
    $('#containertags').empty();
    for (var i = 0; i < response.length; i++) {
      var tag = '<li class="swipeout">'+
                  '<div class="swipeout-content item-content">'+
                    '<div class="item-inner" onClick="addNotes('+ response[i].id +')" style="font-size:15px">'+response[i].nombre+'</div>'+
                  '</div>'+
                  '<div class="swipeout-actions-right">'+
                    '<a href="#" onClick="deleteTag(' + response[i].id + ')" class="bg-blue">borrar</a>'+
                    '<a href="#" onClick="updateTag(' + response[i].id + ')" class="bg-cyan">editar</a>'+
                  '</div>'+
                '</li>';
      $('#containertags').append(tag);
    }
    var lasttag = '<li>'+
                    '<div class="item-content">'+
                      '<div class="item-inner" onClick="addNotes()">Todas</div>'+
                    '</div>'+
                  '</li>';
    $('#containertags').append(lasttag);
    svtags = response;
  });
/* dato importante para enviar un string dinamicamente en el parametro de una funcion implementada en el onClick="" de un elemento
usar \'' param '\' */

};

var addNotes = function(idpertag){

  if (idpertag!=null) {
    $.ajax({
      type: "GET",
      url: url+"/nota/notas/etiqueta/"+idpertag+"/",
      headers: {"Authorization": auth},
      dataType: "json"
    }).done(function(response){

      $('#containernotas').empty();
      for (var i = 0; i < response.length; i++) {
        var nmtag;
        var idtag;
        if (response[i].etiqueta===null) {
          nmtag = "sin etiqueta";
          idtag='';
        }else {
          nmtag = response[i].etiqueta.nombre;
          idtag = response[i].etiqueta.id;
        }
        var nota = '<li class="swipeout" onClick="viewNote(\''+ response[i].titulo +'\',\''+ response[i].contenido +'\')" style="margin-top:5%">'+
                    '<div class="swipeout-content item-content">'+
                      '<div class="item-inner">'+
                        '<div class="item-title-row">'+
                          '<div class="item-title">'+response[i].titulo+'</div>'+
                          '<div class="item-after">'+response[i].fecha+'</div>'+
                        '</div>'+
                        '<div class="item-subtitle">'+nmtag+'</div>'+
                        '<div class="item-text">'+response[i].contenido+'</div>'+
                      '</div>'+
                    '</div>'+
                    '<div class="swipeout-actions-right">'+
                      '<a href="#" onClick="deleteNote(' + response[i].id + ')" class="bg-red">borrar</a>'+
                      '<a href="#" onClick="preUpdateNote(' + response[i].id +',\''+ idtag +'\',\''+ response[i].fecha +'\')" class="bg-blue">editar</a>'+
                    '</div>'+
                  '</li>';

        $('#containernotas').append(nota);

      }

    });
  }else{

  $.ajax({
    type: "GET",
    url: url+"/nota/notas/",
    headers: {"Authorization": auth},
    dataType: "json"
  }).done(function(response) {

    $('#containernotas').empty();
    for (var i = 0; i < response.length; i++) {
      var nmtag;
      var idtag;
      if (response[i].etiqueta===null) {
        nmtag = "sin etiqueta";
        idtag='';
      }else {
        nmtag = response[i].etiqueta.nombre;
        idtag = response[i].etiqueta.id;
      }
      var nota = '<li class="swipeout" style="margin-top:5%">'+
                  '<div class="swipeout-content item-content" onClick="viewNote('+ response[i].id +')">'+
                    '<div class="item-inner">'+
                      '<div class="item-title-row">'+
                        '<div class="item-title">'+response[i].titulo+'</div>'+
                        '<div class="item-after">'+response[i].fecha+'</div>'+
                      '</div>'+
                      '<div class="item-subtitle">'+nmtag+'</div>'+
                      '<div class="item-text">'+response[i].contenido+'</div>'+
                    '</div>'+
                  '</div>'+
                  '<div class="swipeout-actions-right">'+
                    '<a href="#" onClick="deleteNote(' + response[i].id + ')" class="bg-red">borrar</a>'+
                    '<a href="#updatenote" onClick="updateNote(' + response[i].id +')" class="bg-blue">editar</a>'+
                  '</div>'+
                '</li>';

      $('#containernotas').append(nota);

    }

  });
}
/* dato importante para enviar un string dinamicamente en el parametro de una funcion implementada en el onClick="" de un elemento
usar \'' param '\' */

};

$('#bcvnote').on('click',function(){
  $('#vtitle').text('');
  $('#vcont').text('');
  $('#vtag').text('');
});

var viewNote = function(id){

  mainView.router.load({pageName: 'viewnote'});

  $.ajax({
    type: "GET",
    url: url+"/nota/nota/"+id+"/",
    headers: {"Authorization": auth}
  }).done(function(response) {

    var aux = response.etiqueta;
    var tg;

    if (aux===null) {
      tg = "Sin etiqueta";
    }else{
      tg=aux.nombre;
    }

    $('#vtitle').text(response.titulo);
    $('#vcont').text(response.contenido);
    $('#vtag').text(tg);

  });

}

/*delete a tag*/
var deleteTag = function(id){

  myApp.confirm('Quieres eliminar esta etiqueta ?' , 'kNotes',
     function () {
       $.ajax({
         type: "DELETE",
         url: url+"/nota/etiqueta/"+id+"/",
         headers: {"Authorization": auth}
       }).done(function(response) {
         myApp.alert('Etiqueta eliminada','kNotes');
         addTags();
         addNotes();
       });
     }
   );

};

/*delete note*/
var deleteNote = function(id){

  myApp.confirm('Quieres eliminar esta nota ?', 'kNotes',
     function () {
       $.ajax({
         type: "DELETE",
         url: url+"/nota/nota/"+id+"/",
         headers: {"Authorization": auth}
       }).done(function(response) {
         myApp.alert('Nota eliminada','kNotes');
         addNotes();
       });
     }
   );

};

/*update a tag*/
var updateTag = function(id){

myApp.prompt('Nombre de la etiqueta','Editar etiqueta',function(value){

       $.ajax({
         type: "PUT",
         url: url+"/nota/etiqueta/"+id+"/",
         headers: {"Authorization": auth},
         data:{nombre:value}
       }).done(function(response) {
         myApp.alert('Etiqueta editada','kNotes');
         addTags();
         addNotes();
       });

});

};

/*update a note*/

/*event click on popup edit note*/
var updateNote = function(id){

  var ttl = $('#nntitle').val('');
  var contt = $('#nncont').val('');

  $.ajax({
    type: "GET",
    url: url+"/nota/nota/"+id+"/",
    headers: {"Authorization": auth}
  }).done(function(response) {
    idnote=response.id;
    datenote = response.fecha;
    $('#nntitle').val(response.titulo);
    $('#nncont').val(response.contenido);
  });

};

$('#updatenota').on('click',function(){

  var ttl = $('#nntitle').val();
  var contt = $('#nncont').val();
  var tgs = null;

  $$("#sselectags").find('select[name=Etiquetas] option').each(function(){
    if(this.selected){
      tgs = parseInt(this.value);
      console.log(tgs);
    }
  });

  if (ttl===''||contt==='') {
    myApp.alert('Contenido o titulo invalido porfavor ingrese uno valido','kNotes');
  }else{if (tgs===null) {
    myApp.alert('Porfavor seleccione una etiqueta','kNotes');
  }else{
    console.log(tgs);

  $.ajax({
    type: "PUT",
    url: url+"/nota/nota/"+idnote+"/",
    headers: {"Authorization": auth},
    data:{titulo:ttl,contenido:contt,etiqueta_id:tgs}
  }).done(function(response) {
    myApp.alert('Nota editada',"kNotes");
    addNotes();
    mainView.router.back();

  });

 }};

});

/*adding options to smart select from update note*/
$('#nnotetags').on('click',function(){
  addTags();
  $('#ttagopts').empty();
  for (var i = 0; i < svtags.length; i++) {
    var aux = '<option value="'+ svtags[i].id +'">'+svtags[i].nombre+'</option>';
    myApp.smartSelectAddOption('#ttagopts',aux);
  }

});


/* add value tags to select from new note */
$('#notetags').on('click',function(){
  addTags();
  $('#tagopts').empty();
  for (var i = 0; i < svtags.length; i++) {
    var aux = '<option value="'+ svtags[i].id +'">'+svtags[i].nombre+'</option>';
    myApp.smartSelectAddOption('#tagopts',aux);
  }

});



$('#newnota').on('click',function(){

  var ttl = $('#ntitle').val();
  var ctn = $('#ncont').val();
  var tgs=null;

  $$("#selectags").find('select[name=Etiquetas] option').each(function(){
    if(this.selected){
      tgs = parseInt(this.value);
    }
  });

  if (ttl===''||ctn==='') {
    myApp.alert('Contenido o titulo invalido porfavor ingrese uno valido','kNotes');
  }else{if (tgs===null) {
    myApp.alert('Porfavor seleccione una etiqueta','kNotes');
  }else{
    $.ajax({
      type: "POST",
      url: url+"/nota/notas/",
      headers: {"Authorization": auth},
      data:{titulo:ttl,contenido:ctn,etiqueta:tgs}
    }).done(function(response) {
      addNotes();
      myApp.alert("Nota agregada exitosamente","kNotes");
      mainView.router.back();
      var ttl = $('#ntitle').val('');
      var ctn = $('#ncont').val('');
    });
  }};


  console.log(tgs);

});


/*Login and signup code here*/
/*adding event on click logging to the login buttom on modal loging*/
$('#loging').on('click',function(){
  console.log("loging...");
  var nm = $('#usrmail').val();
  var pss = $('#usrpass').val();

  if (nm===''||pss==='') {
    myApp.alert('Ingrese datos!','kNotes');
  }else{
    $.ajax({
      type: "POST",
      url: url+"/usuario/login/",
      data: {email: nm, password: pss},
      statusCode:{
        401: function(){
          myApp.alert('Usuario no existe registrate porfavor','kNotes');
        },
        403: function(){
          myApp.alert('Correo y contraseña no coinciden','kNotes');
        }
      },
      dataType: "json"
    }).done(function(response) {
      console.log(response.token);
      localStorage.setItem('token',response.token);
      location.reload();
      myApp.closeModal();
    });
  };

});

/*adding event on click to the signout button*/
$('#logout').on('click',function(){
  localStorage.clear();
  location.reload();
});

/*adding event on click signup to the button on signup page*/
$('#signupbtn').on('click',function(){
  console.log("joinning...");
  var nm = $('#jusrnm').val();
  var apll = $('#jusrap').val();
  var mail = $('#jusrmail').val();
  var pass = $('#jusrpass').val();

  if (nm===''||apll===''||mail===''||pass==='') {
    myApp.alert('Datos invalidos ingrese unos validos','kNotes');
  }else{
    $.ajax({
      type: "POST",
      url: url+"/usuario/registro/",
      data: {nombre: nm, apellido:apll, email: mail, password: pass},
      statusCode:{
        302:function(){
          myApp.alert('Correo ya registrado','kNotes');
        }
      }
    }).done(function(response) {
      myApp.closeModal();
      myApp.popup(".popup-login");
    });
  };

});

/*click event to sign up page*/
$('#tosignup').on('click',function(){
  console.log("test");
  myApp.closeModal();
  myApp.popup(".popup-signup");
});
/*click event to sign in page*/
$('#tosignin').on('click',function(){
  console.log("test2");
  myApp.closeModal();
  myApp.popup(".popup-login");
});
/* End login/signup code */


/* Tags code */
/* on click event add tag button */
$('#addtag').on('click',function(){
  myApp.prompt('Nombre de la etiqueta','Nueva etiqueta',function(value){

    var nm = value;

    if (nm==='') {
      myApp.alert('Nombre invalido digite uno valido','kNotes');
    }else{
      $.ajax({
        type: "POST",
        url: url+"/nota/etiquetas/",
        headers: {"Authorization": auth},
        data: {nombre:nm},
        statusCode:{
          302: function(){
            myApp.alert('Ya existe esta etiqueta','kNotes');
          }
        }
      }).done(function(response) {
        console.log(response);
        myApp.alert('Etiqueta '+value+' creada',"kNotes");
        addTags();
      });
    };

  });

});

/*PAGES*/
// Now we need to run the code that will be executed only for About page.
// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

});

myApp.onPageInit('newnote', function (page) {
    // Do something here for "about" page

});
