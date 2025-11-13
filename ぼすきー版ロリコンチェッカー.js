/// @ 0.18.0
// ユーザーごとに日替わりのおみくじのプリセット

// 選択肢
let choices = [
	":kmmmkon:です"
	":kmmmkon:ではないかと疑われています"
	"ちょっと:kmmmkon:です"
	"かなり:kmmmkon:です"
	"重度の:kmmmkon:です"
	"手の施しようのない:kmmmkon:です"
	"もしかしたら:kmmmkon:かもしれません"
	":kmmmkon:ですが紳士淑女です"
	":kmmmkon:ではありません"
	"ビジネス:kmmmkon:です"
	"そこはかとなく:kmmmkon:です"
	":cp_shota_wide::_ko::_n:です"
]

// シードが「PlayID+ユーザーID+今日の日付」である乱数生成器を用意
let random = Math:gen_rng(`{THIS_ID}{USER_ID}{Date:year()}{Date:month()}{Date:day()}`)

// ランダムに選択肢を選ぶ
let chosen = choices[random(0, (choices.len - 1))]

// 結果のテキスト
let result = `{USER_NAME}は{chosen} `

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