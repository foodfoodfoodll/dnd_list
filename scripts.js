var form = window.document.forms.my.elements;

window.document.forms.my.addEventListener("Enter.keydown", preventEvent);

function preventEvent(event) {
	if (event.cancelable)
		//  если событие может быть отменено и
		event.preventDefault(); // отменяем действие события по умолчанию
}

function logOut() {
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = () => (window.location.href = "login.html");
	httpRequest.open("POST", "logout.php");
	httpRequest.send();
}

function set_weapon_request(url, index) {
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function () {
		set_weapon_response(httpRequest, index);
	};
	let json = JSON.stringify({
		value: this.value,
	});
	httpRequest.open("GET", url, true);
	httpRequest.send();
}
function set_weapon_response(httpRequest, index) {
	if (httpRequest.readyState == 4) {
		if (httpRequest.status == 200) {
			let response = JSON.parse(httpRequest.responseText);
			for (let i in response) {
				if (document.getElementsByName(i + index).length > 0)
					document.getElementsByName(i + index)[0].value = response[i];
				else {
					let bonus;
					switch (response[i]) {
						case "strength":
							bonus = form.strength.value;
							break;
						case "dexterity":
							bonus = form.dexterity.value;
							break;
						case "both":
							bonus = Math.max(form.strength.value, form.dexterity.value);
							break;
					}
					document.getElementsByName("dmgBonus" + index)[0].value = bonus;
					bonus = Number(bonus) + Number(form.bonus.value);
					if (bonus > 0) bonus = "+" + Number(bonus);
					document.getElementsByName("atkBonus" + index)[0].value = bonus;
				}
			}
		} else alert(httpRequest.status);
	}
}
function set_list_request(url, listId) {
	var httpRequest = new XMLHttpRequest();

	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState == 4) {
			if (httpRequest.status == 200) {
				let options = "";
				options = httpRequest.responseText;
				document.getElementById(listId).innerHTML = options;
			}
		}
	};
	httpRequest.open("GET", url, true);
	httpRequest.send();
}

function set_request(url, foo) {
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function () {
		foo(httpRequest);
	};
	let json = JSON.stringify({
		value: this.value,
	});
	httpRequest.open("GET", url, true);
	httpRequest.send();
}
function set_armor_response(httpRequest) {
	if (httpRequest.readyState == 4) {
		if (httpRequest.status == 200) {
			let response = JSON.parse(httpRequest.responseText);
			if (response["needStr"] > form.str.value) {
				alert("Вы недостаточно сильны для этого доспеха");
				form.armor.value = "";
				return;
			}
			if (response["characteristic"])
				if (response["maxDex"] == null)
					form.armorClass.value =
						Number(response["armorClass"]) + Number(form.dexterity.value);
				else if (Number(form.dexterity.value) > response["maxDex"])
					form.armorClass.value =
						Number(response["armorClass"]) + Number(response["maxDex"]);
				else
					form.armorClass.value =
						Number(response["armorClass"]) + Number(form.dexterity.value);
			form.maxDex.value = response["maxDex"];
			form.needStr.value = response["needStr"];
			if (response["pomeha"] == 1) form.pomeha.checked = "checked";
			else form.pomeha.checked = "";
			form.arcl.value = set_AR(
				form.armorClass.value,
				form.tarcl.value,
				form.shield.value
			);
		} else alert(httpRequest.status);
	}
}
function set_class_response(httpRequest) {
	if (httpRequest.readyState == 4) {
		if (httpRequest.status == 200) {
			let response = JSON.parse(httpRequest.responseText);
			form.hitdice1.value = response["hitdice"];
			if (response["strs"] == 0) form.strs.checked = "";
			else form.strs.checked = "checked";
			if (response["dexs"] == 0) form.dexs.checked = "";
			else form.dexs.checked = "checked";
			if (response["cons"] == 0) form.cons.checked = "";
			else form.cons.checked = "checked";
			if (response["ints"] == 0) form.ints.checked = "";
			else form.ints.checked = "checked";
			if (response["wiss"] == 0) form.wiss.checked = "";
			else form.wiss.checked = "checked";
			if (response["chas"] == 0) form.chas.checked = "";
			else form.chas.checked = "checked";
			let ch = response["characteristic"].split(",");
			if (ch.length == 1)
				form.complexity.value =
					8 +
					Number(form.bonus.value) +
					Number(document.getElementsByName(ch[0])[0].value);
			else {
				let mod = Math.max(
					Number(document.getElementsByName(ch[0])[0].value),
					Number(document.getElementsByName(ch[1])[0].value)
				);
				form.complexity.value = 8 + Number(form.bonus.value) + mod;
			}
		} else alert(httpRequest.status);
	}
}
function set_race_response(httpRequest) {
	if (httpRequest.readyState == 4) {
		if (httpRequest.status == 200) {
			let response = JSON.parse(httpRequest.responseText);
			if (response["darkVision"] == 0) form.darkVision.checked = "";
			else form.darkVision.checked = "checked";
			form.vision.value = response["distance"];
			form.speed.value = response["speed"];
		} else alert(httpRequest.status);
	}
}

form.name.onchange = function () {
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState == 4)
			if (httpRequest.status == 200) {
				let response = JSON.parse(httpRequest.responseText);
				for (let key in response) {
					let elem = document.getElementsByName(key)[0];
					if (elem.type == "checkbox") elem.checked = true;
					else if (
						key == "bag" ||
						key == "features" ||
						key == "tools" ||
						key == "languages" ||
						key == "skills"
					)
						elem.innerHTML.value = response[key];
					else elem.value = response[key];
				}
			}
	};

	httpRequest.open("GET", "get_character.php?name=" + this.value);
	httpRequest.send();
};

form.weaponName1.onchange = function () {
	let url = "request.php?value=" + this.value + "&table=weapon&col=weaponName";
	set_weapon_request(url, 1);
};
form.weaponName2.onchange = function () {
	let url = "request.php?value=" + this.value + "&table=weapon&col=weaponName";
	set_weapon_request(url, 2);
};
form.weaponName3.onchange = function () {
	let url = "request.php?value=" + this.value + "&table=weapon&col=weaponName";
	set_weapon_request(url, 3);
};
form.weaponName4.onchange = function () {
	let url = "request.php?value=" + this.value + "&table=weapon&col=weaponName";
	set_weapon_request(url, 4);
};
form.armor.onchange = function () {
	let url = "request.php?value=" + this.value + "&table=armor&col=armor";
	set_request(url, set_armor_response);
};
form.class.onchange = function () {
	let url = "request.php?value=" + this.value + "&table=classes&col=class";
	set_request(url, set_class_response);
};
form.race.onchange = function () {
	let url = "request.php?value=" + this.value + "&table=races&col=race";
	set_request(url, set_race_response);
};
window.document.body.onload = function () {
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function () {
		if (httpRequest.responseText == "false")
			window.location.href = "login.html";
	};
	httpRequest.open("POST", "redirect.php");
	httpRequest.send();

	
	httpRequest.onreadystatechange = function(){
		document.getElementById("user_name").textContent=httpRequest.responseText;
	}
	httpRequest.open("GET","get_name.php");
	httpRequest.send();


	set_list_request("character_list.php", "characterList");
	set_list_request("request_list.php?table=armor&col=armor", "armorList");
	set_list_request(
		"request_list.php?table=weapon&col=weaponName",
		"waeponList"
	);
	set_list_request("request_list.php?table=classes&col=class", "classList");
	set_list_request("request_list.php?table=races&col=race", "raceList");
	spas_skill_val();
};

function set_modifier(stat) {
	let res = Math.floor((stat - 10) / 2);
	if (res > 0) res = "+" + res;
	return res;
}

function set_level(exp) {
	if (exp < 300) return 1;
	else if (exp < 900) return 2;
	else if (exp < 2700) return 3;
	else if (exp < 6500) return 4;
	else if (exp < 14000) return 5;
	else if (exp < 23000) return 6;
	else if (exp < 34000) return 7;
	else if (exp < 48000) return 8;
	else if (exp < 64000) return 9;
	else if (exp < 85000) return 10;
	else if (exp < 100000) return 11;
	else if (exp < 120000) return 12;
	else if (exp < 140000) return 13;
	else if (exp < 165000) return 14;
	else if (exp < 195000) return 15;
	else if (exp < 225000) return 16;
	else if (exp < 265000) return 17;
	else if (exp < 305000) return 18;
	else if (exp < 355000) return 19;
	else return 20;
}

function set_exp(level) {
	switch (level) {
		case "1":
			return 0;
		case "2":
			return 300;
		case "3":
			return 900;
		case "4":
			return 2700;
		case "5":
			return 6500;
		case "6":
			return 14000;
		case "7":
			return 23000;
		case "8":
			return 34000;
		case "9":
			return 48000;
		case "10":
			return 64000;
		case "11":
			return 85000;
		case "12":
			return 100000;
		case "13":
			return 120000;
		case "14":
			return 140000;
		case "15":
			return 165000;
		case "16":
			return 195000;
		case "17":
			return 225000;
		case "18":
			return 265000;
		case "19":
			return 305000;
		case "20":
			return 355000;
		default:
			return 0;
	}
}

function set_bonus(level) {
	if (level < 5) return "+2";
	else if (level < 9) return "+3";
	else if (level < 13) return "+4";
	else if (level < 17) return "+5";
	else return "+6";
}

function set_spas(stat, check, bonus) {
	let res = Number(stat);
	if (check) res += Number(bonus);
	if (res > 0) res = "+" + res;
	return res;
}

function set_AR(ar, tar, shield) {
	return Number(ar) + Number(tar) + Number(shield);
}

function randomInteger(min, max) {
	return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function spas_skill_val() {
	form.strsn.value = set_spas(
		form.strength.value,
		form.strs.checked,
		form.bonus.value
	);
	form.dexsn.value = set_spas(
		form.dexterity.value,
		form.dexs.checked,
		form.bonus.value
	);
	form.consn.value = set_spas(
		form.constitution.value,
		form.cons.checked,
		form.bonus.value
	);
	form.intsn.value = set_spas(
		form.intelligence.value,
		form.ints.checked,
		form.bonus.value
	);
	form.wissn.value = set_spas(
		form.wisdom.value,
		form.wiss.checked,
		form.bonus.value
	);
	form.chasn.value = set_spas(
		form.charisma.value,
		form.chas.checked,
		form.bonus.value
	);

	form.AthleticsN.value = set_spas(
		form.strength.value,
		form.Athletics.checked,
		form.bonus.value
	);
	form.AcrobaticsN.value = set_spas(
		form.dexterity.value,
		form.Acrobatics.checked,
		form.bonus.value
	);
	form.StealthN.value = set_spas(
		form.dexterity.value,
		form.Stealth.checked,
		form.bonus.value
	);
	form.sleightOfHandN.value = set_spas(
		form.dexterity.value,
		form.sleightOfHand.checked,
		form.bonus.value
	);
	form.HistoryN.value = set_spas(
		form.intelligence.value,
		form.History.checked,
		form.bonus.value
	);
	form.InvestigationN.value = set_spas(
		form.intelligence.value,
		form.Investigation.checked,
		form.bonus.value
	);
	form.ArcanaN.value = set_spas(
		form.intelligence.value,
		form.Arcana.checked,
		form.bonus.value
	);
	form.NatureN.value = set_spas(
		form.intelligence.value,
		form.Nature.checked,
		form.bonus.value
	);
	form.ReligionN.value = set_spas(
		form.intelligence.value,
		form.Religion.checked,
		form.bonus.value
	);
	form.PerceptionN.value = set_spas(
		form.wisdom.value,
		form.Perception.checked,
		form.bonus.value
	);
	form.SurvivalN.value = set_spas(
		form.wisdom.value,
		form.Survival.checked,
		form.bonus.value
	);
	form.MedicineN.value = set_spas(
		form.wisdom.value,
		form.Medicine.checked,
		form.bonus.value
	);
	form.InsightN.value = set_spas(
		form.wisdom.value,
		form.Insight.checked,
		form.bonus.value
	);
	form.AnimalHandlingN.value = set_spas(
		form.wisdom.value,
		form.AnimalHandling.checked,
		form.bonus.value
	);
	form.PerformanceN.value = set_spas(
		form.charisma.value,
		form.Performance.checked,
		form.bonus.value
	);
	form.IntimidationN.value = set_spas(
		form.charisma.value,
		form.Intimidation.checked,
		form.bonus.value
	);
	form.DeceptionN.value = set_spas(
		form.charisma.value,
		form.Deception.checked,
		form.bonus.value
	);
	form.PersuasionN.value = set_spas(
		form.charisma.value,
		form.Persuasion.checked,
		form.bonus.value
	);
	if (form.Perception.checked)
		form.passPerception.value =
			10 + Number(form.wisdom.value) + Number(form.bonus.value);
	else form.passPerception.value = 10 + Number(form.wisdom.value);
}

function roll_attack(atk, dmg, atkBonus, atkDice) {
	atk.value = randomInteger(1, 20) + Number(atkBonus);
	dmg.value = 0;
	let mas = atkDice.split("d");
	for (let i = 0; i < mas[0]; i++)
		dmg.value = Number(dmg.value) + Number(randomInteger(1, Number(mas[1])));
}

form.exp.oninput = function () {
	form.level.value = set_level(this.value);
	form.bonus.value = set_bonus(form.level.value);
	spas_skill_val();

	weapon_set_param(
		form.weaponName1.value,
		form.damageType1,
		form.distance1,
		form.atkBonus1,
		form.atkDice1,
		form.dmgBonus1
	);
	weapon_set_param(
		form.weaponName2.value,
		form.damageType2,
		form.distance2,
		form.atkBonus2,
		form.atkDice2,
		form.dmgBonus2
	);
	weapon_set_param(
		form.weaponName3.value,
		form.damageType3,
		form.distance3,
		form.atkBonus3,
		form.atkDice3,
		form.dmgBonus3
	);
	weapon_set_param(
		form.weaponName4.value,
		form.damageType4,
		form.distance4,
		form.atkBonus4,
		form.atkDice4,
		form.dmgBonus4
	);
};

form.level.oninput = function () {
	form.exp.value = set_exp(this.value);
	form.bonus.value = set_bonus(this.value);
	spas_skill_val();

	weapon_set_param(
		form.weaponName1.value,
		form.damageType1,
		form.distance1,
		form.atkBonus1,
		form.atkDice1,
		form.dmgBonus1
	);
	weapon_set_param(
		form.weaponName2.value,
		form.damageType2,
		form.distance2,
		form.atkBonus2,
		form.atkDice2,
		form.dmgBonus2
	);
	weapon_set_param(
		form.weaponName3.value,
		form.damageType3,
		form.distance3,
		form.atkBonus3,
		form.atkDice3,
		form.dmgBonus3
	);
	weapon_set_param(
		form.weaponName4.value,
		form.damageType4,
		form.distance4,
		form.atkBonus4,
		form.atkDice4,
		form.dmgBonus4
	);
};

form.dexterity.oninput = function () {
	/*armor_set_param();	
	  form.arcl.value=form.armorClass.value;*/
};

form.str.oninput = function () {
	form.strength.value = set_modifier(this.value);
	form.strsn.value = set_spas(
		form.strength.value,
		form.strs.checked,
		form.bonus.value
	);
	form.AthleticsN.value = set_spas(
		form.strength.value,
		form.Athletics.checked,
		form.bonus.value
	);
};

form.dex.oninput = function () {
	form.dexterity.value = set_modifier(this.value);
	form.dexsn.value = set_spas(
		form.dexterity.value,
		form.dexs.checked,
		form.bonus.value
	);
	form.AcrobaticsN.value = set_spas(
		form.dexterity.value,
		form.Acrobatics.checked,
		form.bonus.value
	);
	form.StealthN.value = set_spas(
		form.dexterity.value,
		form.Stealth.checked,
		form.bonus.value
	);
	form.sleightOfHandN.value = set_spas(
		form.dexterity.value,
		form.sleightOfHand.checked,
		form.bonus.value
	);
	/*et_AR(form.armorClass.value, form.dexterity.value, form.shield.value);
	  form.arcl.value=form.armorClass.value;*/
};

form.con.oninput = function () {
	form.constitution.value = set_modifier(this.value);
	form.consn.value = set_spas(
		form.constitution.value,
		form.cons.checked,
		form.bonus.value
	);
};

form.int.oninput = function () {
	form.intelligence.value = set_modifier(this.value);
	form.intsn.value = set_spas(
		form.intelligence.value,
		form.ints.checked,
		form.bonus.value
	);
	form.HistoryN.value = set_spas(
		form.intelligence.value,
		form.History.checked,
		form.bonus.value
	);
	form.InvestigationN.value = set_spas(
		form.intelligence.value,
		form.Investigation.checked,
		form.bonus.value
	);
	form.ArcanaN.value = set_spas(
		form.intelligence.value,
		form.Arcana.checked,
		form.bonus.value
	);
	form.NatureN.value = set_spas(
		form.intelligence.value,
		form.Nature.checked,
		form.bonus.value
	);
	form.ReligionN.value = set_spas(
		form.intelligence.value,
		form.Religion.checked,
		form.bonus.value
	);
};

form.wis.oninput = function () {
	form.wisdom.value = set_modifier(this.value);
	form.wissn.value = set_spas(
		form.wisdom.value,
		form.wiss.checked,
		form.bonus.value
	);
	form.PerceptionN.value = set_spas(
		form.wisdom.value,
		form.Perception.checked,
		form.bonus.value
	);
	form.SurvivalN.value = set_spas(
		form.wisdom.value,
		form.Survival.checked,
		form.bonus.value
	);
	form.MedicineN.value = set_spas(
		form.wisdom.value,
		form.Medicine.checked,
		form.bonus.value
	);
	form.InsightN.value = set_spas(
		form.wisdom.value,
		form.Insight.checked,
		form.bonus.value
	);
	form.AnimalHandlingN.value = set_spas(
		form.wisdom.value,
		form.AnimalHandling.checked,
		form.bonus.value
	);
	if (form.Perception.checked)
		form.passPerception.value =
			10 + Number(form.wisdom.value) + Number(form.bonus.value);
	else form.passPerception.value = 10 + Number(form.wisdom.value);
};

form.cha.oninput = function () {
	form.charisma.value = set_modifier(this.value);
	form.chasn.value = set_spas(
		form.charisma.value,
		form.chas.checked,
		form.bonus.value
	);
	form.PerformanceN.value = set_spas(
		form.charisma.value,
		form.Performance.checked,
		form.bonus.value
	);
	form.IntimidationN.value = set_spas(
		form.charisma.value,
		form.Intimidation.checked,
		form.bonus.value
	);
	form.DeceptionN.value = set_spas(
		form.charisma.value,
		form.Deception.checked,
		form.bonus.value
	);
	form.PersuasionN.value = set_spas(
		form.charisma.value,
		form.Persuasion.checked,
		form.bonus.value
	);
};

form.tarcl.oninput = function () {
	form.arcl.value = set_AR(
		form.armorClass.value,
		this.value,
		form.shield.value
	);
};

form.init.onclick = function () {
	this.value = randomInteger(1, 20) + Number(form.dexterity.value);
};

form.strs.oninput = function () {
	form.strsn.value = set_spas(
		form.strength.value,
		this.checked,
		form.bonus.value
	);
};

form.dexs.oninput = function () {
	form.dexsn.value = set_spas(
		form.dexterity.value,
		this.checked,
		form.bonus.value
	);
};

form.cons.oninput = function () {
	form.consn.value = set_spas(
		form.constitution.value,
		this.checked,
		form.bonus.value
	);
};

form.ints.oninput = function () {
	form.intsn.value = set_spas(
		form.intelligence.value,
		this.checked,
		form.bonus.value
	);
};

form.wiss.oninput = function () {
	form.wissn.value = set_spas(
		form.wisdom.value,
		this.checked,
		form.bonus.value
	);
};

form.chas.oninput = function () {
	form.chasn.value = set_spas(
		form.charisma.value,
		this.checked,
		form.bonus.value
	);
};

form.Acrobatics.oninput = function () {
	form.AcrobaticsN.value = set_spas(
		form.dexterity.value,
		this.checked,
		form.bonus.value
	);
};

form.Investigation.oninput = function () {
	form.InvestigationN.value = set_spas(
		form.intelligence.value,
		this.checked,
		form.bonus.value
	);
};

form.Athletics.oninput = function () {
	form.AthleticsN.value = set_spas(
		form.strength.value,
		this.checked,
		form.bonus.value
	);
};

form.Perception.oninput = function () {
	form.PerceptionN.value = set_spas(
		form.wisdom.value,
		this.checked,
		form.bonus.value
	);
	if (this.checked)
		form.passPerception.value =
			10 + Number(form.wisdom.value) + Number(form.bonus.value);
	else form.passPerception.value = 10 + Number(form.wisdom.value);
};

form.Survival.oninput = function () {
	form.SurvivalN.value = set_spas(
		form.wisdom.value,
		this.checked,
		form.bonus.value
	);
};

form.Performance.oninput = function () {
	form.PerformanceN.value = set_spas(
		form.charisma.value,
		this.checked,
		form.bonus.value
	);
};

form.Intimidation.oninput = function () {
	form.IntimidationN.value = set_spas(
		form.charisma.value,
		this.checked,
		form.bonus.value
	);
};

form.History.oninput = function () {
	form.HistoryN.value = set_spas(
		form.intelligence.value,
		this.checked,
		form.bonus.value
	);
};

form.sleightOfHand.oninput = function () {
	form.sleightOfHandN.value = set_spas(
		form.dexterity.value,
		this.checked,
		form.bonus.value
	);
};

form.Arcana.oninput = function () {
	form.ArcanaN.value = set_spas(
		form.intelligence.value,
		this.checked,
		form.bonus.value
	);
};

form.Medicine.oninput = function () {
	form.MedicineN.value = set_spas(
		form.wisdom.value,
		this.checked,
		form.bonus.value
	);
};

form.Deception.oninput = function () {
	form.DeceptionN.value = set_spas(
		form.charisma.value,
		this.checked,
		form.bonus.value
	);
};

form.Nature.oninput = function () {
	form.NatureN.value = set_spas(
		form.intelligence.value,
		this.checked,
		form.bonus.value
	);
};

form.Insight.oninput = function () {
	form.InsightN.value = set_spas(
		form.wisdom.value,
		this.checked,
		form.bonus.value
	);
};

form.Religion.oninput = function () {
	form.ReligionN.value = set_spas(
		form.intelligence.value,
		this.checked,
		form.bonus.value
	);
};

form.Stealth.oninput = function () {
	form.StealthN.value = set_spas(
		form.dexterity.value,
		this.checked,
		form.bonus.value
	);
};

form.Persuasion.oninput = function () {
	form.PersuasionN.value = set_spas(
		form.charisma.value,
		this.checked,
		form.bonus.value
	);
};

form.AnimalHandling.oninput = function () {
	form.AnimalHandlingN.value = set_spas(
		form.wisdom.value,
		this.checked,
		form.bonus.value
	);
};

form.armorClass.oninput = function () {
	form.arcl.value = set_AR(this.value, form.tarcl.value, form.shield.value);
};

form.shield.oninput = function () {
	form.arcl.value = set_AR(form.armorClass.value, form.tarcl.value, this.value);
};

form.ammunitionP1.onclick = function () {
	form.ammunitionNum1.value = Number(form.ammunitionNum1.value) + 1;
};

form.ammunitionP2.onclick = function () {
	form.ammunitionNum2.value = Number(form.ammunitionNum2.value) + 1;
};

form.ammunitionM1.onclick = function () {
	form.ammunitionNum1.value = Number(form.ammunitionNum1.value) - 1;
};

form.ammunitionM2.onclick = function () {
	form.ammunitionNum2.value = Number(form.ammunitionNum2.value) - 1;
};

form.attack1.onclick = function () {
	roll_attack(form.atk1, form.dmg1, form.atkBonus1.value, form.atkDice1.value);
};

form.attack2.onclick = function () {
	roll_attack(form.atk2, form.dmg2, form.atkBonus2.value, form.atkDice2.value);
};

form.attack3.onclick = function () {
	roll_attack(form.atk3, form.dmg3, form.atkBonus3.value, form.atkDice3.value);
};

form.attack4.onclick = function () {
	roll_attack(form.atk4, form.dmg4, form.atkBonus4.value, form.atkDice4.value);
};

/*

по названию пересчитать параметры


*/
