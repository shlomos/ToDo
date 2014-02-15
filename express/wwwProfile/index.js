$(document).ready(function(){
var submit = document.getElementById('submit');

submit.addEventListener('click',function (event) {
    event.preventDefault();
    var username = document.getElementById('usr').value;
    var password = document.getElementById('pass').value;
    if (username === 'admin' && password === 'admin') {
		var calc = new Calculator();
        var content= $('#content');
        content.empty();
		content.append(calc.createCalc());
        var back = $("<input>");
        back.attr({
            "class":"action",
            "type":"button",
            "value":"Back"
        });
        back.click(function() {
            location.reload();
        });
        content.append(back);
    }
    });
});



