/// @ 1.1.0
// ユーザーごとに日替わりのおみくじのプリセット

// 選択肢
let choices = [
	"ちんちんを取り出す瞬間、
ズボンのチャックに巻き込まれ死亡"
	"ちんちんを丸出しにできた"
	"ちんちんを丸出しにできなかった"
	"そもそもちんちんが無かった"
]

// シードが「PlayID+ユーザーID+今日の日付」である乱数生成器を用意
let random = Math:gen_rng(`{THIS_ID}{USER_ID}{Date:year()}{Date:month()}{Date:day()}`)

// ランダムに選択肢を選ぶ
let chosen = choices[random(0, (choices.len - 1))]

// 結果のテキスト
let result = `**{chosen}**`

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
					text: `{result}{Str:lf}{THIS_URL}
#ちんちん丸出しチャレンジ`
				}
			})
		]
	})
])
