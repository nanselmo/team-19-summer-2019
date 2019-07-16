function submitTix() {
	//var date;
	//var time;
	var ticketForm = document.getElementById("ticket");
	//console.log(document.getElementById("dayTix").value);
	console.log(ticketForm);

	var tixForm = new FormData(ticketForm);
	console.log(tixForm);
	console.log(tixForm.values());

	var pairs = {};
	for(var pair of tixForm.entries()) {
    	pairs[pair[0]] = pair[1]; 
	}

	console.log(pairs);


}