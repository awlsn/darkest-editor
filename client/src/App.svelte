<script>

	$: buffs = [];
	$: trinkets = [];

	function getJSON(url) {
		return fetch(url).then(response => response.json())
	}

	async function loadData() {
		return Promise.all([getJSON("/data/trinkets.json"), getJSON("/data/buffs.json")])

	}

	let thisBuff;
	loadData().then(([trinketList, buffList]) => {

		//let outputTrinkets = trinkets;

		//console.log(xml);
		console.log(trinketList);
		console.log(buffList);

		trinketList.forEach(trinket => {
			trinket.buffs.forEach((buff,i) => {
				trinket.buffs[i] = buffList.find( obj =>  obj.id == buff);
			})
		});

		buffs = buffList;

		//console.log(trinketList);
		trinkets = trinketList;

	});

	function download(filename, text) {
		let element = document.createElement('a');
		var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
		element.setAttribute('href', 'data:'+data);
		element.setAttribute('download', filename);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}

	function downloadBuffs() {
		download('buffsbase.buffs.json', buffs);
	}
</script>

<main>
	<button on:click={downloadBuffs}>
		Click me
	</button>

	<!-- <ul class="buff_info">
	{#each buffs as buff}
		<li><span contenteditable="false" bind:innerHTML={buff.htmlText}></span><br /><small>{buff.id}</small></li>
	{/each}
	</ul>
	
	<ul class="trinket_info">
		{#each trinkets as trinket}
			<li>
				<h4 class="title">{trinket.title}</h4>
				<div class="trinket_info__img {trinket.rarity}">
					<img height="110" src="/images/trinket/{trinket.id}.png" alt={trinket.id} />
				</div>
				
				<div>
					{#if trinket.hero_class_requirements.length > 0}
						
						<span class="gold">{trinket.hero_class_requirements[0]}</span>
					{/if}
					<span>{trinket.rarity}</span>
					<ul>
					{#each trinket.buffs as buff}
						<li  contenteditable="false" bind:innerHTML={buff.htmlText}></li>
					{/each}
					</ul>
				</div>

			</li>
		{/each}
	</ul> -->

	
</main>

