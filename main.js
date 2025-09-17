//!function(){
"use strict"
var w=window,d=document,n=null,u,gPlatform='web'

var gCardTypeIcons = ['😊','💩','💡','🎁']

var gGuyMake = kind => {
	var guy = {
		kind,
		pan:.03,
		votes:0,
		hand:[],
		deck:[],
		trash:[],
		posting:[],
		items:[],
		cool:0,
		shout:0,
		fans:0,
		postBubble:n
	}
	if(kind) {
		guy.pan = .88
		guy.other = gYou
		guy.div = gRivalDiv
		guy.fansDiv = gRivalFansDiv
		gGuyFansSet(guy, kind.fans)
		gRivalNameDiv.innerHTML = kind.name
		gRivalIconDiv.innerHTML = kind.icon
	}
	return guy
}

var gAppVersion=1,
	gMousePan=.5,gMouseX=0,gMouseY=0,
	gVibrateEnabled,
	gYouVotesHigh=0,gYouVotesHighPost,
	gIntroSpeed=9,
	gState='loading',
	gStateState,
	gStateDeckView='deck',
	gStateCardRemove='cardRemove',
	gStateFeed='feed',
	gStateFeedLoad='feedLoad',
	gStatePlay='play',
	gStateRivalPlay='rivalPlay',
	gStateDiscard='discard',
	gStateTrashView='trash',
	gStateIntro='intro',
	gStateWin='win',
	gStateLose='lose',
	gStateGameOver='over',
	gStateShop='shop',
	gStatePost='post',
	gStateDraw='draw',
	gCardStateDeck=1,
	gCardStateDraw=2,
	gCardStateUsing=3,
	gCardStateDiscard=4,
	gCardStatePrize=5,
	gCardStateItemUsed=6,
	gCardStateShop=7,
	gRivalKind,
	gRivalKinds=[],
	gYou=gGuyMake(),
	gGuyNow=gYou,
	gPostingCard0,
	gRival,
	gRound,
	gMuted,
	gHelpShowing,
	gBattleIn,
	gBattleFans=0,
	gStateOld='',
	gGold=0,
	gDay=0,
	gOfferDid=0,
	gPrizeCards=[],
	gSizeX,
	gSizeY,
	gHandSizeY=0,
	gDiscardNeed=0,
	gTrashPick=0,
	gCardRem=24,
	gCardTall=1.43,
	gHandMax=8,
	gEnergyStart=3,
	gSale=' emojis on sale! Lowest price guaranteed. Today only.',
	gRivalInfos=`Boomer|25|👴|🏡1🏈2🔫1✝2🔊1🗽1🤬3🍔3💤1🏡1💤3|I bought my first house for 7 raspberries. The kids today are just lazy. Time for my nap.
Guru|25|🧘|🧵3🙏3✌1🤐2🥗2🤫2🛕1🤦2|The energy crystals harness the moon energy. That is why you are lucky.
Model|25|💃|😈1👒1💋1🍑1🖕1🔞1👀1🍈1👅1🎊1👙1|Do you like the view? Pics in bio!
Hipster|25|🧔|👖1🤐1🦉2🐕1🍆2💪2🍺2🥱2✌1|I liked craft beer before it was cool.
Karen|25|👩|🤮2🤬2👒1🍸2🥗2⚠1|Corner Cafe's avocados aren't organic! That should be illegal. And why do cafes keep shutting down?
Creep|25|👨‍🦲|🤮1🍆3💦4🚽2👀2👅2😈3|hi mama cum to my place
Regard|25|🧒|🚀2🦍2🐻3🐂1📈2🚽1🍔1🎰2|To the moon! 📈🚀
${(gPlatform=='ios'?'RichGuy':'Elon')}|225|👱|🍆1💦1💯2🚀2😂2🚗2🤰1📡1|Go Donald Trump! Run the country through executive order!
GotJunk||🛠||<b>Too Much Junk?</b> Expert junk emoji removal service. Any emoji, one low price!
FanFast||✨||<b>Promote Your Profile!</b> Guaranteed new real fans. 1 for $1. Today only.
Cutest||😻||<b>Sale!</b> ♥CUTE♥${gSale}
Cool2Hate||👹||<b>Sale!</b> 💩HATE${gSale}
Skillz||🧞‍♂️||<b>Sale!</b> 💡SKILL${gSale}
ThinkNerd||🎁||<b>Sale!</b> ITEM${gSale}`.split(`
`),
	gCardKindsByEmoji={},
	gCardKinds=[
		{d:"😀0Grinning|👍7", attack:7},
		{d:"💩1Poop|👎7", block:7},
		{d:"💩12 Poops|👎14", cost:2, block:14},
		{d:"🚀0Rocket|👍1 for each 10 fans u have", attack:_=>(gGuyNow.fans/10|0)},
		{d:"🦍2Apes|draw 2\n🗣+6", cost:2, draw:2, shout:6},
		{d:"😭0Crying|👍10 if u have no cool", attack:_=>gGuyNow.cool < 1 ? 10:0},
		{d:"😘2Blowing a Kiss|increase all 👍👎 by 50%", block:_=>-gGuyNow.other.votes>>1, attack:_=>gGuyNow.votes>>1},
		{d:"🗽0Statue of Liberty|👍10 if u haven't posted any hate", attack:_=>gGuyNow.posting.find(card=>card.block)?0:10},
		{d:"🍵0Tea|👍5\n😎+2", attack:5, cool:2},
		{d:"😂1Tears of joy|👎 for each 👍 ur post has", block:_=>Math.max(0, gGuyNow.votes)},
		{d:"✌ 2Peace Sign|add 3x ☮ to ur enemy's deck", onUse:_=>{for(var i=0;i<3;i++)gCardDeckAdd(gCardMake(gCardKindsByEmoji['☮']), gGuyNow.other);gDeckShuffle(gGuyNow.other)}},
		{d:"🛕3Temple|😎+2 after each post"},
		{d:"📡3Satellite Dish|🗣+2 after each post"},
		{d:"👒3Woman's Hat|draw 1 when u get downvoted"},
		{d:"🤦1Facepalm|👎4x enemy's post size", block:_=>(gGuyNow==gYou ? gGuyNow.other.posting.length : gEnergyStart)*4},
		{d:"🤫1Shush|👎6\nenemy loses all 🗣", block:_=>6, onUse:_=>gGuyShoutAdd(gGuyNow.other, -gGuyNow.other.shout)},
		{d:"🙏2Pray|👤+1 💬+1", energy:1, onUse:_=>gGuyFanGain(gGuyNow)},
		{d:"🍔0Burgers|👍26\n😎-2 to u", attack:26, cool:-2, cost:2},
		{d:"🐂0Bull|👍13\n👍3 to enemy", attack:13, block:-3},
		{d:"🐻1Bear|👎13\n👎3 to u", block:13, attack:-3},
		{d:"🎰0Slot Machine|👍 random 1-20", onUse:_=>gGuyVotesAdd(gRandomInt(1,20)*gCardNowMultGet())},
		{d:"🍸0Cocktail|👍6\n😎+3 if u have none, 😎-6 if u do", attack:6, onUse:card=>card.cool=gGuyNow.cool>0?-6:3},
		{d:"🚗0Car|💬+1\n👍6 if u have more fans",attack:_=>gGuyNow.fans>gGuyNow.other.fans?6:0, energy:1},
		{d:"🤮1Vomit|👎8 copy pasta this to the max", block:8, xAll:1},
		{d:"💋0Kisses|👍9 copy pasta this to the max", attack:9, xAll:1},
		{d:"🐕0Dog|👍5 😎+1\ndiscard 1", attack:10, discard:1, cool:1},
		{d:"🥗0Salad|👍5\ndraw 1", attack:5, draw:1},
		{d:"🍈0Melons|👍20", cost:2, attack:20},
		{d:"💄2Lipstick|😎+4", cool:4},
		{d:"👅0Tongue|👍15 if enemy has more fans", attack:_=>gGuyNow.other.fans>gGuyNow.fans?15:0},
		{d:"🎊0Confetti|👍21 to everyone!", attack:21, block:-21},
		{d:"🍆1Eggplant|👎9", block:9},
		{d:"👙0Bikini|👍22\nenemy gets 🗣+3",attack:22, onUse:_=>gGuyShoutAdd(gGuyNow.other,3)},
		{d:"🚨2Siren|draw 2\n🗣+1", shout:1, draw:2},
		{d:"💦1Droplets|👎x2 the amount of 👎 ur previous emoji did", block:_=>gPostingCard0 ? Math.max(0,gPostingCard0.block*2): 0},
		{d:"🍑0Peach|👍x2 the amount of 👎 ur previous emoji did", attack:_=>gPostingCard0 ? Math.max(0,gPostingCard0.block*2): 0},
		{d:"🔫1Pistol|👎x2 the amount of 👍 ur previous emoji did", block:_=>gPostingCard0 ? Math.max(0,gPostingCard0.attack*2): 0},
		{d:"🔊2Speaker High|next emoji does 2x 👍👎"},
		{d:"🤡1Clown|👎 half ur enemy's 👍", block:_=>gGuyNow.other.votes>0?gGuyNow.other.votes>>1:0},
		{d:"🏈0Football|👍7\n👍3 when chosen to discard", attack:7, onDiscard:_=>{gGuyVotesAdd(3);gPostingRender()}},
		{d:"🚽3Toilet|👎1 every time u use an emoji"},
		{d:"🤢1Nausea|👎for each emoji in ur trash", block:_=>gGuyNow.trash.length},
		{d:"🤐1Zippermouth|👎12 send ur post now", block:12, ender:1},
		{d:"🤬1Face With Symbols|👎4\n🗣+2", block:4, shout:2},
		{d:"👖2Jeans|😎+2\n2x ur 😎 when chosen to discard", cool:2, onDiscard:_=>gGuyCoolAdd(gGuyNow, gGuyNow.cool)},
		{d:"✝ 0The Cross|👍12\nLose 👤1", attack:12, onUse:_=>gGuyFansSet(gGuyNow,-1)},
		{d:"📈3Increasing Chart|😎+1 🗣+1 after each post"},
		{d:"🏡3House With Garden|💬+1 on each post"},
		{d:"💤1Zzz|👎3\nDraw 3 if u lose fans", block:3},
		{d:"🧠3Brain|draw 1 extra each time ur turn starts"},
		{d:"😈0Smiling Devil|👍5\n👎5", attack:5, block:5},
		{d:"🥱1Yawn|👎3 💬+1", block:3, energy:1},
		{d:"🍺0Beer|👍7\n🗣+1\ndiscard 1", attack:7, shout:1, discard:1},
		{d:"💪2Flex|💬+1\n😎+1", energy:1, cool:1},
		{d:"🧵2Thread|💬+3", energy:3},
		{d:"⚠ 2Warning|💬+2\n🗣+1 to everyone", energy:2, shout:1, onUse:_=>gGuyShoutAdd(gGuyNow.other,1)},
		{d:"💯2100%|2x all 👍👎\nsend ur post now", block:_=>-gGuyNow.other.votes, attack:_=>gGuyNow.votes, ender:1},
		{d:"🤰1Pregnant|👎20 unless enemy is a woman", block:_=>gGuyNow.other!=gYou && gOr(gGuyNow.other.kind.icon,'💃','👩')?0:20},
		{d:"👀2Eyes|💬+1\ndraw 2", energy:1, draw:2},
		{d:"🦉2Owl|draw 3\ndiscard 2", draw:3, discard: 2},
		{d:"🖕1Middle Finger|👎18 to everyone", block:18, attack:-18},
		{d:"🔒3Locked|Enemy's first emoji can't vote"},
		{d:"🔞1No Under 18|👎18 if the enemy post is under 18 votes", block:_=>gGuyNow.other.votes<18?18:0},
		{d:"☮ 2Peace|looks nice but does nothing. delete this forever"},
	],
	u

var i=0
for(var kind of gCardKinds) {
	var parts = kind.d.split('|')
	kind.text = parts[1]
	var s = parts[0]
	kind.emoji = s.substr(0,2).trim()
	kind.type = s[2]*1
	kind.name = s.substr(3)
	kind.i = i++
	if(!kind.cost)kind.cost=1
	gCardKindsByEmoji[kind.emoji] = kind
}

var index=0
for(var info of gRivalInfos) {
	var parts = info.split('|')
	var rival = {
		name: parts[0],
		fans: parts[1]*1,
		icon: parts[2],
		deck: [],
		post: parts[4],
		index: index++
	}
	var s = parts[3]
	var i0=0
	for(var i=0; i<s.length; i++) {
		var c = s[i]
		var total = c*1
		if(total) {
			var emoji = s.substring(i0,i)
			for(var j=0; j<total; j++) {
				rival.deck.push(emoji)
			}
			i0=i+1
		}
	}
	gRivalKinds.push(rival)
}

/*
if(navigator.platform.indexOf('Win') >= 0)
	gDevice = 'windows'
else if(navigator.platform.indexOf('Linux') >= 0)
	gDevice = 'android'
*/

var gDivBottomSet = (div, y, x) => {
	if(div.div)div=div.div
	div.style.bottom = (y===u?333:y)+'rem'
	if(x) {
		div.style.left = x+'rem'
	}
}

var gStateStateSet = state => {
	gStateState = state
	gGameDiv.className = gState+'State'+state
}

var gStateSet = state => {
	console.log("gStateSet()",gState,state)
	if(gState != state) {
		gStateOld = gState
	}
	
	d.body.className = state+'State'
	gGameDiv.className = ''
	gBattleFansSet(gBattleFans)
	gButtonShow()
	gButtonShow(1)
	
	if(state == gStateDiscard) {
		if(!gYou.hand.length) {
			gStateSet(gStatePlay)
			return
		}
		gHandPickDiv.innerHTML = "Choose "+gDiscardNeed+" to discard:"
	}
	
	if(gState == gStateTrashView) {
		gTrashRender()
	}
	
	if(state == gStateTrashView) {
		var margin = 6
		var x = margin
		var y = 8
		var spacing = 1
		var cardSizeX = gCardRem+spacing
		var i=0
		for(var card of gYou.trash) {
			card.div.style.fontSize = gCardRem+'rem'
			gDivBottomSet(card, y, x)
			card.div.style.zIndex = 2001+i
			x+=cardSizeX+spacing
			if(x>100-margin-cardSizeX) {
				x = margin
				y += cardSizeX*gCardTall + spacing
			}
			i++
		}
	}
	
	gDivBottomSet(gDeckDiv, !gBattleIn || gYou.deck[0] ? u:72)
	
	if(state == gStateIntro) {
		gDivBottomSet(gYou,83)
		gBubbleMake(0, gLoadingDotsHtmlGet())
		gBubbleMake(1, gLoadingDotsHtmlGet())
		gBubbleGet(1).style.opacity = 0
		gRival = gGuyMake(gRivalKinds[7])
		gDelay(_=>{
			gBubbleTextSet(0, "Cats rule the<br />internet!")
			gDelay(_=>{
				gDivBottomSet(gRivalDiv, 58)
				gBubbleGet(1).style.opacity = 1
				gDelay(_=>{
					gBubbleTextSet(1, "Not anymore. Billionaires rule<br>the internet now. We bought it!")
					gDelay(_=>{
						gBubbleMake(0, gLoadingDotsHtmlGet(), 1)
						gBubbleMake(1, gLoadingDotsHtmlGet(), 1)
						gBubbleGet(3).style.opacity = 0
						gDelay(_=>{
							gBubbleTextSet(2, "Nobody wants<br>that!")
							gDelay(_=>{
								gBubbleGet(3).style.opacity = 1
								gDelay(_=>{
									gBubbleTextSet(3, "Since I'm a free speech absolutist<br>you can only reply with emojis.")
									gDelay(_=>{
										gBubbleMake(0, gLoadingDotsHtmlGet(), 1)
										gBubbleMake(1, gLoadingDotsHtmlGet(), 1)
										gBubbleGet(5).style.opacity = 0
										gDelay(_=>{
											gBubbleTextSet(4, "🤬<div class=emoji>‼❓❔⁉</div>")
											gDelay(_=>{
												gBubbleGet(5).style.opacity = 1
												gDelay(_=>{
													gBubbleTextSet(5, "Not so fast. You have to buy<br>your first emoji pack for $8.")
													gButtonShow(0, 'Buy $8', 14, _=>{
														gButtonShow()
														gGoldAdd(-8)
														
														gDivBottomSet(gYou)
														gDivBottomSet(gRivalDiv)
														gDeckShow()
													})
													
													gCardPackMake()
												}, gIntroSpeed)
											}, gIntroSpeed)
										}, gIntroSpeed)
									}, gIntroSpeed*1.5)
								}, gIntroSpeed)
							}, gIntroSpeed)
						}, gIntroSpeed)
					}, gIntroSpeed*1.5)
				}, gIntroSpeed)
			}, gIntroSpeed)
		}, gIntroSpeed)
	}
	
	if(gState == gStateShop) {
		gDivBottomSet(gMessageDiv)
		gDeckShuffle()
		gDeckRender()
		gButtonShow()
		
		for(var card of gRival.deck) {
			gCardFlipDown(card)
			gDivBottomSet(card, 0, 100)
		}
	}
	
	if(gOr(state, gStateFeedLoad, gStateFeed) || gState == gStateDeckView) {
		gKeyboardHeightSet(20)
		for(var card of gYou.deck) {
			gCardFlipDown(card)
		}
		gHandRender()
	}

	gState = state
	gStateState = 0
	
	if(state == gStateCardRemove) {
		gDeckShow()
	}
	
	if(state == gStateShop) {
		gKeyboardHeightSet(92)
		var i=0,html=''
		for(var card of gRival.deck) {
			card.div.style.opacity = 1
			card.div.querySelector('.cardFront').classList.add('glow')
			gDivBottomSet(card, 47, (50-gCardRem/2)+(i-(gRival.deck.length-1)/2)*(gCardRem+.7))
			gCardFlipUp(card)
			html += `<div style='width:${gCardRem+.7}rem;color:#${gGold<card.gold?'D':'0'}00'>$${card.gold}</div>`
			i++
		}

		html = `<div style='display:flex;justify-content:center;margin-top:39rem;font-size:6rem'>${html}</div>`

		gDivBottomSet(gMessageDiv, 38)
		gMessageDiv.innerHTML = `Welcome to ${gRival.kind.name} shop`+html
		gButtonShow(0, 'Leave', 22, gFeedGo2)
	}

	if(state == gStateFeedLoad) {
		gDivBottomSet(gRivalDiv)
		if(gStateOld!=gStateDeckView)gDayAdd()
		gBubblesDiv.innerHTML = ''
		gBubbleDivAdd(`<div style='font-size:3rem;background:#ABF;border-radius:99rem;color:#000;padding:1rem 3rem;margin:2rem auto;display:inline-block'>August ${gDay}, 2025</div>`)

		gButtonShow(0, 'View Your Feed', 66, _=>{
			gDelay(_=> {
				var high = gDay>1&&gDay<13 ? 2:1
				var specialI = gDay>12 ? 1:2
				for(var rivalI=0; rivalI<=high; rivalI++) {
					var rivalKind = gRivalKinds[rivalI==specialI ? gRandomInt(8,13) : Math.min(6, gRandomInt(1,3)*rivalI+(gDay-1)/2|0)]
					rivalKind.fans += rivalKind.fans && gDay*gRandomInt(2,5)
					if(gDay>12 && !rivalI)rivalKind = gRivalKinds[7]
					gBubbleMake(1, rivalKind.post, u, rivalKind)
					if(rivalI==specialI) {
						gRival = gGuyMake(rivalKind)
						if(rivalKind.index > 9) {
							var total = 4
							var kinds = gCardKinds.filter(kind=>kind.type==rivalKind.index-10)
							gShuffleArray(kinds)
							for(var i=0; i<total; i++) {
								card = gCardMake(kinds[i])
								card.gold = (11+kinds[i].i)/gRandomInt(4,9) |0
								card.state = gCardStateShop
								gRival.deck.push(card)
							}
							gButtonMake('🛒 Shop Now', _=>gStateSet(gStateShop))
						}
						if(rivalKind.icon == '🛠') {
							gButtonMake('Buy $4', _=>gGold>3 && gStateSet(gStateCardRemove))
						}
						if(rivalKind.icon == '✨') {
							gButtonMake('Buy $1', _=>gGold && (gGoldAdd(-1),gGuyFansSet(gYou, 1),gSoundPlay(gCardPlaySounds[0])))
						}
					} else {
						rivalKind.button = gButtonMake('💬 Reply', gBattleStart.bind(u,rivalKind))
					}
				}
			}, 4)
			gFeedGo()
		})
		
	}
}

var gGuyCoolAdd = (guy, total) => {
	guy.cool += total
	gItemsRender(guy)
}

var gGuyShoutAdd = (guy, total) => {
	guy.shout += total
	gItemsRender(guy)
}

var gGuyFansSet = (guy,fans) => {
	guy.fans += fans
	guy.fansDiv.style.color = guy.fans>0 ? '#000':'#F00'
	if(gBattleIn) {
		if(fans>0) {
			gDivClassSet(guy.fansDiv, 'votedUp', 4)
			gSoundPlay(gCardPlaySounds[0], guy.pan)
		}
		if(fans<0) {
			gDivClassSet(guy.fansDiv, 'votedDown', 4)
			gSoundPlay(gFanLoseSound, guy.pan)
		}
		if(guy.fans <= 0) {
			guy.fans = 0
			gBattleIn = 2
			
			gBubbleDivAdd("<div style='height:55rem'></div>")
			
			gBubblesDivScrollBottom()
			
			gDivClassSet(guy.fansDiv, 'blink', 19)
			gSoundPlay(gCancelSound,.8)
			gDelay(_=> {
				gStateSet(guy == gYou ? gStateLose : gStateWin)
				gDivBottomSet(guy.div, 105)
				gDelay(_=> {
					gStateStateSet(2)
					gDelay(_=> gVibrate(), 5)
					gDelay(_=> guy!=gYou ? gBubbleMake(0,"justice is served!",1): (gBubbleMake(1,"hahaha!",1),gBubbleDivAdd("<div style='height:24rem'></div>")), 9)
					if(guy==gYou) {
						gBattleCleanup()
						gGameOverShow()
					} else {
						gDelay(_=> {
							gSoundPlay(gWinSound)
							gBattleCleanup()

							if(gDay>12) {
								gGameOverShow(1)
							} else {
								gYou.shout = gYou.cool = 0
								gYou.items = []
								gItemsRender(gYou)
								
								var total = 3
								var margin = 2
								for(var i=0; i<total; i++) {
									var card = gRival.deck.pop() || gRival.trash.pop()
									card = gCardMake(card.kind)
									card.state = gCardStatePrize
									card.div.querySelector('.cardFront').classList.add('glow')
									gDivBottomSet(card, 37, (50-gCardRem/2)+(i-(total-1)/2)*(gCardRem+margin))
									gCardFlipUp(card)
									gPrizeCards.push(card)
								}
								gDivBottomSet(gMessageDiv, 72)
								gMessageDiv.innerHTML = `<div style='margin-bottom:2rem'>Your fans donated $6 to you!</div>You can take an emoji:`
								gButtonShow(0, '❌ No Thanks', 22, gPrizeDone)
								
								gGoldAdd(6)
							}
						}, 15)
					}
				}, 11)
			}, 14)
		}
	}
	
	guy.fansDiv.innerHTML = '👤'+guy.fans
	if(guy==gYou) {
		gHpDiv.innerHTML = guy.fans
	}
}

var gGameOverShow = win => {
	var post = (win?gYou:gRival).posting.map(card=>card.kind.emoji).join('')
	var score = '🏆'+(gDay*100+gYouVotesHigh+gGold)
	var text = win ? 
		`I cancelled ${gRival.kind.name} with this post: ${post}
${score}`
		:
		`I was cancelled by a ${gRival.kind.name} on August ${gDay}! They posted `+post
	gKeyboardDiv.innerHTML = `
		<div style='font-size:6rem;padding-top:18rem'>${win?'YOU SAVED THE INTERNET!':'Game Over'}</div>
		<div style='font-size:4rem'>Best post ever: ${gYouVotesHigh} (${gYouVotesHighPost})</div>
		<div style='font-size:4rem'>Final Score: ${score}</div>
		<textarea style='width:50rem;height:15rem;font-size:3rem;margin:2rem'>${text}</textarea>
	`
	gButtonShow(0, "Copy to share", 22, _=>{
		navigator.clipboard.writeText(text)
		gButtonShow(0, "✔", 22, _=>{})
	})
}

var gBattleCleanup = _=> {
	for(var card of gYou.items) {
		gCardTrashGo(card)
	}
	gBattleIn = 0
	gTrashClear(gYou)
	gHandRender()
	gPostingRender()
	gTrashRender()
}

var gDivFadeOutDelete = div => {
	if(div.div) {
		div.state = 0
		div = div.div
	}
	div.style.opacity = 0
	gDelay(_=>{
		div.remove()
	}, 5)
}

var gPrizeDone = cardChose =>{
	gDivBottomSet(gMessageDiv)
	gDeckShuffle()
	gDeckRender()
	gButtonShow()
	
	for(var card of gPrizeCards) {
		if(card == cardChose) {
			gCardFlipDown(card)
			gCardDeckAdd(card, gYou)
			gSoundPlay(gCardGetSound)
		} else {
			gDivFadeOutDelete(card)
		}
	}
	gPrizeCards = []
	
	gDelay(_=> {
		gStateSet(gStateFeedLoad)
	}, 5)
}

var gBattleFansSet = fans => {
	gBattleFans = fans
	gBattleFansDiv.innerHTML = '👁'+gBattleFans
	gDivBottomSet(gBattleFansDiv, gBattleIn ? gSizeY/gSizeX*100-25 : u)
	gDivBottomSet(gFanAddDiv, gBattleIn ? gSizeY/gSizeX*100-25 : u)
}

var gBattleStart = rivalKind => {
	//need to clear the old state before we set rival.
	gStateSet(gStateRivalPlay)
	
	var div, kids = gBubblesDiv.children
	var i = [...kids].indexOf(rivalKind.button)
	while(div = kids[i]) {
		div.remove()
	}
	while((div = kids[i-3]) && kids[2]) {
		div.remove()
	}
	
	gRound = 0
	gBattleFansSet(3+gDay/6|0)
	gKeyboardHeightSet(87)
	
	gGuyNow = gRival = gGuyMake(rivalKind)
	gYou.other = gRival
	
	gBattleIn = 1

	gYou.itemsDiv = gYouItemsDiv
	gRival.itemsDiv = gRivalItemsDiv
	gItemsRender(gRival)
	
	gRival.fans = rivalKind.fans
	for(var emoji of rivalKind.deck) {
		var kind = gCardKindsByEmoji[emoji]
		if(!kind)debugger
		gCardDeckAdd({kind, div:gDivMake()}, gRival)
	}
	
	gDivBottomSet(gRival, 113)
	gDivBottomSet(gYou)
	
	
	gDeckShuffle(gYou)
	if(rivalKind.index)gDeckShuffle(gRival)
	
	gHandRender()
	
	gDelay(gRoundStart,2)
	
}

var gRoundStart = _ => {
	if(gBattleIn>1)return
	console.log("gRoundStart()", gRound)
	gRound++
	gYou.votes = gRival.votes = 0
	gYou.posting = []
	gRival.posting = []
	
	gBubbleDivAdd(`<div style='background:#FFF;padding: .5rem 4rem;font-size:2rem;border-radius:9rem;display:inline-block;margin-top:3rem'>Post ${gRound}</div>`)
	
	gRival.postBubble = gBubbleMake(1, '')
	gYou.postBubble = gBubbleMake(0, '')
	
	gTurnStart(gRival)
}

var gTurnStart = guy => {
	console.log("gTurnStart()", gRound, guy==gYou)
	gGuyNow = guy
	
	gPostingCard0 = u
	
	if(guy != gYou) {
		gStateSet(gStateRivalPlay)
		gDelay(_=>{
			gRivalAI()
		}, gRound<2?12:6)
	} else {
		gStateSet(gStateDraw)
	}
	
	gDraw((guy==gYou ? 5 : 4) + gGuyItemTotalGet('🧠'))
	gGuyShoutAdd(gGuyNow, gGuyItemTotalGet('📡')*2 + gGuyItemTotalGet('📈'))
	gGuyCoolAdd(gGuyNow, gGuyItemTotalGet('🛕')*2 + gGuyItemTotalGet('📈'))
	gPostingRender()
}

var gRivalAI = _=> {
	var cans = []
	for(var card of gRival.hand) {
		if(gCardUseCan(card)) {
			cans.push(card)
		}
	}
	card = cans[0]
	if(card) {
		if(card.kind.ender || card.kind.discard>1 || card.kind.text.includes('prev')) {
			gShuffleArray(cans)
		}
		if(gCardUse(cans[0])) {
			cans = []
		}
	}
	if(cans[1]) {
		gDelay(_=>{
			gRivalAI()
		}, 6)
	} else {
		gTurnStart(gYou)
	}
}

var gGuyFanGain = guy => {
	if(gBattleFans > 0) {
		gFanAddDiv.innerHTML = '👤1'
		gDivBottomSet(gFanAddDiv, 89+(guy!=gYou)*24)
		gFanAddDiv.style.left = guy.pan*100+'rem'
		gDelay(_=>{
			gFanAddDiv.innerHTML = ''
			gFanAddDiv.style.left = '3rem'
			gBattleFansSet(gBattleFans-1)
			gGuyFansSet(guy, 1)
		}, 6)
	}
}

var gSend = _=>{
	if(gState!=gStatePlay)return

	if(gRival.votes < 0) {
		if(gYouVotesHigh<-gRival.votes) {
			gYouVotesHigh = -gRival.votes
			gYouVotesHighPost = gYou.posting.map(card=>card.kind.emoji).join('')
		}
	}

	gStateSet(gStatePost)
	
	var guys = [gYou, gRival]
	for(var guy of guys) {
		for(var card of guy.hand) {
			gCardTrashGo(card)
		}
		guy.hand = []
	}
	gHandRender()
	
	gBubblesDiv.children[gBubblesDiv.children.length-1].firstChild.className = 'posted'
	gBubblesDiv.children[gBubblesDiv.children.length-2].firstChild.className = 'posted'
	gDelay(_=>{
		var votes = gYou.votes
		var votes2 = gRival.votes
		if(votes < 0) {
			gGuyFansSet(gYou, votes)
			gDraw(3*gGuyPostTotalGet('💤', gYou), gYou)
		}
		if(gBattleIn<2) {
			if(votes2 < 0) {
				gGuyFansSet(gRival, votes2)
				gDraw(3*gGuyPostTotalGet('💤', gRival), gRival)
			}

			var delay = 7
			if((votes > 0 || votes2 > 0) && votes != votes2 && gBattleFans>0) {
				gGuyFanGain(votes > votes2 ? gYou:gRival)
				delay += 6
			}
			
			gDelay(gRoundStart, delay)
	
			for(var guy of guys) {
				for(var card of guy.posting) {
					if(card.kind.type == 3) {
						card.state = gCardStateItemUsed
					} else {
						gCardTrashGo(card)
						if(card.kind.emoji == '☮') {
							gArrayRemove(guy.trash, card)
							card.guy = u
							gDivFadeOutDelete(card)
						}
					}
				}
			}
			gTrashRender()
		}
	}, 10)
}

var gSendShould = _=>{
	for(var card of gYou.hand) {
		if(gCardUseCan(card)) {
			return
		}
	}
	return 1
}

var gDayAdd = _=> {
	gDay++
	gDayDiv.innerHTML = gDay
}

var gGoldAdd = add => {
	gGold += add
	gGoldDiv.innerHTML = gGold
}

var gTrashClear = guy => {
	for(var card of guy.trash) {
		gCardFlipDown(card)
		card.state = gCardStateDeck
		guy.deck.push(card)
	}
	guy.trash = []
	gDeckShuffle(guy)
}

var gDraw = (total,guy) => {
	if(gBattleIn>1)return
	if(total) {
		if(!guy)guy = gGuyNow
		if(total>1) {
			console.log("gDraw()", total)
			for(var i=0; i<total; i++) {
				if(guy == gYou) {
					gDelay(_=>gDraw(1,guy), i)
				} else {
					gDraw(1, guy)
				}
			}
			if(gState == gStateDraw) {
				gDelay(_=>{gStateSet(gStatePlay);gSendButtonRender()}, i+1)
			}
			return
		}

		if(guy.hand.length < 8) {
			if(!guy.deck[0]) {
				gTrashClear(guy)
			}
			
			var card = guy.deck.pop()
			if(card) {
				if(guy == gYou) {
					gDelay(_=> {
						gCardFlipUp(card)
						gSoundPlay(gCardDrawSound, card)
					}, 2)
				}
				gCardHandAdd(card, guy)
				gDivBottomSet(gDeckDiv, guy.deck[0] ? u:72)
			}
			
			gHandRender()
		}

	}
}

var gDeckShuffle = guy => {
	if(!guy)guy = gGuyNow
	gShuffleArray(guy.deck)
	guy.deck.map((card,i)=>card.div.style.zIndex=i+2)
}

var gShuffleArray = a => {
    for(var i=a.length-1; i>0; i--) {
        var j = gRandomInt(0,i)
        var t = a[i]
        a[i] = a[j]
        a[j] = t
    }
}

var gRandomInt = (lo, hi) => Math.random()*(hi-lo+1)+lo|0

var gCardHandAdd = (card, guy) => {
	if(!guy)guy = gGuyNow
	console.log("gCardHandAdd()", card.kind.name)
	card.state = gCardStateDraw
	card.handI = 0
	while(1) {
		if(!guy.hand.find(card2=>card2.handI==card.handI)) {
			break
		}
		card.handI++
	}
	gPush(guy.hand, card)
	
}

var gCardFlipUp = card => {
	//console.log("gCardFlipUp()", card.kind.name)
	card.div.classList.add('faceUp')
	card.div.style.fontSize = gCardRem+'rem'
}

var gCardFlipDown = card => {
	//console.log("gCardFlipDown()", card.kind.name)
	card.div.classList.remove('faceUp')
	card.div.style.fontSize = gCardRem*.4+'rem'
}

var gLoadingDotsHtmlGet = _ => Array.from({length:3},(_,i)=>`<div style='width:1.5rem;height:1.5rem;border-radius:99%;display:inline-block;margin:5rem .5rem 3rem;animation:load 1s infinite;background:#09C;animation-delay:.${i*2}s'></div>`).join('')


var gCardInfoShow = (div) => {
	if(div == gBattleFansDiv) {
		var text = gBattleFans+" ppl r watching. they become fans if ur post is best"
	}
	if(div == gRivalFansDiv) {
		text = gRival.kind.name+` has ${gRival.fans} fans left`
	}
	if(div == gYouFansDiv || div == gHpDiv) {
		text = `u have ${gYou.fans} fans left`
	}
	var html = div.innerHTML
	var cardKind = gCardKindsByEmoji[html]
	if(cardKind && div != gMuteButton) {
		text = cardKind.name+':<br>'+cardKind.text
	}
	var html2 = html.substr(0,2)
	var total = html.substr(2)
	if(html2 == '🗣') {
		text = `Shout ${total}: Adds 👎${total} to each hate emoji used`
	}
	if(html2 == '😎') {
		text = `cool ${total}: Adds 👍${total} to each cute emoji used`
	}
	/*
	if(gOr(div.parentNode, gPostingSlotsDiv, gItemsDiv)) {
		for(var kind of gCardKinds) {
			if(kind.emoji == div.innerHTML) {
				text = kind.text
			}
		}
	}
	*/
	if(text) {
		gTooltipShow(div, text)
	}
}

var gTooltipShow = (div, text) => {
	gCardInfoDiv.firstChild.innerHTML = text
	
	var rect = div.getBoundingClientRect()
	gCardInfoDiv.style.display = 'block'
	gCardInfoDiv.style.top = rect.y+rect.height*.8+'px'
	var pad = 13*gSizeX/100
	gCardInfoDiv.style.left = Math.min(innerWidth-pad, Math.max(pad, rect.x+rect.width/2))+'px'
	gCardInfoDiv.style.fontSize = '3rem'
}

var gButtonShow = (index, text, bottom, func) => {
	var button = index?gButton2:gButton
	button.innerHTML = text
	gDivBottomSet(button, bottom)
	button.onclick = _=>{
		gSoundPlay(gClickSound)
		func()
	}
}

var gDivShow = (div, cond) => {
	div.style.display = cond ? 'block':'none'
}

var gPostingRender = _ => {
	gDivBottomSet(gSendButton, gBattleIn ? gHandSizeY+2:u)
	if(!gBattleIn)return
	
	gSendButtonRender()
	
	var html = ''
	
	
	var card,cardI=0
	for(var i=0; i<gEnergyMaxGet(gYou); i++) {
		card = gYou.posting[cardI]
		if(card) {
			i += card.kind.cost-1
			html += `<div style='border-bottom:1rem solid transparent'>${card.kind.emoji}</div>`.repeat(card.kind.cost)
		} else {
			html += `<div class=postingSlotEmpty></div>`
		}
		cardI++
	}
	gGuyPostBubbleRender(gYou, html)
	
	gGuyPostBubbleRender(gRival, gRival.posting.map(card=>`<span>${card.kind.emoji}</span>`.repeat(card.kind.cost)).join('')+gTextIf(gState==gStateRivalPlay && gEnergyGet(gRival)>0, gLoadingDotsHtmlGet()))
	
	gDivBottomSet(gYou, gState==gStateIntro ? 69 : 89)
	
}

var gGuyPostBubbleRender = (guy, html) => {
	var thumb = '👍'
	if(guy.votes<0)thumb=`<div style='filter:contrast(.5);display:inline-block'>${thumb}</div>`
	thumb += guy.votes
	
	gBubbleTextSet(guy.postBubble, `
		<div class=emoji style='font-size:7rem;display:flex;align-items:flex-end;min-height:10rem;white-space:nowrap'>${html}</div>
		<div style='text-shadow:-2px -2px 1px #FFF,2px -2px 1px #FFF,-2px 2px 1px #FFF,2px 2px 1px #FFF;font-weight:bold;white-space:nowrap;position:absolute;top:100%;${guy!=gYou?'left':'right'}:0;font-size:6rem;color:#${guy.votes<0?'E':'0'}00'>${thumb}</div>
	`)
}

var gEnergyMaxGet = guy => {
	var energy = gEnergyStart
	if(guy != gYou)energy--
	
	for(var card of guy.posting) {
		energy += card.energy
	}

	energy += gGuyItemTotalGet('🏡',guy)
	//energy -= gGuyItemTotalGet('⚖',guy.other)

	return Math.min(8, energy)
}

var gEnergyGet = guy => {
	var energy = gEnergyMaxGet(guy)
	for(var card of guy.posting) {
		energy -= card.kind.cost
	}
	return energy
}

var gCardUseCan = card=>{
	return card.kind.cost <= gEnergyGet(gGuyNow)
}

var gTextIf = (cond, text) => cond?text:''

var gItemsRender = guy =>{
	guy.itemsDiv.innerHTML =
		gTextIf(guy.shout, `<div>🗣${guy.shout}</div>`) +
		gTextIf(guy.cool, `<div>😎${guy.cool}</div>`) +
		guy.items.map(card=>`<div>${card.kind.emoji}</div>`).join(' ')
}

var gTrashToggle = _=> {
	if(gTrashPick<1)
		gStateSet(gState == gStateTrashView ? gStateOld : gStateTrashView)
}

var gArrayRemove = (a,v)=>{
	var i = a.indexOf(v)
	if(i<0)debugger
	a.splice(i,1)
}

var gPush = (list, item, errorIgnore) => {
	if(list.indexOf(item)>=0) {
		if(!errorIgnore) {
			debugger
		}
		return
	}
	list.push(item)
}

var gCardUseTry = card=>{
	console.log("gCardUseTry()", card.kind.name, card.state)
	
	if(card.state == gCardStatePrize) {
		gPrizeDone(card)
		return
	}
	
	if(card.state == gCardStateShop) {
		if(gGold >= card.gold) {
			gGoldAdd(-card.gold)
			gArrayRemove(gRival.deck, card)
			gCardDeckAdd(card, gYou)
			gCardFlipDown(card)
			gSoundPlay(gCardGetSound)
			gDelay(_=>{gDeckRender();gStateSet(gState)},2)
			
		}
		return
	}
	
	if(gState == gStateCardRemove) {
		if(!gStateState) {
			gStateStateSet(2)
			gDivFadeOutDelete(card)
			gSoundPlay(gCardRemoveSound)
			gBubblesDiv.lastChild.remove()
			gBubbleDivAdd("<div style='font-size:4rem;color:#2A2;position:relative;top:-5rem'>Purchased!</div>")
			
			gDelay(_=>{
				gGoldAdd(-4)
				gArrayRemove(gYou.deck, card)
				gFeedGo()
			}, 5)
		}
		return
	}
	
	if(gOr(gState,gStateFeed,gStateFeedLoad,gStateLose,gStateWin)) {
		if(gYou.deck.includes(card)) {
			gStateSet(gStateDeckView)
			gSoundPlay(gClickSound)
			gDeckShow()
		}
	}
	
	if(!gOr(gState,gStateDiscard,gStateTrashView,gStatePlay)) {
		return
	}
	
	if(card.state == gCardStateDiscard) {
		if(gState == gStateTrashView) {
			if(gTrashPick) {
				gTrashPick--
				if(gTrashPick<1) {
					var card2 = gYou.posting[gYou.posting.length-1]
					if(card2.kind.emoji=='🦝') {
						gArrayRemove(gYou.trash, card)
						gCardHandAdd(card)
						gHandRender()
						gTrashToggle()
					}
				}
			}
		} else {
			gStateSet(gStateTrashView)
		}
		gSoundPlay(gClickSound)
		return
	}
	
	if(card.state != gCardStateDraw) {
		gTooltipShow(card.div, gYou.deck.length+" cards left in ur deck")
		return
	}
	
	if(gState == gStateDiscard) {
		gSoundPlay(gCardDiscardSound)
		card.state = gCardStateDiscard
		gDiscardNeed--
		gCardDiscard(card)
		if(gDiscardNeed<1) {
			gStateSet(gStatePlay)
		} else {
			gStateSet(gState)
		}
		gHandRender()
		return
	}
	
	if(gCardUseCan(card)) {
		gCardUse(card)
	} else {
		gTooltipShow(card.div, gEnergyGet(gYou) ? "not enough room in ur post!": "post is full!")
	}
}

var gGuyPostTotalGet = (emoji, guy) => (guy||gGuyNow).posting.filter(card=>card.kind.emoji==emoji).length
var gGuyItemTotalGet = (emoji, guy) => (guy||gGuyNow).items.filter(card=>card.kind.emoji==emoji).length

var gSendButtonRender = _=> gSendButton.style.background = gState!=gStatePlay ? '#888' : (gSendShould() ? '#0E0' : '#2A2')

var gCardUse = card => {
	var guy = gGuyNow
	guy.other.votes -= gGuyItemTotalGet('🚽')
	
	card.state = gCardStateUsing
	gArrayRemove(guy.hand, card)
	
	gCardUsePostAdd(card)
	if(card.kind.xAll) {
		while(gEnergyGet(guy)) {
			gCardUsePostAdd(card)
		}
	}
	
	gPostingRender()
	gSoundPlay(gCardPlaySounds[card.kind.type], card)
	
	if(guy == gYou) {
		card.div.style.opacity = 0
		card.div.style.pointerEvents = 'none'
		gDivBottomSet(card, 72, 20)
	}
	
	if(card.kind.ender) {
		if(guy != gYou)return 1
		gSend()
	}
}

var gCardNowMultGet = _ => 
	!gGuyNow.posting[0] && gGuyItemTotalGet('🔒',gGuyNow.other) ? 0 :
	(
		gPostingCard0?.kind.emoji=='🔊' ? 2: 1
	)

var gCardAttackNowGet = card => {
	var votes = card.kind.attack || 0
	if(votes.call) {
		votes = votes()
	}
	if(votes) {
		votes += gGuyNow.cool
	}
	return votes*gCardNowMultGet()
}

var gCardBlockNowGet = card => {
	var votes = card.kind.block || 0
	if(votes.call) {
		votes = votes()
	}
	if(votes) {
		votes += gGuyNow.shout
	}
	return votes*gCardNowMultGet()
}

var gGuyVotesAdd = (votes, guy) => {
	if(!guy)guy = gGuyNow
	guy.votes += votes
	if(votes>0)gDivClassSet(guy.postBubble, 'votedUp', 4)
	if(votes<0)gDivClassSet(guy.postBubble, 'votedDown', 4)
}

var gCardUsePostAdd = card => {
	
	var block = gCardBlockNowGet(card)
	var attack = gCardAttackNowGet(card)
	
	if(block) {
		gGuyVotesAdd(-block, gGuyNow.other)
	}
	
	if(attack) {
		gGuyVotesAdd(attack)
	}

	//gGuyVotesAdd((gGuyItemTotalGet('📵', gYou) + gGuyItemTotalGet('📵', gRival))*-2)


	card.attack = attack
	card.block = block

	var energy = card.kind.energy||0
	card.energy = energy.call ? energy() : energy
	
	card.cool = card.kind.cool||0
	card.shout = card.kind.shout||0
	
	card.kind.onUse?.(card)

	if(card.block>0) {
		gDraw(gGuyItemTotalGet('👒', gGuyNow.other), gGuyNow.other)
	}

	gGuyCoolAdd(gGuyNow, card.cool)
	gGuyShoutAdd(gGuyNow, card.shout)
	
	gGuyNow.posting.push(card)
	card.kind.seen = 1
	gPostingCard0 = card
	gHandRender()
	
	if(card.kind.type == 3) {
		gGuyNow.items.push(card)
		gItemsRender(gGuyNow)
	}

	gDraw(card.kind.draw)

	/*
	if(card.kind.emoji=='🦝') {
		if(gGuyNow.trash[0]) {
			gTrashPick = 1
			gStateSet(gStateTrashView)
		}
	}
	if(card.kind.emoji=='🦅') {
		while(1) {
			var kind = gCardKinds[gRandomInt(0,gCardKinds.length-1)]
			if(kind.type == 0)break
		}
		var card2 = gCardMake(kind)
		gCardFlipUp(card2)
		gCardHandAdd(card2)
		gHandRender()
	}
	*/

	//if this card changed your energy total, update cantUse
	gHandRender()
	
	if(gDiscardNeed = card.kind.discard) {
		if(gGuyNow == gYou) {
			gStateSet(gStateDiscard)
		} else {
			for(;gDiscardNeed--;) {
				var card2 = gGuyNow.hand[0]
				if(card2) {
					gCardDiscard(card2)
				}
			}
		}
	}
}

var gCardTrashGo = card => {
	card.state = gCardStateDiscard
	card.div.style.opacity = 1
	card.div.style.pointerEvents = 'all'
	card.div.classList.remove('cantUse')

	gPush(card.guy.trash, card, 1)
}

var gCardDiscard = card => {
	gArrayRemove(gGuyNow.hand, card)
	gCardTrashGo(card)
	card.kind.onDiscard?.()
}

var gDivClassSet = (div, className, time100) => {
	gDelay(_=>{
		if(div===0 || div*1) {
			div = gBubbleGet(div).firstChild.firstChild.children[1]
		}
		div.classList.add(className)
		if(time100)gDelay(_=>div.classList.remove(className), time100)
	})
}

var gTrashRender = _=> {
	var cardSizeX = gCardRem*gSizeX/100
	var i=0
	for(var card of gYou.trash) {
		card.div.style.zIndex = 1000+i
		card.div.style.fontSize = gCardRem/3+'rem'
		gDivBottomSet(card, gHandSizeY+3+i*.2, 24)
		i++
	}
	
	gDivBottomSet(gTrashDiv, gBattleIn ? gHandSizeY+1 : u)
}

var gDeckRender = _=> {
	var i=0
	for(var card of gYou.deck) {
		card.div.style.fontSize = gCardRem*.4+'rem'
		card.div.style.left = gYou.deck.length-i+'px'
		card.div.style.bottom = (gHandSizeY+1)*gSizeX/100+i+'px'
		if(!gBattleIn) {
			card.div.style.bottom = i+3+gSizeX/99+'px'
		}
		i++
	}
}

var gHandRender = ()=>{
	
	gSendButtonRender()
	
	gDeckRender()
	
	gTrashRender()
	
	var i=0
	for(var card of gYou.hand) {
		card.div.style.zIndex = 1000+gYou.hand.length-i
		
		if(gCardUseCan(card)) {
			card.div.classList.remove('cantUse')
		} else {
			card.div.classList.add('cantUse')
		}
		
		card.div.querySelector('.cardText').innerHTML = gCardTextHtmlGet(card)
		
		i++
	}
	
	var cardSizeX = gCardRem
	var spacing = .5
	var screenPadding = .5
	var startY = screenPadding+spacing
	for(var card of gYou.hand) {
		var x = (cardSizeX+spacing)*(card.handI%4)+spacing*3
		var y = startY + (card.handI<4 ? 0 : cardSizeX*gCardTall+spacing)
		gDivBottomSet(card, y, x)
		card.div.style.fontSize = gCardRem+'rem'
	}
	for(var i=0; i<gHandMax; i++) {
		var x = (cardSizeX+spacing)*(i%4)+spacing*3
		var y = startY + (i<4 ? 0 : cardSizeX*gCardTall+spacing)
		var div = d.getElementsByClassName('handBlank')[i]
		div.style.display = gBattleIn ? 'block':'none'
		gDivBottomSet(div, y, x)
		div.style.fontSize = gCardRem+'rem'
	}
}

var gCardDeckAdd = (card, guy) => {
	card.state = gCardStateDeck
	if(guy == gYou) {
		card.kind.seen = 1
		card.div.querySelector('.cardFront').classList.remove('glow')
	}
	guy.deck.push(card)
	card.guy = guy
}

var gCardMake = (kind)=>{
	var card={kind}
	var div = gDivMake(u, 'card')
	card.div = div
	div.onclick = gCardUseTry.bind(u,card)
	div.style.fontSize = gCardRem+'rem'
	div.style.zIndex = 3
	div.style.left = -gCardRem+'rem'
	div.innerHTML = gCardHtmlGet(card)
	gCardsDiv.appendChild(div)
	return card
}

var gDeckShow = _=>{
	gKeyboardHeightSet(136)
	var x = 43, y=28, z = 3
	for(var card of gYou.deck) {
		x+=.2
		y+=1
		card.div.querySelector('.cardText').innerHTML = gCardTextHtmlGet(card)
		gDivBottomSet(card, y, x)
		card.div.style.fontSize = gCardRem/2+'rem'
		card.div.style.zIndex = z++
	}
	gDelay(_=>{
		var spacing = .8 //.8 = 4/(100-gCardRem*4)
		var cardSizeX = gCardRem+spacing
		var rows = Math.ceil(gYou.deck.length/4)
		var addY = Math.min(cardSizeX*gCardTall + spacing, 75 / (rows-1))
		var i=0
		for(var card of gYou.deck) {
			card.div.style.fontSize = gCardRem+'rem'
			var x = spacing + (i%4)*cardSizeX
			var y = 100-(i/4|0)*addY
			gDivBottomSet(card, y, x)
			i++
			gDelay(gCardFlipUp.bind(n,card), 3 + i*.1)
		}
		gSoundPlay(gPackOpenSound)
		gDelay(_=>{
			gButtonShow(0, gState!=gStateCardRemove?'Okay':'Cancel', 10, _=>
				gStateSet(gState == gStateIntro ? gStateFeedLoad : gStateOld)
			)
		}, 9)
	}, 2)
}

var gFeedGo2 = _ => {
	gDivBottomSet(gRivalDiv)
	gDivBottomSet(gYouDiv)
	gStateSet(gStateFeed)
	gDivBottomSet(gLoadingDiv)
	gDivBottomSet(gMessageDiv)
}

var gFeedGo = _ => {
	gDivBottomSet(gMessageDiv)
	gLoadingDiv.innerHTML = gLoadingDotsHtmlGet()
	gDivBottomSet(gLoadingDiv, 99)
	gButtonShow()
	gDelay(gFeedGo2, 4)
}

var gKeyboardHeightSet = rem => gKeyboardDiv.style.height = rem+'rem'

var gCardPackMake = _=>{
	if(0) {
		for(var emoji of gRivalKinds[0].deck) {
			var kind = gCardKindsByEmoji[emoji]
			if(!kind)debugger
			var card = gCardMake(kind)
			gCardDeckAdd(card, gYou)
		}
	} else {
		for(var i=0; i<12; i++) {
			//var card = gCardMake(gCardKinds[i])
			var k = i/4|0
			if(i==7)k=2
			if(i>7)k=3+gRandomInt(0,55)
			var card = gCardMake(gCardKinds[k])
			gCardDeckAdd(card, gYou)
		}
	}
	gDelay(_=>{
		var y=28
		for(var card of gYou.deck) {
			y+=.1
			gDivBottomSet(card, y, 44)
			card.div.style.fontSize = gCardRem/2+'rem'
		}
	})
}

var gCardHtmlGet = card => {
	var kind = card.kind
	var emojis = kind.emoji
	if(kind.cost > 1) {
		emojis = ''
		for(var i=0; i<kind.cost; i++) {
			emojis += `
				<div style='position:absolute;left:${(i+1)/(kind.cost+1)*100}%;transform:translateX(-50%)'>
					${kind.emoji}
				</div>
			`
		}
	}
	
	return `
		<div style='position:relative;width:1em;padding-bottom:143%'>
			<div style='position:absolute;top:0;left:0;width:100%;height:100%;perspective:100rem'>
				<div class=cardBack>
					<div class=emoji style='font-size:.4em'>😊<br>💩</div>
				</div>
				<div class=cardFront>
					<div style='line-height:.8;margin-top:.03em;text-transform:uppercase;color:#77baff;text-shadow:0 -1px 0 #358,0 1px 0 #cdf'>
						<div style='font-size:${1.3/kind.name.length}em;white-space:nowrap'>
							${kind.name}
						</div>
					</div>
					<div class=emoji style='font-size:.4em;position:absolute;top:8%;width:100%'>
						${emojis}
					</div>
					<div style='border-radius:.05em;background:#FFD;width:calc(100% - .04em);left:.02em;line-height:1.1;position:absolute;bottom:.5rem;padding:0 .04em;height:51%;display:flex;flex-direction:column;align-items:center;justify-content:center'>
						<div style='position:absolute;bottom:99%;left:.6em;background:#FFD;border-top-left-radius:.3em;border-top-right-radius:.3em;font-size:.08em;padding:.3em'>
							${gCardTypeIcons[card.kind.type]}
						</div>
						<div class=cardText>
							${gCardTextHtmlGet(card)}
						</div>
					</div>
				</div>
			</div>
		</div>
	`
}

var gCardTextHtmlGet = card => {
	var kind = card.kind
	var text = kind.text
	
	var fontSize = .095
	if(text.length<52)fontSize = .11
	if(text.length<45)fontSize = .13
	if(text.length<30)fontSize = .15
	var lines = 1
	
	var text = text.replaceAll('\n',"<div style='height:1rem'></div>")
	
	if(gBattleIn) {
		var attack = gCardAttackNowGet(card)
		if(attack != kind.attack && kind.attack && !(kind.attack<0)) {
			if(attack)attack=`<span style='color:#34E'>${attack}</span>`
			text += `<br>(👍${attack})`
			lines++
		}
		var block = gCardBlockNowGet(card)
		if(block != kind.block && kind.block && !(kind.block<0)) {
			if(block)block=`<span style='color:#34E'>${block}</span>`
			text += `<br>(👎${block})`
			lines++
		}
	}
	fontSize *= 5/(4+lines)
	
	return `
		<div style='font-size:${fontSize}em'>
			${text}
		</div>
	`
}

var gBubbleGet = i => gBubblesDiv.children[i]

var gBubbleTextSet = (i,text) => {
	gBubbleGet(i).firstChild.firstChild.innerHTML = text
}

var gButtonMake = (text, func) => {
	var button = gDivMake('button')
	button.innerHTML = text
	button.onclick = _=> {
		gSoundPlay(gClickSound)
		func(button)
	}
	gBubblesDiv.appendChild(button)
	return button
}

var gBubbleDivAdd = (html, className) => {
	var div = gDivMake(u, className)
	div.innerHTML = html
	gBubblesDiv.appendChild(div)
}

var gBubbleMake = (right, html, maxHeight0, rival) => {
	var i = gBubblesDiv.children.length
	
	var rivalHtml = rival ? `
		<div style='position:absolute;left:100%;bottom:-6rem;font-size:3rem;text-align:center'>
			<div>${rival.name}</div>
			<div style='font-size:10rem'>${rival.icon}</div>
			`+gTextIf(rival.fans, `<div style='font-size:4rem'>👤${rival.fans}</div>`)+`
		</div>
	`:''
	
	gBubbleDivAdd(`<div><div style='font-weight:normal'>${html}</div>
			${rivalHtml}
			<div style='position:absolute;`+(right?'right':'left')+`:-3rem;bottom:0;height:7rem;width:3rem;overflow:hidden'>
				<div class=bubbleArrow></div>
			</div>
		</div>
	`, 'bubble '+(right?'right':'left'))
	
	gBubblesDivScrollBottom()
	return i
}

var gBubblesDivScrollBottom = _ => {
	
	//gBubblesDiv.parentNode.scrollTop=1e4//
	var f = _=>gBubblesDiv.parentNode.scrollTo({top: 1e4, behavior: /iPhone/i.test(navigator.userAgent) ? 'instant':'smooth'})
	for(var j=0;j<22;j++) {
		gDelay(f,j*.2)
	}
}

var gResize = _=>{
	var ratio = innerWidth/innerHeight
	if(ratio>.65) {
		gSizeY = innerHeight
		gSizeX = gSizeY*.65
	} else {
		gSizeX = innerWidth
		gSizeY = innerHeight//gSizeX/.65
	}
	gGameDiv.style.width = gSizeX+'px'
	gGameDiv.style.height = gSizeY+'px'
	d.documentElement.style.fontSize = gSizeX/100+'px'
	gHandSizeY = gCardRem*2*gCardTall+2
	
	gPostingRender()
	gHandRender()
	gDelay(_=>{
		gPostingRender()
		gHandRender()
	})
}

w.onload = _=>{
	gDelay(gOnLoad, 1)
}

var gOnLoad = _ => {
	var f = e => {
		//gHelpButton.innerHTML = '1'
		var target = e.target
		if(e.changedTouches) {
			e = e.changedTouches[0]
		}
		var bounds = gGameDiv.getBoundingClientRect()
		gMousePan = gClamp((e.clientX-bounds.x)/bounds.width,0,1)
		gMouseX = e.clientX-bounds.x
		gMouseY = e.clientY-bounds.y
		
		gDivShow(gCardInfoDiv)
		
		if(target == gBubblesDiv) {
			gBubblesDiv.parentNode.style.pointerEvents = 'none'
			target = d.elementFromPoint(e.clientX, e.clientY)
			gBubblesDiv.parentNode.style.pointerEvents = 'all'
		}
		if(target) {
			gCardInfoShow(target)
		}
		gIntroSpeed*=0.8
		//gHelpButton.innerHTML = '2'
	}
	addEventListener("mousedown", f, {passive:false})
	addEventListener("touchstart", f)
	
	for(var i=0; i<gHandMax; i++) {
		var div = gDivMake(u, 'handBlank')
		gCardsDiv.appendChild(div)
	}
	
	gYou.div = gYouDiv
	gYou.fansDiv = gYouFansDiv
	gGuyFansSet(gYou, 70)
	gGoldAdd(8)

	w.onresize = gResize
	gResize()
	
	if(1) {
		gStateSet(gStateIntro)
	} else if(0) {
		gCardPackMake()
		gBattleStart(gRivalKinds[0])
	} else {
		gCardPackMake()
		gStateSet(gStateFeedLoad)
	}
	
	addEventListener('keydown', e => {
		if(e.keyCode == 27) {
			if(gHelpShowing) {
				gHelpShowing = 0
				gDivShow(gHelpDiv)
			}
			if(gState == gStateTrashView)gTrashToggle()
			if(gState == gStateDeckView)gButton.onclick()
		}
	})
	
	//gBg.innerHTML = '♣ ☆ ☏ ☂ ☃ ♥ ➚ @ ☚ ☁ ☀ ♫ ♱ ✎ ✂ ★ ☘ ☠ ☯ ☺ ♘ '.repeat(20)
	gBg.innerHTML = '☆ ☏ ➚ @ ☚ ☻ ☽ ♖ ♡ ♫ ♱ ✎ ★ ☙ ♘ ➳ '.repeat(22)
	gBg.style.textShadow = [0,2,3,5].map(i => i%3-1+`px ${i<3?-1:1}px 0 #eae0d4`).join(',')
	
	gSendButton.onclick = _=>{
		gSoundPlay(gClickSound)
		/*
		if(!gSendShould()) {
			if(!confirm("really send? u could add more emojis to ur post")) {
				return
			}
		}
		*/
		
		gSend()
	}
	
	gTrashViewCloseButton.onclick = gTrashDiv.onclick = _=> {
		gSoundPlay(gClickSound)
		gTrashToggle()
	}
	
	gHelpButton.onclick = _ => {
		gSoundPlay(gClickSound)
		gHelpShowing = !gHelpShowing
		gDivShow(gHelpDiv, gHelpShowing)
		
		var html = ''
		for(var kind of gCardKinds) {
			var emoji = kind.emoji.repeat(kind.cost)
			var text = kind.seen ? kind.text : `<i>not found</i>`
			var rowStyle = gTextIf(!gYou.deck.find(card=>card.kind==kind), ` style='filter:grayscale(1);color:#888'`)
			html += `
				<tr${rowStyle}>
					<td style='letter-spacing:-2rem;padding-right:2rem;white-space:nowrap' class=emoji>${emoji} </td>
					<td align=left>${kind.name}</td>
					<td align=left>${text}</td>
					<td>${gCardTypeIcons[kind.type]}</td>
				</tr>
			`
		}
		gHelpCardsDiv.innerHTML = `<table border=1>${html}</table>`
	}
	
	
	gMuteButton.onclick = _=>{
		gMuted = !gMuted
		gMuteButton.innerHTML = gMuted ? '🔇':'🔊'
		if(!gMuted)gAudioContext.resume()
		gSoundPlay(gClickSound)
	}
}

var gOr = (val,a,b,c,d,e) => {
	return val==a || val==b || (c!==u && val==c) || (d!==u && val==d) || (e!==u && val==e)
}

var gDelay = (f, time100) => setTimeout(f, time100*100||44)

var gDivMake = (type, className) => {
	var div = d.createElement(type||'div')
	div.className = className
	return div
}

/*
var gAudioContext, gSoundFuncs = []
var gSoundMake = (func) => {
	gSoundFuncs.push(func)
	return gSoundFuncs.length-1
}
var gSoundsMake = _ => {
	gAudioContext = new AudioContext
	var soundI=0
	for(var func of gSoundFuncs) {
		var buffer = gAudioContext.createBuffer(1, 96e3, 48e3)
		var data = buffer.getChannelData(0)
		for(i=96e3;i--;) {
			data[i] = func(i)
		}
		gSoundBuffers[soundI++] = buffer
		gSoundPlay(buffer,u,1)
	}
}
*/

var gAudioContext = new (w.AudioContext || w.webkitAudioContext)
var gSoundMake = (func) => {
	var buffer = gAudioContext.createBuffer(1, 96e3, 48e3)
	var data = buffer.getChannelData(0)
	for(i=96e3;i--;) {
		data[i] = func(i)
	}
	return buffer
}
var t=(i,n)=>(n-i)/n
var gSin = (i,d) => Math.sin(d ? i/d/100 : i)

var gClamp = (v, lo, hi) => Math.min(hi, Math.max(v, lo))

var gSoundPlay = (buffer, pan) => {
	if(!gMuted) {
		var source = gAudioContext.createBufferSource()
		if(source) {
			source.buffer = buffer
			
			var gainNode = gAudioContext.createGain()
			var volume = 1
			
			if(buffer == gClickSound)pan=gMousePan
			if(pan !== u) {
				if(pan.div) {
					pan = ((parseInt(pan.div.style.left)||70)+gCardRem/2)/100
				}
				var gainNode2 = gAudioContext.createGain()

				var pan01 = gClamp(pan,0,1)
				
				gainNode.gain.value = volume * (1 - pan01)
				gainNode2.gain.value = volume * pan01

				
				var splitter = gAudioContext.createChannelSplitter(2)
				source.connect(splitter, 0, 0)
				var merger = gAudioContext.createChannelMerger(2)
				
				splitter.connect(gainNode, 0)
				splitter.connect(gainNode2, 0)
				
				gainNode.connect(merger,0,0)
				gainNode2.connect(merger,0,1)
				merger.connect(gAudioContext.destination)
			} else {
				gainNode.gain.value = volume
				source.connect(gainNode)
				gainNode.connect(gAudioContext.destination)
			}
			
			source.start(0)
		}
	}
}

var gClickSound = gSoundMake(i => gSin(i/10) * Math.exp(-i/100) * (i/100 % 6 < 3 ? 1 : .2))

/*
var gPackOpenSound = gSoundMake(i => {
	var m=3e4
	if(i > m) return n
	var q = t(i,m)
	return gSin(i/1e3*gSin(.009*i+gSin(i,2))+gSin(i,1))*q*q
})
*/

//chord = f = i => (Math.sin(i/30) * Math.sin(i/240)) * Math.exp(-i/1e4)
//heartbeat = f = i => i>10000?n:Math.sin(i/50*Math.abs(Math.cos(i/6000))) * .9 * Math.max(0,Math.sin(i/3000))
var gPackOpenSound = gSoundMake(i => {
	var m=15e3
	if(i > m) return n
	var q = t(i,m)
	return gSin(i*.001*gSin(.009*i+gSin(i,2))+gSin(i,1))*q*q
})

var gWinSound = gSoundMake(i => {
	var notes = [0,4,7,12,u,7,12]
	var m=3.5e4
	if (i > m) return n
	var idx = ((notes.length*i)/m)|0
	var note = notes[idx]
	if (note === u) return 0
	var r = Math.pow(2,note/12)*.8
	var q = t((i*notes.length)%m, m)*.1
	return ((i*r)&64)?q:-q
})

var gCardGetSound = gSoundMake(i => {
	var notes = [0,4,7]
	var m=1e4
	if (i > m) return n
	var idx = ((notes.length*i)/m)|0
	var note = notes[idx]
	var r = Math.pow(2, note/12)*.8
	var q = t((i*notes.length)%m, m)*.1
	return ((i*r)&64)?q:-q
})

var gCardDrawSound = gSoundMake(i => {
	var m=13e3
	if(i > m-8500) return n
	var q = t(i+1e4,m)
	return gSin(-i*.03*gSin(.09*i+gSin(i,2))+gSin(i,1))*q
})

var gCardRemoveSound = gSoundMake(i => gSin(i/40) * gSin(i*.003 + 1.5*gSin(i,7)) * Math.exp(-i/1e4))
var gCardDiscardSound = gSoundMake(i => gSin(i / 50 + 5 * gSin(i,10)) * Math.exp(-i/6e3))
var gVibrateSound = gSoundMake(i => i>11500?n:gSin(i/50) * Math.abs(Math.cos((i+1200)/900)) * 1)

var gCancelSound = gSoundMake(i => {
	var m=11e3
	if(i > m*4)return n
	var o = (i/m|0)+1
	i=i%m
	var q = t(i,m)
	return gSin(gSin(i/(50+o*28)))*q*q
})

var gFanLoseSound = gSoundMake(i => {
	var m=4e3
	if(i > m*3)return n
	var o = (i/m|0)+1
	i=i%m
	var q = t(i,m)
	return gSin(gSin(i/(40+o*18)))*q*q
})

var gCardPlaySounds = []
gCardPlaySounds[0] = gSoundMake(i => {
	return gSin(i/(i<3e3?30:(i<6e3?20:15))) * Math.exp(-i/6e3) * gSin(Math.pow(i,1.3)/7e4)
})
gCardPlaySounds[2] = gSoundMake(i => {
	i+=3000
	return (gSin(i*.02) + .5*gSin(i*.04) + .25*gSin(i*(i<8e3?.04:.05))) * Math.exp(-i/8e3)
})
gCardPlaySounds[3] = gSoundMake(i => {
	i+=3000
	return (gSin(i*.02) + .5*gSin(i*.03) + .25*gSin(i*.06)) * Math.exp(-i/8e3)
})
gCardPlaySounds[1] = gSoundMake(i => {
	var m=6e3
	if(i > m)return n
	var q = t(i,m)
	return gSin(i*.01*gSin(.003*i+gSin(i,7))+gSin(i,1))*q*q
})

var gExport = _ => {
	return JSON.stringify(gCardKinds.map(kind=>({emoji:kind.emoji, name:kind.name, text:kind.text, cost:kind.cost, type:kind.type})))
}
var gExport2 = _ => {
	return JSON.stringify(gRivalKinds.map(kind=>({icon:kind.icon, name:kind.name, post:kind.post, fans:kind.fans, deck:kind.deck.join()})))
}

var gVibrate = _ => {
	if(gVibrateEnabled) {
		gNativeSend('vibrate')
	} else {
		gDivClassSet(d.documentElement,'shake', 4)
		gSoundPlay(gVibrateSound)
	}
}

var gNativeSend = (text) => {
	if(gPlatform == 'ios') {
		console.log("gNativeSend()", text)
		if(window.webkit) {
			window.webkit.messageHandlers.ads.postMessage(text)
		}
	} else if(gPlatform == 'android') {
		console.log(text)
	} else if(window.CrazyGames) {
		console.log("gNativeSend()", text)
	}
}

/*
gSoundMake(i => {
	var n=3e4
	if (i > n) return n
	return gSin(i/2e3 - gSin(i/331)*gSin(i/61) + gSin(gSin(i/59)/39) * 33)*t(i,n)
})
*/
//}()