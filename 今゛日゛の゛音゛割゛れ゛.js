/// @ 0.19.0
// ユーザーごとに日替わりのおみくじのプリセット
//参考play：okazさん作のささつづハシスロット(待機画面部分)https://voskey.icalo.net/play/9pe1uha08x
//         白緑さん(メンテナンスフリー化)https://voskey.icalo.net/notes/aaqpfn5dn9
//         チータスさん pityおみくじ https://voskey.icalo.net/play/a74rkeiluj

//読み込みは初回のみ
let loadingUiText = "<center>$[tada.speed=0s $[position.x=1.7 ロ゛ー゛ド゛中゛  $[position.x=-1.7 $[border.style=hidden $[position.x=1 :pity_yukari:]]$[border.style=hidden $[position.x=-1 $[flip :pity_yukari:]]]]]]</center>"
Ui:render([
  Ui:C:mfm({ text: loadingUiText })
])

let array = CUSTOM_EMOJIS.map(@(emoji) { emoji.name }).filter(@(name) { name.index_of("pity") != -1 })
let EMOJIS = array.map(@(emoji) { `:{emoji}:` })
//pity軍団に音割れ千冬も追加
EMOJIS.push(':otoware_chifuyu_potter:')

//振り直しできるようにmainメソッドに分離
@main() {
	// シードが「PlayID+ユーザーID+今日の日付+hh:mm:ss」である乱数生成器を用意
	let random = Math:gen_rng(`{THIS_ID}{USER_ID}{Date:year()}{Date:month()}{Date:day()}{Date:hour()}{Date:minute()}{Date:second()}`)
	
	// ランダムに選択肢を選ぶ
	let chosen = EMOJIS[random(0, (EMOJIS.len - 1))]
	
	// 結果のテキスト
	let otoware_text = `$[border.style=hidden $[position.x=1 {chosen}]]$[border.style=hidden $[position.x=-1 $[flip {chosen}]]]`
	let result = `$[tada.speed=0s $[tada.speed=0s $[tada.speed=0s {otoware_text}]]] `
	
	// UIを表示
	Ui:render([
		Ui:C:container({
			align: 'center'
			children: [
				Ui:C:mfm({ text: result })
	    	Ui:C:buttons({
	    		buttons: [{
	    			text: "ふり直す"
	    			onClick: main
	    		}]
	    	})
				Ui:C:postFormButton({
					text: "投稿する"
					rounded: true
					primary: true
					form: {
						text: `<center>{result}</center>{Str:lf}{THIS_URL}
#今゛日゛の゛音゛割゛れ゛`
					}
				})
			]
		})
	])
}

main()
