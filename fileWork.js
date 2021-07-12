$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    console.log(a);
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$(function() {
    $('form').submit(function() {
        var data = JSON.stringify($('form').serializeObject());
        var name = $('form').serializeArray()[0].value;
        download(name,data);
        return false;
    });
});


function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


window.onload = function() {
    var fileInput = document.getElementById('fileInput');
    var fileDisplayArea = document.getElementById('fileDisplayArea');
    

    fileInput.addEventListener('change', function(e) {
      var file = fileInput.files[0];
      var textType = /text.*/;

      if (file.type.match(textType)) {
         var reader = new FileReader();

         reader.onload = function(e) {
            var text = reader.result;
            load(text);
         }

         reader.readAsText(file);   
      } 
   });
   
}


function load(info){
    try
	{
        const obj = JSON.parse(info);
        $.each(obj,function(key,value){
            if($('input[name="'+key+'"]').attr('type')=="checkbox")
			{
                $('input[name="'+key+'"]').prop('checked',true);
            }
			else if (key == "bag" || key == "features" ||key == "tools" ||key == "languages" ||key == "skills")
			{
				$('textarea[name="'+key+'"]').html(value);
			}
			else
			{
                $('input[name="'+key+'"]').val(value);
            
            }
        })
    }
	catch
	{
        alert("Wrong file format");
    }
}


