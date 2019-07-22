// Fetch messages and add them to the page.
function fetchTix(){
  const url = '/tixfeed';
  fetch(url).then((response) => {
    return response.json();
  }).then((tix) => {
    const ticketsContainer = document.getElementById('tix-container');
    if(tix.length == 0){
     ticketsContainer.innerHTML = '<p>There are no tickets yet.</p>';
    }
    else{
     ticketsContainer.innerHTML = '';  
    }
    tix.forEach((tix) => {  
     const tixDiv = buildMessageDiv(ticket);
     ticketsContainer.appendChild(tixDiv);
    });
  });
}

function buildMessageDiv(ticket){
 const usernameDiv = document.createElement('div');
 usernameDiv.classList.add("left-align");
 usernameDiv.appendChild(document.createTextNode(ticket.user));
 
 const timeDiv = document.createElement('div');
 timeDiv.classList.add('right-align');
 timeDiv.appendChild(document.createTextNode(new Date(ticket.timestamp)));
 
 const headerDiv = document.createElement('div');
 headerDiv.classList.add('ticket-header');
 headerDiv.appendChild(usernameDiv);
 headerDiv.appendChild(timeDiv);
 
 const bodyDiv = document.createElement('div');
 bodyDiv.classList.add('ticket-body');
 bodyDiv.appendChild(document.createTextNode(ticket.date));
 bodyDiv.appendChild(document.createTextNode(ticket.time));
 
 const ticketDiv = document.createElement('div');
 ticketDiv.classList.add("ticket-div");
 ticketDiv.appendChild(headerDiv);
 ticketDiv.appendChild(bodyDiv);
 
 return ticketDiv;
}

// Fetch data and populate the UI of the page.
function buildUI(){
 fetchTix();
}
