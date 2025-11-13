/// @ 0.19.0
// ユーザーごとに日替わりのおみくじのプリセット
//参考play：okazさん作のささつづハシスロット(待機画面部分)https://voskey.icalo.net/play/9pe1uha08x
//         白緑さん(メンテナンスフリー化)https://voskey.icalo.net/notes/aaqpfn5dn9
//         チータスさん pityおみくじ https://voskey.icalo.net/play/a74rkeiluj

let loadingUiText = "<center>$[tada.speed=0s $[position.x=1.7 :nowloading:$[position.x=-1.7 :okorare_karin:]]]</center>"
Ui:render([
  Ui:C:mfm({ text: loadingUiText })
])

let array = CUSTOM_EMOJIS.map(@(emoji) { emoji.name }).filter(@(name) { name.index_of("okorare") != -1 })
let EMOJIS = array.map(@(emoji) { `:{emoji}:` })

// シードが「PlayID+ユーザーID+今日の日付」である乱数生成器を用意
let random = Math:gen_rng(`{THIS_ID}{USER_ID}{Date:year()}{Date:month()}{Date:day()}`)

// ランダムに選択肢を選ぶ
let chosen = EMOJIS[random(0, (EMOJIS.len - 1))]

// 結果のテキスト
let result = `今日のおこられは〜！？
$[tada.speed=0s $[tada.speed=0s $[tada.speed=0s {chosen}]]] `

// UIを表示
Ui:render([
	Ui:C:container({
		align: 'center'
		children: [
			Ui:C:mfm({ text: result })
			Ui:C:postFormButton({
				text: "投稿する"
				rounded: true
				primary: true
				form: {
					text: `<center>{result}</center>{Str:lf}{THIS_URL}
#おこられおみくじ`
				}
			})
		]
	})
])
