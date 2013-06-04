(function () {
	var GUESTS = {
		"zoidberg" : {
			url : "http://screenletstore.appspot.com/img/94ba50b3-cc9b-11e2-a6d9-016a8cd7abaa.png",
			name : "Pr. Zoidberg"
		},
		"tobias" : {
			url : "http://screenletstore.appspot.com/img/c7efe59e-ccd9-11e2-be3b-11d00abb586c.png",
			name : "Tobias Fünke"
		},
		"dwight" : {
			url : "http://screenletstore.appspot.com/img/ed2aadb5-ccd9-11e2-9c31-11d00abb586c.png",
			name : "Dwight Schrute"
		}
	}
	var data = document.querySelector("[_template='roulotte.views.app.Main']").__data,
		room = data.rooms[0],
		lobby = data.lobby;

	var createUser = function (id, url, name) {
		return {
			email: id+"@gmail.com",
			first_name: id,
			username : name,
			id: id,
			last_name: "",
			picture: url
		}
	}

	for (var guestId in GUESTS) {
		if (GUESTS.hasOwnProperty(guestId)) {
			var guest = createUser(guestId, GUESTS[guestId].url, GUESTS[guestId].name);
			aria.utils.Json.add(room.users_id, guest);
			lobby.coworkers[guestId] = guest;
		}
	}

	var onChange = function () {
		var message = room.messages[room.messages.length-1];
		if (message.type == "chat") {
			var text = message.content;
			if (aria.utils.Type.isArray(text)) {
				text = text[text.length-1];
			}
	
			var guestId = extractGuestId(text);
			if (guestId !== null) {
				text = text.replace(":"+guestId+":", "");
				if (aria.utils.Type.isArray(message.content)) {
					aria.utils.Json.removeAt(message.content, message.content.length-1);
					aria.utils.Json.add(room.messages, {
						user : {id  : guestId},
						content : text,
						room_id : message.room_id,
						time : message.time,
						type : "chat"
					});
				} else {
					aria.utils.Json.setValue(message, "content", text);
					aria.utils.Json.setValue(message.user, "id", guestId);
				}
				document.querySelector("[_template='roulotte.views.room.Chat']").__template.$refresh();
			}	
		}
	};

	var extractGuestId = function (msg) {

		var matches = msg.match(/^:(\w+):/);
		if (matches && matches[1]) {
			var guest = matches[1];
			if (GUESTS[guest]) {
				return guest;
			}
		}

		return null;
	} 


	aria.utils.Json.addListener(data, "rooms", {
		fn : onChange, 
		scope : this
	}, false, true);
})();

