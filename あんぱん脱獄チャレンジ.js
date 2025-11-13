/// @ 1.1.0
// ユーザーごとに日替わりのおみくじのプリセット

// 選択肢
let choices = [
	"脱獄できた"
	"脱北した"
	"ついに$[sparkle 処刑]された"
	"牢屋からは出れたが、すぐに捕まった"
	"獄中死した"
	"獄中で作った料理動画が大バズリした"
	"仲間が牢屋に襲撃して逃げれた"
	"脱糞した" 
	"脱腸した" 
	"脱肛した"
	"脱力した"
	"脱税した"
	"脱藩した"
	"クローンが大暴れしたため、投獄前と治安は変わらなかった"
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
				text: "脱獄する"
				rounded: true
				primary: true
				form: {
					text: `{result}{Str:lf}{THIS_URL}
#あんぱん脱獄チャレンジ`
				}
			})
		]
	})
])
