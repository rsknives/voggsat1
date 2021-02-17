var timeStatus;

var page = 0;
function checkSwitch(chk, componet) {
    var checkBox = document.getElementById(chk);
    var text     = document.getElementById(componet);
    if (checkBox.checked) {
        text.style.display = "grid";
    } else {
        text.style.display = "none";
    }
}
function doUpdate(){
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
    });
    xhr.open("GET", "/doUpdate", true);
    xhr.withCredentials = true;
    xhr.send(null);
}
function checkUpdate(){
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
    });
    xhr.open("GET", "/checkUpdate", true);
    xhr.withCredentials = true;
    xhr.send(null);
}

/**
 * Funções da tela principal
 */
function onloadPage() {
    document.getElementById("defaultStatus").click();
    startTimeStatus();
}
/**
 * Trigger functions
*/
function loadtrigger() {
    loadTriggerCombo();
    getGrid("trigger");
}
function clearTrigger(){
    document.getElementById("desciption").value  = "";
    document.getElementById("portTrigger").value = "";
    document.getElementById("portTarget").value  = "";
    document.getElementById("type").value        = "";
    document.getElementById("portStatus").value  = "";
    document.getElementById("portValue").value   = "";
    document.getElementById("command").value   = "";
}
function loadTriggerCombo() {
    let combo1 = document.getElementById("portTrigger");
    let combo2 = document.getElementById("portTarget");
    for (let i = 0; i < 17; i++) {
       if (i == 16) {
        combo2.add(new Option("PORTA ANALÓGICA 17",(i+1)));
       } else {
        combo2.add(new Option("PORTA "+(i+1),(i+1)));
        combo1.add(new Option("PORTA "+(i+1),(i+1)));
       }
    }
}
function removeTriggerItem(id) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            alert("Remove Item."+id);
            getGrid("trigger");
        }
    });
    xhr.open("GET", "/removeTriggerItem?id="+id, true);
    xhr.withCredentials = true;
    xhr.send(null);
}
function ap(port) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
    });
    xhr.open("GET", "/actionPort?port=" + port, true);
    xhr.withCredentials = true;
    xhr.send(null);
}

function reqChange() {
    if (this.readyState == 4) {
      if (this.status == 200 && this.responseText != null) {
        var ds = JSON.parse(this.responseText);
        document.getElementById("lbVoltage").innerHTML = "Tensão: " + ds.boardVoltage.toFixed(2) + "V";
        document.getElementById("lbRunTime").innerHTML = ds.runTime;
        document.getElementById("mqttIsOn").innerHTML  = ds.mqttIsOn;
        document.getElementById("dot1").style.backgroundColor  = ds.e1p1?"green":"red";
        document.getElementById("dot2").style.backgroundColor  = ds.e1p2?"green":"red";
        document.getElementById("dot3").style.backgroundColor  = ds.e1p3?"green":"red";
        document.getElementById("dot4").style.backgroundColor  = ds.e1p4?"green":"red";
        document.getElementById("dot5").style.backgroundColor  = ds.e1p5?"green":"red";
        document.getElementById("dot6").style.backgroundColor  = ds.e1p6?"green":"red";
        document.getElementById("dot7").style.backgroundColor  = ds.e1p7?"green":"red";
        document.getElementById("dot8").style.backgroundColor  = ds.e1p8?"green":"red";
        document.getElementById("dot9").style.backgroundColor  = ds.e2p1?"green":"red";
        document.getElementById("dot10").style.backgroundColor = ds.e2p2?"green":"red";
        document.getElementById("dot11").style.backgroundColor = ds.e2p3?"green":"red";
        document.getElementById("dot12").style.backgroundColor = ds.e2p4?"green":"red";
        document.getElementById("dot13").style.backgroundColor = ds.e2p5?"green":"red";
        document.getElementById("dot14").style.backgroundColor = ds.e2p6?"green":"red";
        document.getElementById("dot15").style.backgroundColor = ds.e2p7?"green":"red";
        document.getElementById("dot16").style.backgroundColor = ds.e2p8?"green":"red";
      } 
    }
  }
  
  var reqStatus = new XMLHttpRequest();
  reqStatus.onreadystatechange = reqChange;
  
  var reqSet = new XMLHttpRequest();
  reqSet.onreadystatechange = reqChange;
  
  function updateStatus() {
    reqStatus.open("GET", "/getstatus", true);
    reqStatus.send(null);
    window.setTimeout("updateStatus()", 2000);
  }
  
 /**
  * 433 lista
  */
 function priorPage(type){
    if (page > 0) { page--; }
    getGrid(type);
}
function nextPage(type){
    if (page > 50) { return; }
    page++;
    getGrid(type);
}
function loadData(type){
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            alert("Atualização realizado com sucesso.");
            page = 0;
            getGrid(type);
        }
    });
    console.log(page);
    xhr.open("GET", "/updatedataaccess?type="+type, true);
    xhr.withCredentials = true;
    xhr.send(null);
}

function getGrid(type) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(page);
            console.log(this.responseText);
            var collum
            if (type == "trigger") {
                collum = "<tr><th>#Id</th><th>Tipo</th><th>Descrição</th><th>Comando</th><th>P. Gatilho</th><th>P. Destino</th><th>St. Gatilho</th><th>V. Porta</th><th>Ações</th></tr>";
            } else {
                collum = "<tr><th>Dispositivo</th><th>Porta</th><th>Inicio</th>	<th>Fim</th></tr>";
            }          
            document.getElementById("lines").innerHTML = collum+this.responseText;
        }
    });
    xhr.open("GET", "/getGridList?page="+page+"&type="+type, true);
    xhr.withCredentials = true;
    xhr.send(null);
}

function editRadioItem(device) {
    console.log("Editando controle:");
}
function removeRadioItem(device) {
    console.log("Removendo controle:");
}
function startTimeStatus() {
    timeStatus = setInterval(() => {
        updateStatus();
    }, 60000);
}
function stopTimeStatus() {
    clearInterval(timeStatus);
}
function doReset() {
	ret = confirm('Deseja reiniciar a placa?');
	if (ret) { location.href='reset';}
}
function getServerData() {
    //{"mqttIsOn":"on","srvMqtt":"mqtt.mdin.com.br","mqttPort":"1883","mqttTopic":"/0003/0008/","mqttUser":"infra","mqttPass":"@infra2000@","cayUser":"","cayPass":"","cayClient":""}
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        var ds = JSON.parse(this.responseText);
        if (this.readyState === 4) { console.log(this.responseText); }
        document.getElementById("mqttIsOn").checked = ds.mqttIsOn; 
        document.getElementById("cayIsOn").checked  = ds.cayIsOn;
        document.getElementById("srvMqtt").value    = ds.srvMqtt;
        document.getElementById("mqttPort").value   = ds.mqttPort;
        document.getElementById("mqttUser").value   = ds.mqttUser;
        document.getElementById("mqttPass").value   = ds.mqttPass;
        document.getElementById("mqttTopic").value  = ds.mqttTopic;
        document.getElementById("cayUser").value    = ds.cayUser;
        document.getElementById("cayPass").value    = ds.cayPass;
        document.getElementById("cayClient").value  = ds.cayClient;
        checkSwitch("mqttIsOn");
        checkSwitch("cayIsOn");
    });
    xhr.open("GET", "/getserverdata", true);
    xhr.withCredentials = true;
    xhr.send(null);
}
/*
function getNetworkData() {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        var ds = JSON.parse(this.responseText);
        if (this.readyState === 4) { console.log(this.responseText); }
        document.getElementById("isFixedIp").checked = ds.isFixedIp;
        document.getElementById("wifiName").value     = ds.wifiName;
        document.getElementById("wifiPassword").value = ds.wifiPassword;
        document.getElementById("ipAddress").value    = ds.ipAddress;
        document.getElementById("mask").value         = ds.mask;
        document.getElementById("gateway").value      = ds.gateway;
        document.getElementById("dns1").value         = ds.dns1;
        document.getElementById("dns2").value         = ds.dns2;
        checkSwitch("isFixedIp");
    });
    xhr.open("GET", "/getnetworkdata", true);
    xhr.withCredentials = true;
    xhr.send(null);
}
function getuserData() {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        var ds = JSON.parse(this.responseText);
        if (this.readyState === 4) { console.log(this.responseText); }
        document.getElementById("webUser").value  = ds.webUser;
        document.getElementById("webPass").value  = ds.webPass;
    });
    xhr.open("GET", "/getuserdata", true);
    xhr.withCredentials = true;
    xhr.send(null);
}
function get433Data() {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        var ds = JSON.parse(this.responseText);
        if (this.readyState === 4) { console.log(this.responseText); }
        document.getElementById("rxIsActive").checked      = ds.rxIsActive;
        document.getElementById("rxOfflineActive").checked = ds.rxOfflineActive;
        document.getElementById("rxPort").value            = ds.rxPort;
        document.getElementById("rxTime").value            = ds.rxTime;
        document.getElementById("rxDelay").value           = ds.rxDelay;
        checkSwitch("rxIsActive");
        checkSwitch("rxOfflineActive");
    });
    xhr.open("GET", "/get433data", true);
    xhr.withCredentials = true;
    xhr.send(null);
}
function getRfidData() {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        var ds = JSON.parse(this.responseText);
        if (this.readyState === 4) { console.log(this.responseText); }
        document.getElementById("rfIdIsActive").checked       = ds.rfIdIsActive;
        document.getElementById("rfIdOffline1Active").checked = ds.rfIdOffline1Active;
        document.getElementById("rfIdOffline2Active").checked = ds.rfIdOffline2Active;
        document.getElementById("rfId1Port").value            = ds.rfId1Port;
        document.getElementById("rfId1Time").value            = ds.rfId1Time;
        document.getElementById("rfId1Delay").value           = ds.rfId1Delay;
        document.getElementById("portType1").value            = ds.portType1;
        document.getElementById("rfId2Port").value            = ds.rfId2Port;
        document.getElementById("rfId2Time").value            = ds.rfId2Time;
        document.getElementById("rfId2Delay").value           = ds.rfId2Delay;
        document.getElementById("portType2").value            = ds.portType2;
        checkSwitch("rfIdIsActive");
        checkSwitch("rfIdOffline1Active");
        checkSwitch("rfIdOffline2Active");
    });
    xhr.open("GET", "/getrfiddata", true);
    xhr.withCredentials = true;
    xhr.send(null);
}

function openPage(pageName, elmnt, color) {
    switch(pageName) {
        case 'status'  :  startTimeStatus(); break;
        case 'network' :  getNetworkData();getuserData(); break;
        case 'server'  :  getServerData();  break;
        case 'radio433':  get433Data();     break;
        case 'Rfid'    :  getRfidData();    break;
    }
    if (pageName != "status") {stopTimeStatus();}
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.display = "block";
    elmnt.style.backgroundColor = color;
function ap(port) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
    });
    xhr.open("GET", "/actionPort?port="+port, true);
    xhr.withCredentials = true;
    xhr.send(null);
}
}
]*/
// Get the element with id="defaultOpen" and click on it
//		document.getElementById("defaultOpen").click();


