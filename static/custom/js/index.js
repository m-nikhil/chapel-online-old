$( document ).ready(function() {

 // splitter panel
 $(".panel-left").resizable({
   handleSelector: ".splitter",
   resizeHeight: false
 });

 //editor
 var editor = ace.edit("editor");
 editor.setTheme("ace/theme/monokai");
 editor.getSession().setMode("ace/mode/javascript");
 editor.setOptions({
    fontSize: "13pt"
  });
});



