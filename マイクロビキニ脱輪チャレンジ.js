/// @ 0.19.0
// ユーザーごとに日替わりのおみくじのプリセット

// 選択肢
let choices = [
	":supertada_hyper:マイクロビキニから脱輪してドライブが差し押さえされました:supertada_hyper:"
	":supertada_hyper:マイクロビキニから脱輪してアカウントが凍結しました:supertada_hyper:"
	":supertada_hyper:マイクロビキニから脱輪して:silence:になりました:supertada_hyper:"
	"マイクロビキニから脱輪しませんでした:igyo_aoi:"
]

// シードが「PlayID+ユーザーID+今日の日付」である乱数生成器を用意
let random = Math:gen_rng(`{THIS_ID}{USER_ID}{Date:year()}{Date:month()}{Date:day()}`)

// ランダムに選択肢を選ぶ
let chosen = choices[random(0, (choices.len - 1))]

// 結果のテキスト
let result = `{chosen}`

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
