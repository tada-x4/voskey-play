/// @ 0.19.0
// ユーザーごとに日替わりのおみくじのプリセット

// 選択肢
let choices = [
	"に移行できた！:waai_akane:"
	"の移行に失敗した:zetubou_akane2:"
	"の抽選に落ちた:akari_aa:"
	"はプラグインが対応していなかった:ota_cry_chifuyu:"
]

// シードが「PlayID+ユーザーID+今日の日付」である乱数生成器を用意
let random = Math:gen_rng(`{THIS_ID}{USER_ID}{Date:year()}{Date:month()}{Date:day()}`)

// ランダムに選択肢を選ぶ
let chosen = choices[random(0, (choices.len - 1))]

// 結果のテキスト
let result = `aviutl2{chosen}`

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
