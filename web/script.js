var intervalID;
var ExistError=1;
var NotError=0;   

var CYCLIC=0;		//циклический вызов функции
var Single=1;	//Одноразовый вызов функции


var TimerID;
var http1 = createRequestObject();
var http2 = createRequestObject();

var UserAbbort=1;
var ClearAbbort=0;
var StatusAbort=ClearAbbort;

var TimerID_blink = new Array(10);
var TimerID_blink = [];

//var TimerID_blink[5];

//const RGB_STATUS_NORM="rgb(76,153,0)";
//const RGB_STATUS_NORM="rgb(0,204,0)";
var RGB_STATUS_NORM="rgb(33,114,17)";
var RGB_STATUS_ADMONITION="rgb(255,128,0)";
var RGB_STATUS_ERROR="rgb(255,0,0)";
var RGB_WHITE="rgb(255,255,255)";
var RGB_BLEK="rgb(0,0,0)";

//-------------------------------------------------------------------------------------------------- 
	var StrResponse;
//--------------------------------------------------------------------------------------------------
//==========================================================================================
//==========================================================================================
//------------------------------------------------------------------------------------------
// a one-time function call
// cyclic function call
//------------------------------------------------------------------------------------------
    function GetSettingTimeout3(link,ModeFuncCall,CallbackTrue,CallbackFalse) {
        (function _f() {
			//var http2 = createRequestObject();
            if( http2 ) {
				//---------------------------------------------
                http2.open('GET', link, true);
				//---------------------------------------------
				http2.timeout =1000;
				//---------------------------------------------
                http2.onreadystatechange = function () {
					if (http2.readyState == 4&&http2.status == 200) {
						
					if (CallbackTrue && typeof(CallbackTrue) === "function") {
						CallbackTrue.call(http2.responseText);
					}						
						
						//CallbackTrue.call(http2.responseText);
						ConnectSuccessful();
						if(ModeFuncCall==CYCLIC){
							TimerID = setTimeout(_f, 1000);
						}
                    }
                };
				//---------------------------------------------
				http2.ontimeout = function() {
					Disconnect();
					TimerID = setTimeout(_f, 1500);
					if (CallbackFalse && typeof(CallbackFalse) === "function") {
						CallbackFalse.call(http2.responseText);
					}
				};
				//---------------------------------------------
				http2.abort= function() {
					if(StatusAbort==ClearAbbort){
						Disconnect();
						StatusAbort=ClearAbbort;
						TimerID = setTimeout(_f, 1000);
					}
				};
				//---------------------------------------------
                http2.send(null);
            }else{
				TimerID = setTimeout(_f, 1000);
            }
        })();
    }
//------------------------------------------------------------------------------------------
	function createRequestObject()
    {
        try { return new XMLHttpRequest() }
        catch(e)
        {
            try { return new ActiveXObject('Msxml2.XMLHTTP') }
            catch(e)
            {
                try { return new ActiveXObject('Microsoft.XMLHTTP') }
                catch(e) { return null; }
            }
        }
    }
//==================================================================================================
//==================================================================================================
//==================================================================================================
	var PAGE_STATUS = document.getElementById('page_status');
	//var PAGE_VAR = document.getElementById('table_conteint');
	var PAGE_SET = document.getElementById('page_set');
	var PAGE_TABL = document.getElementById('center_tabl_show');
	var PAGE_ALL_ERROR = document.getElementById('AllLogError');
	var PAGE_HELP = document.getElementById('ShowHelp');
	//---------------------------------------------------------------
	var But_status = document.getElementsByName('But_status');
	var But_var = document.getElementsByName('But_var');
	var But_set = document.getElementsByName('But_set');
	//---------------------------------------------------------------
	//PageCondition();		//Запуск начальной страницы
	//---------------------------------------------------------------
	
var StatusDisconect=0;
var StatusConect=1;	
//==================================================================================================
var Mode_BlinkConnectSuccessful=0;
function ConnectSuccessful(){

	var StatusConnect = document.getElementById('IdStatusConnect');
	if(Mode_BlinkConnectSuccessful==0){
		//------------------------------------------------------------
		StatusConnect.setAttribute("fill","rgb(0,204,0)");
		//------------------------------------------------------------
		Mode_BlinkConnectSuccessful=1;
	}else{
		//------------------------------------------------------------
		StatusConnect.setAttribute("fill","rgb(255,255,255)");
		//------------------------------------------------------------		
		Mode_BlinkConnectSuccessful=0;
	}
}
//==================================================================================================
function Disconnect(){
	var StatusConnect = document.getElementById('IdStatusConnect');
	StatusConnect.setAttribute("fill","rgb(255,51,51)"); //Красный	
	//StatusConnect.className="ImageDisconnect";
	clearInterval(intervalID);
}
//==================================================================================================
//---------------------Запрос на считывания состояния блока питания---------------------------------
//==================================================================================================
function GetStatusPowerButt(){
	var PowerSupply = document.getElementById('IdPowerSupplyOnOff');
		GetSettingTimeout3('GetPower.CGI',Single,function(){
			var objJSON = eval('({' + this + '})');
			if(objJSON.Power==1){
				PowerSupply.innerHTML="Вкл";
			}
			if(objJSON.Power==2){
				PowerSupply.innerHTML="Выкл";
			}
			ConnectSuccessful();
		},function (){
			Disconnect();
			//PowerSupply.innerHTML="Ошибка";
		})		
	}
//==================================================================================================
//---------------------Запрос на изменения состояния блока питания----------------------------------
//==================================================================================================
function PowerSupplyOnOff(){
	var PowerSupply = document.getElementById('IdPowerSupplyOnOff');
	
	GetSettingTimeout3('SetPower.CGI',Single,function (){
		//---------------------------------------------
		GetStatusPowerButt();
		//---------------------------------------------
	},function (){
		Disconnect();
		//alert("Связь с сервером потеряна");
		//PowerSupply.innerHTML="Ошибка";
		//clearInterval(intervalID);
	});
}
//==================================================================================================
//--------------------------------Связь с сервером--------------------------------------------------
//==================================================================================================
function CheckConnection(){
	PageCondition();
	//GetStatusPowerButt();
	//intervalID = setInterval(GetStatusPowerButt,300);
}
//==================================================================================================
//------------------Обработчик кнопки Состояние-----------------------------------------------------
//==================================================================================================
var IdTimeGetVar;
function PageCondition() {
	//------------------------------------------------------------------
	document.getElementById("IdPageCondition").disabled=false;	
	document.getElementById("IdPageOptions").disabled=false;
	document.getElementById("IdPageSetting").disabled=false;	
	document.getElementById("IdShowAllError").disabled=false;
	document.getElementById("IdHelp").disabled=false;
	//------------------------------------------------------------------
	StatusAbort=UserAbbort;
	//------------------------------------------------------------------
	//document.getElementById("But_var").disabled = false;	
	//document.getElementById("But_status").disabled = false;	
	//------------------------------------------------------------------
	http2.abort();
	clearInterval(TimerID);
	//intervalID = setInterval(GetStatusPowerButt,300);
	
	//style.display = 'block';
	
	PAGE_STATUS.style.display="none";
	PAGE_TABL.style.display="block";
	PAGE_SET.style.display="none";
	PAGE_ALL_ERROR.style.display="none";
	PAGE_HELP.style.display="none";	
	
	// PAGE_STATUS.hidden=true;
	// PAGE_TABL.hidden=false;
	// PAGE_SET.hidden=true;
	// PAGE_ALL_ERROR.hidden=true;
	// PAGE_HELP.hidden=true;
	//But_var[0].disabled=true;
	//------------------------------------------------------------
	//document.getElementsByName("But_var").disabled=true;
	//va1.disabled="false";
	//------------------------------------------------------------
	GetSettingTimeout3('PageCondition.CGI',Single,function () {
		//------------------------------------------------------------
		//GetSettingTimeout3('GetVar.CGI',CYCLIC,Led_On,Led_Off);
		//------------------------------------------------------------
		var objJSON = eval('({' + this + '})');
		//------------------------------------------------------------
		var TablNameOfTheUnit = document.getElementById("TablCondNameOfTheUnit");
		var TablSerNumber = document.getElementById("TablCondSerNumber");
		var TablIpAdress = document.getElementById("TablCond_Ip_adress");
		
		TablNameOfTheUnit.innerHTML=objJSON.NameOfTheUnit;
		TablSerNumber.innerHTML=objJSON.SerNumber;
		TablIpAdress.innerHTML=objJSON.IP;
		//------------------------------------------------------------
		clearTimeout(IdTimeGetVar);
		IdTimeGetVar=setTimeout(GetVar,100);
		//------------------------------------------------------------
		
		
	});
}
//==================================================================================================
function TextBlink1(arr) {
    var b = true;
    return function() {
        arr.forEach(function(item) {
            item.el.textContent = b ? item.text : "";
            item.el.setAttribute("fill", RGB_STATUS_ERROR);
        });
        b = !b
 
    }
}		
//==================================================================================================
//==================================================================================================
//==================================================================================================
function ShowHelp(){

	PAGE_STATUS.style.display="none";
	PAGE_TABL.style.display="none";
	PAGE_SET.style.display="none";
	PAGE_ALL_ERROR.style.display="none";
	PAGE_HELP.style.display="block";	

	// PAGE_STATUS.hidden=true;
	// PAGE_TABL.hidden=true;
	// PAGE_SET.hidden=true;
	// PAGE_ALL_ERROR.hidden=true;
	// PAGE_HELP.hidden=false;	
	
}	
//==================================================================================================	
function GetVar() {
	
GetSettingTimeout3('GetVar.CGI',CYCLIC,function () {
	
			var arr = [];
	
			var objJSON = eval('(' + this + ')');
			//--------------------------------------------------------------------------------------
			var content = document.getElementById("crash_Log");
			content.innerHTML=" ";
			//--------------------------------------------------------------------------------------
			for(i=0;i<objJSON.MaxItemErr;i++){
				content.innerHTML+="<div class=\"style_log_"+objJSON.ItemErr[i].Status+"\"><div class=\"style_log_nomber\">"+objJSON.ItemErr[i].ItemN+"</div>"+
				"<div class=\"style_log_content\">"+objJSON.ItemErr[i].LogCont+"</div>"+
				"<div class=\"style_log_time\">"+objJSON.ItemErr[i].Time+"</div>"+"</div>"
			}
			//--------------------------------------------------------------------------------------
			var CurrentTime = document.getElementById("IdCurrentTime");
			CurrentTime.innerHTML='';
			CurrentTime.innerHTML="Время:"+objJSON.Time;
			//======================================================================================
			//=============================Режим работы вентилятора=================================
			//======================================================================================
			var FanMode1 = document.getElementById("Id_FanMode1"); //получаем любой элемент внутри svg
			var FanMode2 = document.getElementById("Id_FanMode2"); //получаем любой элемент внутри svg
			var FanMode3 = document.getElementById("Id_FanMode3"); //получаем любой элемент внутри svg
			var FanModeOff = document.getElementById("Id_FanModeOff"); //получаем любой элемент внутри svg
			//-----------------------------------
			var ArrModeFan = [
						{el: FanMode1,},
						{el: FanMode2,},
						{el: FanMode3,},
						{el: FanModeOff,}
			];
			//-----------------------------------
			var i=0;
			ArrModeFan.forEach(function(item) {
				if(i!=objJSON.ModeFan){
					item.el.setAttribute("fill",RGB_WHITE);
				}else{
					item.el.setAttribute("fill",RGB_STATUS_NORM);
				}
				i++;
			});
			//======================================================================================
			//---------------------------Т горячая--------------------------------------------------
			//======================================================================================
			var TempHot = document.getElementById("IdT_Hot");
			var TextStatusT_Hot = document.getElementById("Id_StatusT_Hot");			
			//--------------------------------------------------------------------------------------
			if(objJSON.T_Hot<127){
					TempHot.innerHTML="Т горячая="+objJSON.T_Hot+" \u2103";
			}else{
					TempHot.innerHTML="Т горячая="+" \u2212 "+(256-objJSON.T_Hot)+" \u2103";
			}
			//--------------------------------------------------------------------------------------
			if(objJSON.T_ST_Hot==0){	//Статус температуры 
				TempHot.setAttribute("fill",RGB_STATUS_NORM); //зеленый
				TextStatusT_Hot.setAttribute("fill",RGB_STATUS_NORM); //зеленый
				TextStatusT_Hot.innerHTML="Норма";
			}
			if(objJSON.T_ST_Hot==1){	//Статус температуры 
				TempHot.setAttribute("fill",RGB_STATUS_ADMONITION); //желтый				
				TextStatusT_Hot.setAttribute("fill",RGB_STATUS_ADMONITION); //желтый				
				TextStatusT_Hot.innerHTML="Норма";
			}
			if(objJSON.T_ST_Hot==3){	//Статус температуры 
				TempHot.setAttribute("fill",RGB_STATUS_ERROR); //желтый				
				TextStatusT_Hot.setAttribute("fill",RGB_STATUS_ERROR); //желтый				
				TempHot.innerHTML="Т горячая="+"XXX"+" \u2103";
				TextStatusT_Hot.innerHTML="КЗ";
			}			
			if(objJSON.T_ST_Hot==2){	//Статус температуры 
				TempHot.setAttribute("fill",RGB_STATUS_ERROR); //Красный
				arr.push({
					el: TextStatusT_Hot,
					text: "Авария"
				})
			}
			//--------------------------------------------------------------------------------------
			//--------------------------Т охлаждения------------------------------------------------
			//--------------------------------------------------------------------------------------
			var Temp_Colling = document.getElementById("IdTColling");
			var TextStatusT_Colling = document.getElementById("Id_StatusT_Colling");			
			//--------------------------------------------------------------------------------------
			if(objJSON.T_Colling<127){
					Temp_Colling.innerHTML="Т охлаждения="+objJSON.T_Colling+" \u2103";
			}else{
					Temp_Colling.innerHTML="Т охлаждения="+" \u2212 "+(256-objJSON.T_Colling)+" \u2103";
			}
			//--------------------------------------------------------------------------------------
			if(objJSON.T_ST_Colling==0){	//Статус температуры 
				Temp_Colling.setAttribute("fill",RGB_STATUS_NORM); //зеленый
				TextStatusT_Colling.setAttribute("fill",RGB_STATUS_NORM); //зеленый
				TextStatusT_Colling.innerHTML="Норма";
			}
			if(objJSON.T_ST_Colling==1){	//Статус температуры 
				Temp_Colling.setAttribute("fill",RGB_STATUS_ADMONITION); //желтый
				TextStatusT_Colling.setAttribute("fill",RGB_STATUS_ADMONITION); //желтый				
				TextStatusT_Colling.innerHTML="Норма";
			}
			if(objJSON.T_ST_Colling==3){	//Статус КЗ
				Temp_Colling.setAttribute("fill",RGB_STATUS_ERROR); 
				TextStatusT_Colling.setAttribute("fill",RGB_STATUS_ERROR); 
				TextStatusT_Colling.innerHTML="КЗ";
				Temp_Colling.innerHTML="Т охлаждения="+"XXX"+" \u2103";
			}			
			if(objJSON.T_ST_Colling==2){	//Статус температуры 
				Temp_Colling.setAttribute("fill",RGB_STATUS_ERROR); //Красный
				arr.push({
					el: TextStatusT_Colling,
					text: "Авария"
				})				
			}
			//--------------------------------------------------------------------------------------
			//--------------------------Т Холодная--------------------------------------------------
			//--------------------------------------------------------------------------------------
			var Temp_Cold = document.getElementById("IdTCold");
			var TextStatusT_Cold = document.getElementById("Id_StatusT_Cold");			
			//--------------------------------------------------------------------------------------
			if(objJSON.T_Cold<127){
					Temp_Cold.innerHTML="Т холодная="+objJSON.T_Cold+" \u2103";
			}else{
					Temp_Cold.innerHTML="Т холодная="+" \u2212 "+(256-objJSON.T_Cold)+" \u2103";
			}			
			//--------------------------------------------------------------------------------------
			if(objJSON.T_ST_Cold==0){	//Статус температуры 
				Temp_Cold.setAttribute("fill",RGB_STATUS_NORM); //зеленый
				TextStatusT_Cold.setAttribute("fill",RGB_STATUS_NORM); //зеленый
				TextStatusT_Cold.innerHTML="Норма";
			}
			if(objJSON.T_ST_Cold==1){	//Статус температуры 
				Temp_Cold.setAttribute("fill",RGB_STATUS_ADMONITION); //желтый
				TextStatusT_Cold.setAttribute("fill",RGB_STATUS_ADMONITION); //желтый				
				TextStatusT_Cold.innerHTML="Норма";
			}
			if(objJSON.T_ST_Cold==3){	//Статус КЗ
				Temp_Cold.setAttribute("fill",RGB_STATUS_ERROR); 
				TextStatusT_Cold.setAttribute("fill",RGB_STATUS_ERROR); 
				TextStatusT_Cold.innerHTML="КЗ";
				Temp_Cold.innerHTML="Т холодная="+"XXX"+" \u2103";
			}			
			if(objJSON.T_ST_Cold==2){	//Статус температуры 
				Temp_Cold.setAttribute("fill",RGB_STATUS_ERROR); //Красный
				arr.push({
					el: TextStatusT_Cold,
					text: "Авария"
				})				
			}
			
			
			//--------------------------------------------------------------------------------------
			//--------------------------Т Уличная---------------------------------------------------
			//--------------------------------------------------------------------------------------
			var Temp_Out = document.getElementById("IdTOut");
			var TextStatusT_Out = document.getElementById("Id_StatusT_Out");			
			//--------------------------------------------------------------------------------------
			if(objJSON.T_Out<127){
					Temp_Out.innerHTML="Т уличная="+objJSON.T_Out+" \u2103";
			}else{
					Temp_Out.innerHTML="Т уличная="+" \u2212 "+(256-objJSON.T_Out)+" \u2103";
			}						
			//--------------------------------------------------------------------------------------
			if(objJSON.T_ST_Out==0){	//Статус температуры 
				Temp_Out.setAttribute("fill",RGB_STATUS_NORM); //зеленый
				TextStatusT_Out.setAttribute("fill",RGB_STATUS_NORM); //зеленый
				TextStatusT_Out.innerHTML="Норма";
			}
			if(objJSON.T_ST_Out==1){	//Статус температуры 
				Temp_Out.setAttribute("fill",RGB_STATUS_ADMONITION); //желтый
				TextStatusT_Out.setAttribute("fill",RGB_STATUS_ADMONITION); //желтый				
				TextStatusT_Out.innerHTML="Норма";
			}
			if(objJSON.T_ST_Out==3){	//температуры 
				Temp_Out.setAttribute("fill",RGB_STATUS_ERROR); //желтый
				TextStatusT_Out.setAttribute("fill",RGB_STATUS_ERROR); //желтый				
				TextStatusT_Out.innerHTML="КЗ";
				Temp_Out.innerHTML="Т уличная="+"XXX"+" \u2103";
			}
			if(objJSON.T_ST_Out==2){	//Статус температуры 
				Temp_Out.setAttribute("fill",RGB_STATUS_ERROR); //Красный
				arr.push({
					el: TextStatusT_Out,
					text: "Авария"
				})
			}
			//======================================================================================
			//======================================================================================
			//======================================================================================
			var StatusPump1 = document.getElementById("Id_StatusPump1");
			var StatusPump2 = document.getElementById("Id_StatusPump2");
			//--------------------------------------------------------------------------------------
			if(objJSON.Pump1==0){
				StatusPump1.setAttribute("fill",RGB_WHITE);
			}
			if(objJSON.Pump1==1){
				StatusPump1.setAttribute("fill",RGB_STATUS_NORM);
			}
			if(objJSON.Pump1==2){	//Статус температуры 
				StatusPump1.setAttribute("fill",RGB_STATUS_ERROR); //Красный
			}
			//--------------------------------------------------------------------------------------
			if(objJSON.Pump2==0){
				StatusPump2.setAttribute("fill",RGB_WHITE);
			}
			if(objJSON.Pump2==1){
				StatusPump2.setAttribute("fill",RGB_STATUS_NORM);
			}
			if(objJSON.Pump2==2){
				StatusPump2.setAttribute("fill",RGB_STATUS_ERROR);
			}
			//======================================================================================
			//======================================================================================
			//======================================================================================
			var WaterLvl = document.getElementById("IdWaterLvl");
			
			if(objJSON.WaterLvl==1){
				WaterLvl.setAttribute("fill",RGB_STATUS_NORM);
				WaterLvl.innerHTML="Норма";
			}else{
				WaterLvl.setAttribute("fill",RGB_STATUS_ERROR);
				arr.push({
					el: WaterLvl,
					text: "Авария"
				})					
			}
			//======================================================================================
			//=============================Расход жидкости==========================================
			//======================================================================================
			var VarConsumption = document.getElementById("IdConsumption");
			var TextStatusConsumption = document.getElementById("Id_StatusConsumption");			
			//--------------------------------------------------------------------------------------
			VarConsumption.innerHTML=objJSON.Consumption+" л/ч";
			//--------------------------------------------------------------------------------------
			if(objJSON.ST_Consumption==0){	//Статус температуры 
				VarConsumption.setAttribute("fill",RGB_STATUS_NORM); //зеленый
				TextStatusConsumption.setAttribute("fill",RGB_STATUS_NORM); //зеленый
				TextStatusConsumption.innerHTML="Норма";
			}
			if(objJSON.ST_Consumption==1){	//Статус температуры 
				VarConsumption.setAttribute("fill",RGB_STATUS_ADMONITION); //желтый
				TextStatusConsumption.setAttribute("fill",RGB_STATUS_ADMONITION); //желтый				
				TextStatusConsumption.innerHTML="Норма";
			}
			if(objJSON.ST_Consumption==2){	//Статус температуры 
				VarConsumption.setAttribute("fill",RGB_STATUS_ERROR); //Красный
				arr.push({
					el: TextStatusConsumption,
					text: "Авария"
				})				
			}
			//======================================================================================
			clearInterval(TimerBlink);
			var fn = TextBlink1(arr);
			TimerBlink=setInterval(fn, 300);
		});
}
//==================================================================================================
//------------------Обработчик кнопки Параметры-----------------------------------------------------
//==================================================================================================
function PageOptions() {
	StatusAbort=UserAbbort;
	http2.abort();
	clearInterval(TimerID);
	//------------------------------
	
	PAGE_STATUS.style.display="block";
	PAGE_TABL.style.display="none";
	PAGE_SET.style.display="none";
	PAGE_ALL_ERROR.style.display="none";
	PAGE_HELP.style.display="none";		
	
	// PAGE_STATUS.hidden=false;
	// PAGE_SET.hidden=true;
	// PAGE_TABL.hidden=true;
	// PAGE_ALL_ERROR.hidden=true;
	// PAGE_HELP.hidden=true;
	//------------------------------

		var PageOpt_Inpun_IP = document.getElementById("po_id_ip_adress");
		var PageOpt_Subnet_Mask = document.getElementById("po_id_Subnet_Mask");
		var PageOpt_gateway = document.getElementById("po_id_gateway");
		
		var PageOpt_Ip_adress_access1 = document.getElementById("po_id_Ip_adress_access1");
		var PageOpt_Ip_adress_access2 = document.getElementById("po_id_Ip_adress_access2");
		var PageOpt_Ip_adress_access3 = document.getElementById("po_id_Ip_adress_access3");
		var PageOpt_Ip_adress_access4 = document.getElementById("po_id_Ip_adress_access4");
		//-------------------------SNMP--------------------------------------------------------
		var PageOpt_Community_Read_SNMP = document.getElementById("po_id_Ip_Community_Read");
		var PageOpt_Community_Write_SNMP = document.getElementById("po_id_Ip_Community_Write");
		//-------------------------TRAP1--------------------------------------------------------
		var PageOpt_Ip_Trap_server_1 = document.getElementById("po_id_Ip_Trap_server_1");
		var PageOpt_Port_Trap_server_1 = document.getElementById("po_id_Trap_server_1_port");
		var PageOpt_Port_Trap_server_1_ON_OFF = document.getElementById("po_id_checkbox_trap_1");
		var PageOpt_Community_Trap_server_1 = document.getElementById("po_id_Trap_server_1_Community");
		//-------------------------TRAP2--------------------------------------------------------
		var PageOpt_Ip_Trap_server_2 = document.getElementById("po_id_Ip_Trap_server_2");
		var PageOpt_Port_Trap_server_2 = document.getElementById("po_id_Trap_server_2_port");
		var PageOpt_Port_Trap_server_2_ON_OFF = document.getElementById("po_id_checkbox_trap_2");
		var PageOpt_Community_Trap_server_2 = document.getElementById("po_id_Trap_server_2_Community");
	//------------------------------------------------------------
	GetSettingTimeout3('PageOptions.CGI',Single,function () {
		//------------------------------------------------------------
		var objJSON = eval('({' + this + '})');
		//------------------------------------------------------------
		PageOpt_Inpun_IP.value=objJSON.IP;
		PageOpt_Subnet_Mask.value=objJSON.Mask;
		PageOpt_gateway.value=objJSON.Gateway;
		//------------------------------------------------------------
		if(objJSON.IP_Access[0]=='0.0.0.0'){
			PageOpt_Ip_adress_access1.value="";
		}else{
			PageOpt_Ip_adress_access1.value=objJSON.IP_Access[0]+'/'+objJSON.Mask_Access[0];
		}
		if(objJSON.IP_Access[1]=='0.0.0.0'){
			PageOpt_Ip_adress_access2.value="";
		}else{
			PageOpt_Ip_adress_access2.value=objJSON.IP_Access[1]+'/'+objJSON.Mask_Access[1];
		}
		if(objJSON.IP_Access[2]=='0.0.0.0'){
			PageOpt_Ip_adress_access3.value="";
		}else{
			PageOpt_Ip_adress_access3.value=objJSON.IP_Access[2]+'/'+objJSON.Mask_Access[2];
		}
		if(objJSON.IP_Access[3]=='0.0.0.0'){
			PageOpt_Ip_adress_access4.value="";
		}else{
			PageOpt_Ip_adress_access4.value=objJSON.IP_Access[3]+'/'+objJSON.Mask_Access[3];
		}
		//------------------------------------------------------------
		PageOpt_Community_Read_SNMP.value=objJSON.ComReadSNMP;
		PageOpt_Community_Write_SNMP.value=objJSON.ComWriteSNMP;
		//------------------------------------------------------------
		PageOpt_Ip_Trap_server_1.value=objJSON.IpTrap[0];
		PageOpt_Port_Trap_server_1.value=objJSON.PortTrap[0];
		PageOpt_Port_Trap_server_1_ON_OFF.checked=objJSON.TrapCheckbox[0];
		PageOpt_Community_Trap_server_1.value=objJSON.Comm[0];
		//------------------------------------------------------------
		PageOpt_Ip_Trap_server_2.value=objJSON.IpTrap[1];
		PageOpt_Port_Trap_server_2.value=objJSON.PortTrap[1];
		PageOpt_Port_Trap_server_2_ON_OFF.checked=objJSON.TrapCheckbox[1];		
		PageOpt_Community_Trap_server_2.value=objJSON.Comm[1];
		//------------------------------------------------------------
		// var Inpun_IP = document.getElementById("id_Ip_adress");
		// var Inpun_Mask = document.getElementById("id_Subnet_Mask");
		
		// Inpun_Mask.value=objJSON.Pout
		// Inpun_IP.value=objJSON.SerNumber;
	});
	//------------------------------------------------------------		
}
//==================================================================================================
//------------------Обработчик кнопки Настройки-----------------------------------------------------
//==================================================================================================
function PageSetting() {
	StatusAbort=UserAbbort;
	http2.abort();
	clearInterval(TimerID);
	//-------------------------------------------------------
	// PAGE_STATUS.hidden=true;
	// PAGE_SET.hidden=false;
	// PAGE_TABL.hidden=true;
	// PAGE_ALL_ERROR.hidden=true;
	// PAGE_HELP.hidden=true;
	PAGE_STATUS.style.display="none";
	PAGE_TABL.style.display="none";
	PAGE_SET.style.display="block";
	PAGE_ALL_ERROR.style.display="none";
	PAGE_HELP.style.display="none";	
	//-------------------------------------------------------
	But_var[0].disabled=false;	
	//------------------------------------------------------------
	GetSettingTimeout3('PageSettings.CGI',Single,function () {
		//------------------------------------------------------------
		var objJSON = eval('(' + this + ')');
		
		//------------------------------------------------------------
		if(objJSON.Kalib_ST==2){
			//-----------Калибровка запрещена-------------------------
			document.getElementById("Id_Save_Tlim").disabled=true;
			document.getElementById("Id_clear_log").disabled=true;
			document.getElementById("Id_T1_lim_Up").disabled=true;
			document.getElementById("Id_T2_lim_Up").disabled=true;
			document.getElementById("Id_T3_lim_Up").disabled=true;
			document.getElementById("Id_T4_lim_Down").disabled=true;
			document.getElementById("Id_T5_lim_Down").disabled=true;
			document.getElementById("Id_T6_lim_Down").disabled=true;
		}
		if(objJSON.Kalib_ST==1){
			//-----------Калибровка разрешена-------------------------
			document.getElementById("Id_Save_Tlim").disabled=false;
			document.getElementById("Id_clear_log").disabled=false;
			document.getElementById("Id_T1_lim_Up").disabled=false;
			document.getElementById("Id_T2_lim_Up").disabled=false;
			document.getElementById("Id_T3_lim_Up").disabled=false;
			document.getElementById("Id_T4_lim_Down").disabled=false;
			document.getElementById("Id_T5_lim_Down").disabled=false;
			document.getElementById("Id_T6_lim_Down").disabled=false;
		}
		//------------------------------------------------------------		
		
		
		//------------------------------------------------------------
		//------------------------------------------------------------
		var Inpun_SerNumber = document.getElementById("Id_SerNumber");
		var Inpun_MacAddr = document.getElementById("Id_MacAddr");
		var Inpun_NameOfTheUnit = document.getElementById("id_NameOfTheUnit");
		//------------------------------------------------------------------
		var Inpun_Id_T1_lim_Up = document.getElementById("Id_T1_lim_Up");
		var Inpun_Id_T2_lim_Up = document.getElementById("Id_T2_lim_Up");
		var Inpun_Id_T3_lim_Up = document.getElementById("Id_T3_lim_Up");
		var Inpun_Id_T4_lim_Down = document.getElementById("Id_T4_lim_Down");
		var Inpun_Id_T5_lim_Down = document.getElementById("Id_T5_lim_Down");
		var Inpun_Id_T6_lim_Down = document.getElementById("Id_T6_lim_Down");
		//------------------------------------------------------------------
		Inpun_Id_T1_lim_Up.value=objJSON.T1_lim;
		Inpun_Id_T2_lim_Up.value=objJSON.T2_lim;
		Inpun_Id_T3_lim_Up.value=objJSON.T3_lim;
		
		Inpun_Id_T4_lim_Down.value=objJSON.T6_lim;
		Inpun_Id_T5_lim_Down.value=objJSON.T5_lim;
		Inpun_Id_T6_lim_Down.value=objJSON.T4_lim;
		
		Inpun_NameOfTheUnit.value=objJSON.NameOfTheUnit;
		Inpun_MacAddr.value=objJSON.Mac;
		Inpun_SerNumber.value=objJSON.SerNumber;
	});
	//------------------------------------------------------------
}
//==================================================================================================
//------------------Обработчик кнопки сохранить страница НАСТРОЙКИ----------------------------------
//==================================================================================================
function SavePageSetting(){
		//----------------------------------------------------------
		//validator.check(this);
		//----------------------------------------------------------
		var Inpun_SerNumber = document.getElementById("Id_SerNumber");
		var Inpun_MacAddr = document.getElementById("Id_MacAddr");
		var NameOfTheUnit = document.getElementById("id_NameOfTheUnit");
		//----------------------------------------------------------
		var NewPasword = document.getElementById("Id_NewPasword");
		var DublPasword = document.getElementById("Id_DublPasword");
		var Pasword = document.getElementById("Id_Pasword");
		//----------------------------------------------------------
		var Kalib_ST = document.getElementById("id_checkbox_kalib");
		//----------------------------------------------------------
		var NewPassword;
		if(DublPasword.value==""){
			NewPassword="Null";
		}else{NewPassword=DublPasword.value;}
		//----------------------------------------------------------
		if(NewPasword.value==DublPasword.value){
			SettingSend=Pasword.value+","+
			Inpun_MacAddr.value+","+		
			NameOfTheUnit.value+","+		
			Inpun_SerNumber.value+","+
			NewPassword+","+
			Kalib_ST.checked+","+
			"\0";	
		}else{
			alert("Пароли не совпадают");
			return;
		}
		//------------------------------------------------------------
		GetSettingTimeout3('PageSettingsSave.CGI?'+SettingSend,Single,function () {
		//------------------------------------------------------------
			if(this=="OK"){
				alert("Сохранено");
			}else{alert("Введен неправильный пароль");}
		});
		//------------------------------------------------------------		
		
//ValidIpAddressRegex = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$";		
		
}
//==================================================================================================
//------------------Обработчик кнопки сохранить страница ПАРАМЕТРЫ----------------------------------
//==================================================================================================
function SavePageOptions(){
	
		var Str_Ip_adress_access1;
		var Str_Ip_adress_access2;
		var Str_Ip_adress_access3;
		var Str_Ip_adress_access4;

		var PageOpt_Inpun_IP = document.getElementById("po_id_ip_adress");
		var PageOpt_Subnet_Mask = document.getElementById("po_id_Subnet_Mask");
		var PageOpt_gateway = document.getElementById("po_id_gateway");
		
		var PageOpt_Ip_adress_access1 = document.getElementById("po_id_Ip_adress_access1");
		var PageOpt_Ip_adress_access2 = document.getElementById("po_id_Ip_adress_access2");
		var PageOpt_Ip_adress_access3 = document.getElementById("po_id_Ip_adress_access3");
		var PageOpt_Ip_adress_access4 = document.getElementById("po_id_Ip_adress_access4");
		//------------------------------------------------------------------------------------------
		var Community_Read = document.getElementById("po_id_Ip_Community_Read");
		var Community_Write = document.getElementById("po_id_Ip_Community_Write");
		//-----------------------------TrapServer1--------------------------------------------------
		var PageOpt_Port_Trap_server_1_ON_OFF = document.getElementById("po_id_checkbox_trap_1");
		var PageOpt_Ip_Trap_server_1 = document.getElementById("po_id_Ip_Trap_server_1");
		var PageOpt_Port_Trap_server_1 = document.getElementById("po_id_Trap_server_1_port");
		var Trap_server1_Community = document.getElementById("po_id_Trap_server_1_Community");
		//-----------------------------TrapServer2--------------------------------------------------
		var PageOpt_Port_Trap_server_2_ON_OFF = document.getElementById("po_id_checkbox_trap_2");
		var PageOpt_Ip_Trap_server_2 = document.getElementById("po_id_Ip_Trap_server_2");
		var PageOpt_Port_Trap_server_2 = document.getElementById("po_id_Trap_server_2_port");
		var Trap_server2_Community = document.getElementById("po_id_Trap_server_2_Community");
		
		if(PageOpt_Ip_adress_access1.value==""){Str_Ip_adress_access1="Entry";}else{Str_Ip_adress_access1=PageOpt_Ip_adress_access1.value;}
		if(PageOpt_Ip_adress_access2.value==""){Str_Ip_adress_access2="Entry";}else{Str_Ip_adress_access2=PageOpt_Ip_adress_access2.value;}
		if(PageOpt_Ip_adress_access3.value==""){Str_Ip_adress_access3="Entry";}else{Str_Ip_adress_access3=PageOpt_Ip_adress_access3.value;}
		if(PageOpt_Ip_adress_access4.value==""){Str_Ip_adress_access4="Entry";}else{Str_Ip_adress_access4=PageOpt_Ip_adress_access4.value;}
		
		var SettingSend;
		
		if(Community_Read.value==""){alert("Пожалуйста, заполните поле Community Read.");Community_Read.value="Null"};
		if(Community_Write.value==""){alert("Пожалуйста, заполните поле Community Write.");Community_Write.value="Null"};
		
		
		SettingSend=PageOpt_Inpun_IP.value+","+				//IP
					PageOpt_Subnet_Mask.value+","+			//Mask
					PageOpt_gateway.value+","+				//Gw
					Str_Ip_adress_access1+","+	//ip1
					Str_Ip_adress_access2+","+	//ip2
					Str_Ip_adress_access3+","+	//ip3
					Str_Ip_adress_access4+","+	//ip4
					//-----------Snmp-------------------------
					Community_Read.value+","+	
					Community_Write.value+","+	
					//-----------TrapServer1-------------------------
					PageOpt_Port_Trap_server_1_ON_OFF.checked+","+
					PageOpt_Ip_Trap_server_1.value+","+
					PageOpt_Port_Trap_server_1.value+","+
					Trap_server1_Community.value+","+
					//-----------TrapServer2-------------------------
					PageOpt_Port_Trap_server_2_ON_OFF.checked+","+
					PageOpt_Ip_Trap_server_2.value+","+
					PageOpt_Port_Trap_server_2.value+","+
					Trap_server2_Community.value+","+					
					"\0";	
		//------------------------------------------------------------
		GetSettingTimeout3('SavePageOptions.CGI?'+SettingSend,Single,function () {
		//------------------------------------------------------------
			if(this=="OK"){
				alert("Сохранено");
			}
		});
		//------------------------------------------------------------
	//document.write(document.location.href);
	//document.location.href = 'http://'+PageOpt_Inpun_IP.value;	
	
	//setTimeout("document.location.href='http://"+PageOpt_Inpun_IP.value, 10000);

}
//==================================================================================================
//------------------Показать весь журнал-----------------------------------------------------
//==================================================================================================
function ShowAllError() {
	StatusAbort=UserAbbort;
	http2.abort();
	clearInterval(TimerID);

	PAGE_STATUS.style.display="none";
	PAGE_TABL.style.display="none";
	PAGE_SET.style.display="none";
	PAGE_ALL_ERROR.style.display="block";
	PAGE_HELP.style.display="none";	

	//----------------------------------------------------------------------------------------------
	GetSettingTimeout3('ShowAllError.CGI',Single,function () {
		//------------------------------------------------------------------------------------------
		var objJSON = eval('(' + this + ')');
		//---------------------Журнал аварий--------------------------------------------------------
		var content = document.getElementById("ALL_crash_Log");
		content.innerHTML=" ";
		//-------------------------------------
		for(i=0;i<objJSON.MaxItemErr;i++){
			content.innerHTML+="<div class=\"style_log_"+objJSON.ItemErr[i].Status+"\"><div class=\"style_log_nomber\">"+objJSON.ItemErr[i].ItemN+"</div>"+
			"<div class=\"style_log_content\">"+objJSON.ItemErr[i].LogCont+"</div>"+
			"<div class=\"style_log_time\">"+objJSON.ItemErr[i].Time+"</div>"+"</div>"
		}
		//-------------------------------------
	});
	//----------------------------------------------------------------------------------------------
}
//==================================================================================================
//==================================================================================================
function clear_log(){
	//------------------------------------------------------------
	GetSettingTimeout3('clear_log.CGI',Single,function () {
	//------------------------------------------------------------
		if(this=="OK"){
			alert("Журнал стерт");
		}else{
			{alert("Отчистка журнала запрещена");}
		}
	});	
}
//==================================================================================================
function SaveLimT(){
	//------------------------------------------------------------------
	var Inpun_Id_T1_lim_Up = document.getElementById("Id_T1_lim_Up");
	var Inpun_Id_T2_lim_Up = document.getElementById("Id_T2_lim_Up");
	var Inpun_Id_T3_lim_Up = document.getElementById("Id_T3_lim_Up");
	var Inpun_Id_T4_lim_Down = document.getElementById("Id_T4_lim_Down");
	var Inpun_Id_T5_lim_Down = document.getElementById("Id_T5_lim_Down");
	var Inpun_Id_T6_lim_Down = document.getElementById("Id_T6_lim_Down");
	//------------------------------------------------------------------
	var SettingSend;
	SettingSend=Inpun_Id_T1_lim_Up.value+","+
	Inpun_Id_T2_lim_Up.value+","+
	Inpun_Id_T3_lim_Up.value+","+
	Inpun_Id_T4_lim_Down.value+","+
	Inpun_Id_T5_lim_Down.value+","+
	Inpun_Id_T6_lim_Down.value+","+"\0";
	//------------------------------------------------------------
	GetSettingTimeout3('SwitchRangeTemp.CGI?'+SettingSend,Single,function () {
	//------------------------------------------------------------
		if(this=="OK"){
			alert("Температурные пороги сохранены");
		}else{alert("Сохранение порогов запрещено");}
	});	
}
//==================================================================================================

//------------------Тестирование журнала аварий-----------------------------------------------------
//==================================================================================================
//==================================================================================================
//==================================================================================================
//==================================================================================================
var TimerBlink;
//==================================================================================================
//------------------Обработчик кнопки сохранить-----------------------------------------------------
//==================================================================================================

/**
 * Объект "validator" 
 * version 1.2
 * autor Komarov Artem 
 * site : http://php-zametki.ru
 * email: arty-komarov@yandex.ru
 */
var validator = (function( GLOB ){
	return {
		// Объект для тестов. Здесь он пустой
		// Наполняется он в файле validator_tests.js
		tests : {},
		// Контейнер для элементов, которые потребуется сравнивать
		samples : {},
		/**
		 * Метод для валидации формы.
		 * Вешается на обработчик onsubmit
		 * @param object form: Объект html-формы.
		 * @return boolean true|false
		 */
		check : function ( form ) {
			var DOC      = GLOB.document,   // Зависимость 
				elements = form.elements,   // Здесь будут элементы формы
				elLength = elements.length, // Количество элементы формы
				require  = false, // Флаг: обязательно ли поле
				curItem  = null,  // Текущий (для цикла) элемент формы
				curVal   = null,  // Текущее (для цикла) значение элемента формы
				curTest  = null,  // Текущий (для цикла) класс/тест элемента формы
				curSample= null,  // Текущий элемент сравнения
				errSpan  = null,  // Контейнер для ошибок элемента формы
				tests    = new Array(), // Здесь будут классы/тесты элемента формы
				errors   = {},    // Флаг указывает есть ли ошибки
				prop     = null,  // Свойство для обхода объекта errors
				testsLength = 0,  // Количество классов/тестов элемента формы	
				outerLoop = null,
				innerLoop = null,
				errorLoop = null,
				i, // Счётчики циклов
				q;	
				
			this.samples = {};
				
			outerLoop: for (i = 0; i < elLength; i += 1) {
				// Получаем текущий элемент:	
				curItem  = elements[i];
				// Пропускаем элементы не имеющие атрибутов: class и value:
				if (typeof (curItem.className) === "undefined" || typeof (curItem.value) === "undefined") {
					continue outerLoop;
				}
				// Получаем текущее значение:
				curVal = curItem.value;
				// Узнаём обязателен ли текущий элемент:
				require = (curItem.className.indexOf("require") !== -1);								
				// Пытаемся получить ссылку на элемент-контейнер ошибок:
				errSpan = DOC.getElementById(curItem.name + "_error");
				// Если элемента-контейнера не существует
				if (!errSpan) {
					// ... формируем его:
					errSpan    = DOC.createElement("SPAN");
					errSpan.id = curItem.name + "_error";
					errSpan.className = "error";
					// и добавляем его в DOM - древо, 
					// сразу после текущего элемента формы.
					curItem.parentNode.insertBefore(errSpan, curItem.nextSibling);
				}
				// Если текущий элемент не обязателен и не заполнен...
				if (curVal.length < 1 && !require) {
					// Очищаем его контейнер, на случай, если он уже содержал текст ошибки,
					errSpan.innerHTML = "";
					// и пропускаем итерацию цикла.
					continue outerLoop;
				}
				// Получаем имена классов/тестов в массив:
				tests = curItem.className.split(" ");
				// Получаем длину массива:
				testsLength = tests.length;		
				
				// Проходим по массиву классов/тестов циклом:
				innerLoop: for (q = 0; q < testsLength; q += 1) {
					// Получаем текущее имя класса:	
					curTest  = tests[q];
					// Если текущее имя класса не является тестом...
					if (!this.tests.hasOwnProperty(curTest)) {
						// пропускаем итерацию.
						continue innerLoop;
					}
					// Собсна проверка:
					if (!curVal.match(this.tests[curTest].condition)) {
						// Устанавливаем флаг для этой ошибки:
						errors[curItem.name] = true;
						// Не удачно - пишем ошибку в контейнер:
						errSpan.innerHTML = this.tests[curTest].failText;					
						// Останавливаем цикл - вывод остальных ошибок для этого элемента не нужен,
						// - не зачем пугать пользователя, пусть сначала устранят ту ошибку что есть.
						break innerLoop;
					} else {
						// Снимаем флаг ошибки:
						errors[curItem.name] = false;
						// Удачно - очищаем контейнер от содержимого.
						errSpan.innerHTML = "";					
					} // END IF
				} // END innerLoop
				
				// Проверка идентичности значения полей				
				curSample = curItem.className.match(/\bconfirm-?\d{0,}\b/i);
				
				if ( curSample !== null ) {
					// Устанавливаем эталон:
					if (typeof(this.samples[curSample]) === "undefined"){
						this.samples[curSample] = curVal;						
					} else {
						if (this.samples[curSample] !== curVal) {
							errors[curItem.name + "_samples"] = true;
							errSpan.innerHTML = "Х";
						} else {
							errors[curItem.name + "_samples"] = false;
							errSpan.innerHTML = "";
						}						
					}													
				} 					
			} // END outerLoop
											
			/* 
			 * Проверяем наличие установленных флагов ошибок. 
			 * Если ошибок нет возвращаем true - в этом случае
			 * Обработчик "onsubmit" должен штатно отработать.
			 */ 
			errorLoop: for( prop in errors ) {
				if ( errors.hasOwnProperty(prop) && errors[prop] === true) {
					return false;
				}	
			}			
			return true;
			
		} // END CHECK		
	};
}(this));


/**
 * Набор тестов для объекта "validator" 
 * autor Komarov Artem 
 * site : http://php-zametki.ru
 * email: arty-komarov@yandex.ru
 */

/**
 * Проверка ввода русских букв и пробелов:
 */
validator.tests.ru_char = {
	failText  : "Допустимы только русские буквы и пробелы.",
	condition : /^[а-яё\s]+$/i
};
/**
 * Проверка ввода латинских букв и пробелов:
 */
validator.tests.en_char = {
	failText  : "Допустимы только английские буквы и пробелы.",
	condition : /^[a-z\s]+$/i
};
/**
 * Проверка ввода целых чисел:
 */
validator.tests.integer =  {
	failText  : "Допустимы целые чила.",
	condition : /^\b\d+$/
};
/**
 * Проверка ввода целых, вещественных, положительных и отрицательных чисел:
 */
validator.tests.numeric  =  {
	failText  : "Допустимы целые и веществ. чила.",
	condition : /^[\-+]?\b[0-9]*\.?[0-9]+$/
};
/**
 * Заимствовано из библиотеки программы RegexBuddy: http://www.regexbuddy.com/
 * Проверка ввода email:
 */
validator.tests.email   =  {
	failText  : "Допустим только валидный email адрес.",
	condition : /\b[A-Z0-9-._%+]+@[A-Z0-9-.]+\.[A-Z]{2,4}\b/i
};
/**
 * Проверка заполнения, пробелы учитываются:
 */
validator.tests.require =  {
	failText  : "Обязательное поле.",
	condition : /^.+$/im
	//condition : /[\u0020-\u007d\u0410-\u0451]+/i
	//condition : /[\wа-яё]+/i
};
/**
 * Проверка заполнения, пробелы не учитываются:
 */
validator.tests.require_ws =  {
	failText  : "Обязательное поле без учёта пробелов.",
	condition : /[\u0021-\u007d\u0410-\u0451]+/im
	//condition : /[\wа-яё]+/i
};
/**
 * Заимствовано из библиотеки программы RegexBuddy: http://www.regexbuddy.com/
 * IPv4-адрес (точный захват)
 * Захват с 0.0.0.0 по 255.255.255.255
 */
validator.tests.ip_Mask = {
	failText  : "Не правильный формат.",
	condition : /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/(\d|[1-2]\d|3[0-2]))$/
				  
};
validator.tests.ipv4 = {
	failText  : "Не правильный формат.",
	condition : /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
	//condition : /(?!^0+\.)(?!.*?\.0+$)(^(25[0-4]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-4]|2[0-4]\d|[0-1]?\d?\d)){3}$)/
	//condition : /^([0-9]{1,3}\.){3}[0-9]{1,3}$/
	//condition : /\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\b/
	//condition : /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/(\d|[1-2]\d|3[0-2]))$/
				  
};
validator.tests.Port = {
	failText  : "Не правильный формат порт:[0-65535].",
	condition : /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/
	
};
validator.tests.Community = {
	failText  : "Не правильный формат, длина больше 10 символов или присутствуют Кириллические символы",
	//failText  : "Кирилица не допустима.",
	condition : /^[^А-Яа-я]{1,10}$/
	//condition : /^[^А-Яа-я]+$/
};
validator.tests.Mac = {
	failText  : "Не правильный формат Mac",
	condition : /([0-9a-fA-F]{2}([:-]|$)){6}$|([0-9a-fA-F]{4}([.]|$)){3}/
	
};
/**
 * Заимствовано из библиотеки программы RegexBuddy: http://www.regexbuddy.com/
 * Проверка доменного имени:
 */
validator.tests.domain =  {
	failText  : "Не правильное доменное имя.",
	condition : /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i
	//condition : /[\wа-яё]+/i
};
/*
 * Заимствовано из библиотеки программы RegexBuddy: http://www.regexbuddy.com/
 * Кредитные карты: Все основные кредитные карты.
 * Проверка правильности номера кредитных карт, цифры которых могут быть сгруппированы в логические блоки, 
 * и разделяться пробелами или тире или не разделяться. 
 */
validator.tests.cred_card =  {
	failText  : "Не правильный номер карты.",
	condition : /^(?:4\d{3}[ -]*\d{4}[ -]*\d{4}[ -]*\d(?:\d{3})?|5[1-5]\d{2}[ -]*\d{4}[ -]*\d{4}[ -]*\d{4}|6(?:011|5[0-9]{2})[ -]*\d{4}[ -]*\d{4}[ -]*\d{4}|3[47]\d{2}[ -]*\d{6}[ -]*\d{5}|3(?:0[0-5]|[68][0-9])\d[ -]*\d{6}[ -]*\d{4}|(?:2131|1800)[ -]*\d{6}[ -]*\d{5}|35\d{2}[ -]*\d{4}[ -]*\d{4}[ -]*\d{4})$/
	//condition : /[\wа-яё]+/i
};
