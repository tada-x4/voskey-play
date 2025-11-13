/// @ 0.19.0
// ユーザーごとに日替わりのおみくじのプリセット

// 選択肢
let choices = [
	"開封済み。"
	"密閉済み。"
	"投獄済み。"
	"脱獄済み。"
	"燻製済み。"
	"退社済み。"
	"破壊済み。"
	"廃棄済み。"
	"注射済み。"
	"冷凍済み。"
	":silence:済み。"
	":sasiosae:済み。"
	":siyouzumi:み。"
	":kaihou:済み。"
	"幽閉済み。"
	"貫通済み。"
	"調教済み。"
]

// シードが「PlayID+ユーザーID+今日の日付」である乱数生成器を用意
let random = Math:gen_rng(`{THIS_ID}{USER_ID}{Date:year()}{Date:month()}{Date:day()}`)

// ランダムに選択肢を選ぶ
let chosen = choices[random(0, (choices.len - 1))]

// 結果のテキスト
let result = `あんぱんは{chosen}`

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
					text: `{result}{Str:lf}{THIS_URL}`
				}
			})
		]
	})
])
