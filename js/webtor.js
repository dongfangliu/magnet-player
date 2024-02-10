

// Download by form input
$('form').submit(function(e) {
	e.preventDefault() // Prevent page refresh

	var torrentId = $('form input[name=torrentId]').val()

	if (torrentId.length > 0)
		downloadTorrent(torrentId)
})

// Download by URL hash
onHashChange()
window.addEventListener('hashchange', onHashChange)
function onHashChange () {
	var hash = decodeURIComponent(window.location.hash.substring(1)).trim()
	if (hash !== '') downloadTorrent(hash)
}

function downloadTorrent(torrentId) {
	console.log('Downloading torrent from ' + torrentId)
	console.log("this is webtor")
	onTorrent(torrentId)
}

function onTorrent(torrent) {
	
	// Display name of the file being streamed

	// Update clipboard share url
	$('#share-url').val('https://ferrolho.github.io/magnet-player/#' + torrent.infoHash);


	// hide magnet input
	$('#magnet-input').slideUp()

	// show player
	$('#hero').slideDown()




	window.webtor = window.webtor || [];
	window.webtor.push({
		id: 'output',
		baseUrl: 'https://webtor.io',
		// baseUrl: 'http://192.168.0.100:4000',
		magnet: 'magnet:?xt=urn:btih:'+torrent,
		// magnet: 'magnet:?xt=urn:btih:ca540adb8d37eb222d75aeca6954486842f72765',
		// width: '100%',
		// height: '100%',
		features: {
			continue:    false,
			// title:       false,
			// p2pProgress: false,
			// subtitles:   false,
			// settings:    false,
			// fullscreen:  false,
			// playpause:   false,
			// currentTime: false,
			// timeline:    false,
			// duration:    false,
			// volume:      false,
			// chromecast:  false,
		},
		on: function(e) {
			if (e.name == window.webtor.TORRENT_FETCHED) {
				console.log('Torrent fetched!', e.data.files);
				var p = e.player;
				var files = document.getElementById('files');
				for (const f of e.data.files) {
					if (!f.name.endsWith('.mp4')) continue;
					var a = document.createElement('a');
					a.setAttribute('href', f.path);
					a.innerText = f.name;
					files.appendChild(a);
					a.addEventListener('click', function(e) {
						e.preventDefault();
						p.open(e.target.getAttribute('href'));
						return false;
					});
				}
			}
			if (e.name == window.webtor.TORRENT_ERROR) {
				console.log('Torrent error!')
			}
			if (e.name == window.webtor.INITED) {
				var p = e.player;
				document.getElementById('play').addEventListener('click', function(ev) {
					p.play();
				});
				document.getElementById('pause').addEventListener('click', function(ev) {
					p.pause();
				});
			}
			if (e.name == window.webtor.PLAYER_STATUS) {
				document.getElementById('player-status').innerHTML = e.data;
			}
			if (e.name == window.webtor.OPEN) {
				console.log(e.data);
			}
			if (e.name == window.webtor.CURRENT_TIME) {
				document.getElementById('current-time').innerHTML = parseInt(e.data);
			}
			if (e.name == window.webtor.DURATION) {
				document.getElementById('duration').innerHTML = parseInt(e.data);
			}
			if (e.name == window.webtor.OPEN_SUBTITLES) {
				console.log(e.data);
			}
		},
		i18n: {
		en: {
			common: {
				"prepare to play": "Preparing Video Stream... Please Wait...",
			},
			stat: {
				"seeding": "Seeding",
					"waiting": "Client initialization",
					"waiting for peers": "Waiting for peers",
					"from": "from",
			},
		},
	},
	});

}
