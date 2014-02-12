//A calculator object constructor.
function Calculator(){

    var defaultVal = 0;
    var self = this;

    this.add=function(){
        var res= $('#res');
        var inp = $('#in').val();
        res.val(1*inp+1*res.val());
    };

    this.mult=function(){
        var res= $('#res');
        var inp=$('#in').val();
        if($.isNumeric(inp)){
            res.val(inp*res.val());
        }
    };

    this.clear=function(){
        $('#res').val(defaultVal);
        $('#in').val("");
    };

    //Set the default value on calculator pane.
    this.setDefaultVal=function(value){
        if($.isNumeric(value)){
			if((value*1) >= 0){
				defaultVal = value*1;
			}else{
				alert('Illegal default value!\nValue must be positive or zero!');
			}
        }
        self.clear();
    };

    this.createCalc=function(){
        var calcBody = $("<form></form>");
        calcBody.css({
            "background":"grey",
            "position":"absolute",
            "text-align":"center",
            "width":"50%",
            "left":"25%"
        });
        var resultScn = $('<input id="res" class="action" type="text" readonly="readonly"/><br/>');
        resultScn.attr("value",defaultVal);
        resultScn.css({
            "background":"lightgray",
            "box-shadow": "0px 0px 0px 0px",
            "-webkit-box-shadow": "0px 0px 0px 0px",
            "-moz-box-shadow": "0px 0px 0px 0px",
            "border":"0px",
            "width":"90%"
        });
        var inputScn = $('<input id="in" class="action" type="text"/><br/><br/>');
        inputScn.css({
            "border":"1px",
            "width":"90%"
        });
        var setBut = $('<input id="set" class="action" type="button" value="Settings" />');
        var addBut = $('<input id="add" class="action" type="button" value="+" />');
        var multBut = $('<input id="mult" class="action" type="button" value="x" />');
        var clsBut = $('<input id="cls" class="action" type="button" value="Clear" /><br/><br/>');
        addBut.click(function() {
            self.add();
        });
        multBut.click(function() {
            self.mult();
        });
        clsBut.click(function() {
            self.clear();
        });
        setBut.click(function() {
            self.setDefaultVal(prompt("Set the default value for the calculator:"));
        });
        inputScn.keypress(function(event) {
            return self.validate(event);
        });
        calcBody.append(resultScn);
        calcBody.append(inputScn);
        calcBody.append(addBut);
        calcBody.append(multBut);
        calcBody.append(clsBut);
        calcBody.append(setBut);
        return calcBody;
    };
}

Calculator.prototype.validate = function (event)
{
    return $.isNumeric(String.fromCharCode(event.charCode));
};
